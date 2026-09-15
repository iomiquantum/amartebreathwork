-- Apply only after reviewing production inventory and deploying /api/forms.
-- Closing direct INSERT is intentional: otherwise bots bypass the gateway.
begin;
create schema if not exists amarte_private;
revoke all on schema amarte_private from public, anon, authenticated;
create table if not exists amarte_private.form_quotas (
  scope text not null, key_hash text not null, window_start timestamptz not null,
  hits integer not null, primary key (scope, key_hash)
);
alter table amarte_private.form_quotas enable row level security;
revoke all on amarte_private.form_quotas from public, anon, authenticated;
create or replace function public.consume_form_quota(p_scope text, p_key text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare allowed boolean;
begin
  if p_scope not in ('form-ip','form-contact','form-global') or p_key !~ '^[0-9a-f]{64}$'
     or p_limit not between 1 and 1000 or p_window_seconds not between 60 and 86400 then
    raise exception 'Invalid quota configuration';
  end if;
  insert into amarte_private.form_quotas as q (scope,key_hash,window_start,hits)
  values (p_scope,p_key,clock_timestamp(),1)
  on conflict (scope,key_hash) do update set
    hits = case when q.window_start <= clock_timestamp() - make_interval(secs => p_window_seconds) then 1 else least(q.hits+1,p_limit+1) end,
    window_start = case when q.window_start <= clock_timestamp() - make_interval(secs => p_window_seconds) then clock_timestamp() else q.window_start end
  returning hits <= p_limit into allowed;
  return allowed;
end $$;
revoke all on function public.consume_form_quota(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_form_quota(text,text,integer,integer) to service_role;
-- Dedicated cron job, no cleanup on every public request.
create or replace function public.cleanup_form_quotas() returns void
language sql security definer set search_path = '' as $$
  delete from amarte_private.form_quotas where window_start < now() - interval '2 days';
$$;
revoke all on function public.cleanup_form_quotas() from public, anon, authenticated;
grant execute on function public.cleanup_form_quotas() to service_role;

-- Only verified accounts explicitly enrolled by a database owner are admins.
create table if not exists amarte_private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table amarte_private.admin_users enable row level security;
revoke all on amarte_private.admin_users from public, anon, authenticated;
insert into amarte_private.admin_users(user_id)
select id from auth.users where email_confirmed_at is not null and lower(email) in (
  'breathwork@amarteinc.com','amarteinc@gmail.com','miguelvalencia0531@gmail.com'
) on conflict do nothing;
create or replace function public.is_amarte_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from amarte_private.admin_users a join auth.users u on u.id=a.user_id
    where a.user_id=auth.uid() and u.email_confirmed_at is not null and (auth.jwt()->>'aal') = 'aal2');
$$;
revoke all on function public.is_amarte_admin() from public, anon;
grant execute on function public.is_amarte_admin() to authenticated;

do $$
declare t text; p record;
begin
  foreach t in array array['breathwork_leads','breathwork_subscribers','breathwork_reservations',
    'breathwork_corporate_inquiries','breathwork_gender_inquiries','breathwork_youth_inquiries'] loop
    if to_regclass('public.'||t) is null then raise exception 'Missing expected table: %', t; end if;
    execute format('alter table public.%I enable row level security',t);
    -- Replace policies on these owned tables: permissive OR policies must not survive.
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I',p.policyname,t);
    end loop;
    execute format('revoke all on public.%I from public, anon, authenticated',t);
    execute format('grant select, insert, update, delete on public.%I to authenticated, service_role',t);
    execute format('create policy amarte_admin_only on public.%I for all to authenticated using ((select public.is_amarte_admin())) with check ((select public.is_amarte_admin()))',t);
  end loop;
  foreach t in array array['breathwork_events','amarte_bank_config'] loop
    execute format('alter table public.%I enable row level security',t);
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I',p.policyname,t);
    end loop;
    execute format('revoke all on public.%I from public, anon, authenticated',t);
    execute format('grant select on public.%I to anon, authenticated',t);
    execute format('grant insert, update, delete on public.%I to authenticated',t);
    execute format('grant select, insert, update, delete on public.%I to service_role',t);
    execute format('create policy amarte_admin_only on public.%I for all to authenticated using ((select public.is_amarte_admin())) with check ((select public.is_amarte_admin()))',t);
    if t='breathwork_events' then
      execute 'create policy amarte_public_read on public.breathwork_events for select to anon,authenticated using (status in (''published'',''sold_out'',''past''))';
    else
      execute 'create policy amarte_public_read on public.amarte_bank_config for select to anon,authenticated using (true)';
    end if;
  end loop;
  if to_regprocedure('public.count_lead_attempts(text)') is not null then
    revoke execute on function public.count_lead_attempts(text) from public,anon,authenticated;
  end if;
  if exists(select 1 from pg_extension where extname='pg_cron') then
    if exists(select 1 from cron.job where jobname='amarte-form-quota-cleanup') then
      perform cron.unschedule('amarte-form-quota-cleanup');
    end if;
    perform cron.schedule('amarte-form-quota-cleanup','17 * * * *','select public.cleanup_form_quotas()');
  end if;
end $$;
-- Backups are private even if the bucket was inadvertently made public.
update storage.buckets set public=false where id='backups';
-- Restrictive policies override any existing broad storage policies for backups.
drop policy if exists amarte_backup_guard on storage.objects;
create policy amarte_backup_guard on storage.objects as restrictive for all to anon,authenticated
using (bucket_id <> 'backups') with check (bucket_id <> 'backups');
commit;
