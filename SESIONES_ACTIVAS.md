# 🎯 Dashboard de Sesiones Paralelas — AMARTE

> **Propósito:** snapshot completo de qué se ha delegado a qué sesión Claude, qué está completo, qué está en progreso, qué falta. Si abres una sesión nueva, lee este doc primero junto con `ESTADO_PROYECTO.md`.
>
> **Última actualización:** 2026-05-22

---

## 🌐 URLS / Verticals del proyecto

```
breathwork.amarteinc.com/                ← Home (público general)
breathwork.amarteinc.com/corporativo     ← B2B empresas
breathwork.amarteinc.com/jovenes         ← Niños/jóvenes/colegios (en construcción)
breathwork.amarteinc.com/hombres         ← Vertical masculino (en construcción)
breathwork.amarteinc.com/mujeres         ← Vertical femenino (en construcción)
breathwork.amarteinc.com/admin/*         ← Panel admin (Login, Events, Leads, Reservations)
```

---

## 🚦 SESIONES ACTIVAS / DELEGADAS

### Sesión 1: PRINCIPAL (Claude conmigo, IOMI)
**Estado:** 🟢 Activa
**Foco:** Tracking pixels, coordinación general, infraestructura
**Esperando del usuario:**
- 🅵 Meta Pixel ID (de business.facebook.com → Events Manager)
- 📊 GA4 Measurement ID (de analytics.google.com)
- 🔥 Microsoft Clarity Project ID (de clarity.microsoft.com)

**Archivos exclusivos:**
- `src/lib/tracking.ts`, `src/lib/pixels.ts`
- `src/data/siteConfig.ts` (frequent edits)
- `src/App.tsx` (eventual)
- `index.html`, `vercel.json`

---

### Sesión 2: WhatsApp Cloud API
**Estado:** 🟡 Delegada (prompt entregado, no confirmado iniciada)
**Foco:** Setup Meta Cloud API + Edge Function whatsapp-welcome para auto-mensaje al gate
**Prompt entregado:** sí (mensaje del 22 mayo)
**Necesita del usuario:** acceso a Meta for Developers + número WhatsApp dedicado

**Archivos exclusivos:**
- `supabase/functions/whatsapp-welcome/`
- Configuración externa Meta Business

**Output esperado:**
- Cuando alguien complete WhatsappGateModal → recibe auto-mensaje en <30s
- Template `amarte_welcome_breathwork` aprobado por Meta

---

### Sesión 3: Backend / Mejoras generales
**Estado:** 🟢 Activa (muy productiva, 4+ tareas completadas)
**Foco:** Tareas del menú TAREAS_PARALELAS.md
**Prompt entregado:** sí

**✅ COMPLETADO por esta sesión:**
- ✅ Tarea F: Backup automático DB (Edge Function daily-backup + cron 04:00 UTC + Storage bucket retention 30d)
- ✅ Tarea N: Vendor chunks split (react, motion, supabase, icons, utils separados)
- ✅ Tarea Q: Email welcome sequence (7 emails) + Resend-ready templates
- ✅ Tarea D: Admin Dashboard completo (`/admin/login`, `/admin/events`, `/admin/leads`, `/admin/reservations`)
- ✅ Tarea G: Geolocation auto-país (`src/lib/geolocation.ts` + integrado en WhatsappGateModal)
- ✅ Tarea L: Mobile UI refinements (Header, EventsCalendar, ReservationModal, WhatsappGateModal)

**🟡 Disponibles para tomar:**
- Tarea B: PayPhone integración real (necesita credenciales del usuario)
- Tarea C: Resend email transaccional (necesita API key Resend del usuario)
- Tarea H: Sentry integration (necesita Sentry DSN del usuario)
- Tarea M: Accessibility audit avanzado

---

### Sesión 4: Visual / Design
**Estado:** 🟡 Delegada (prompt entregado)
**Foco:** Analizar imágenes/videos del usuario, integrar a la web, optimizar
**Prompt entregado:** sí
**Necesita del usuario:** ruta de carpeta local con imágenes

**Archivos exclusivos:**
- `/public/gallery/`, `/public/guide/`, `/public/team/`, etc.
- `src/components/Gallery.tsx`, `GuideSection.tsx`, `Testimonials.tsx`

**Output esperado:**
- Reemplazar todos los placeholders Unsplash con fotos reales
- Logo gráfico AMARTE
- og-image.png profesional

---

### Sesión 5: Corporativo `/corporativo`
**Estado:** 🟢 Base lista, mejoras delegadas
**Base creada:** ✅ por la sesión principal (esta) en commit `e6269d7`
- Página completa con 8 secciones (hero, stats, beneficios, casos uso, proceso, logística, FAQ, form B2B)
- Tabla `breathwork_corporate_inquiries` operativa
- Form B2B con honeypot + UTM tracking
- En producción: https://breathwork.amarteinc.com/corporativo

