# 📝 Reporte de Sesión — Vertical /corporativo

> **Fecha:** 2026-05-21
> **Modelo:** Claude Opus 4.7
> **Rol asignado:** Mejorar y expandir la landing `/corporativo` (vertical B2B)
> **Estado al cierre:** ✅ Todo el trabajo commiteado y pusheado a `main`. Pendiente solo destrabar Vercel para que el deploy llegue a producción.

---

## 🎯 Misión recibida

> "Tu zona específica: `/corporativo`. Tu trabajo es expandirla y optimizarla para convertir MÁS empresas. Maximizar conversiones del form B2B."

El usuario priorizó:
1. **Pricing transparente** (para Ecuador, sin paquetes, con énfasis en acompañamiento humano+tecnológico)
2. **Diferenciación brutal** vs alternativas (team building / apps meditación / charlas)
3. **Identidad visual propia** con paleta naranja para distinguir del resto del sitio breathwork

---

## 📦 Lo que se construyó

### Archivos NUEVOS creados (mi zona exclusiva)

| Archivo | Líneas | Propósito |
|---|---|---|
| `src/pages/corporativo/CorporatePricing.tsx` | ~140 | Sección "Inversión" con rango único "desde $32 USD" + 6 incluyes destacando acompañamiento humano + tech |
| `src/pages/corporativo/CorporateComparison.tsx` | ~210 | Tabla honesta vs Team Building / Apps Meditación / Charlas Wellbeing. Versión desktop (tabla) + mobile (stack). Cierra con quote "AMARTE habla al sistema nervioso" |
| `src/pages/corporativo/CorporateAfterCare.tsx` | ~110 | Bloque "No te soltamos cuando termina el evento" — 4 cards: tecnología (frecuencias en vivo), check-in humano 7 días, reporte cualitativo, programa anual opcional |
| `src/pages/corporativo/corporate-theme.css` | ~120 | CSS scoped via `body[data-vertical="corporate"]` que overridea emerald→orange para componentes globales (Header, FloatingWhatsappButton) sin tocarlos. Oculta SideRail. |
| `docs/INVESTIGACION_MERCADO_CORPORATIVO.md` | 212 | Research completa: benchmarks USA/EU/LATAM, opacidad EC, justificación de pricing, métricas a vigilar, fuentes verificables |
| `docs/SESION_CORPORATIVO_2026-05-21.md` | este | Reporte de cierre de sesión |

### Archivos MODIFICADOS

