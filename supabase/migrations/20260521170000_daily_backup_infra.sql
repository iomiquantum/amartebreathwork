-- Daily-backup infra para Edge Function daily-backup
-- Aplicado en producción: 2026-05-21
--
-- Lo que hace:
-- 1. Habilita pg_cron + pg_net
-- 2. Crea storage bucket privado "backups"
-- 3. Genera shared-secret aleatorio en vault.secrets (name='backup_secret')
-- 4. Expone get_backup_secret() RPC solo para service_role
-- 5. GRANTs SELECT en tablas de negocio a service_role
-- 6. Programa cron job 04:00 UTC diario

create extension if not exists pg_cron;
create extension if not exists pg_net;

insert into storage.buckets (id, name, public)
values ('backups', 'backups', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'backup_secret') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'backup_secret',
      'Shared secret entre pg_cron y la Edge Function daily-backup'
    );
  end if;
end$$;

create or replace function public.get_backup_secret()
returns text
language sql
security definer
set search_path = ''
as $func$
  select decrypted_secret from vault.decrypted_secrets where name = 'backup_secret' limit 1;
$func$;

revoke execute on function public.get_backup_secret() from public, anon, authenticated;
grant execute on function public.get_backup_secret() to service_role;

comment on function public.get_backup_secret() is
  'Devuelve el shared-secret para autenticar invocaciones a la Edge Function daily-backup. Solo accesible por service_role.';

grant select on public.breathwork_leads to service_role;
grant select on public.breathwork_subscribers to service_role;
grant select on public.breathwork_events to service_role;
grant select on public.breathwork_reservations to service_role;
grant select on public.amarte_bank_config to service_role;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'daily-backup-amarte') then
    perform cron.unschedule('daily-backup-amarte');
  end if;
end$$;

select cron.schedule(
  'daily-backup-amarte',
  '0 4 * * *',
  $cron$
  select net.http_post(
    url := 'https://ajhajtousbarhsfugxbo.supabase.co/functions/v1/daily-backup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-backup-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'backup_secret' limit 1)
    ),
    body := '{}'::jsonb
  );
  $cron$
);
