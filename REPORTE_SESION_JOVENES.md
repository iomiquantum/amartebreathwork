# 📋 Reporte de Sesión — Vertical AMARTE Jóvenes (/jovenes)

> **Fecha cierre:** 2026-05-21
> **Sesión:** "Sesión 6 — Jóvenes/Colegios" del dashboard `SESIONES_ACTIVAS.md`
> **Estado al cierre:** 🟡 **Build offline completo · Pendiente cambio de paleta + push a producción**

Este documento existe para que **cualquier sesión nueva (de Claude o de Miguel)** pueda retomar el trabajo sin re-investigar nada. Léelo entero antes de continuar.

---

## 🎯 Qué se hizo en esta sesión

### Fase 1: Investigación (✅ completa, en repo)
Se lanzaron **5 sub-agentes de investigación en paralelo** que produjeron ~8.000 palabras consolidadas en un documento maestro:

📄 **`INVESTIGACION_AMARTE_JOVENES.md`** (859 líneas, 67 KB, commit `3af9418`)

Los 5 ejes de investigación:

1. **Breathwork seguro para 9-17 años** — técnicas SÍ (diafragmática, box, coherent, 4-7-8, Bhramari) / NO (Wim Hof, holotropic, kapalabhati, hiperventilación intensa). Citas: Telles 2019, Franco 2016, Vlemincx 2021. Contraindicaciones, marco de seguridad, ratios facilitador/niño.
2. **Mindfulness y breathwork en colegios** — referentes (MindUP, Inner Explorer, .b/Paws b, Calm/Headspace), evidencia (Durlak 2011 con 270K estudiantes, MYRIAD Oxford 28K niños, Schonert-Reichl UBC), marco CASEL + DECE Ecuador, objeciones típicas de colegios y respuestas.
3. **Salud mental infantil Ecuador y LATAM** — toda la data dura: suicidio = 1ª causa muerte 10-14 años Ecuador (INEC 2023), 1.949 menores con ideación suicida 2023, 6/10 con bullying, 82% ciberbullying por redes, 7h22min/día pantallas. UNICEF + OMS + MSP + INEC.
4. **Mercado y pricing LATAM** — competencia Ecuador (Mindfulness EC, Drawing Mindful, Holotrópica), LATAM (Instituto Mexicano de Mindfulness con aval SEP, The Breath Act España/Colombia), pricing real observado, modelos B2C/B2B/B2G, canales ASECCBI/FIDAL.
5. **9D Breathwork (Europa) — análisis competitivo profundo** — Brian Kelly (fundador americano base Bali, no UK), las 9 dimensiones = 9 capas de audio, programa "9D Kids" UK (caso Saffron Walden HS + Sigma Trust con RCADS), certificación $5K+$200/mes, gaps que AMARTE puede llenar (español, LATAM, certificación pediátrica, integración curricular MinEduc).

### Fase 2: Implementación (✅ código offline · ❌ NO commiteado · ❌ NO en producción)

| Componente | Archivo | Estado |
|---|---|---|
| **DB tabla** | `breathwork_youth_inquiries` en Supabase project `amarteinc` | ✅ **Aplicada a producción** vía MCP |
| **Migración SQL** | `supabase/migrations/20260521180906_breathwork_youth_inquiries.sql` | ✅ Local, no committeado |
| **Helper TS** | `src/lib/supabase.ts` → `submitYouthInquiry()` + tipo `YouthInquiryInput` | ✅ Local |
| **Página principal** | `src/pages/YouthPage.tsx` (~1100 líneas, 15 secciones monolítico) | ✅ Local |
| **Tailwind paleta** | `tailwind.config.js` → tokens `lavender.soft/deep`, `coral.warm/soft`, `bg-radial-lavender`, `bg-radial-coral` | ✅ Local |
| **CSS utility** | `src/index.css` → clase `.input` para forms | ✅ Local |
| **Ruta** | `src/App.tsx` → `<Route path="/jovenes">` con lazy import | ✅ Local (preview only) |
| **SEO** | `public/sitemap.xml` → entry `/jovenes` priority 0.9 | ✅ Local |
| **Build verify** | `npm run build` | ✅ Pasa · YouthPage chunk 58 KB / 14 KB gzip |
| **Dev server** | `npm run dev` localhost:5173/jovenes | ✅ Verificado HTTP 200 |

---

## ✅ Decisiones aprobadas por Miguel (NO cambiarlas sin re-aprobación)