| Archivo | Cambio |
|---|---|
| `src/pages/CorporatePage.tsx` | + imports de 3 nuevas secciones + CSS theme. Reorden del funnel (Benefits→**Comparison**→UseCases→Process→Logistics→**AfterCare**→**Pricing**→FAQ→Form). Hero con chip nuevo "Desde $32 USD". Replace emerald→orange (46 instancias). useEffect adicional para set/remove `data-vertical="corporate"` en body. |
| `tailwind.config.js` | +paleta `orange.{brand,glow,deep}` (#FF6B35 / #FF8C5C / #3D1F15) + `bg-radial-orange` + `shadow-glow-orange{,-strong}`. Coexiste con paleta emerald original y otras paletas verticales (lavender/coral/primary/secondary de la sesión gender). |

---

## 🔖 Commits hechos a `main`

En orden cronológico:

| Hash | Mensaje |
|---|---|
| `2ac2256` | feat(corporativo): pricing transparente + comparativa + aftercare |
| `73675a3` | feat(corporativo): paleta naranja como identidad visual del vertical B2B |
| `10a49df` | fix(corporativo): forzar paleta naranja en componentes globales via CSS scoped |
| `6194edb` | docs(corporativo): investigación de mercado completa para vertical B2B |

Todos los commits incluyen `Co-Authored-By: Claude Opus 4.7`.

---

## 🎨 Decisiones de diseño tomadas

### Pricing — "Desde $32 USD" público, sin paquetes

**Razón:** El usuario rechazó tiers prefabricados (Essential/Pro/Enterprise) y pidió un solo "desde" comunicando accesibilidad. Tabla interna de descuento por volumen quedó documentada en `docs/INVESTIGACION_MERCADO_CORPORATIVO.md` (sección 3.2) — NO publicada, solo guía interna para cotizar:

- 8-15 personas → $42-$45
- 16-40 → $36-$40
- 41-80 → $32-$36
- 80-150 → $30-$34 (negociable)
- 150+ → cotización abierta sobre objetivos

### Paleta naranja como identidad del vertical B2B

- `orange-brand` `#FF6B35` (vibrante, ejecutivo)
- `orange-glow` `#FF8C5C` (highlights)
- `orange-deep` `#3D1F15` (deep tone)
- Gold se mantiene como acento secundario (continuidad de marca)
- Ink y bone se mantienen (base del sitio)

**Implementación de doble capa:**
1. Mis 4 archivos nuevos usan clases `orange-*` directamente (no requieren override)
2. Para componentes globales (Header logo, WhatsApp button, etc.) — CSS scoped en `corporate-theme.css` con selector `body[data-vertical="corporate"]`
3. `useEffect` en `CorporatePage` setea/remueve el atributo. Al salir, todo vuelve a verde.

### Orden óptimo del funnel persuasivo

```
Hero → Stats (problema) → Beneficios (solución) →
  Comparison (diferenciación) → UseCases → Process → Logistics →
  AfterCare (sostén del valor) → Pricing (precio al final) →
  FAQ → Form B2B → Final CTA
```

**Razón:** el precio aparece después de construir todo el valor. La comparativa va temprano para anclar "AMARTE no es lo mismo que ya probaste".

### Mensaje central de la página (copy aplicado)

> El team building tradicional **le habla al ego.**
> Las apps de meditación **al algoritmo.**
> Las charlas de bienestar **al PowerPoint.**
>
> **AMARTE le habla al sistema nervioso.**
> Y ese, sí escucha.

---

## ⚠️ Bloqueo conocido al cierre

**Vercel deployment was blocked** (free tier rate limit alcanzado por múltiples sesiones paralelas pusheando).

- Mis 4 commits están en `origin/main` ✅
- Build local pasa sin errores ✅
- `breathwork.amarteinc.com/corporativo` sigue mostrando la versión anterior (último deploy exitoso fue `3af9418`)
- Solo se ve nuevo en `http://localhost:5173/corporativo` (dev server local)

**Acción del usuario pendiente:** entrar a Vercel Dashboard → Settings → Billing/Deployment Protection y destrabar. Cuando lo haga, todos los commits acumulados se deployan automáticamente.

---

## 🤝 Coordinación con sesiones paralelas

Durante la sesión coexistí con otras 2-3 sesiones Claude activas trabajando en:

- **Sesión gender** → creó `/hombres` y `/mujeres` con `src/pages/gender/`, paletas dinámicas primary/secondary, `src/lib/supabase.ts` con `submitGenderInquiry`. Tocó `tailwind.config.js` agregando lavender + coral + primary/secondary.
- **Sesión youth/jovenes** → creó `src/pages/YouthPage.tsx`, doc de mercado niños/jóvenes/colegios, migration `breathwork_youth_inquiries.sql`.
- **Sesión backend/seguridad** → server-side validation + rate limiting + CSP refinado + skeletons + mobile fixes + analytics charts.

**Conflictos manejados:**
- `tailwind.config.js` editado por múltiples sesiones — resolví con `git stash → pull --rebase → push → stash pop`
- Mi `git push` fue rechazado 2 veces por fast-forward, resuelto cada vez con rebase limpio
- Ningún merge conflict real (zonas bien separadas)

**Sin tocar** (zonas prohibidas según `TAREAS_PARALELAS.md`):
- `src/App.tsx`, `src/main.tsx`
- `src/lib/tracking.ts`, `src/lib/pixels.ts`
- `src/data/siteConfig.ts`, `src/data/countries.ts`
- `src/components/Header.tsx`, `Footer.tsx`, `Hero.tsx`, `SideRail.tsx`, `FloatingWhatsappButton.tsx`, `CorporateSection.tsx`
- `src/components/ReservationModal.tsx`, `WhatsappGateModal.tsx`
- `supabase/functions/whatsapp-welcome/`
- `vercel.json`, `index.html`

---

## 📊 Métricas de la sesión

```
✅ 4 commits a main (todos con TS clean + build OK)
✅ ~692 líneas de código nuevo (.tsx + .css)
✅ 212 líneas de documentación (research)
✅ 79 reemplazos emerald→orange en 4 archivos
✅ Bundle CorporatePage: 49KB raw / 11.45KB gzip (sin crecimiento vs antes)
✅ Build time local: <600ms
✅ 0 conflictos de merge irresolubles
```

---

## 🚀 Próximas mejoras sugeridas (priorizadas por ROI conversion)

De la lista original de 14 mejoras, mi top 3 fue Pricing (✅ hecho) + las 2 siguientes:

### #2 Multi-step form para cotización (PENDIENTE)
- **Por qué:** form actual tiene 13 campos en una sola pantalla → abandonment-killer
- **Plan:** 4 steps con progress bar (Empresa → Necesidad → Contacto → Confirmar)
- **Tiempo estimado:** ~2h
- **Archivo a tocar:** `src/pages/CorporatePage.tsx` función `CorporateForm()` (líneas 705+)
- **Reutiliza:** `submitCorporateInquiry` ya existente, no cambia DB

### #3 Calculadora ROI (PENDIENTE)
- **Por qué:** diferenciador único — convierte concepto abstracto en números duros
- **Plan:** Inputs (tamaño equipo, salario promedio, días enfermos/año). Output: $ perdidos por burnout vs $ AMARTE = ROI %. CTA: "Descarga este análisis en PDF para tu CEO"
- **Tiempo estimado:** ~2-3h
- **Archivo nuevo:** `src/pages/corporativo/CorporateROICalculator.tsx`
- **Posición sugerida en funnel:** entre Comparison y UseCases (refuerza el "no es gasto, es ROI")

### Otras mejoras de la lista original (#4-#14):
- #5 Video hero corporativo (cuando exista video real)
- #7 Stats counter animation (al hacer scroll)
- #9 Sticky CTA mobile (30 min, alto ROI mobile)
- #10 react-helmet-async para SEO meta tags por ruta
- #14 Schema.org Service + LocalBusiness markup

---

## 🧠 Para Claude en próxima sesión sobre /corporativo

Cuando IOMI retome este vertical, hacer en este orden:

1. **Leer este archivo + `docs/INVESTIGACION_MERCADO_CORPORATIVO.md`** — todo el contexto está aquí
2. **Verificar TAREAS_PARALELAS.md** — ver si la zona sigue libre y quién más está activo
3. **Verificar `breathwork.amarteinc.com/corporativo`** está sirviendo la versión nueva (si no, Vercel sigue bloqueado)
4. **Revisar tabla `breathwork_corporate_inquiries` en Supabase** — si ya hay inquiries reales, comparar con benchmarks de research para validar pricing
5. **Continuar con Multi-step form (#2)** o lo que IOMI priorice

**Memorias relevantes en `/Users/iomijhondavid/.claude/projects/.../memory/`:**
- `[[project-amarte-breathwork]]` — proyecto completo en producción
- `[[project-amarte-corporativo]]` — vertical B2B y su identidad
- `[[feedback-corporativo-no-paquetes]]` — IOMI prefiere "desde $X" sin tiers prefabricados
- `[[feedback-coordinacion-paralela]]` — múltiples sesiones simultáneas, leer TAREAS_PARALELAS.md primero

---

## 🌿 Filosofía aplicada en esta sesión

- **Pricing transparente** como diferenciador en mercado opaco (Ecuador)
- **Diferenciación por dimensión, no por feature** (AMARTE trabaja en el sistema nervioso, no en la mente)
- **Cohesión visual del vertical** (paleta propia distinguible del resto del sitio)
- **Coordinación sin pisar trabajo paralelo** (zona limitada + override scoped en lugar de modificar globales)
- **Documentación que sobrevive a la sesión** (research + reporte para que cualquiera retome con contexto)

---

**Generado:** 2026-05-21
**Sesión cerrada por:** usuario (IOMI / Miguel Ángel Valencia)
**Trabajo entregado:** completo y commiteado. Sin work-in-progress pendiente.

🌿 Si llegas a este archivo en una sesión futura — tienes contexto completo. Adelante. 🚀
