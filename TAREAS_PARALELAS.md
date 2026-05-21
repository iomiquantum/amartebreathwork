# 🚦 Coordinación de Sesiones Paralelas — AMARTE

> **Propósito:** Permitir que múltiples sesiones de Claude trabajen en paralelo en este proyecto sin pisarse (sin merge conflicts ni duplicación de trabajo).
> **Última actualización:** 2026-05-22

---

## 📖 SI ERES UNA SESIÓN NUEVA, LEE ESTO PRIMERO

### Paso 1: Lee los documentos obligatorios EN ESTE ORDEN
1. `ESTADO_PROYECTO.md` — fuente de verdad del proyecto (700+ líneas con todo)
2. `TAREAS_PARALELAS.md` (este archivo) — qué hacer y qué NO tocar
3. (Opcional según tu tarea):
   - `PLAN_WHATSAPP_AUTOMATION.md` — si te toca WhatsApp Cloud API
   - `AUDITORIA_SEGURIDAD.md` — si te toca anything de seguridad
   - `AUDITORIA_LANDING.md` — si te toca UX/UI

Comando: `gh api repos/iomiquantum/amartebreathwork/contents/ESTADO_PROYECTO.md --jq '.content' | base64 -d`

### Paso 2: Verifica MCP de Supabase
- Llama `list_organizations` → debe ver `Amarte Inc`
- Llama `list_projects` → debe ver `amarteinc` ACTIVE_HEALTHY
- Si no → pídele al usuario re-autorizar

### Paso 3: Elige tu tarea de "Carriles libres" (ver abajo)
- Anuncia en chat: "Voy a tomar tarea X (zona Y, archivos Z)"
- Trabaja SOLO en los archivos que indica esa tarea
- NO toques los archivos de "Carriles ocupados"

---

## 🚦 CARRILES OCUPADOS (NO TOQUES estos archivos)

### Sesión Principal (tracking + pixels)
**Archivos que NO debes modificar:**
- `src/data/siteConfig.ts`
- `src/lib/tracking.ts`
- `src/lib/pixels.ts`
- `src/App.tsx` (eventualmente; pregunta primero)
- `index.html`
- `vercel.json` (eventualmente)

### Sesión WhatsApp Cloud API (si está activa)
**Archivos que NO debes modificar:**
- `supabase/functions/whatsapp-welcome/` (cuando la creen)
- Database webhooks de breathwork_leads
- Meta Pixel/WhatsApp Business config (lado externo)

---

## ✅ CARRILES LIBRES — Tareas disponibles para tomar

> **Reglas:** Toma UNA tarea a la vez. Trabaja SOLO en los archivos que indica. Commit con mensaje claro `feat(zone-X): ...`. Cuando termines, marca aquí como `[DONE]` y commit.

### 🎯 ALTO IMPACTO — Backend

#### A. Páginas por evento `/evento/{slug}` ✅ [DONE — 2026-05-21]
- **Implementado:** ruta `/evento/:slug` con SEO meta dinámico (title, description, og:image, og:url, og:type=event)
- **fetchEventBySlug()** agregado a `src/lib/supabase.ts` — busca published/sold_out/past
- **404 handling:** si el slug no existe muestra error friendly con CTA a /
- **CTA reservar:** abre `ReservationModal` directamente desde la página
- **EventsCalendar:** títulos linkean a `/evento/:slug` (descubrible por Google)
- **Bundle:** EventPage lazy-loaded, ~5KB gzip
- **Archivos:** `src/pages/EventPage.tsx`, `src/lib/supabase.ts`, `src/App.tsx`, `src/components/EventsCalendar.tsx`

#### B. PayPhone integración real [DISPONIBLE]
- **Por qué:** sustituir el placeholder en ReservationModal con flujo real
- **Tiempo:** 1-2 horas (depende de docs PayPhone)
- **Necesita del usuario:** credenciales merchant PayPhone (Login token + token API)
- **Archivos nuevos:**
  - `supabase/functions/payphone-create-transaction/`
  - `supabase/functions/payphone-callback/`
  - `src/lib/payphone.ts`
- **Archivos modificar:**
  - `src/components/ReservationModal.tsx` (step payphone_placeholder → flujo real)
  - `src/lib/supabase.ts` (helper para actualizar transaction_id en reserva)

