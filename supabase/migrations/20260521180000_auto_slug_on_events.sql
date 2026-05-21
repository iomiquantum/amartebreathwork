-- Auto-generar slug desde title si es NULL al insert/update en breathwork_events.
-- Algoritmo: lowercase + remover acentos + reemplazar no-alfanumérico con '-' +
-- colapsar guiones + recortar + agregar sufijo numérico si hay colisión.

create or replace function public.slugify(input text)
returns text
language plpgsql
immutable
as $$
declare
  result text;
begin
  if input is null then return null; end if;
  result := lower(input);
  result := translate(result,
    'áéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ',
    'aeiouunAEIOUUNaeiouAEIOUaeiouAEIOU');
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  result := regexp_replace(result, '-+', '-', 'g');
  result := trim(both '-' from result);
  return result;
end;
$$;

create or replace function public.breathwork_events_auto_slug()
returns trigger
language plpgsql
as $$
declare
  base_slug text;
  candidate text;
  suffix int := 1;
begin
  if new.slug is null or length(trim(new.slug)) = 0 then
    base_slug := public.slugify(new.title);
    if base_slug is null or length(base_slug) = 0 then
      base_slug := 'evento-' || substr(new.id::text, 1, 8);
    end if;
    candidate := base_slug;
    while exists (select 1 from public.breathwork_events where slug = candidate and id != new.id) loop
      suffix := suffix + 1;
      candidate := base_slug || '-' || suffix;
    end loop;
    new.slug := candidate;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_breathwork_events_auto_slug on public.breathwork_events;
create trigger trg_breathwork_events_auto_slug
  before insert or update on public.breathwork_events
  for each row execute function public.breathwork_events_auto_slug();
