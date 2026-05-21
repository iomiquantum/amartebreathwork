# 🌿 AMARTE Breathwork — Estado del Proyecto

> **Última actualización:** 2026-05-21 (sesión 3 — Backend + Security + UX hardening)
> **Estado:** EN PRODUCCIÓN — sistema operativo end-to-end, hardened
> **URL:** https://breathwork.amarteinc.com
> **Repo:** https://github.com/iomiquantum/amartebreathwork
> **Stack:** Vite + React 19 + TS + Tailwind + Supabase + Vercel

Este documento es la **fuente única de verdad** del proyecto. Si cierras la sesión, abre este archivo primero al regresar y tendrás todo el contexto.

> **📋 Inventario completo del backend:** ver [INVENTARIO_BACKEND.md](./INVENTARIO_BACKEND.md) — listado exhaustivo de tablas, triggers, funciones, edge functions, cron jobs, rutas, headers de seguridad y funcionalidades activas.

---

## 📊 RESUMEN EJECUTIVO

**Lo que tienes hoy:**
- 🟢 Landing pública con SSL: https://breathwork.amarteinc.com
- 🟢 Captura de leads con gate WhatsApp (modal con selector país)
- 🟢 **Geolocalización auto** — pre-selecciona país por IP (ipapi.co + cache 24h)
- 🟢 Backend de eventos multi-ciudad + online (Ecuador)
- 🟢 **Per-event pages SEO-friendly** en `/evento/:slug` con Schema.org Event JSON-LD
- 🟢 **Sitemap dinámico** — regenerado en cada build, incluye todos los eventos
- 🟢 **Auto-slug en DB** — trigger genera slug desde título, resuelve colisiones
- 🟢 Sistema de reservas con depósito ($20 USD default)
- 🟢 2 métodos de pago: PayPhone (placeholder) + Transferencia bancaria (full flow)
- 🟢 4 frecuencias en vivo con Web Audio API (174, 396, 528, 741 Hz)
- 🟢 Calendario de eventos con filtros (ciudad + formato) que linkean a páginas dedicadas
- 🟢 **Bot protection multi-capa:** honeypot client+server, dedup 3-max, sanitización, **rate limit DB (5 leads/IP/h, 3 reservas/IP/h)**
- 🟢 **Validación server-side** — CHECK constraints en DB (no bypaseable client-side)
- 🟢 **Admin Dashboard `/admin`** — magic link auth, KPIs, gráficas SVG, undo cancel, CSV export
- 🟢 **Backup automático diario** — Edge Function + pg_cron 04:00 UTC + Storage retention 30d
- 🟢 **PWA installable** — Service Worker con offline fallback
- 🟢 **CSP headers estrictos** — whitelist completa + HSTS 2y preload + Permissions-Policy
- 🟢 **Cookie consent GDPR/LGPD** — pixels solo cargan si el usuario acepta
- 🟢 **404 page friendly** con próximos eventos como CTA
- 🟢 **Loading skeletons** — UX percibida más rápida que spinners
- 🟢 Pixels infrastructure: Meta + GA4 + TikTok + Clarity (esperando IDs)
- 🟢 FAQs sincronizadas entre UI y Schema.org
- 🟢 Bundle main 15.66 KB gzipped (88% reducción) + vendor chunks cacheables

**Lo que falta para "todo listo para pautar":**
1. Auto-WhatsApp con Meta Cloud API (en otra sesión)
2. PayPhone integración real (necesita credenciales merchant)
3. Email transaccional con Resend (necesita API key + dominio DNS)
4. Sentry error tracking (necesita DSN)
5. Datos bancarios reales en `amarte_bank_config`
6. Meta Pixel ID (cuando lo tengas)
7. **Configurar redirect URLs en Supabase Auth** para que magic link admin funcione

---

## 🌐 URLS Y ACCESOS

