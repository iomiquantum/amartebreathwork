-- Rate limiting server-side:
-- - max 5 leads/IP/60min en breathwork_leads
-- - max 3 reservations/IP/60min en breathwork_reservations
-- Complementa el soft-cap por WhatsApp que ya existe (cubre rotación de números).

create index if not exists idx_leads_ip_created
  on public.breathwork_leads (ip_address, created_at desc)
  where ip_address is not null;

create or replace function public.breathwork_leads_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count int;
  max_per_hour constant int := 5;
begin
  if new.ip_address is null then return new; end if;
  select count(*) into recent_count
  from public.breathwork_leads
  where ip_address = new.ip_address
    and created_at > (now() - interval '60 minutes');
  if recent_count >= max_per_hour then
    raise exception 'rate limit excedido (max % por hora desde la misma IP)', max_per_hour
      using errcode = '54000', hint = 'demasiados intentos, intenta más tarde';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_breathwork_leads_rate_limit on public.breathwork_leads;
create trigger trg_breathwork_leads_rate_limit
  before insert on public.breathwork_leads
  for each row execute function public.breathwork_leads_rate_limit();

create index if not exists idx_reservations_ip_created
  on public.breathwork_reservations (ip_address, created_at desc)
  where ip_address is not null;

create or replace function public.breathwork_reservations_rate_limit()
returns trigger
language plpgsql
as $$
declare
  recent_count int;
  max_per_hour constant int := 3;
begin
  if new.ip_address is null then return new; end if;
  select count(*) into recent_count
  from public.breathwork_reservations
  where ip_address = new.ip_address
    and created_at > (now() - interval '60 minutes');
  if recent_count >= max_per_hour then
    raise exception 'rate limit excedido (max % por hora desde la misma IP)', max_per_hour
      using errcode = '54000', hint = 'demasiados intentos, intenta más tarde';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_breathwork_reservations_rate_limit on public.breathwork_reservations;
create trigger trg_breathwork_reservations_rate_limit
  before insert on public.breathwork_reservations
  for each row execute function public.breathwork_reservations_rate_limit();
