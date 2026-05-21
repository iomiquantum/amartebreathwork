# Edge Function: daily-backup

Backup automático diario de todas las tablas de negocio del proyecto `amarteinc`.

## Cómo funciona

1. **Schedule:** `pg_cron` invoca esta función todos los días a las **04:00 UTC** (23:00 Ecuador, UTC-5).
2. **Auth:** la función exige header `x-backup-secret`. El secret vive en `vault.secrets` con name `backup_secret`. Tanto `pg_cron` como la función lo leen de allí.
3. **Dump:** lee todas las tablas listadas en `TABLES` (con service_role, bypasea RLS) y arma un JSON único.
4. **Upload:** sube el JSON a Supabase Storage, bucket privado `backups`, ruta `YYYY-MM-DD/backup-{ISO-timestamp}.json`.
5. **Retention:** borra carpetas con fecha < hoy − `RETENTION_DAYS` (30).

## Tablas incluidas

- `breathwork_leads`
- `breathwork_subscribers`
- `breathwork_events`
- `breathwork_reservations`
- `amarte_bank_config`

Si agregas una tabla nueva al negocio, **edita la constante `TABLES`** en `index.ts` y re-deploy.

## Cómo restaurar

1. Login en https://supabase.com/dashboard → proyecto `amarteinc` → Storage → bucket `backups`.
2. Descarga el archivo del día deseado (`YYYY-MM-DD/backup-...json`).
3. El JSON tiene la forma:
   ```json
   {
     "_metadata": { "generated_at": "...", "tables": [...] },
     "breathwork_leads": [ {...}, {...} ],
     "breathwork_events": [ ... ],
     ...
   }
   ```
4. Para restaurar una tabla, usa el SQL Editor:
   ```sql
   -- ejemplo: restaurar breathwork_leads
   insert into breathwork_leads
   select * from jsonb_populate_recordset(
     null::breathwork_leads,
     '<pega aquí el array JSON de la tabla>'::jsonb
   )
   on conflict (id) do nothing;
   ```

## Test manual

Desde el SQL Editor de Supabase:
```sql
select net.http_post(
  url := 'https://ajhajtousbarhsfugxbo.supabase.co/functions/v1/daily-backup',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-backup-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'backup_secret' limit 1)
  ),
  body := '{}'::jsonb
);
-- espera ~5 segundos
select id, status_code, substring(content, 1, 500)
from net._http_response order by id desc limit 1;
```

Status 200 + `{"ok": true, ...}` = todo OK.

## Cron management

```sql
-- Ver job activo
select jobid, schedule, jobname, active from cron.job where jobname = 'daily-backup-amarte';

-- Pausar
update cron.job set active = false where jobname = 'daily-backup-amarte';

-- Reactivar
update cron.job set active = true where jobname = 'daily-backup-amarte';

-- Borrar
select cron.unschedule('daily-backup-amarte');
```
