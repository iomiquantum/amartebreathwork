# AMARTE — Reporte Técnico del Proyecto

> **Estado:** Listo para configurar credenciales y desplegar.
> **Última actualización:** 2026-05-09
> **Owner:** Miguel Ángel Valencia (Impulsar Corp / iOMI MUSIC LAB)
> **Stack:** Vite 8 + React 19 + TypeScript + Tailwind CSS 3 + Framer Motion + Supabase

---

## 1. Resumen ejecutivo

**AMARTE** es una landing de conversión cinematográfica para captar leads desde pauta digital (Meta / TikTok) hacia un grupo privado de WhatsApp donde se anuncian las próximas experiencias presenciales de **breathwork inmersivo** (respiración + sonido + frecuencias) cada 15 días, los jueves en la noche.

- **Marca interna del proyecto:** AMARTE
- **Marca pública / titular hero:** "Regula tu sistema nervioso · Breathwork Inmersivo"
- **CTA principal:** Unirse al grupo privado de WhatsApp
- **CTA alternativos:** Newsletter por email · Mailto a empresas

---

## 2. Cómo levantar el proyecto

```bash
cd AMARTEBREATHWORK
npm install
npm run dev          # http://localhost:5173
npm run build        # genera /dist (verificar antes de deploy)
npm run preview      # sirve /dist localmente
```

Variables de entorno (opcionales — si están vacías, los formularios siguen funcionando pero solo loguean en consola):

