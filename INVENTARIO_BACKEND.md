# 📋 Inventario Backend AMARTE Breathwork

> **Propósito:** referencia rápida de TODO lo que existe en el backend / infra del proyecto.
> **Última actualización:** 2026-05-21
> **Generado en:** sesión paralela claude-opus-4-7 (consolidación de mejoras backend + security + UX)
>
> Si abres este archivo y quieres saber "qué tenemos hoy" → empieza por aquí.

---

## 🗄️ Base de datos (Supabase project `amarteinc`)

### 8 Tablas

| Tabla | Para qué sirve |
|---|---|
| `breathwork_leads` | Leads del formulario WhatsApp gate (nombre, país, phone, email, intent, source, IP) |
| `breathwork_subscribers` | Newsletter (email único) |
| `breathwork_events` | Eventos publicados (slug, fecha, formato, ciudad, cupos, precio, depósito, status, featured, tags) |
| `breathwork_reservations` | Reservas con pago (método, status pending/confirmed/cancelled, payphone IDs, comprobante) |
| `amarte_bank_config` | Singleton con datos bancarios para transferencias |
| `breathwork_corporate_inquiries` | Form B2B desde `/corporativo` |
| `breathwork_gender_inquiries` | Forms de `/mujeres` y `/hombres` (audience type) |
| `breathwork_youth_inquiries` | Forms de juveniles |

### 8 CHECK Constraints (validación server-side)

- `chk_leads_name_length` — 2-100 chars
- `chk_leads_whatsapp_format` — regex `+?[0-9]{7,20}`
- `chk_leads_email_format` — regex válido o NULL
- `chk_leads_city_length` — max 80
- `chk_reservations_name_length`, `chk_reservations_email_format`, `chk_reservations_whatsapp_format`, `chk_reservations_amount_positive`

### 11 Triggers activos

- `trg_breathwork_events_auto_slug` (INSERT/UPDATE) → genera slug desde título
- `trg_breathwork_events_updated_at` → auto timestamp
- `trg_breathwork_leads_validate` → anti-honeypot + trim/lowercase
- `trg_breathwork_leads_rate_limit` → max 5 leads/IP/hora
- `trg_breathwork_reservations_validate` → trim/lowercase
- `trg_breathwork_reservations_rate_limit` → max 3 reservas/IP/hora
- `trg_breathwork_reservations_updated_at` → auto timestamp
- `trg_sync_event_spots` → auto-decrementa cupos al confirmar reserva
- `trg_corp_inquiries_updated_at`, `set_gender_inquiries_updated_at`, `trg_youth_inquiries_updated_at`

### 15 Funciones SQL

- `slugify(text)` — normaliza string a slug (remueve acentos, colapsa guiones)
- `is_valid_email(text)` — regex validation reutilizable
- `count_lead_attempts(whatsapp)` — anti-spam soft-cap (SECURITY DEFINER)
- `get_backup_secret()` — devuelve secret del Vault (solo service_role)
- `breathwork_events_auto_slug()`, `breathwork_leads_validate()`, `breathwork_leads_rate_limit()`, `breathwork_reservations_validate()`, `breathwork_reservations_rate_limit()`, `sync_event_spots_on_reservation()`
- 5 más de `updated_at` triggers

### 25+ Indexes

WhatsApp, email, IP, status, fecha, slug, country — todos para lookups rápidos.

### 14 RLS Policies

- **Anon (público):** INSERT en leads/reservations/subscribers/corporate/gender/youth + SELECT en events publicados + SELECT en bank_config
- **Authenticated (admin):** full access en todas las tablas

---

## ⚡ Edge Functions

| Función | Versión | Propósito |
|---|---|---|
| `daily-backup` | v2 ACTIVE | Dump JSON de las 8 tablas a Storage `backups/YYYY-MM-DD/`. Auth vía vault secret. Retention 30 días. |

---

## ⏰ Cron Jobs

| Job | Schedule | Acción |
|---|---|---|
| `daily-backup-amarte` | `0 4 * * *` (04:00 UTC = 23:00 Ecuador) | Invoca daily-backup vía `pg_net.http_post` con secret del Vault |

---

## 📦 Storage Buckets

| Bucket | Acceso | Contenido |
|---|---|---|
| `backups` | PRIVATE | Dumps JSON diarios (retention 30 días auto-purge) |

---

## 🔐 Supabase Vault

| Secret name | Uso |
|---|---|
| `backup_secret` | Shared secret entre pg_cron y Edge Function `daily-backup` |

---

## 🌐 Rutas frontend

### Públicas (8)