#### C. Resend email transaccional [DISPONIBLE]
- **Por qué:** confirmar reservas + recordatorios + newsletter
- **Tiempo:** 1 hora
- **Necesita del usuario:** API key de resend.com (free tier 3000 emails/mes)
- **Archivos nuevos:**
  - `supabase/functions/send-reservation-email/`
  - `supabase/functions/send-newsletter/`
  - `supabase/functions/_shared/email-templates.ts`
- **Webhooks:** crear webhook en breathwork_reservations al cambiar status='confirmed'

#### D. Admin Dashboard `/admin` ✅ [DONE — 2026-05-21]
- **Implementado:** sistema completo de admin con magic link de Supabase Auth
- **Auth:** allowlist hardcoded en `src/lib/auth.ts` (`breathwork@amarteinc.com`, `amarteinc@gmail.com`, `miguelvalencia0531@gmail.com`)
- **Pages:**
  - `/admin/login` — magic link form
  - `/admin` — Dashboard con KPIs (leads totales, leads 7d, eventos próximos, reservas pending/confirmed)
  - `/admin/events` — lista de eventos + cambiar status (draft/published/sold_out/cancelled/past)
  - `/admin/reservations` — confirmar/cancelar reservas con un click (trigger DB auto-decrementa spots al confirmar)
  - `/admin/leads` — lista con buscador en vivo + export CSV
- **Routing:** App.tsx detecta `/admin` y renderiza sin Header público / Splash / Floating WA / etc.
- **Bundle:** todo lazy-loaded (chunks pequeños por pagina admin)
- **PENDIENTE MANUAL EN SUPABASE:** agregar redirect URLs en Authentication → URL Configuration:
  - `https://breathwork.amarteinc.com/admin`
  - `http://localhost:5173/admin` (dev)

#### E. Recordatorio 24h antes del evento [DISPONIBLE — pero después de WhatsApp Cloud API]
- **Depende:** WhatsApp Cloud API debe estar funcionando primero
- **Tiempo:** 45 min
- **Archivos nuevos:**
  - `supabase/functions/event-reminder-cron/`
- **Cron:** Supabase pg_cron o Vercel Cron Jobs
- **Logic:** SELECT reservations confirmed con event_date BETWEEN now() AND now() + interval '24 hours'

#### F. Backup automático de DB ✅ [DONE — 2026-05-21]
- **Implementado:** Edge Function `daily-backup` deployed + `pg_cron` job `daily-backup-amarte` a 04:00 UTC (23:00 Ecuador)
- **Storage:** bucket privado `backups`, retention 30 días, ruta `YYYY-MM-DD/backup-{ISO}.json`
- **Auth:** shared secret en `vault.secrets` (name='backup_secret'), expuesto vía RPC `get_backup_secret()` restringido a service_role
- **Test E2E:** ejecutado con status 200, 5 tablas dumpeadas, 4.6KB, 530ms
- **Archivos:** `supabase/functions/daily-backup/index.ts`, `supabase/functions/daily-backup/README.md`, `supabase/migrations/20260521170000_daily_backup_infra.sql`

### 🎨 MEDIO IMPACTO — Frontend / UX

#### G. Geolocalización país automática ✅ [DONE — 2026-05-21]
- **Implementado:** `src/lib/geolocation.ts` con `detectCountry()` usando `ipapi.co/json/` (free 1000 req/día)
- **Cache:** sessionStorage 24h TTL, evita refetch en cada apertura del modal
- **Comportamiento:** solo aplica si el usuario aún no cambió el país manualmente (country === DEFAULT_COUNTRY). 20 ISOs mapeados a phone codes.
- **AbortController:** si el modal cierra antes de que la request resuelva, se cancela
- **Archivos:** `src/lib/geolocation.ts`, `src/components/WhatsappGateModal.tsx`

#### H. Sentry integration [DISPONIBLE]
- **Por qué:** error tracking en producción
- **Tiempo:** 15 min
- **Necesita del usuario:** Sentry DSN (free tier)
- **Archivos nuevos:** `src/lib/sentry.ts`
- **Modificar (LIGHT):** `src/main.tsx` (init Sentry) — ⚠️ COORDINAR

#### I. Logo gráfico AMARTE [DISPONIBLE — diseño]
- **Por qué:** hoy el "logo" es solo un punto verde
- **Tiempo:** 1-2h (con tool de diseño)
- **Archivos nuevos:**
  - `public/logo.svg`
  - `public/logo-dark.svg`