```bash
# .env.local
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

---

## 3. Estructura del proyecto

```
AMARTEBREATHWORK/
├── public/
│   ├── favicon.svg                # Logo punto verde
│   ├── og-image.svg               # OG image cinematográfica 1200×630
│   ├── site.webmanifest           # PWA installable + shortcuts
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── 404.html                   # Página 404 cinematográfica
│   ├── privacidad.html            # Política de privacidad
│   ├── terminos.html              # Términos y condiciones
│   └── gracias.html               # Landing post-conversión
│
├── src/
│   ├── components/
│   │   ├── Aurora.tsx              # Blobs de gradiente animados
│   │   ├── AudioWavePreview.tsx    # 48 barras reactivas play/pause
│   │   ├── BehindTheScenes.tsx     # Cómo se construye una sesión
│   │   ├── BenefitsSection.tsx     # Lista de beneficios
│   │   ├── CinematicQuote.tsx      # Bloque emocional + BreathPacer 4-4-4
│   │   ├── Comparison.tsx          # Tabla comparativa vs alternativas
│   │   ├── CookieBanner.tsx        # Banner consentimiento
│   │   ├── CorporateSection.tsx    # CTA B2B con mailto
│   │   ├── Countdown.tsx           # Cuenta regresiva días/h/m/s
│   │   ├── CTAButton.tsx           # Botón con magnetic effect
│   │   ├── CursorGlow.tsx          # Glow que sigue mouse en hero
│   │   ├── Differentiators.tsx     # Por qué se siente diferente
│   │   ├── EventFormat.tsx         # Formato + próxima fecha + countdown
│   │   ├── ExitIntent.tsx          # Modal al intentar cerrar tab
│   │   ├── ExperienceSection.tsx   # No es una clase, es experiencia
│   │   ├── FAQ.tsx                 # FAQ con búsqueda + acordeón
│   │   ├── FinalCTA.tsx            # Cierre con CTA principal
│   │   ├── FloatingWhatsappButton.tsx  # Botón flotante después de scroll
│   │   ├── Footer.tsx              # Footer + privacidad + términos
│   │   ├── ForWhoSection.tsx       # Para quién es / no necesitas
│   │   ├── Gallery.tsx             # 4 cuadros atmosféricos
│   │   ├── GuideSection.tsx        # Quién te guía + bio
│   │   ├── Header.tsx              # Sticky con scroll spy + progress
│   │   ├── Hero.tsx                # Hero con Aurora + Hooks + CursorGlow
│   │   ├── HookRotator.tsx         # Cicla 5 frases marketing en hero
│   │   ├── HowItWorks.tsx          # Timeline 5 pasos
│   │   ├── IncludesSection.tsx     # 6 cards de qué incluye
│   │   ├── LeadForm.tsx            # Multi-step 3 pasos + Supabase
│   │   ├── Manifesto.tsx           # 6 frases credo
│   │   ├── NerveTest.tsx           # Test interactivo 5 preguntas
│   │   ├── Newsletter.tsx          # Email capture alternativo
│   │   ├── OriginStory.tsx         # Cómo nace AMARTE
│   │   ├── PressStrip.tsx          # Mencionados en (logos)
│   │   ├── ProblemSection.tsx      # 6 dolores cotidianos
│   │   ├── ResponsibleNotice.tsx   # Aviso médico responsable
│   │   ├── Schedule.tsx            # Lista próximas fechas + .ics
│   │   ├── SectionHeader.tsx       # Header reutilizable de sección
│   │   ├── SectionSkeleton.tsx     # Loader esqueleto chunks lazy
│   │   ├── ShareSection.tsx        # WA/Telegram/X/Copy/Native
│   │   ├── SideRail.tsx            # Nav lateral derecha desktop
│   │   ├── Splash.tsx              # Intro 1.4s al primer load
│   │   ├── StructuredData.tsx      # JSON-LD (Org/Event/FAQ/Reviews)
│   │   ├── Testimonials.tsx        # 3 testimonios + estrellas
│   │   ├── TrustBar.tsx            # Barra rápida 4 atributos
│   │   ├── WaveDivider.tsx         # Divisores con ondas SVG
│   │   └── WhatsappCommunity.tsx   # Sección grupo privado
│   │
│   ├── data/
│   │   └── siteConfig.ts           # ⭐ Config central — TODO se cambia aquí
│   │
│   ├── lib/
│   │   ├── calendar.ts             # Generador .ics
│   │   ├── supabase.ts             # Cliente + submitLead + subscribeNewsletter
│   │   ├── toast.tsx               # Sistema de notificaciones
│   │   ├── tracking.ts             # Wrappers de analytics
│   │   ├── useReducedMotion.ts     # Hook prefers-reduced-motion
│   │   ├── utils.ts                # cn(), scrollToId()
│   │   └── whatsapp.tsx            # Hook centralizado CTA WhatsApp
│   │
│   ├── App.tsx                     # Composición principal con lazy
│   ├── main.tsx                    # Entry React
│   └── index.css                   # Globals + utilidades Tailwind
│
├── index.html                      # SEO + fonts preload + meta tags
├── tailwind.config.js              # Theme custom (paleta, fuentes, animaciones)
├── postcss.config.js
├── tsconfig.json / .app / .node
├── vite.config.ts
├── vercel.json                     # Config deploy SPA
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── PROJECT_REPORT.md               # Este documento
```

---

## 4. Secciones de la página (orden de scroll)

| # | Sección | Componente | Descripción |
|---|---------|------------|-------------|
| 0 | Splash | `Splash.tsx` | Intro 1.4s con punto verde respirando |
| 1 | Header | `Header.tsx` | Sticky con scroll-spy, progress bar, skip link |
| 2 | Hero | `Hero.tsx` | Aurora + cursor glow + 5 hooks rotando |
| 3 | TrustBar | `TrustBar.tsx` | 4 chips: Respiración / Sonido / Frecuencias / Presencial |
| 4 | Problema | `ProblemSection.tsx` | 6 dolores cotidianos |
| 5 | Experiencia | `ExperienceSection.tsx` | "No es una clase, es experiencia" |
| 6 | Cómo funciona | `HowItWorks.tsx` | Timeline 5 pasos |
| 7 | Qué incluye | `IncludesSection.tsx` | 6 cards |
| 8 | Vista previa sonido | `AudioWavePreview.tsx` | Visualizador play/pause |
| 9 | Atmósfera | `Gallery.tsx` | 4 cuadros mood |
| 10 | Test | `NerveTest.tsx` | 5 preguntas interactivas + resultado |
| 11 | Comparativa | `Comparison.tsx` | Tabla vs clase tradicional vs app |
| 12 | Beneficios | `BenefitsSection.tsx` | 10 beneficios |
| 13 | Para quién | `ForWhoSection.tsx` | Yes/No need lists |
| 14 | Origen | `OriginStory.tsx` | Cómo nace AMARTE |
| 15 | Behind the scenes | `BehindTheScenes.tsx` | 4 pasos de preparación |
| 16 | Manifiesto | `Manifesto.tsx` | 6 frases credo |
| 17 | Guía | `GuideSection.tsx` | Bio facilitador |
| 18 | Voces | `Testimonials.tsx` | 3 testimonios + estrellas |
| 19 | Press | `PressStrip.tsx` | Mencionados en (placeholders) |
| 20 | Formato | `EventFormat.tsx` | 6 datos + próxima fecha + countdown |
| 21 | Agenda | `Schedule.tsx` | Lista fechas + descarga .ics (oculta hasta llenar) |
| 22 | Comunidad | `WhatsappCommunity.tsx` | Sección grupo privado |
| 23 | Diferenciadores | `Differentiators.tsx` | 6 diferenciales numerados |
| 24 | Cinematográfico | `CinematicQuote.tsx` | Frases + BreathPacer 4-4-4 |
| 25 | FAQ | `FAQ.tsx` | 10 preguntas + búsqueda |
| 26 | Lead form | `LeadForm.tsx` | Multi-step 3 pasos |
| 27 | Newsletter | `Newsletter.tsx` | Email capture alternativo |
| 28 | Empresas | `CorporateSection.tsx` | B2B mailto |
| 29 | Compartir | `ShareSection.tsx` | WA/TG/X/copy/native |
| 30 | Aviso responsable | `ResponsibleNotice.tsx` | Disclaimer médico |
| 31 | CTA Final | `FinalCTA.tsx` | Cierre + WhatsApp |
| 32 | Footer | `Footer.tsx` | Marca + Instagram + Email + Legal |
| - | Floating | `FloatingWhatsappButton.tsx` | Persistente después de 600px |
| - | Side rail | `SideRail.tsx` | Dots verticales nav (desktop) |
| - | Exit intent | `ExitIntent.tsx` | Modal al intentar cerrar |
| - | Cookie banner | `CookieBanner.tsx` | Aparece a los 1.5s |

---

## 5. Funcionalidades implementadas

### Conversión
- ✅ Hero rotando 5 hooks de marketing cada 5.5s con fade + blur
- ✅ Multi-step LeadForm (3 pasos con barra de progreso)
- ✅ Newsletter alternativo (Supabase tabla `subscribers`)
- ✅ NerveTest interactivo 5 preguntas → resultado personalizado → CTA
- ✅ Exit intent modal con WhatsApp CTA
- ✅ Botón flotante WhatsApp post-scroll
- ✅ Toast confirmation al click WhatsApp
- ✅ Magnetic CTA effect en hover
- ✅ Cuenta regresiva en vivo a próxima sesión
- ✅ Schedule list con descarga `.ics` para Google/Apple/Outlook Calendar
- ✅ Share buttons (WhatsApp, Telegram, X, copy, native share API)
- ✅ Página `/gracias` para post-conversión Meta Lead Forms

### Trust / Brand
- ✅ Origin Story narrativa con 4 párrafos numerados
- ✅ Manifiesto de marca con 6 credos
- ✅ Testimonios con 5 estrellas + schema markup Review
- ✅ Behind the scenes (4 pasos del proceso)
- ✅ Tabla comparativa vs alternativas
- ✅ Press strip placeholder
- ✅ Guide section con bio del facilitador
- ✅ Aviso responsable médico

### UX premium
- ✅ Splash intro cinematográfico (1.4s)
- ✅ Aurora background animado en hero
- ✅ Cursor glow (desktop, no reduced-motion)
- ✅ BreathPacer 4-4-4 visual
- ✅ Audio Wave Preview (play/pause con sintetizador visual)
- ✅ Side rail navigation (desktop)
- ✅ Header sticky con scroll spy + progress bar
- ✅ Skip link para teclado
- ✅ FAQ con búsqueda y filtrado normalizado (acentos-insensitive)
- ✅ Wave dividers entre secciones clave
- ✅ Skeleton loader para chunks lazy
- ✅ Section reveals con stagger + fade + slide

### Accesibilidad
- ✅ `prefers-reduced-motion` respetado en todas las animaciones infinitas
- ✅ Skip link al contenido
- ✅ ARIA labels en CTAs y navegación
- ✅ Focus rings con color de marca
- ✅ Contraste verificado
- ✅ Semantic HTML (`<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`)

### SEO / Discovery
- ✅ JSON-LD: Organization + WebSite + Event + FAQPage + AggregateRating + Reviews
- ✅ Meta tags Open Graph + Twitter Cards
- ✅ OG image SVG cinematográfica 1200×630
- ✅ `robots.txt` + `sitemap.xml`
- ✅ Canonical via siteUrl
- ✅ Lang="es" + locale es_EC
- ✅ Apple touch icon + theme color

### Performance
- ✅ Code splitting agresivo (cada sección su chunk)
- ✅ Bundle inicial: **237 kB (gzip 75 kB)**
- ✅ Build time: ~430ms
- ✅ Fonts con preload + non-blocking
- ✅ Vercel Analytics + Speed Insights instalados
- ✅ Supabase como chunk compartido (lazy LeadForm + Newsletter)
- ✅ Aurora con GPU-accelerated `will-change-transform`

### Compliance / Legal
- ✅ Política de Privacidad (`/privacidad.html`)
- ✅ Términos y Condiciones (`/terminos.html`)
- ✅ Cookie banner ligero (localStorage)
- ✅ Página 404 con branding
- ✅ Aviso responsable médico

### PWA
- ✅ Manifest installable
- ✅ Shortcuts a Test y Próxima sesión
- ✅ Categorías: health, lifestyle, wellness
- ✅ Theme color #050505
- ✅ Icono SVG escalable

---

## 6. Configuración rápida (todo desde un archivo)

`src/data/siteConfig.ts` controla **TODO** sin tocar componentes:

| Quiero cambiar… | Campo |
|---|---|
| Link del grupo de WhatsApp | `whatsappGroupUrl` |
| WhatsApp directo (con mensaje) | `whatsappMessageUrl` |
| Próxima fecha (texto) | `nextDate` |
| Próxima fecha ISO (countdown) | `nextDateISO` |
| Lista de fechas futuras | `upcomingSessions` |
| Ubicación / horario / duración / cupos | `location` / `time` / `duration` / `capacity` |
| Email de contacto | `contactEmail` |
| Instagram | `instagram` / `instagramUrl` |
| Hooks rotando en hero | `heroHooks` |
| Hero título / sub / párrafo | `heroTitle` / `heroSubtitle` / `heroParagraph` |
| Testimonios | `testimonials` |
| Bio del guía | `guide` |
| Empresas | `corporate` |
| Newsletter | `newsletter` |
| Galería atmósfera | `gallery` |
| Press logos | `press` |
| Origin Story párrafos | `origin.paragraphs` |
| SEO meta | `seoTitle` / `seoDescription` / `siteUrl` |

---

## 7. Setup Supabase (free tier)

1. Crear proyecto en https://supabase.com → New Project
2. SQL Editor → ejecutar:

```sql
-- Tabla de leads
create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  whatsapp     text not null,
  city         text,
  intent       text,
  source       text,
  user_agent   text
);