| Ruta | Página | Qué hace |
|---|---|---|
| `/` | HomePage | Landing principal AMARTE |
| `/evento/:slug` | EventPage | Detalle de evento con Schema.org Event + reserva directa + SEO meta dinámico + 404 friendly si no existe |
| `/corporativo` | CorporatePage | Landing B2B con form para empresas |
| `/mujeres` | WomenPage | Landing audiencia femenina (paleta terracota) |
| `/hombres` | MenPage | Landing audiencia masculina (paleta cobalto) |
| `/privacidad.html` | Estática | Política de privacidad |
| `/terminos.html` | Estática | Términos y condiciones |
| `/*` | NotFoundPage | 404 friendly con CTA + lista próximos eventos + noindex |

### Admin autenticadas (5)

| Ruta | Página | Funcionalidades |
|---|---|---|
| `/admin/login` | AdminLogin | Magic link Supabase Auth · allowlist 3 emails |
| `/admin` | AdminDashboard | 5 KPIs (totales/7d/eventos/pending/confirmed/conversión%) + bar chart leads/día 30d + donut por método pago |
| `/admin/events` | AdminEvents | Cambiar status inline (draft/published/sold_out/cancelled/past) + link a Studio |
| `/admin/reservations` | AdminReservations | Confirmar/cancelar 1-click + **undo 10s con countdown** + filtros + mailto/wa.me directos |
| `/admin/leads` | AdminLeads | Lista 1000 últimos + buscador en vivo + **export CSV** |

**Allowlist de admins** (`src/lib/auth.ts`):

- `breathwork@amarteinc.com`
- `amarteinc@gmail.com`
- `miguelvalencia0531@gmail.com`

---

## 🎯 Funcionalidades end-to-end

### Captura de leads

- WhatsApp gate modal con form multipaso (nombre + país selector 20 países + phone + email opcional)
- **Geolocalización auto** vía `ipapi.co` (cache 24h sessionStorage)
- Honeypot client + server side
- Dedup soft-cap 3 intentos/whatsapp
- Rate limit 5 leads/IP/hora server-side
- Persistencia en localStorage tras registro
- Normalización automática (trim, lowercase email)

### Reservas con pago

- Modal multi-step (método → datos → instrucciones)
- 2 métodos activos:
  - **Transferencia bancaria** (full flow + datos del banco + comprobante WhatsApp)
  - **PayPhone** placeholder (esperando credenciales merchant)
- Auto-decrement de cupos al confirmar (trigger DB)
- Rate limit 3 reservas/IP/hora
- Tracking code generado client-side

### Frecuencias en vivo

- Web Audio API: 174, 396, 528, 741 Hz
- 4 frecuencias × 40s con visualizador animado

### Eventos

- Calendar público con filtros (ciudad + formato)
- Cards linkean a `/evento/:slug` (descubrible por Google)
- ICS download para Google Calendar
- Auto-slug en BD (no se puede crear evento sin slug)
- Schema.org Event JSON-LD por página

### Newsletter

- Inscripción simple con email único
- Subscribe automático al pasar email en lead form

---

## 🔍 SEO técnico

| Item | Estado |
|---|---|
| Sitemap dinámico | ✅ 7 URLs (4 estáticas + 3 eventos), regenerado en cada `npm run build` vía `scripts/generate-sitemap.mjs` |
| Schema.org Event | ✅ JSON-LD inline en EventPage (Google Events ready) |
| StructuredData | ✅ Organization/LocalBusiness en HomePage |
| Robots.txt | ✅ servido |
| Meta tags dinámicos | ✅ title, description, og:title/image/url por página |
| 404 con noindex | ✅ NotFoundPage marca `<meta name="robots" content="noindex">` |

---

## 🛡️ Seguridad activa

### Headers HTTP en producción (vercel.json)

- **Content-Security-Policy** — whitelist Supabase + Vercel + GA/Meta/TikTok/Clarity + ipapi + payphone
- **Strict-Transport-Security** — 2 años, includeSubDomains, preload
- **X-Frame-Options:** DENY
- **X-Content-Type-Options:** nosniff
- **Referrer-Policy:** strict-origin-when-cross-origin
- **Permissions-Policy** — bloquea camera/mic/geo/interest-cohort

### Capas defensivas

- Rate limiting por IP (DB triggers, no bypaseable client-side)
- CHECK constraints en DB
- Trigger anti-honeypot server-side
- RLS policies (anon limitado a INSERT en tablas de captura)
- Vault para secrets
- Cookie consent GDPR/LGPD (pixels no cargan sin aceptar)
- Magic link auth con allowlist (no signup público)

---

## ⚡ Performance / PWA

- Service Worker (`public/sw.js`) con offline fallback + cache-first static + network-first HTML
- Manifest PWA installable
- Vendor chunks separados (react, motion, supabase, icons, utils) — cacheables entre deploys
- Main bundle: **15.66 KB gzipped** (era 131 KB antes de la optimización)
- Cache-Control immutable en `/assets/`
- Lazy loading de todas las páginas no-home

---

## 📁 Estructura de archivos backend / infra