- **Modificar:** `src/components/Header.tsx` (reemplazar el punto verde)
- **Inspiración:** símbolo de respiración, onda sonora, círculo zen

#### J. og-image.png profesional [DISPONIBLE — diseño]
- **Por qué:** WhatsApp no renderiza bien el SVG actual al compartir
- **Tiempo:** 30 min con tool de diseño
- **Archivos nuevos:** `public/og-image.png` (1200×630)
- **Modificar:** `index.html` (meta og:image)

#### K. Real gallery photos [DISPONIBLE — requiere fotos]
- **Por qué:** la galería ahora son íconos placeholder
- **Tiempo:** 30 min (después de tener fotos)
- **Archivos nuevos:** `public/gallery/1.jpg`, `2.jpg`, etc.
- **Modificar:** `src/components/Gallery.tsx` (renderizar imágenes en vez de íconos)

### 💎 BAJO IMPACTO — Polish

#### L. Mobile UI refinements ✅ [DONE — 2026-05-21]
- **Hero chips fix:** clamp inside frame en mobile (`left-2`/`right-2` + `max-w-[60%]` + `truncate`), liberados a posición original en sm+
- **Header drawer:** `AnimatePresence` wrapper agregado para que la animación exit (-y 8 + fade) corra correctamente
- **Archivos:** `src/components/Hero.tsx`, `src/components/Header.tsx`

#### M. Accessibility audit avanzado ✅ [DONE — 2026-05-21]
- **Header nav:** `aria-current="true"` en item activo + focus-visible ring consistente
- **CookieBanner:** cambiado de `role="dialog"` (no era blocking) a `role="region"` + `aria-live="polite"`
- **WhatsappGateModal + ReservationModal:** ESC key handler + body scroll lock cuando abiertos
- **Baseline previo verificado:** modals con `aria-modal/labelledby`, `aria-expanded` en FAQ, `aria-live` en NerveTest, `role="alert"` en errores, htmlFor/id en forms — todo OK
- **Archivos:** `src/components/Header.tsx`, `src/components/CookieBanner.tsx`, `src/components/WhatsappGateModal.tsx`, `src/components/ReservationModal.tsx`

#### N. Per-component bundle optimization ✅ [DONE — 2026-05-21]
- **Implementado:** manualChunks function en `vite.config.ts` separando vendors (react, framer-motion, supabase, lucide, utils)
- **Resultado:** main `index.js` de 131KB gzip → **15.66KB gzip** (-88%). Vendor chunks ahora cacheables por separado entre deploys.
- **Build time:** 16.7s → 5.48s
- **Archivos:** `vite.config.ts`

#### O. PWA support / Service Worker [DISPONIBLE]
- Ya tienes manifest.webmanifest, solo falta SW
- Permite "Add to Home Screen" en móviles
- **Tiempo:** 1h
- **Archivos nuevos:** `public/sw.js`, `src/lib/pwa.ts`

### 📋 CONTENIDO

#### P. Plan editorial Instagram/TikTok 30 días [DISPONIBLE]
- Calendario de posts
- Ideas de Reels
- Carruseles educativos
- Hashtags strategy
- **Archivos nuevos:** `docs/CONTENIDO_REDES.md`

#### Q. Email templates (welcome sequence) ✅ [DONE — 2026-05-21]
- **Implementado:** 7 emails de bienvenida con tono AMARTE (cálido, profundo)
- **Archivos:** `docs/EMAIL_TEMPLATES.md` (spec + cronograma) + `supabase/functions/_shared/email-templates.ts` (TypeScript module con `EmailTemplate[]`, `renderEmail()`, HTML estilizado mobile-first)
- **Cronograma:** día 0, +1, +3, +5, +7, +10, +14
- **Listo para conectar:** cuando llegue API key Resend (Tarea 10), las funciones de envío ya tienen los templates importables

#### R. Plan Meta Ads completo [DISPONIBLE]
- Audiencias custom
- Copy de 5-10 anuncios
- Budget plan
- KPIs
- **Archivos nuevos:** `docs/PLAN_META_ADS.md`

---

## 🛡️ REGLAS CRÍTICAS (RESPECT THESE)

