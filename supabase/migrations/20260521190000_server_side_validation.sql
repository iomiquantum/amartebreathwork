-- Server-side validation para breathwork_leads y breathwork_reservations.
-- CHECK constraints + trigger anti-honeypot + normalización (trim/lowercase).

create or replace function public.is_valid_email(email text)
returns boolean
language sql
immutable
as $$
  select email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

-- breathwork_leads
alter table public.breathwork_leads
  drop constraint if exists chk_leads_name_length;
alter table public.breathwork_leads
  add constraint chk_leads_name_length
  check (length(btrim(name)) between 2 and 100);

alter table public.breathwork_leads
  drop constraint if exists chk_leads_whatsapp_format;
alter table public.breathwork_leads
  add constraint chk_leads_whatsapp_format
  check (whatsapp ~ '^\+?[0-9]{7,20}$');

alter table public.breathwork_leads
  drop constraint if exists chk_leads_email_format;
alter table public.breathwork_leads
  add constraint chk_leads_email_format
  check (email is null or public.is_valid_email(email));

alter table public.breathwork_leads
  drop constraint if exists chk_leads_city_length;
alter table public.breathwork_leads
  add constraint chk_leads_city_length
  check (city is null or length(city) <= 80);

create or replace function public.breathwork_leads_validate()
returns trigger
language plpgsql
as $$
begin
  if new.honeypot_value is not null and length(btrim(new.honeypot_value)) > 0 then
    raise exception 'bot detectado' using errcode = '23514';
  end if;
  new.name := btrim(new.name);
  if new.email is not null then
    new.email := lower(btrim(new.email));
  end if;
  new.whatsapp := btrim(new.whatsapp);
  return new;
end;
$$;

drop trigger if exists trg_breathwork_leads_validate on public.breathwork_leads;
create trigger trg_breathwork_leads_validate
  before insert on public.breathwork_leads
  for each row execute function public.breathwork_leads_validate();

-- breathwork_reservations
alter table public.breathwork_reservations
  drop constraint if exists chk_reservations_name_length;
alter table public.breathwork_reservations
  add constraint chk_reservations_name_length
  check (length(btrim(name)) between 2 and 100);

alter table public.breathwork_reservations
  drop constraint if exists chk_reservations_email_format;
alter table public.breathwork_reservations
  add constraint chk_reservations_email_format
  check (public.is_valid_email(email));

alter table public.breathwork_reservations
  drop constraint if exists chk_reservations_whatsapp_format;
alter table public.breathwork_reservations
  add constraint chk_reservations_whatsapp_format
  check (whatsapp ~ '^\+?[0-9]{7,20}$');

alter table public.breathwork_reservations
  drop constraint if exists chk_reservations_amount_positive;
alter table public.breathwork_reservations
  add constraint chk_reservations_amount_positive
  check (amount > 0);

create or replace function public.breathwork_reservations_validate()
returns trigger
language plpgsql
as $$
begin
  new.name := btrim(new.name);
  new.email := lower(btrim(new.email));
  new.whatsapp := btrim(new.whatsapp);
  return new;
end;
$$;

drop trigger if exists trg_breathwork_reservations_validate on public.breathwork_reservations;
create trigger trg_breathwork_reservations_validate
  before insert on public.breathwork_reservations
  for each row execute function public.breathwork_reservations_validate();