alter table public.leads enable row level security;

create policy "anon insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Tabla de suscriptores newsletter
create table public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  source      text
);

alter table public.subscribers enable row level security;

create policy "anon insert subscribers"
  on public.subscribers
  for insert
  to anon
  with check (true);
```

3. Project Settings → API → copiar:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`

4. Crear `.env.local` con esos valores

---

## 8. Deploy en Vercel (free tier)

### Opción A — Conectando GitHub (recomendado)

```bash
# 1. Sube el repo a GitHub primero (ver sección 11 — pendiente)
# 2. Entra a https://vercel.com → New Project → Import el repo
# 3. Vercel detecta Vite automáticamente
# 4. En Environment Variables agregar:
#    VITE_SUPABASE_URL
#    VITE_SUPABASE_ANON_KEY
# 5. Deploy
```

### Opción B — Vercel CLI

```bash
npm i -g vercel
vercel              # primer deploy (preview)
vercel --prod       # producción
```

`vercel.json` ya configurado con framework Vite y rewrites SPA.

---

## 9. Activar Meta Pixel

1. En `index.html`, descomentar el bloque `<!-- Meta Pixel placeholder -->` y reemplazar `YOUR_PIXEL_ID`
2. En `src/lib/tracking.ts`, descomentar las líneas `window.fbq?.(...)`
3. Eventos cableados:
   - `PageView` (App.tsx)
   - `Lead` con source: `hero_primary`, `hero_secondary`, `final_cta`, `event_format`, `floating_button`, `whatsapp_community`, `cinematic_quote`, `lead_form_submit`