| Recurso | URL / Acceso |
|---|---|
| 🟢 Landing producción | https://breathwork.amarteinc.com |
| 🟡 Landing fallback Vercel | https://amartebreathwork.vercel.app |
| 📂 Repo GitHub | https://github.com/iomiquantum/amartebreathwork |
| 🚀 Dashboard Vercel | https://vercel.com/dashboard → proyecto `amartebreathwork` |
| 🗄️ Dashboard Supabase | https://supabase.com/dashboard → org **Amarte Inc** → proyecto `amarteinc` |
| 🌍 DNS (name.com) | https://name.com → My Domains → `amarteinc.com` |
| 📊 Cuenta GitHub | `iomiquantum` (miguelvalencia0531@gmail.com) |
| 📊 Cuenta Supabase | `amarteinc@gmail.com` (Owner de Amarte Inc org) |
| 📞 WhatsApp grupo | https://chat.whatsapp.com/CqOmZpEIVGL54FPOj4xXYI?mode=gi_t |
| 📞 WhatsApp directo | +593 99 565 6078 |
| 📷 Instagram | @amarteinc1212 |
| 🎵 TikTok | @amarteinc1212 |
| ✉️ Email | breathwork@amarteinc.com |

---

## 🏗️ ARQUITECTURA

```
🌐 amarteinc.com (DNS en name.com)
├─ amarteinc.com           → Lovable (sitio principal, NO TOCAR)
├─ www.amarteinc.com       → Lovable
└─ breathwork.amarteinc.com → Vercel (CNAME a e92efb80f6c910d4.vercel-dns-017.com)
                              │
                              ▼
                         📦 GitHub: iomiquantum/amartebreathwork
                              │  (auto-deploy en cada push a main)
                              ▼
                         🚀 Vercel build (Vite 8)
                              │
                              ▼
                         🗄️ Supabase: proyecto "amarteinc"
                              ├─ breathwork_leads
                              ├─ breathwork_subscribers
                              ├─ breathwork_events
                              ├─ breathwork_reservations
                              └─ amarte_bank_config (singleton)
```

---

## 💾 BASE DE DATOS (Supabase project: amarteinc)

### Tablas

#### `breathwork_leads` (13 columnas)
Leads capturados desde la landing.
- `id` UUID PRIMARY KEY
- `created_at` TIMESTAMPTZ
- `name`, `whatsapp`, `email` TEXT
- `country_code` TEXT default '593'
- `country_name` TEXT default 'Ecuador'
- `city`, `intent`, `source`, `user_agent`, `ip_address`, `honeypot_value` TEXT
- Índices: `whatsapp`, `created_at DESC`, `country_code`, `email`, `ip_address`

#### `breathwork_subscribers` (4 columnas)
Newsletter mensual.
- `id`, `email` (UNIQUE), `source`, `created_at`

#### `breathwork_events` (24 columnas)
Eventos publicados.
- `id` UUID, `slug`, `title`, `description`, `date_iso`, `duration_min`
- `format` (presencial/online/hibrido), `city`, `venue_name`, `venue_address`, `online_url`
- `spots_total`, `spots_available`
- `price_amount`, `price_currency` (USD default)
- `deposit_amount` (20 default), `deposit_currency`, `deposit_percentage` (50 default)
- `status` (draft/published/sold_out/cancelled/past)
- `is_featured`, `cover_image_url`, `tags`
- `created_at`, `updated_at` (trigger auto)

#### `breathwork_reservations` (21 columnas) — NUEVA
Reservas con pago.
- `id`, `event_id` FK
- `name`, `email`, `whatsapp`, `country_code`, `country_name`
- `amount`, `currency`
- `payment_method` (payphone/transferencia/efectivo)
- `payment_status` (pending/confirmed/cancelled/refunded/expired)
- `payphone_transaction_id`, `payphone_response` JSONB
- `proof_url`, `proof_notes`
- `ip_address`, `user_agent`, `admin_notes`
- `created_at`, `updated_at`, `confirmed_at`

#### `amarte_bank_config` (9 columnas singleton) — NUEVA
Datos bancarios para transferencias.
- `id` (siempre 1)
- `bank_name`, `account_holder`, `account_type`, `account_number`, `identification`, `email`, `notes`
- **EDITA AQUÍ:** Supabase Studio → amarte_bank_config → row id=1

### Funciones DB

| Función | Propósito | Seguridad |
|---|---|---|
| `count_lead_attempts(p_whatsapp)` | Cuenta intentos por phone (dedup soft-cap 3) | SECURITY DEFINER |
| `update_breathwork_events_updated_at()` | Trigger auto updated_at | SECURITY INVOKER |
| `update_breathwork_reservations_updated_at()` | Trigger auto updated_at | SECURITY INVOKER |
| `sync_event_spots_on_reservation()` | Auto-decrement spots al confirmar reserva | SECURITY INVOKER |