### 1. UN archivo = UNA sesión a la vez
Si vas a editar un archivo que sospechas que otra sesión esté usando, **pregunta al usuario primero**. Es mejor esperar 30 segundos que tener un merge conflict.

### 2. Tareas que toquen src/App.tsx COORDINAR
App.tsx es el orquestador. Múltiples sesiones podrían querer agregar Suspense, providers, rutas. **Antes de modificar App.tsx, pregunta al usuario qué otras sesiones están activas.**

### 3. NUNCA modifiques migraciones Supabase aplicadas
Las migraciones aplicadas (visibles en `list_migrations`) son inmutables. Si necesitas cambiar schema, crea NUEVA migration.

### 4. NUNCA toques siteConfig.ts si la sesión principal está activa
Esta sesión la edita frecuentemente para integrar IDs de pixels.

### 5. Commits descriptivos
- Formato: `<tipo>(<zona>): <descripción>`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `security`
- Ejemplo: `feat(payphone): integrar SDK PayPhone Web Box`
- Incluye `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`

### 6. Build verification antes de push
- Siempre `npm run build` antes de commit
- Si hay TS errors → arreglar antes de push
- Bundle no debe crecer > 50KB sin razón clara

### 7. Test antes de cantar victoria
- Si tocas backend (Supabase function) → invocala con datos de prueba
- Si tocas frontend → mira el sitio en producción tras Vercel deploy (~1 min)

### 8. Si encuentras un bug NO relacionado
- Si encuentras un bug que no es de tu zona, **avísale al usuario** pero no lo arregles a menos que sea trivial
- Documéntalo aquí en una sección "Bugs encontrados pendientes"

---

## 📊 ESTADO DE TAREAS (actualizar al tomar / terminar)

| Tarea | Estado | Sesión asignada | Iniciado | Terminado |
|---|---|---|---|---|
| A. Per-event pages | Disponible | — | — | — |
| B. PayPhone | Disponible | — | — | — |
| C. Resend email | Disponible | — | — | — |
| D. Admin dashboard | Disponible | — | — | — |
| E. Recordatorio 24h | Bloqueada (espera WhatsApp) | — | — | — |
| F. Backup auto | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| Q. Email templates | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| N. Bundle optim | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| L. Mobile refinements | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| M. A11y audit | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| G. Geolocation | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| D. Admin Dashboard | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| A. Per-event pages | **[DONE]** | claude-opus-4-7 (paralela) | 2026-05-21 | 2026-05-21 |
| G. Geolocation | Disponible | — | — | — |
| H. Sentry | Disponible | — | — | — |
| I. Logo gráfico | Disponible | — | — | — |
| J. og-image PNG | Disponible | — | — | — |
| K. Gallery photos | Bloqueada (espera fotos) | — | — | — |
| L. Mobile refinements | Disponible | — | — | — |
| M. A11y audit | Disponible | — | — | — |
| N. Bundle optim | Disponible | — | — | — |
| O. PWA / SW | Disponible | — | — | — |
| P. Plan editorial redes | Disponible | — | — | — |
| Q. Email templates | Disponible | — | — | — |
| R. Plan Meta Ads | Disponible | — | — | — |

---

## 🚨 PROTOCOLO DE EMERGENCIA

### Si hay merge conflict
1. NO hagas force push
2. Pull primero: `git pull origin main --rebase`
3. Resolver conflicto manualmente (preserva los cambios de ambas sesiones si posible)
4. Re-push

### Si rompes algo en producción
1. Git revert al último commit que funcionaba
2. Push
3. Diagnostica el problema
4. Avísale al usuario QUÉ se rompió y qué hiciste para revertir

### Si Supabase deja de responder
1. Verifica MCP: `list_projects` debe retornar
2. Si no → pide al usuario verificar en supabase.com que el proyecto siga activo
3. Si está pausado → pide unpause

---

## 📝 BUGS ENCONTRADOS PENDIENTES (cualquier sesión puede registrar)

(Ninguno reportado al momento. Si encuentras uno, agrégalo aquí con: archivo, línea, severidad, descripción.)

---

## 🌿 Documento vivo

Este archivo se actualiza por cualquier sesión que tome o termine una tarea. Si haces cambio de estado, **commit con mensaje** `chore(parallel): actualizar estado tarea X`.

**Generado:** 2026-05-22
**Mantenido por:** todas las sesiones Claude activas en el proyecto