Mismo patrón funciona con TikTok (`window.ttq`), GA4 (`window.gtag`), GTM (`window.dataLayer`).

---

## 10. Paleta de marca

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#050505` | Fondo principal |
| `ink-900` | `#0B0F0D` | Bandas alternas |
| `ink-800` | `#0F1411` | Hover oscuros |
| `ink-700` | `#1A1A1A` | Bordes |
| `emerald-brand` | `#00C896` | CTA, acentos primarios |
| `emerald-glow` | `#10E0A8` | Hover, brillo |
| `emerald-deep` | `#0F3D34` | Cápsulas, soft fills |
| `gold-warm` | `#D4AF37` | Acentos cálidos |
| `gold-soft` | `#E6C77A` | Hover dorado |
| `bone` | `#F5F2EA` | Texto principal |
| `muted` | `#A7A7A7` | Texto secundario |

**Tipografía:**
- Display: `Inter Tight` (500-700)
- Body: `Inter` (300-700)

---

## 11. Pendiente subir a GitHub

- **Repo planificado:** `iomiquantum/amartebreathwork` (privado)
- **Cuenta:** iomiquantum (autenticada via gh CLI)
- **Branch principal:** `main`
- **Subir por primera vez:**

```bash
cd AMARTEBREATHWORK
git init
git add -A
git commit -m "Initial commit"
gh repo create iomiquantum/amartebreathwork --private --source=. --push
```