### RLS Policies (10 activas)

| Tabla | Policy | Cmd | Role |
|---|---|---|---|
| `breathwork_leads` | INSERT público | INSERT | anon |
| `breathwork_leads` | Select admin | SELECT | authenticated |
| `breathwork_subscribers` | INSERT público | INSERT | anon |
| `breathwork_subscribers` | Select admin | SELECT | authenticated |
| `breathwork_events` | SELECT publicados | SELECT | anon, authenticated |
| `breathwork_events` | Admin all | ALL | authenticated |
| `breathwork_reservations` | INSERT público | INSERT | anon |
| `breathwork_reservations` | Admin all | ALL | authenticated |
| `amarte_bank_config` | SELECT público | SELECT | anon, authenticated |
| `amarte_bank_config` | Admin all | ALL | authenticated |

### Eventos seed (puedes borrar/editar en Supabase Studio)
1. **Ritual nocturno · Cumbayá** — 12 Jun, presencial, 12 cupos, $35
2. **AMARTE en vivo · Online** — 19 Jun, online, 50 cupos, $18
3. **Sesión inmersiva · Guayaquil** — 3 Jul, presencial, 16 cupos, $40 (featured)

---

## 📁 ESTRUCTURA DEL CÓDIGO

```
amartebreathwork/
├─ index.html (SEO meta + manifest + fonts + comentario pixels)
├─ vercel.json (Vite framework)
├─ public/
│   ├─ favicon.svg, og-image.svg, site.webmanifest
│   ├─ robots.txt, sitemap.xml
│   ├─ 404.html, gracias.html
│   ├─ privacidad.html, terminos.html (legales con email real)
├─ src/
│   ├─ App.tsx (orquestador, WhatsappGateProvider, Suspense lazy sections)
│   ├─ main.tsx (entry point)
│   ├─ components/
│   │   ├─ Hero.tsx, Header.tsx, TrustBar, ProblemSection
│   │   ├─ ExperienceSection, HowItWorks, IncludesSection
│   │   ├─ AudioWavePreview, FrequenciesPlayer ⭐ NUEVO
│   │   ├─ Gallery, NerveTest, Comparison, BenefitsSection, ForWhoSection
│   │   ├─ OriginStory, BehindTheScenes, Manifesto, GuideSection
│   │   ├─ Testimonials (text + video support)
│   │   ├─ PressStrip, EventFormat
│   │   ├─ EventsCalendar ⭐ NUEVO (lee de DB)
│   │   ├─ WhatsappCommunity, Differentiators, CinematicQuote, FAQ
│   │   ├─ LeadForm, Newsletter
│   │   ├─ CorporateSection, ShareSection, ResponsibleNotice
│   │   ├─ FinalCTA, FloatingWhatsappButton, Footer
│   │   ├─ Splash, ExitIntent, CookieBanner, SideRail
│   │   ├─ WhatsappGateModal ⭐ NUEVO
│   │   └─ ReservationModal ⭐ NUEVO
│   ├─ lib/
│   │   ├─ supabase.ts (submitLead, createReservation, fetchUpcomingEvents,
│   │   │              fetchBankConfig, sanitizePhone, isValidEmail, countLeadAttempts)
│   │   ├─ whatsapp.tsx (useWhatsappCTA hook con gate logic)
│   │   ├─ whatsappGate.tsx ⭐ NUEVO (Context Provider + localStorage)
│   │   ├─ pixels.ts ⭐ NUEVO (Meta + GA4 + TikTok auto-init)
│   │   ├─ tracking.ts (eventos: PageView, Lead, FAQ, WhatsApp click)
│   │   ├─ calendar.ts (ICS download)
│   │   ├─ toast.tsx, useReducedMotion.ts, utils.ts
│   ├─ data/
│   │   ├─ siteConfig.ts (toda la config: brand, copy, frecuencias, etc.)
│   │   ├─ countries.ts ⭐ NUEVO (19 países, EC default)
│   │   └─ faqs.ts ⭐ NUEVO (FAQs compartidas entre UI y Schema)
├─ ESTADO_PROYECTO.md ← este archivo
├─ REPORTE_LANZAMIENTO.md (sesión 1)
├─ PLAN_WHATSAPP_AUTOMATION.md (plan auto-WhatsApp Meta)
├─ AUDITORIA_LANDING.md (700+ líneas con hallazgos)
```

