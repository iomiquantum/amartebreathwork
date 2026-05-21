# 🌿 AMARTE Breathwork — Estado del Proyecto

> **Última actualización:** 2026-05-21 (sesión 1 completa)
> **Estado:** EN PRODUCCIÓN — sistema operativo end-to-end
> **URL:** https://breathwork.amarteinc.com
> **Repo:** https://github.com/iomiquantum/amartebreathwork
> **Stack:** Vite + React 19 + TS + Tailwind + Supabase + Vercel

Este documento es la **fuente única de verdad** del proyecto. Si cierras la sesión, abre este archivo primero al regresar y tendrás todo el contexto.

---

## 📊 RESUMEN EJECUTIVO

**Lo que tienes hoy:**
- 🟢 Landing pública con SSL: https://breathwork.amarteinc.com
- 🟢 Captura de leads con gate WhatsApp (modal con selector país)
- 🟢 Backend de eventos multi-ciudad + online (Ecuador)
- 🟢 Sistema de reservas con depósito ($20 USD default)
- 🟢 2 métodos de pago: PayPhone (placeholder) + Transferencia bancaria (full flow)
- 🟢 4 frecuencias en vivo con Web Audio API (174, 396, 528, 741 Hz)
- 🟢 Calendario de eventos con filtros (ciudad + formato)
- 🟢 Bot protection: honeypot + dedup 3-max + sanitización phone + email regex
- 🟢 Pixels infrastructure: Meta + GA4 + TikTok (esperando IDs)
- 🟢 FAQs sincronizadas entre UI y Schema.org

**Lo que falta para "todo listo para pautar":**
1. Auto-WhatsApp con Meta Cloud API (próxima sesión, ~2h)
2. PayPhone integración real (necesita credenciales)
3. Email transaccional con Resend (~1h, free tier 3000 emails/mes)
4. Datos bancarios reales en `amarte_bank_config`
5. Meta Pixel ID (cuando lo tengas)
6. Foto real de Miguel

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