| # | Decisión | Valor |
|---|---|---|
| 1 | URL | `/jovenes` con sub-marca "AMARTE Jóvenes" |
| 2 | Hero | **Unificado emocional** — NO selector dual padres/colegios. Mensaje único cálido cross-audience; segmentación viene en secciones siguientes. |
| 3 | Stats Ecuador (suicidio, bullying) | **Datos + esperanza.** 4 cifras con fuente seguidas inmediatamente de "Pero hay algo que sí funciona — y la ciencia lo demostró." |
| 4 | Certificación facilitadores | **Mencionar como "Próximamente"** desde día 1. Posicionar como primer estándar hispano de facilitador pediátrico (gap de 9D). |
| 5 | Estructura | 15 secciones en archivo monolítico (patrón CorporatePage) |
| 6 | Pricing B2C | $35 workshop · $180 programa 6 sem · $320 premium familiar |
| 7 | Pricing B2B | $650 piloto · $5,800 semestral · $18,500 anual integral |
| 8 | Frame editorial | NO meditación, NO mindfulness genérico. **SÍ** "regulación emocional con base neurocientífica alineada al currículo SEL del MinEduc + marco CASEL". 60% científico / 30% emocional / 10% místico. |
| 9 | Lección MYRIAD | NO prometer cura universal. Sí prometer regulación + cultura escolar + burnout docente reducido. |
| 10 | Build offline primero | Verificación visual local antes de push a Vercel |

---

## 🚧 Pendiente al cierre (lo que NO se hizo)

### 🔴 Bloqueante: cambio de paleta
Miguel pidió **quitar/reducir el color verde emerald-brand** del diseño actual. La paleta original planeaba mantener emerald para sección B2B colegios (consistencia con AMARTE adulto), pero quiere más diferenciación.

**Lugares donde hay verde emerald-brand actualmente** (revisar `src/pages/YouthPage.tsx`):
- `YouthHero` — botón secundario "Llevar a mi colegio" + chips de confianza usan `text-emerald-glow`
- `YouthWhatIs` — title gradient `from-emerald-glow to-lavender-soft` + card "Lo que SÍ es" usa `border-emerald-brand/30 bg-emerald-deep/15`
- `YouthSessionByAge` — card "16-18 años" usa color `emerald` (border + bg + text)
- `YouthForSchools` — **toda la sección B2B**: eyebrow, headline gradient, checks, tier tags, tier recomendado, badge "Recomendado"
- `YouthSafety` — card "Lo que SÍ hacemos" usa `border-emerald-brand/30 bg-emerald-deep/10`
- `YouthSchoolProcess` — number `text-emerald-glow`
- `YouthFAQ` — **botón "Para colegios"** usa `bg-emerald-brand` (el que Miguel mostró en screenshot)
- `YouthForm` — botón selector "Represento un colegio" + botón submit `bg-emerald-brand`
- Confirmation screen post-submit usa `border-emerald-brand/30`

### 🟡 Decisión pendiente (le pregunté pero dismissió las opciones)
**Pregunta 1:** ¿Cuánto verde quitar?
- A) Cero emerald — reemplazar todo
- B) Reducir, dejar solo como acento de "éxito" en check-marks chicos
- C) Solo cambiar FAQ + For Schools + School Process

**Pregunta 2:** ¿Color principal de reemplazo?
- A) Lavender + coral dominantes (ya en hero)
- B) Gold + coral (más premium)
- C) Lavender + gold (calma + sabiduría premium)
- D) Ver propuestas con mockup primero

### 🟢 Tareas pendientes técnicas
- Cambio de paleta según decisión arriba
- Test E2E del form: `curl` INSERT a `/rest/v1/breathwork_youth_inquiries` vía anon key, verificar registro aparece en Supabase
- `git add` + `git commit` con mensaje descriptivo
- `git push origin main`
- Verificar deploy automático en Vercel
- Verificar producción: `curl https://breathwork.amarteinc.com/jovenes` + screenshot
- Confirmar form submission end-to-end en producción

---

## 📁 Archivos modificados/creados en esta sesión

### Creados (nuevos)
- `INVESTIGACION_AMARTE_JOVENES.md` — investigación maestra · **YA pusheado** (commit 3af9418)
- `REPORTE_SESION_JOVENES.md` — este archivo · pusheo al final de la sesión
- `supabase/migrations/20260521180906_breathwork_youth_inquiries.sql`
- `src/pages/YouthPage.tsx`

### Modificados
- `src/lib/supabase.ts` — agregado `submitYouthInquiry()` + tipo `YouthInquiryInput` + interface (líneas alrededor de 435)
- `src/App.tsx` — agregado lazy import `YouthPage` + `<Route path="/jovenes">` (revisar que no choque con la sesión paralela que modificó este archivo el mismo día)
- `tailwind.config.js` — agregados tokens `lavender`, `coral` y backgrounds `radial-lavender`, `radial-coral`
- `src/index.css` — agregada clase `.input` para forms
- `public/sitemap.xml` — agregada entry `/jovenes`

### Aplicado a Supabase production (project `amarteinc`)
- Tabla `breathwork_youth_inquiries` (~30 columnas, RLS habilitado, anon INSERT, authenticated ALL, índices en type/created_at/status, trigger updated_at)

---

## 🗄️ Schema DB de referencia