---

## 🚀 LO QUE SE TRABAJÓ (cronología completa)

### Sesión 1 (2026-05-20) — LANZAMIENTO INICIAL

**Setup infraestructura:**
- Decidido Vercel + Supabase como stack
- Estrategia: cuenta Supabase separada para Amarte (no mezclar con otros proyectos IOMI)
- Cuenta `amarteinc@gmail.com` creada con org "Amarte Inc"
- Cross-membership con `miguelvalencia0531` (rol Developer para no bloquear free quota)
- MCP de Supabase autorizado desde `amarteinc@gmail.com`

**Database:**
- Tablas `breathwork_leads` + `breathwork_subscribers`
- RLS policies + GRANTs explícitos para anon role

**Deploy:**
- Repo `iomiquantum/amartebreathwork` importado en Vercel
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Dominio custom `breathwork.amarteinc.com` con CNAME en name.com
- SSL automático Vercel

**Bug fixes:**
- Schema mismatch (código esperaba `leads` table, creamos `breathwork_leads`)
- Columnas en español vs inglés
- GRANT INSERT perdido tras ALTER TABLE
- Permission denied for table (GRANTs explícitos)

**Test:** Primer lead capturado (Miguel · Quito · "reconectar")

**Commits sesión 1:** b392e3f, 3bfbb06, 201852e

---

### Sesión 2 (2026-05-21) — TODA LA EXPANSIÓN

#### Fase 2A — Cleanup
- Removidos TODOS los placeholders (TODO_URL, TODO_EMAIL, TODO_IG, etc.)
- Datos reales aplicados: WhatsApp group, IG, TikTok, email, siteUrl
- 9 archivos modificados, ~30 reemplazos
- Footer con TikTok glyph + aria-labels

#### Fase 2B — Pre-marketing setup
- Foto Miguel placeholder (Unsplash) en GuideSection
- Testimonials refactor: soporte texto + video + EmptyState bonito
- Pixels infrastructure (`src/lib/pixels.ts`): Meta + GA4 + TikTok auto-init si IDs presentes
- Opt-in checkbox en LeadForm (consent claro para WhatsApp)
- Splash: sessionStorage → localStorage

#### Fase 2C — Gate WhatsApp + Multi-ciudad + Frecuencias
- **WhatsappGateModal**: form con país selector (19 países, EC default), nombre, WhatsApp, email opcional
- **whatsappGate.tsx**: Context Provider + localStorage para persistir registro
- **useWhatsappCTA hook**: actualizado para abrir gate si no registrado
- TODOS los CTAs de WhatsApp actualizados (9 lugares)
- **Multi-ciudad copy**: removido "Jueves noche" hardcoded
- **FAQs reescritas** para Ecuador + online
- **EventsCalendar**: nueva sección que lee de DB con filtros
- **FrequenciesPlayer**: 4 frecuencias × 40s con Web Audio API (174, 396, 528, 741 Hz)
- **Tabla `breathwork_events`** creada con 24 columnas
- **Columnas country_code, country_name, email** agregadas a breathwork_leads

#### Fase 2D — Reservaciones + Bot Protection
- **breathwork_reservations** tabla con 21 columnas
- **amarte_bank_config** singleton para datos bancarios
- **ReservationModal**: multi-step (método → datos → instrucciones)
  - PayPhone (placeholder por ahora)
  - Transferencia (full flow con bank data + WhatsApp comprobante)
- **Bot protection**: honeypot + IP capture
- **Phone sanitization**: strip 0 inicial para Ecuador
- **Email regex** realista
- **Dedup soft cap**: 3 intentos por whatsapp (mensaje friendly al 4to)
- **count_lead_attempts** RPC con SECURITY DEFINER

#### Fase 2E — Polish
- **Auto-decrement spots** trigger al confirmar reserva
- **FAQs sync**: extraídas a `src/data/faqs.ts` compartido entre UI y Schema.org
- **aria-live** en NerveTest result para accesibilidad