- **Cómo clonar para retomar después:**

```bash
gh repo clone iomiquantum/amartebreathwork
cd amartebreathwork
npm install
cp .env.example .env.local   # llenar con keys reales
npm run dev
```

---

## 12. Checklist antes de pautar

### Crítico (sin esto no funciona)
- [ ] Reemplazar `whatsappGroupUrl` con link real del grupo
- [ ] Reemplazar número en `whatsappMessageUrl`

### Alto (afecta conversión)
- [ ] Subir foto real al Hero (cuando tengas)
- [ ] Reemplazar testimonios placeholder con voces reales
- [ ] Llenar `nextDate`, `location`, `time` con primera sesión real
- [ ] Activar `nextDateISO` para countdown en vivo
- [ ] Llenar `upcomingSessions` para activar Schedule

### Medio (Supabase + tracking)
- [ ] Crear proyecto Supabase + ejecutar SQL
- [ ] Crear `.env.local` con URL + anon key
- [ ] Activar Meta Pixel (descomentar en `index.html` y `tracking.ts`)

### Deploy
- [ ] Push a GitHub privado (pendiente — ver sección 11)
- [ ] Conectar Vercel → agregar env vars
- [ ] Configurar dominio custom (opcional)
- [ ] Probar el flujo completo: anuncio → landing → WhatsApp en celular

---

## 13. Cómo retomar el proyecto en el futuro

```bash
# 1. Clonar
gh repo clone iomiquantum/amartebreathwork
cd amartebreathwork

# 2. Instalar
npm install

# 3. Configurar entorno
cp .env.example .env.local
# editar .env.local con tus keys de Supabase

# 4. Levantar dev server
npm run dev

# 5. Build para verificar
npm run build
```

**Para empezar a trabajar con Claude Code de nuevo:**
- Abrir Claude Code en `/Users/iomijhondavid/Documents/PROYECTOS CLAUDE CODE/M4MACIOMI-JD/OPUS47/AMARTEBREATHWORK`
- Decirle: "Lee el `PROJECT_REPORT.md` y dame el estado del proyecto"
- Continuar desde ahí.

---

## 14. Roadmap de mejoras pendientes (orden de impacto)

### Listo para activar (solo necesita data real)
1. Llenar `upcomingSessions` → Schedule visible
2. Llenar `nextDateISO` → countdown en vivo
3. Subir foto real → Hero + Guide section
4. Reemplazar testimonios → schema Review automático

### Próximas mejoras posibles (cuando quieras)
1. **Versión inglesa (i18n)** — preparado para escalar internacional
2. **Service Worker offline** — PWA con cache estratégico
3. **Audio sample real** — sustituir AudioWavePreview con audio de muestra real
4. **Sound credits / inspiraciones** — sección transparente de fuentes
5. **Calendly integration** — sesiones 1-on-1
6. **Reviews API live** — pull de Google Reviews / IG comments
7. **Edge function Slack/email** — notificación al captar nuevo lead
8. **Multi-language detection** — auto switch ES/EN
9. **Section number side rail con labels expandidos**
10. **Web Vitals dashboard custom**

---

## 15. Backup local

Tarball completo del código (excluye `node_modules` y `dist`):

`OPUS47/AMARTEBREATHWORK-backup-{fecha}.tar.gz`

Para restaurar:

```bash
tar -xzf AMARTEBREATHWORK-backup-{fecha}.tar.gz
cd AMARTEBREATHWORK
npm install
npm run dev
```

---

## 16. Métricas finales del build

| Métrica | Valor |
|---|---|
| Componentes | 40+ |
| Secciones de página | 25+ |
| Páginas estáticas | 5 (home, 404, privacidad, términos, gracias) |
| Build time | ~430ms |
| Bundle JS inicial | 237 kB |
| Bundle JS gzip inicial | 75 kB |
| CSS bundle | 31 kB (gzip 6.5 kB) |
| Chunks lazy | 25+ |
| Dependencias prod | 7 |
| Dependencias dev | 6 |

---

**Documento mantenido por Claude Code para Miguel Ángel Valencia · iOMI MUSIC LAB · Impulsar Corp.**