```sql
breathwork_youth_inquiries (
  id UUID PK, created_at, updated_at,
  inquiry_type TEXT CHECK ('parent','school','other'),

  -- PARENT (B2C familia)
  parent_name, parent_email, parent_whatsapp,
  parent_country_code DEFAULT '593', parent_country_name DEFAULT 'Ecuador',
  child_age INTEGER, child_count INTEGER DEFAULT 1, child_concerns TEXT,

  -- SCHOOL (B2B colegio)
  institution_name, institution_type, contact_role, contact_name,
  contact_email, contact_phone, student_count_total INTEGER,
  target_grades, format_interest, estimated_date DATE,

  -- COMÚN
  message, city,
  status TEXT DEFAULT 'new' CHECK ('new','contacted','quoted','won','lost'),
  admin_notes, utm_source/medium/campaign, user_agent, honeypot_value
)
```

---

## 🔄 Cómo retomar el trabajo (próxima sesión)

### Si eres Claude (sesión nueva)
1. Lee `ESTADO_PROYECTO.md`, `TAREAS_PARALELAS.md`, `SESIONES_ACTIVAS.md` en raíz
2. Lee este archivo `REPORTE_SESION_JOVENES.md` completo
3. Lee `INVESTIGACION_AMARTE_JOVENES.md` solo si necesitas fundamentar decisiones (es largo)
4. Si vas a tocar la paleta: lee solo `src/pages/YouthPage.tsx` y `tailwind.config.js`
5. Si vas a hacer test E2E: revisa el patrón en `submitCorporateInquiry` / `submitGenderInquiry` en `src/lib/supabase.ts`
6. Antes de tocar `src/App.tsx`, `src/index.css`, `tailwind.config.js` — verifica si otra sesión los ha modificado recientemente (`git log --oneline -10`)

### Si eres Miguel directamente
1. **Para ver lo construido:** `cd AMARTEBREATHWORK && npm run dev` → abre `http://localhost:5173/jovenes`
2. **Para cambiar paleta tú mismo:** edita `src/pages/YouthPage.tsx` buscando `emerald-brand`, `emerald-glow`, `emerald-deep` — reemplaza con tokens nuevos (lavender/coral/gold)
3. **Para hacer push cuando estés listo:**
   ```bash
   git add .
   git commit -m "feat(jovenes): nueva vertical breathwork para niños 9-17 y colegios"
   git push origin main
   ```
4. **Si decides cancelar la vertical:** elimina las 4 líneas del `<Route path="/jovenes">` en `src/App.tsx`. El resto del código queda inofensivo (lazy import no se ejecuta si nunca se accede).

---

## 🌐 URLs y referencias rápidas

| Recurso | URL |
|---|---|
| Repo GitHub | https://github.com/iomiquantum/amartebreathwork |
| Investigación maestra | https://github.com/iomiquantum/amartebreathwork/blob/main/INVESTIGACION_AMARTE_JOVENES.md |
| Producción (cuando se pushee) | https://breathwork.amarteinc.com/jovenes |
| Supabase project | https://supabase.com/dashboard → org "Amarte Inc" → proyecto `amarteinc` (id `ajhajtousbarhsfugxbo`) |
| Tabla Supabase | `breathwork_youth_inquiries` en schema `public` |

---

## 📊 Métricas técnicas

- **Líneas de código generadas:** ~1.500 (YouthPage 1100 + helper supabase 90 + tailwind 15 + index.css 3 + App.tsx 11 + sitemap 5 + migración 80)
- **Build time:** 505 ms
- **Bundle YouthPage:** 58.52 KB / 14.04 KB gzip (lazy chunk, no impacta home)
- **Tiempo total sesión:** ~3 horas (investigación 50 min + planning 25 min + build 90 min + iteración 30 min)
- **Sub-agentes ejecutados en paralelo:** 5

---

## 🎓 Aprendizajes para futuras verticales

1. **El patrón AMARTE para nuevas verticales ya está consolidado:**
   - 1 archivo monolítico `XxxxPage.tsx` con 10-15 secciones (no fragmentar)
   - 1 tabla DB `breathwork_xxx_inquiries` con form dual o multi-tier
   - 1 helper `submitXxxInquiry()` en `src/lib/supabase.ts`
   - 1 entry en `App.tsx` (lazy) + `sitemap.xml`
   - Verificación visual en localhost antes de push

2. **La paleta importa más de lo esperado.** No asumir que emerald-brand sirve para todas las verticales. Cada audiencia merece consideración cromática propia.

3. **Build offline antes de push** es valioso — atrapó el feedback de paleta sin desperdiciar deploy.

4. **5 sub-agentes en paralelo** para investigación funciona muy bien — ~3h de trabajo humano comprimido en 15 min de wall-clock.

5. **9D Breathwork es competencia indirecta seria pero con gaps grandes** (no opera en LATAM hispana, sin certificación pediátrica formal, opaco en pricing). Aprovechar.

---

**Fin del reporte.**
**Cualquier sesión futura: este documento es el punto de entrada al estado de la vertical `/jovenes`.**