#### Testing E2E (14 tests)
- 14/14 passed ✅
- 1 bug encontrado y fixed durante testing (count_lead_attempts permissions)
- Production validado: HTTP, bundle, lazy chunks, DB schema, RLS, security advisors

**Commits sesión 2:** 6955d4d, 2cfdf2e, de98145, f64cf39, + final commit

---

### Sesión 3 (2026-05-21) — BACKEND + SECURITY + UX HARDENING

**Resumen:** 21 mejoras en backend, infra, seguridad, SEO y anti-fricción. Ver [INVENTARIO_BACKEND.md](./INVENTARIO_BACKEND.md) para el detalle completo.

#### Fase 3A — Infraestructura (primera ronda)
1. **Backup automático DB** — Edge Function `daily-backup` + pg_cron 04:00 UTC + Storage bucket privado con retention 30d. Vault secret entre cron y función.
2. **Email templates** — 7 emails welcome sequence en `docs/EMAIL_TEMPLATES.md` + módulo TS `supabase/functions/_shared/email-templates.ts` listo para Resend.
3. **Bundle optimization** — Manual chunks en `vite.config.ts` separando vendors (react, motion, supabase, icons, utils). Main `index.js` de **131KB → 15.66KB gzip (-88%)**.
4. **Mobile UI refinements** — Hero chips clamp en iPhone SE + Header drawer con `AnimatePresence`.
5. **A11y audit** — `aria-current` en nav + ESC handler + body scroll lock en modals + Cookie banner role/aria-live.
6. **Geolocalización país** — `src/lib/geolocation.ts` con `detectCountry()` vía `ipapi.co` + cache sessionStorage 24h.
7. **Admin Dashboard `/admin`** — magic link Supabase Auth + allowlist 3 emails + Dashboard/Events/Reservations/Leads + CSV export.
8. **Per-event pages `/evento/:slug`** — SEO meta dinámico + ReservationModal directo + 404 friendly.
9. **PWA / Service Worker** — `public/sw.js` con offline fallback + cache-first static + network-first HTML.

#### Fase 3B — Backend / Security / UX hardening (12 mejoras encadenadas)
1. **#1 Schema.org Event** — JSON-LD inline en EventPage (Google Events ready) con startDate, endDate, location, offers, organizer, capacity.
2. **#2 Sitemap dinámico** — `scripts/generate-sitemap.mjs` corre en `prebuild`, lee Supabase ANON, genera `public/sitemap.xml` con todas las URLs incluyendo `/evento/:slug`. Auto-carga `.env.local`. Fallback estático si Supabase falla.
3. **#9 Slug auto-generado** — DB trigger con `slugify()` (remueve acentos, colapsa guiones, resuelve colisiones con sufijo numérico). No se puede crear evento sin slug.
4. **#12 404 page** — `src/pages/NotFoundPage.tsx` con CTA al home + grupo WhatsApp + lista próximos eventos. Marca `<meta name="robots" content="noindex">`.
5. **#6 Server-side validation** — CHECK constraints en `breathwork_leads` y `breathwork_reservations` (name length, email regex, whatsapp format, amount > 0) + trigger anti-honeypot + normalización (trim/lowercase).
6. **#3 Rate limiting server-side** — Triggers DB: max 5 leads/IP/60min + max 3 reservas/IP/60min. Index parcial en (ip_address, created_at desc). No bypaseable client-side.
7. **#4 CSP headers refinados** — Agregado `ipapi.co`, `worker-src 'self'`, `manifest-src 'self'`, `frame-src https://*.payphone.app`, `form-action 'self'`. Headers específicos para `/sw.js` (no-cache) y `/sitemap.xml` (xml content-type).
8. **#5 Cookie consent real** — `src/lib/consent.ts` con `getConsent/setConsent/onConsentChange` custom event. Pixels skip si `hasMarketingConsent() === false`. Cumple GDPR/LGPD.
9. **#11 Loading skeletons** — `src/components/Skeleton.tsx` reutilizable + aplicado a EventPage (hero+cover+4 detail cards) + AdminDashboard + AdminLeads. UX percibida más rápida.
10. **#10 Mobile audit** — `text-base` en inputs admin (evita iOS Safari zoom) + touch-targets >= 44px en mobile (`h-11 min-h-[44px]` con responsive `sm:h-9`).
11. **#8 Soft delete con undo** — AdminReservations: banner ámbar con countdown 10s tras cancelar reserva, click "Deshacer" restaura `payment_status` previo.
12. **#7 Dashboard analytics** — AdminDashboard con KPI conversión global (% confirmed/leads) + gráfica SVG inline de leads/día últimos 30d (bar chart) + donut SVG de reservas por método (payphone/transferencia/efectivo). Sin librería externa.