```
amartebreathwork/
├─ scripts/
│  └─ generate-sitemap.mjs           ⭐ prebuild sitemap dinámico (lee Supabase)
├─ supabase/
│  ├─ functions/
│  │  ├─ daily-backup/index.ts       ⭐ Edge Function backup automático
│  │  ├─ daily-backup/README.md      docs cómo restaurar
│  │  └─ _shared/email-templates.ts  ⭐ 7 emails welcome sequence (TS module)
│  └─ migrations/
│     ├─ 20260521170000_daily_backup_infra.sql
│     ├─ 20260521180000_auto_slug_on_events.sql
│     ├─ 20260521190000_server_side_validation.sql
│     └─ 20260521200000_rate_limit_by_ip.sql
├─ src/
│  ├─ components/Skeleton.tsx        ⭐ loading skeletons reutilizables
│  ├─ lib/auth.ts                    ⭐ admin auth + allowlist
│  ├─ lib/consent.ts                 ⭐ cookie consent GDPR
│  ├─ lib/geolocation.ts             ⭐ auto-detectar país (ipapi.co + cache)
│  ├─ lib/pwa.ts                     ⭐ SW registration
│  └─ pages/
│     ├─ EventPage.tsx               ⭐ per-event page + Schema.org JSON-LD
│     ├─ NotFoundPage.tsx            ⭐ 404 friendly
│     └─ admin/
│        ├─ AdminLayout.tsx          sidebar + outlet + auth guard
│        ├─ AdminLogin.tsx
│        ├─ AdminDashboard.tsx       KPIs + SVG charts inline (sin deps)
│        ├─ AdminEvents.tsx          edit status inline
│        ├─ AdminReservations.tsx    confirmar/cancelar + undo
│        └─ AdminLeads.tsx           buscar + CSV export
├─ docs/
│  ├─ EMAIL_TEMPLATES.md             spec 7 emails welcome
│  └─ ...
├─ public/
│  ├─ sw.js                          ⭐ service worker offline + cache
│  ├─ sitemap.xml                    ⭐ regenerado cada build (no editar)
│  ├─ robots.txt
│  ├─ site.webmanifest
│  ├─ favicon.svg, og-image.svg
│  └─ 404.html, gracias.html, privacidad.html, terminos.html
└─ vercel.json                       headers seguridad + cache + SW config
```

---

## 🔑 Lo que espera credenciales tuyas

| Funcionalidad | Necesito |
|---|---|
| Sentry error tracking | DSN (5 min crear cuenta en sentry.io) |
| Resend emails transaccionales | API key + dominio DNS (10 min) |
| PayPhone pagos reales | Login + API tokens merchant |
| Magic link admin funcional | Agregar redirect URLs en Supabase Auth dashboard: `https://breathwork.amarteinc.com/admin` y `http://localhost:5173/admin` |

---

## ❌ Lo que no existe todavía (oportunidades)

- WhatsApp Cloud API auto-respuesta (otra sesión está en eso)
- Recordatorio 24h antes del evento (depende de WhatsApp API)
- Logo gráfico AMARTE (requiere diseño)
- og-image PNG profesional (requiere diseño)
- Fotos reales en Gallery (esperando fotos)
- Plan editorial redes (contenido)
- Plan Meta Ads completo (contenido)
- Sentry/Resend/PayPhone integrations (esperando credenciales)

---

## 🧪 Cómo verificar que todo funciona

### Producción

```bash
# Smoke test de rutas
for url in / /admin/login /evento/ritual-nocturno-cumbaya-jun-2026 /corporativo /mujeres /hombres /sw.js /sitemap.xml; do
  echo "$(curl -sIo /dev/null -w '%{http_code}' https://breathwork.amarteinc.com$url)  $url"
done

# Headers de seguridad
curl -sI https://breathwork.amarteinc.com/ | grep -iE 'content-security-policy|strict-transport|x-frame'

# Sitemap dinámico (cuenta URLs)
curl -s https://breathwork.amarteinc.com/sitemap.xml | grep -c '<url>'
```

### Backup manual desde Supabase SQL Editor

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

### Verificar cron activo

```sql
select jobname, schedule, active from cron.job where jobname = 'daily-backup-amarte';
```

### Verificar triggers de seguridad

```sql
select trigger_name, event_object_table
from information_schema.triggers
where event_object_schema = 'public' and trigger_name like 'trg_%';
```

---

## 🚀 Comandos útiles

```bash
# Desarrollo
npm run dev              # → http://localhost:5173
npm run build            # tsc check + prebuild sitemap + vite build
npm run preview          # sirve /dist localmente

# Sitemap manual
node scripts/generate-sitemap.mjs

# Edge Function logs (vía Supabase dashboard)
https://supabase.com/dashboard/project/ajhajtousbarhsfugxbo/functions/daily-backup/logs
```

---

🌿 **Última verificación E2E:** 2026-05-21 — 17/17 rutas HTTP 200 · 8 triggers activos · 8 CHECK constraints · cron `0 4 * * *` activo · 2 backups en Storage · build 1.91s sin warnings.