**🟡 Sesión dedicada para EXPANDIR:** prompt entregado
**Mejoras pendientes (14 opciones):**
- Pricing tiers transparentes
- Casos de éxito (placeholder hasta tener reales)
- Comparativa AMARTE vs alternativas
- Logos clientes "Trusted by"
- Multi-step form
- Stats con counter animation
- ROI calculator
- PDF descargable ejecutivo
- Etc.

**Archivos exclusivos:**
- `src/pages/CorporatePage.tsx`
- `src/pages/corporativo/` (carpeta para subcomponentes)
- `public/corporativo/`

---

### Sesión 6: Jóvenes/Colegios `/jovenes`
**Estado:** 🟡 Delegada (prompt entregado, no confirmado iniciada)
**Foco:** Crear landing dedicada breathwork para niños 9+ y colegios
**Prompt entregado:** sí

**Fase 1:** Investigación profunda (breathwork niños, mindfulness en colegios, salud mental adolescente Ecuador)
**Fase 2:** Diseño post-investigación
**Fase 3:** Build de landing + DB nueva

**Archivos exclusivos:**
- `src/pages/YouthPage.tsx` (o nombre que decidan)
- `src/pages/youth/`
- `public/youth/`
- Nueva tabla `breathwork_youth_inquiries`

**Output esperado:**
- Landing dual audience (padres + colegios)
- Form B2B (colegios) + B2C (padres) con selector inicial
- Contenido basado en research científico

---

### Sesión 7: Hombres + Mujeres `/hombres` `/mujeres`
**Estado:** 🟡 Delegada (prompt entregado, no confirmado iniciada)
**Foco:** Verticals dobles segmentadas por género
**Prompt entregado:** sí

**Fase 1:** Investigación profunda (fisiología, salud mental, posicionamiento por género)
**Fase 2:** Diseño paleta/tono diferenciado SIN estereotipos
**Fase 3:** Build ambas pages + DB compartida

**Archivos exclusivos:**
- `src/pages/MenPage.tsx`, `src/pages/WomenPage.tsx`
- `src/pages/gender/` (componentes compartidos)
- `public/hombres/`, `public/mujeres/`
- Nueva tabla `breathwork_gender_inquiries`

**Output esperado:**
- 2 landings con shared components
- Contenido respetuoso basado en ciencia
- Inclusivo (trans/no-binarios mencionados)

---

## ✅ TAREAS COMPLETADAS EN EL PROYECTO

### Setup inicial (sesión 1)
- Supabase project + 6 tablas + RLS + Edge Functions
- Vercel deploy + dominio custom `breathwork.amarteinc.com` + SSL
- Repo `iomiquantum/amartebreathwork` con commits limpios

### Frontend completo
- Home con 25+ secciones (Hero, Frecuencias, Calendar, etc.)
- WhatsApp gate con 19 países (selector geolocation auto)
- Reservation modal con depósito + transferencia
- FrequenciesPlayer (4 frecuencias en vivo Web Audio API)
- Lead capture multi-step

### Backend
- Database: 7 tablas (leads, subscribers, events, reservations, bank_config, corporate_inquiries, *en construcción youth/gender*)
- 5+ Edge Functions (incluyendo daily-backup)
- RLS multi-capa
- pg_cron jobs
- Triggers auto (spots decrement al confirmar reserva)

### Security
- HTTP security headers completos (HSTS, CSP, X-Frame, etc.)
- Bot protection (honeypot + dedup 3-max + email regex + IP capture)
- 8/10 OWASP Top 10 mitigado
- Score estimado A+ en SecurityHeaders.com

### Verticals
- ✅ Home (general public)
- ✅ Corporate (B2B)
- 🟡 Jovenes (delegada)
- 🟡 Hombres (delegada)
- 🟡 Mujeres (delegada)

### Admin
- ✅ Login con Supabase Auth
- ✅ Dashboard (`/admin/events`, `/admin/leads`, `/admin/reservations`)
- ✅ AdminLayout

### Analytics infrastructure
- ✅ Meta Pixel + GA4 + TikTok + Clarity (auto-init si IDs presentes)
- ✅ UTM capture + persistencia
- ✅ Engagement tracking (scroll depth, time on page)
- ✅ Custom events (Lead, ViewContent, AddToCart, InitiateCheckout, Purchase)
- 🟡 Esperando IDs del usuario para activar

### Documentación (9 archivos .md)
- `ESTADO_PROYECTO.md` — master state
- `TAREAS_PARALELAS.md` — coordinación
- `SESIONES_ACTIVAS.md` — este archivo (dashboard)
- `REPORTE_LANZAMIENTO.md` — setup inicial
- `PLAN_WHATSAPP_AUTOMATION.md` — plan Meta Cloud API
- `AUDITORIA_LANDING.md` — UX audit
- `AUDITORIA_SEGURIDAD.md` — security audit
- `README.md`
- Más en `/supabase/functions/*/README.md`