#### Bugs fixed durante la sesión
- `breathwork_corporate_inquiries` agregada al backup TABLES array (sesión paralela había creado la tabla pero quedaba sin backup)
- Conflictos de merge con sesión paralela `/mujeres` `/hombres` resueltos preservando ambas features
- `tracking-code` en reservations: client-side generation (anon no tiene SELECT)

#### Migraciones DB nuevas
- `20260521170000_daily_backup_infra.sql`
- `20260521180000_auto_slug_on_events.sql`
- `20260521190000_server_side_validation.sql`
- `20260521200000_rate_limit_by_ip.sql`

#### Archivos nuevos
```
scripts/generate-sitemap.mjs
supabase/functions/daily-backup/index.ts
supabase/functions/daily-backup/README.md
supabase/functions/_shared/email-templates.ts
src/components/Skeleton.tsx
src/lib/auth.ts
src/lib/consent.ts
src/lib/geolocation.ts
src/lib/pwa.ts
src/pages/EventPage.tsx
src/pages/NotFoundPage.tsx
src/pages/admin/AdminLayout.tsx
src/pages/admin/AdminLogin.tsx
src/pages/admin/AdminDashboard.tsx
src/pages/admin/AdminEvents.tsx
src/pages/admin/AdminReservations.tsx
src/pages/admin/AdminLeads.tsx
public/sw.js
docs/EMAIL_TEMPLATES.md
INVENTARIO_BACKEND.md
```

#### Verificación E2E final
- 17/17 rutas en producción HTTP 200
- 8 triggers activos, 8 CHECK constraints, cron `0 4 * * *` activo
- Edge Function v2 ACTIVE, 2 backups en Storage
- 3/3 events con slug auto-generado
- Sitemap en prod servido con 7 URLs
- CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy todos activos
- Build limpio: `✓ built in 1.91s` sin warnings

---

## 🎯 LO QUE FALTA POR HACER (priorizado)

### 🔥 ALTO IMPACTO (mañana / próximas sesiones)

#### 1. Auto-WhatsApp con Meta Cloud API ⭐ #1 prioridad
- **Plan completo:** ver `PLAN_WHATSAPP_AUTOMATION.md` en el repo
- **Tiempo:** 2h activas + esperar aprobación Meta (24-48h primera vez)
- **Necesitas tener listo:**
  - Cuenta Meta Business verificada (✅ ya tienes)
  - Número WhatsApp dedicado a Cloud API (⚠️ ese número deja de funcionar en app normal)
  - Acceso al chip para SMS de verificación
  - Link grupo WhatsApp (✅ ya tienes)
- **Pasos:** crear App de tipo Business en developers.facebook.com → producto WhatsApp → registrar número → template `amarte_welcome_breathwork` Utility → Permanent Access Token → Supabase Edge Function → Database Webhook → test
- **Beneficio:** conversión 2-3x (auto-mensaje en 30 seg vs respuesta manual)

#### 2. PayPhone integración real
- **Estado actual:** placeholder "preparando integración" en ReservationModal
- **Necesitas:** credenciales merchant PayPhone (LOGIN token + token API)
- **Pasos:** registrarse en payphone.com como merchant → obtener credenciales → integrar Web Box SDK o REST API → callback URL hacia Supabase Edge Function que actualiza payment_status='confirmed'
- **Tiempo:** 1-2h después de tener credenciales

#### 3. Email transaccional con Resend
- **Estado actual:** no existe
- **Necesitas:** API key gratis en resend.com (3000 emails/mes free)
- **Casos de uso:**
  - Reserva pendiente → "Te llegó la reserva, envía comprobante por WhatsApp"
  - Reserva confirmada → email con detalles del evento + QR
  - Newsletter mensual a subscribers
