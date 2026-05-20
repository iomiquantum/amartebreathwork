# AMARTE — Landing Page

Landing de conversión para captar leads desde pauta digital (Meta / TikTok) hacia un grupo privado de WhatsApp donde se anuncian las próximas experiencias presenciales de **breathwork inmersivo** (respiración, sonido y frecuencias).

> **Marca interna:** AMARTE
> **Marca pública en la web:** “REGULA TU SISTEMA NERVIOSO · BREATHWORK INMERSIVO”

---

## Stack

- Vite 8
- React 19 + TypeScript
- Tailwind CSS 3 (config custom: paleta esmeralda + dorado + negro cinematográfico)
- Framer Motion (animaciones)
- Lucide React (íconos)
- Supabase JS (formulario opcional, free tier)

---

## Levantar el proyecto offline

```bash
cd AMARTEBREATHWORK
npm install
npm run dev
```

Se abre en `http://localhost:5173`.

Para compilar producción:

```bash
npm run build      # genera /dist
npm run preview    # sirve /dist localmente
```

---

## ⚙️ Configuración rápida (todo desde un solo archivo)

Edita `src/data/siteConfig.ts`. Ahí cambias **TODO** sin tocar componentes:

| Quiero cambiar… | Campo en `siteConfig.ts` |
| --- | --- |
| Link del grupo de WhatsApp | `whatsappGroupUrl` |
| WhatsApp directo (con mensaje) | `whatsappMessageUrl` |
| Próxima fecha | `nextDate` |
| Ubicación | `location` |
| Horario | `time` |
| Duración | `duration` |
| Cupos | `capacity` |
| Email de contacto | `contactEmail` |
| Instagram | `instagram` / `instagramUrl` |
| Texto del Hero | `heroEyebrow`, `heroTitle`, `heroSubtitle`, `heroParagraph` |
| Texto del CTA | `ctaPrimary`, `ctaSecondary`, `ctaFloatingMobile`, `ctaFloatingDesktop` |
| SEO | `seoTitle`, `seoDescription` (también en `index.html`) |

---

## 🧠 Supabase (formulario opcional)

El componente `LeadForm.tsx` guarda leads en una tabla `leads` de Supabase. Si **no configuras** las variables, el formulario sigue funcionando pero solo loguea en consola — no se rompe.

### 1) Crear proyecto

1. Entra a https://supabase.com → New Project (free tier).
2. En el SQL Editor, ejecuta:

```sql
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
```

> Esto permite que cualquier visitante anónimo pueda **insertar** filas (lo que necesitas para captar leads), pero no leerlas. Para ver los leads, usa el dashboard de Supabase con tu cuenta autenticada.

### 2) Conectar el frontend

1. Copia `.env.example` → `.env.local`.
2. Pega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (los encuentras en Project Settings → API).
3. Reinicia `npm run dev`.

---

## 🚀 Deploy en Vercel (free tier)

### Opción A — Conectando GitHub (recomendado)

1. Sube el repo a GitHub.
2. Entra a https://vercel.com → New Project → importa el repo.
3. Vercel detecta Vite automáticamente.
4. En **Environment Variables** agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Listo.

### Opción B — Vercel CLI

```bash
npm i -g vercel
vercel       # primer deploy (preview)
vercel --prod
```

El archivo `vercel.json` ya está configurado con framework Vite y rewrites para SPA.

---

## 📊 Tracking / Pixel

Los eventos están preparados pero comentados en `src/lib/tracking.ts` y en `index.html`. Para activarlos:

1. **Meta Pixel:** descomenta el bloque `<!-- Meta Pixel placeholder -->` en `index.html` y reemplaza `YOUR_PIXEL_ID`.
2. En `src/lib/tracking.ts`, descomenta las líneas `window.fbq?.(...)` dentro de cada función.
3. Funciones disponibles ya cableadas en cada CTA:
   - `trackPageView()` (App.tsx)
   - `trackHeroCTA()` (Hero)
   - `trackFinalCTA()` (FinalCTA)
   - `trackWhatsappClick(source)` (todos los demás CTAs)
   - `trackLeadFormSubmit(payload)` (LeadForm)
   - `trackFAQOpen(question)` (FAQ)

Funciona igual con TikTok Pixel (`window.ttq`), GA4 (`window.gtag`), o GTM (`window.dataLayer`).

---

## 🗂 Estructura

```
AMARTEBREATHWORK/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── TrustBar.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── IncludesSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── ForWhoSection.tsx
│   │   ├── EventFormat.tsx
│   │   ├── WhatsappCommunity.tsx
│   │   ├── Differentiators.tsx
│   │   ├── CinematicQuote.tsx
│   │   ├── FAQ.tsx
│   │   ├── ResponsibleNotice.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── LeadForm.tsx
│   │   ├── Footer.tsx
│   │   ├── FloatingWhatsappButton.tsx
│   │   ├── SectionHeader.tsx
│   │   └── CTAButton.tsx
│   ├── data/
│   │   └── siteConfig.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── tracking.ts
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .env.example
└── package.json
```

---

## 🎨 Paleta de marca

| Token | Hex | Uso |
| --- | --- | --- |
| `ink` | `#050505` | Fondo principal |
| `ink-900` | `#0B0F0D` | Bandas alternas |
| `emerald-brand` | `#00C896` | CTA, acentos |
| `emerald-glow` | `#10E0A8` | Hover, brillo |
| `emerald-deep` | `#0F3D34` | Cápsulas, soft fills |
| `gold-warm` | `#D4AF37` | Acentos cálidos |
| `bone` | `#F5F2EA` | Texto principal |
| `muted` | `#A7A7A7` | Texto secundario |

---

## ✅ Checklist antes de pautar

- [ ] Reemplazar `whatsappGroupUrl` con tu link real en `siteConfig.ts`.
- [ ] Reemplazar el número en `whatsappMessageUrl`.
- [ ] Actualizar `nextDate`, `location`, `time` cuando tengas la primera fecha.
- [ ] Subir una imagen `og-image.jpg` (1200×630) a `/public` para que se vea bonito al compartir.
- [ ] Configurar Supabase y `.env.local` si quieres usar el formulario.
- [ ] Activar Meta Pixel en `index.html` y `tracking.ts`.
- [ ] Deploy en Vercel.
- [ ] Probar el flujo: anuncio → landing → WhatsApp en tu celular.