---

## 📋 LO QUE ESPERA DEL USUARIO (IOMI)

Para que las sesiones avancen al máximo, IOMI necesita proveer cuando pueda:

### 🔥 ALTA PRIORIDAD
- ☐ **Meta Pixel ID** (Sesión 1) — para activar tracking de ads
- ☐ **GA4 Measurement ID** (Sesión 1) — para analytics
- ☐ **Microsoft Clarity Project ID** (Sesión 1) — para heatmaps
- ☐ **WhatsApp Cloud API setup** (Sesión 2) — Business Account + número
- ☐ **Datos bancarios reales** para reservas — Supabase Studio → `amarte_bank_config`

### 🟠 MEDIA PRIORIDAD
- ☐ **Fotos reales** para sesión visual (Miguel + gallery + eventos)
- ☐ **Credenciales PayPhone merchant** (para tarea B)
- ☐ **API key Resend** (para tarea C — email transaccional)
- ☐ **Sentry DSN** (para tarea H — error tracking)

### 🟡 BAJA PRIORIDAD
- ☐ Video corporativo / testimoniales
- ☐ Logo gráfico AMARTE (puede esperar)
- ☐ Eventos reales en `breathwork_events` (Supabase Studio)
- ☐ Logos clientes corporativos (cuando los tenga)

---

## 🔗 PROMPTS DE SESIONES (referenciados)

Los prompts completos para cada sesión paralela están en el historial del chat principal. Para encontrarlos rápido:

1. **Sesión WhatsApp:** prompt empieza con "Hola Claude, soy IOMI. Tengo otra sesión tuya abierta trabajando en setup de tracking pixels..."

2. **Sesión Backend:** prompt empieza con "Hola Claude, soy IOMI. Tengo otras sesiones tuyas trabajando en paralelo..."

3. **Sesión Visual:** prompt empieza con "Hola Claude, soy IOMI. Tengo otras 3 sesiones tuyas trabajando en paralelo..."

4. **Sesión Corporativo (mejoras):** prompt empieza con "Hola Claude, soy IOMI. Tengo otras sesiones tuyas trabajando en paralelo en este proyecto. Tu rol específico aquí es MEJORAR Y EXPANDIR la landing corporativa..."

5. **Sesión Jóvenes:** prompt empieza con "Hola Claude, soy IOMI. Tengo otras sesiones tuyas trabajando en paralelo. Tu rol específico aquí es CREAR una nueva landing dedicada a BREATHWORK PARA NIÑOS Y JÓVENES..."

6. **Sesión Hombres/Mujeres:** prompt empieza con "Hola Claude, soy IOMI. Tengo otras sesiones tuyas trabajando en paralelo. Tu rol es CREAR DOS landings dedicadas: /hombres y /mujeres..."

---

## 📊 MÉTRICAS DEL PROYECTO (al snapshot)

| Métrica | Valor |
|---|---|
| Commits totales | 20+ |
| Sesiones de trabajo Claude paralelas | 7 (1 activa, 6 delegadas) |
| Tablas DB | 7 (creciendo a 9 cuando youth/gender estén) |
| Edge Functions | 4+ (incluyendo backup, próximamente whatsapp + email) |
| Componentes React | 50+ |
| Bundle gzipped main | ~145 KB |
| Páginas con SEO | 2 producción (/, /corporativo) + 3 en construcción |
| Líneas de código | ~10,000+ |
| Documentación .md | 9 archivos |
| Costo mensual | $0 (todo en free tier) |

---

## 🌿 Filosofía del sistema multi-sesión

- **UN archivo = UNA sesión a la vez**
- **NUEVA carpeta = TU zona libre**
- **Comunicar con commits descriptivos** (`feat(zone): ...`)
- **TAREAS_PARALELAS.md** se actualiza al tomar/terminar tareas
- **Coordinar conmigo (sesión principal)** antes de tocar archivos compartidos (App.tsx, siteConfig.ts)

---

## 🎯 Próximos pasos del proyecto

Una vez todo el trabajo paralelo en flight se complete:

1. **Activar tracking pixels** (cuando IOMI provea IDs)
2. **Activar auto-WhatsApp** (cuando Meta apruebe template)
3. **Lanzar primera campaña Meta Ads** segmentada por vertical:
   - Campaign 1: B2C wellness → home
   - Campaign 2: B2B corporativo → /corporativo
   - Campaign 3: Padres + colegios → /jovenes
   - Campaign 4: Femenino premium → /mujeres
   - Campaign 5: Masculino performance → /hombres
4. **Análizar primeros leads** vía /admin
5. **Iterar** según data

---

**Generado:** 2026-05-22
**Mantenido por:** todas las sesiones Claude activas