- **Tiempo:** 1h (Edge Function + templates)

#### 4. Páginas por evento `/evento/{slug}` (SEO + ads)
- **Estado actual:** todos los eventos viven en `/`
- **Beneficio:** pautas en Meta pueden apuntar a evento específico, mejor SEO
- **Tiempo:** 2h (instalar react-router + nuevo componente EventPage + actualizar links)

#### 5. Confirmación bancaria automática
- **Estado actual:** admin confirma manualmente cambiando `payment_status` en Supabase Studio
- **Tiempo futuro:** Trigger desde recepción de comprobante por WhatsApp Cloud API (Phase post-#1)

---

### 💎 MEDIO IMPACTO

#### 6. Admin dashboard `/admin`
- Página protegida con magic link Supabase Auth
- Ver/editar eventos sin entrar a Supabase Studio
- Confirmar reservas con un click
- Lista de leads con filtros + export CSV
- **Tiempo:** 2-3h

#### 7. Microsoft Clarity (heatmaps)
- **Tiempo:** 10 min
- **Costo:** Gratis ilimitado
- **Pasos:** crear cuenta clarity.microsoft.com → obtener project ID → pegar script en index.html

#### 8. Cookie banner respeta decisión
- Hoy: banner cosmético, pixels cargan igual
- Fix: si "Solo esenciales" → NO cargar pixels Meta/GA/TikTok
- **Tiempo:** 30 min

#### 9. Geolocalización país automática
- Pre-select dropdown según IP (Vercel header `x-vercel-ip-country`)
- **Tiempo:** 30 min
- **Beneficio:** -fricción para extranjeros

#### 10. Recordatorio 24h antes vía WhatsApp Cloud API
- Edge Function cron que mande recordatorio a reservas confirmadas
- **Tiempo:** 45 min después de tener #1

---

### 🎨 BAJO IMPACTO (polish)

#### 11. Foto real de Miguel
- Sube a `/public/guide.jpg`, edita `siteConfig.guide.photo`

#### 12. Logo gráfico AMARTE (no solo punto verde)

#### 13. og-image.png en vez de SVG (WhatsApp render mejor)

#### 14. Sitemap dinámico con eventos (después de #4)

#### 15. Vista calendario mensual (grid) — alternativa a lista actual

#### 16. Sentry para error tracking

---

## ⚙️ CONFIGURACIONES PENDIENTES (datos que TÚ debes proveer)

### En Supabase Studio:

**1. Datos bancarios reales** — Tabla `amarte_bank_config` (id=1):
```sql
UPDATE amarte_bank_config SET
  bank_name = 'Banco Pichincha',  -- o tu banco real
  account_holder = 'IOMI / AMARTE INC',
  account_type = 'Cuenta Ahorros',  -- o Corriente
  account_number = '2204XXXXXX',
  identification = '1700XXXXXX',
  email = 'breathwork@amarteinc.com'
WHERE id = 1;
```

**2. Eventos reales** — Tabla `breathwork_events`:
Editar/crear desde Table Editor en Supabase. Los 3 seed events están listos para que los uses como template.

### En `src/data/siteConfig.ts`:

**3. IDs de Pixels** (cuando los tengas):
```typescript
metaPixelId: "1234567890123456",     // de business.facebook.com
gaMeasurementId: "G-XXXXXXXXXX",      // de analytics.google.com
tiktokPixelId: "C...",                // de TikTok Ads Manager
```

**4. Fecha próxima sesión** (cuando confirmes):
```typescript
nextDateISO: "2026-06-12T19:30:00-05:00",
```

---

## 🛠️ COMANDOS ÚTILES

### Desarrollo local
```bash
cd amartebreathwork
npm install
npm run dev          # → http://localhost:5173
npm run build        # → /dist (verificar TS sin errores)
npm run preview      # → sirve /dist localmente
```

### Variables locales (.env.local)
```
VITE_SUPABASE_URL=https://ajhajtousbarhsfugxbo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  (la pública del README)
```

### Ver leads / reservaciones desde Supabase
1. Login amarteinc@gmail.com en supabase.com
2. Proyecto `amarteinc` → Table Editor
3. Tablas: `breathwork_leads`, `breathwork_reservations`, `breathwork_events`

### SQL útiles
```sql
-- Confirmar una reserva (trigger auto-decrementa spots)
UPDATE breathwork_reservations
SET payment_status = 'confirmed'
WHERE id = 'reservation-uuid-here';

-- Marcar evento como sold_out manualmente
UPDATE breathwork_events SET status = 'sold_out' WHERE id = 'event-uuid';

-- Ver leads del último mes
SELECT name, whatsapp, email, country_name, source, created_at
FROM breathwork_leads
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Contar intentos por phone (anti-bot)
SELECT count_lead_attempts('+593999565078');
```

### DNS check
```bash
dig +short breathwork.amarteinc.com CNAME
# Debe: e92efb80f6c910d4.vercel-dns-017.com
```

---

## 📚 DOCUMENTOS EN EL REPO

| Documento | Propósito |
|---|---|
| `ESTADO_PROYECTO.md` | **ESTE archivo** — fuente de verdad completa |
| `REPORTE_LANZAMIENTO.md` | Reporte de la sesión inicial (set-up infra) |
| `PLAN_WHATSAPP_AUTOMATION.md` | Plan detallado para auto-WhatsApp Meta API |
| `AUDITORIA_LANDING.md` | Auditoría exhaustiva de la web (700+ líneas) |
| `README.md` | Setup técnico del repo (Vite + npm scripts) |

---

## 🧠 PARA CLAUDE EN LA PRÓXIMA SESIÓN

Cuando IOMI retome este trabajo, hacer en este orden:

1. **Leer `ESTADO_PROYECTO.md` primero** (este archivo)
2. **Verificar MCP Supabase está conectado:**
   - `list_organizations` → debe ver "Amarte Inc"
   - Si no → pedir al usuario re-autorizar
3. **Verificar proyecto activo:**
   - `list_projects` → `amarteinc` debe estar `ACTIVE_HEALTHY`
   - Si pausado por inactividad → unpause
4. **Verificar Vercel deploy:**
   - `curl -sI https://breathwork.amarteinc.com/` → HTTP 200
   - Verificar bundle hash actual

**Memorias relevantes (en `/Users/iomi/.claude/projects/.../memory/`):**
- `[[project-amarteinc]]` — visión y estado
- `[[reference-supabase-limits]]` — gotchas de Supabase
- `[[feedback-supabase-separation]]` — preferencias de IOMI
- `[[feedback-no-api-billing]]` — triple confirmación antes de cualquier API

---

## 📊 MÉTRICAS DEL PROYECTO (al cierre sesión 2)

```
✅ 2 sesiones de trabajo
✅ ~12 commits totales
✅ ~5,000 líneas de código nuevo
✅ 5 tablas Supabase + 4 funciones DB + 10 RLS policies
✅ 8 documentos en el repo
✅ Bundle producción: 131 KB gzipped (excelente)
✅ TTFB: ~328ms
✅ Lighthouse score estimado: 90+
✅ 14/14 tests E2E passing
✅ 2 bugs encontrados y fixed durante testing
✅ Costo mensual: $0/mes (todo en planes Free)
```

**Costo proyectado cuando crezca:**
- 0-500 leads/mes: $0
- 500-1500 leads/mes con auto-WhatsApp: $0-8/mes (Meta free tier + Supabase free)
- 1500+ leads/mes: $25-50/mes (Pro tiers + WhatsApp cost)

---

## 💡 FILOSOFÍA DEL PROYECTO

- **Privacidad por defecto:** anon NO puede leer leads (solo INSERT)
- **Bot protection multi-capa:** honeypot + dedup + email regex + sanitize
- **Mobile-first:** responsive en 41/46 componentes
- **Performance obsesivo:** lazy loading todo below-the-fold
- **Accessibility:** skip links, aria, prefers-reduced-motion
- **Multi-país:** 19 países en selector, Ecuador default
- **Sin lock-in:** todo es portable (Vite, Postgres, no proprietary)

---

**Generado:** 2026-05-21
**Próxima actualización:** Cuando retomes el trabajo

🌿 Si llegaste hasta aquí leyendo — ya tienes contexto completo. Vamos. 🚀
