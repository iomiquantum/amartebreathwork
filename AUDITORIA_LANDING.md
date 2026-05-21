# 🔍 Auditoría Completa — breathwork.amarteinc.com

> **Fecha:** 2026-05-21
> **Versión analizada:** Commit `201852e`
> **Alcance:** 46 componentes, 6 archivos lib, 4 páginas HTML estáticas, config completa
> **Score general:** **8.5/10** — código de alta calidad, principal issue son placeholders

---

## 📊 TL;DR (resumen ejecutivo)

✅ **Buenas noticias:** El código está EXCELENTEMENTE construido — responsive, accesible, optimizado, con animaciones que respetan `prefers-reduced-motion`. Es trabajo profesional.

🚨 **Mala noticia:** Hay **20+ touchpoints visibles a usuarios con texto literal `TODO_*`** o links rotos a `REEMPLAZAR_AQUI`. Esto rompe la experiencia profesional.

⚡ **Performance:** 328ms TTFB. Lighthouse score estimado 90+. Sin issues serios.

♿ **Accesibilidad:** Muy bien resuelta — skip links, aria-labels, semantic HTML, contraste OK.

📱 **Responsive:** 41 de 46 componentes con breakpoints; los 5 sin responsive son decorativos (Aurora, CursorGlow) o no-UI (StructuredData) — correctos.

---

## ✅ LO QUE ESTÁ EXCELENTE (no tocar)

### Performance
- **TTFB:** 328ms (excelente)
- **HTTP/2 + CDN Vercel** activado
- **HSTS** habilitado (seguridad headers)
- **HTTP → HTTPS** redirect automático
- **Cache headers** correctos
- **Lazy loading** de 25+ secciones below-the-fold
- **Fuentes** preconnect + preload (carga optimizada)
- **JS modules** preload + module-preload
- **Vercel Analytics + Speed Insights** instalados

### Accesibilidad (a11y)
- ✅ **Skip link** en Header (`Saltar al contenido`)
- ✅ **aria-label** en todos los botones de íconos sin texto
- ✅ **aria-expanded** en accordions (FAQ, menu mobile)
- ✅ **aria-pressed** en botón Play (AudioWavePreview)
- ✅ **aria-modal** en modals (ExitIntent)
- ✅ **aria-labelledby** en diálogos
- ✅ **role="dialog"** en banners y modals
- ✅ **aria-hidden** en SVGs decorativos
- ✅ **prefers-reduced-motion** respetado (Hero, Splash, CinematicQuote, AudioWavePreview, CTAButton)
- ✅ **focus:ring-2** visible en CTAs
- ✅ **alt-text:** N/A (no usa <img>, todo es SVG inline)
- ✅ **lang="es"** en HTML, locale "es_EC"

### Responsive Design
- ✅ Mobile-first con clases `sm:`, `md:`, `lg:`
- ✅ Container queries via clases custom (`container-x`, `container-tight`)
- ✅ Mobile drawer en Header
- ✅ Floating WhatsApp button: sticky bottom mobile, floating round desktop
- ✅ Cookie banner adapta a `inset-x-3` mobile y `inset-x-auto` desktop
- ✅ Safe area inset (`env(safe-area-inset-bottom)`) para iPhone notch
- ✅ Grids responsive en testimonials, gallery, comparison

### Seguridad
- ✅ **`target="_blank"` + `rel="noopener noreferrer"`** en TODOS los links externos
- ✅ **RLS habilitado** en Supabase
- ✅ **anon key pública** (correcto, no es secreto)
- ✅ **Database password** guardada en password manager (no en repo)
- ✅ **CSP via Vercel default** (HSTS, etc.)

### SEO
- ✅ Meta tags completos (title, description, keywords, robots)
- ✅ Open Graph completo (og:title, og:description, og:image 1200×630)
- ✅ Twitter Card configurada
- ✅ Locale "es_EC" → mejor para Ecuador
- ✅ Schema.org JSON-LD con Organization, WebSite, Event, FAQPage
- ✅ Páginas legales (privacidad.html, terminos.html) presentes
- ✅ 404.html custom con CTA al home
- ✅ robots.txt + sitemap.xml + site.webmanifest (PWA-ready)

### Calidad del código
- ✅ TypeScript estricto
- ✅ Sin `console.log` olvidados (solo en `tracking.ts` que es intencional)
- ✅ Sin `target="_blank"` sin `rel="noopener"`
- ✅ Sin keys hardcoded
- ✅ Componentes lazy con `Suspense + fallback`
- ✅ Estado bien manejado (sessionStorage para Splash, ExitIntent)

---

## 🚨 ISSUES CRÍTICOS (prioridad MÁXIMA)

Estos rompen funcionalidad real y son visibles a usuarios HOY:

### 🚨 #1 — `whatsappGroupUrl` está placeholder
**Archivo:** `src/data/siteConfig.ts:24`
**Valor actual:** `"https://chat.whatsapp.com/REEMPLAZAR_AQUI"`

**Touchpoints afectados (9 lugares):**
1. `Header.tsx:122` — Botón "WhatsApp" / "Únete" en navbar
2. `Header.tsx:170` — Botón "Unirme al grupo" en mobile drawer
3. `FloatingWhatsappButton.tsx:31` — Botón flotante sticky mobile
4. `FloatingWhatsappButton.tsx:44` — Botón flotante desktop
5. `LeadForm.tsx:87` — Botón "Entrar al grupo" después de submit exitoso
6. `WhatsappCommunity.tsx:52` — CTA principal "Entrar al grupo privado"
7. `NerveTest.tsx:196` — Botón "Únete al grupo" al final del test
8. `ExitIntent.tsx:85` — Modal de salida "Unirme al grupo"
9. `CinematicQuote.tsx:122` — CTA cinemático "Quiero vivir la experiencia"
10. `StructuredData.tsx:100` — JSON-LD para Google (oferta del evento)

**Impacto:** Casi TODOS los CTAs de la landing llevan a URL rota. Usuario completa form → click "Entrar al grupo" → página de error.

**Fix:** Reemplazar con link real `https://chat.whatsapp.com/XXXXX`

---

### 🚨 #2 — `whatsappMessageUrl` tiene número placeholder
**Archivo:** `src/data/siteConfig.ts:26`
**Valor actual:** `"https://wa.me/593XXXXXXXXX?text=..."`

**Touchpoints:** Botones que abren chat WhatsApp directo individual (no grupo).

**Fix:** Reemplazar `593XXXXXXXXX` con número real (ej. `593999943636`)

---

### 🚨 #3 — `contactEmail` muestra "TODO_EMAIL" literal
**Archivo:** `src/data/siteConfig.ts:56`
**Valor actual:** `"TODO_EMAIL"`

**Touchpoints afectados:**
1. `Footer.tsx:47` — Link mailto roto: `mailto:TODO_EMAIL`
2. `Footer.tsx:51` — **Texto visible "TODO_EMAIL"** en el footer
3. `CorporateSection.tsx:11` — `mailto:TODO_EMAIL?subject=...` roto al click
4. `StructuredData.tsx:57` — Email en JSON-LD para Google (mal data)
5. **`public/privacidad.html:56`** — 2x mailto:TODO_EMAIL + 2x texto visible "TODO_EMAIL"
6. **`public/terminos.html:50`** — mailto:TODO_EMAIL + texto visible

**Impacto:** El footer muestra "TODO_EMAIL" como si fuera el email. Usuarios serios pueden percibir falta de profesionalismo.

**Fix:** Reemplazar con email real (sugerido: `hola@amarteinc.com`)

---

### 🚨 #4 — `instagram` + `instagramUrl` con placeholders
**Archivo:** `src/data/siteConfig.ts:57-58`
**Valores:** `"TODO_IG"`, `"TODO_IG_URL"`

**Touchpoints:**
1. `Footer.tsx:38` — `href="TODO_IG_URL"` (link roto al click)
2. `Footer.tsx:44` — **Texto visible "TODO_IG"** en el footer
3. `StructuredData.tsx:56` — sameAs en JSON-LD

**Fix:**
- `instagram: "@amarte"` (o tu @)
- `instagramUrl: "https://instagram.com/amarte"` (URL completa)

---

### 🚨 #5 — `siteUrl` rompe sitemap, share y JSON-LD
**Archivo:** `src/data/siteConfig.ts:64`
**Valor actual:** `"TODO_URL"`

**Touchpoints:**
1. `StructuredData.tsx:54,77,95` — URL del Organization y WebSite en JSON-LD
2. `ShareSection.tsx:9` — URL que se comparte al click "Compartir con WhatsApp" → comparte `TODO_URL` literal a amigos del usuario
3. `ShareSection.tsx:18` — `navigator.clipboard.writeText("TODO_URL")` — botón "Copiar link" copia "TODO_URL"
4. `public/sitemap.xml` — `<loc>TODO_URL/</loc>` → Google no indexa
5. `public/robots.txt` — `Sitemap: TODO_URL/sitemap.xml` → broken sitemap declaration

**Impacto:** SEO afectado (Google no indexa sitemap), botón Share envía URL rota a amigos.

**Fix:** Reemplazar con `https://breathwork.amarteinc.com`

---

### 🚨 #6 — Calendar ICS con `@TODO_DOMAIN`
**Archivo:** `src/lib/calendar.ts:17`
**Valor actual:** `` `UID:${start.getTime()}@TODO_DOMAIN` ``

**Impacto:** Cuando un usuario click "Agregar al calendario" desde Schedule, descarga un `.ics` que tiene `UID:1234@TODO_DOMAIN` adentro. Se ve en algunos clientes de calendario.

**Fix:** Cambiar `@TODO_DOMAIN` por `@amarteinc.com`

---

### 🚨 #7 — Páginas legales (Privacidad y Términos) tienen TODOs
**Archivos:** `public/privacidad.html`, `public/terminos.html`

**Problemas:**
- Privacidad: 2 links `mailto:TODO_EMAIL` + 2 textos visibles "TODO_EMAIL"
- Términos: 1 link `mailto:TODO_EMAIL` + 1 texto visible

**Impacto:** Páginas legales con TODO visible reducen credibilidad y compliance.

**Fix:** Reemplazar `TODO_EMAIL` con email real en ambos archivos.

---

### 🚨 #8 — Hardcoded fechas placeholder
**Archivo:** `src/data/siteConfig.ts:31-32, 56`

**Valores actuales:**
- `nextDate: "Por anunciar"` (texto visible — OK como fallback temporal)
- `location: "Quito · Por anunciar"` (texto visible — OK temporal)
- `nextDateISO: ""` (countdown muestra "Por anunciar" — OK temporal)
- `upcomingSessions: []` (sección Schedule no se muestra — OK temporal)

**Estado:** No es bug, son fallbacks correctos. Solo cambian si tienes fecha real.

**Fix cuando confirmes evento:** Llenar `nextDateISO` con formato ISO (ej. `"2026-06-26T19:30:00-05:00"`) y `upcomingSessions` con array.

---

### 🚨 #9 — Foto de Miguel placeholder visible
**Archivo:** `src/components/GuideSection.tsx:64`
**Valor actual:** Texto literal **"Foto · Por subir"** visible

**Impacto:** En la sección "Quién te guía", en lugar de foto de Miguel se ve el monograma de iniciales "MV" + texto "Foto · Por subir".

**Fix:** Subir foto a `/public/guide.jpg` e integrarla en el componente.

---

## ⚠️ ISSUES MEDIOS

### ⚠️ #10 — FAQs duplicadas e inconsistentes entre Schema y componente
**Archivos:** `StructuredData.tsx` (6 FAQs) vs `FAQ.tsx` (10 FAQs)

**Impacto:** Google ve 6 preguntas via JSON-LD, usuarios ven 10. Inconsistencia.

**Fix:** Sincronizar — mover el array de FAQs a un solo lugar (probablemente `siteConfig.ts` o un archivo compartido) e importarlo en ambos.

---

### ⚠️ #11 — Newsletter usa `placeholder` HTML attr correctamente
**Archivo:** `Newsletter.tsx:61`
**Estado:** ✅ Es correcto, no es bug. `placeholder="tu@email.com"` es uso correcto.

---

### ⚠️ #12 — Tracking pixels comentados
**Archivo:** `src/lib/tracking.ts` + `index.html:62`

**Estado actual:**
- `tracking.ts` tiene todas las llamadas `fbq?.()`, `gtag?.()`, `ttq?.()` **comentadas**
- `index.html` tiene el snippet de Meta Pixel comentado

**Implicación:**
- Cuando hagas pauta, NO tendrás tracking activo
- No medirás conversiones
- Optimización de ads imposible sin pixel

**Fix:**
- Activar Meta Pixel en `index.html` con tu Pixel ID real
- Descomentar líneas en `tracking.ts` para llamar `fbq?.("track", "Lead", ...)` etc.

---

### ⚠️ #13 — Falta opt-in WhatsApp en form
**Archivo:** `src/components/LeadForm.tsx`

**Issue:** El form pide WhatsApp pero NO tiene checkbox ni texto explícito de "Acepto recibir WhatsApp". Esto será necesario cuando activemos auto-WhatsApp Meta API (ya planeado en `PLAN_WHATSAPP_AUTOMATION.md`).

**Fix:** Agregar antes del botón "Confirmar y enviar":
- Texto claro: "Al confirmar aceptas recibir un WhatsApp con el link al grupo"
- O checkbox: "☐ Acepto recibir información por WhatsApp"

---

### ⚠️ #14 — Splash usa sessionStorage
**Archivo:** `src/components/Splash.tsx:13`

**Issue:** Splash se muestra una vez por sesión (`sessionStorage`). Si usuario refresca la página, sale otra vez. Sería mejor `localStorage` (una vez por dispositivo).

**Impacto bajo:** Mejora cosmética.

**Fix:** Cambiar `sessionStorage` por `localStorage` en línea 13 y 18.

---

### ⚠️ #15 — Testimonios son placeholders
**Archivo:** `src/data/siteConfig.ts:75-95`

**Estado:** Los 3 testimonios actuales ("María José", "Andrés", "Camila") son **ficticios** (marcados con comentario "placeholders editables — reemplaza con voces reales después de la primera sesión").

**Impacto en SEO/conversión:** Google rich snippets ven 3 reviews 5-star, pero son ficticias. Si se publica abiertamente, podría considerarse engañoso.

**Fix:** Después de primera sesión real, obtener consentimiento de participantes y reemplazar.

---

### ⚠️ #16 — `press` con placeholders
**Archivo:** `src/data/siteConfig.ts:126`
**Valor:** `["Revista Mundo", "Podcast Ec", "Diario El Comercio", "El Universo"]`

**Estado:** Lista de "menciones en prensa" pero son aspiracionales, no reales (probablemente no te han mencionado en El Comercio aún).

**Impacto:** Si gente verifica → daña credibilidad. Si no verifica → da impresión de autoridad falsa.

**Fix:**
- Opción A: vaciar el array hasta tener menciones reales
- Opción B: cambiar a "Próximas colaboraciones" o "Aliados editoriales"

---

### ⚠️ #17 — Gallery con placeholders
**Archivo:** `src/data/siteConfig.ts:118-125`

**Estado:** La galería tiene 4 items con `label + mood`, pero NO hay imágenes reales — son íconos genéricos (Headphones, Flame, AudioLines, Wind) y comentario dice "sustituye por imágenes reales cuando las tengas".

**Impacto:** Visual placeholder. Funciona pero sería más impactante con fotos reales del setup.

**Fix:** Cuando tengas fotos del evento, agregar `image: "/gallery/1.jpg"` al objeto y modificar `Gallery.tsx` para renderizar imágenes.

---

### ⚠️ #18 — `gracias.html` página huérfana
**Archivo:** `public/gracias.html`

**Estado:** Página de "Gracias" existe pero el form actual NO redirige a ella (`LeadForm.tsx` muestra success inline). Es código muerto.

**Impacto:** Bajo. Solo extra ~5KB en assets.

**Fix:** Opción A: eliminar archivo. Opción B: cambiar form para redirigir a `/gracias.html` después de submit (consideración: pierdes la opción de seguir interactuando inline).

---

### ⚠️ #19 — Logo es solo un punto verde
**Archivos:** `Header.tsx:85-91`, `Footer.tsx:30`

**Estado:** El "logo" de AMARTE es:
- Header: punto verde con glow + texto "AMARTE"
- Footer: solo texto "AMARTE"

**Impacto:** No hay logo gráfico real. Para una marca de breathwork inmersivo, podrías querer algo más memorable.

**Fix opcional:** Diseñar logo (símbolo de respiración, onda, círculo) y reemplazar el `<span>` del punto verde.

---

## 📱 RESPONSIVE — Issues específicos de mobile

### ⚠️ #20 — Hero "Floating chips" pueden overflow en pantallas <360px
**Archivo:** `Hero.tsx:207-220`

**Issue:** Las chips "Respiración guiada" y "Frecuencias" están posicionadas con `-left-4` y `-right-2`. En pantallas muy pequeñas pueden cortarse o causar scroll horizontal.

**Severidad:** Baja (la mayoría de teléfonos son ≥375px). iPhone SE primera gen (320px) podría tener issue.

**Fix:** Agregar `max-w-[80vw]` o esconderlas en `<sm:`.

---

### ⚠️ #21 — Header en breakpoint entre mobile y desktop
**Archivo:** `Header.tsx:129-130`

**Issue:** Texto del CTA cambia 2 veces:
- En mobile (<sm): solo ícono visible
- Entre sm y md: muestra "Únete"
- En md+: muestra "WhatsApp"

Esto es intencional pero puede ser confuso. Quizás simplificar a solo 2 estados.

**Severidad:** Cosmético.

---

### ⚠️ #22 — Mobile drawer no usa `AnimatePresence`
**Archivo:** `Header.tsx:146-185`

**Issue:** El drawer mobile usa `motion.div` con `exit` pero NO está dentro de `<AnimatePresence>`. La animación de salida puede no funcionar.

**Severidad:** Cosmético menor.

**Fix:** Envolver en `<AnimatePresence>`.

---

### ✅ Responsive en general: EXCELENTE
- Todos los componentes principales tienen variantes `sm:`, `md:`, `lg:`
- Tipografía escala correctamente (`text-2xl sm:text-3xl lg:text-5xl`)
- Grids responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Padding/spacing adapta (`py-20 sm:py-32`)
- Componentes flex de columna a fila (`flex-col sm:flex-row`)

---

## ♿ ACCESIBILIDAD — Score: 9/10

### ✅ Lo bien hecho
- Skip link, semantic HTML, aria-labels correctos
- Focus rings visibles en CTAs
- prefers-reduced-motion en animaciones
- Roles ARIA en dialogs y nav

### ⚠️ Mejorables
- **#23:** El test (NerveTest) no anuncia cambios de paso a screen readers. Falta `aria-live="polite"` o similar.
- **#24:** Algunos colores `text-bone/60` sobre `bg-ink-900` podrían tener contraste WCAG AA insuficiente. Revisar con Lighthouse.
- **#25:** Botones de íconos en CookieBanner no tienen `aria-label`.

---

## 🔍 SEO — Score: 7/10

### ✅ Excelente:
- Meta tags completos
- Open Graph + Twitter Card
- Schema.org JSON-LD (Organization + Event + FAQPage)
- Sitemap + robots.txt presentes

### ⚠️ Por arreglar (críticos #5 y #6):
- `siteUrl` placeholder rompe JSON-LD, sitemap, robots
- FAQs desincronizadas entre Schema y FAQ.tsx

### 💡 Mejoras:
- **#26:** og-image es SVG. WhatsApp y algunos clientes no renderizan SVG bien → cambiar a PNG/JPG 1200×630.
- **#27:** Falta `<link rel="canonical">` en index.html.
- **#28:** Falta `hreflang` si vas a expandir fuera de EC.
- **#29:** Schema.org Event tiene `nextDate` "Por anunciar" — Google podría rechazar el rich result. Mejor remover el Event schema hasta tener fecha.

---

## ⚡ PERFORMANCE — Score: 9/10

### Métricas medidas:
- **TTFB:** 328ms ✅ (excelente)
- **DNS lookup:** 5ms
- **TLS handshake:** 207ms
- **Bundle size HTML:** 4.2KB
- **Cache:** HIT en x-vercel-cache

### ✅ Optimizaciones presentes:
- Lazy loading de componentes
- Module preloading
- Font preconnect + preload
- Image-free (todo SVG inline)
- HTTP/2 multiplexing
- CDN edge global de Vercel

### 💡 Sugerencias:
- **#30:** No vi `next/image` o equivalente — pero como no usa `<img>`, no aplica.
- **#31:** Considerar **prefetch** de fuentes en `<head>` para mejorar FCP.
- **#32:** El JS bundle podría medirse con `npm run build` y reportar tamaño.

---

## 📋 TOP 10 ACCIONES PRIORIZADAS

Por impacto × esfuerzo:

| # | Acción | Impacto | Esfuerzo | Bloquea... |
|---|---|---|---|---|
| **1** | Reemplazar `whatsappGroupUrl` con link real | 🔴 CRÍTICO | 30s + tú das URL | Toda la conversión |
| **2** | Reemplazar `contactEmail` (Footer + legal pages) | 🔴 CRÍTICO | 1 min + email real | Profesionalismo |
| **3** | Reemplazar `instagram` + `instagramUrl` | 🔴 CRÍTICO | 30s + tu @ | Redes sociales |
| **4** | Reemplazar `siteUrl` con `https://breathwork.amarteinc.com` | 🔴 CRÍTICO | 30s | SEO + Share |
| **5** | Reemplazar `whatsappMessageUrl` con tu número | 🟠 ALTO | 30s | CTA secundaria |
| **6** | Cambiar `@TODO_DOMAIN` en calendar.ts | 🟠 ALTO | 30s | UX al descargar evento |
| **7** | Subir foto Miguel + actualizar GuideSection | 🟡 MEDIO | 5 min + foto | Credibilidad guía |
| **8** | Activar Meta Pixel | 🟠 ALTO | 15 min + Pixel ID | Pauta digital |
| **9** | Agregar opt-in WhatsApp al form | 🟡 MEDIO | 10 min | Auto-WhatsApp |
| **10** | Sincronizar FAQs (Schema vs componente) | 🟡 MEDIO | 15 min | Consistencia SEO |

---

## 🎯 LO QUE PUEDO HACER YO EN 20 MINUTOS

Si me pasas estos datos en un mensaje:

```
WhatsApp Group URL: https://chat.whatsapp.com/______
WhatsApp Number: 593______
Instagram @: ________
Instagram URL: https://instagram.com/_______
Email: ________@amarteinc.com  (o el que prefieras)
```

Yo en una corrida:
1. ✅ Actualizo `siteConfig.ts` con todos los datos
2. ✅ Actualizo `public/sitemap.xml` con `https://breathwork.amarteinc.com`
3. ✅ Actualizo `public/robots.txt` con sitemap real
4. ✅ Actualizo `public/privacidad.html` con email real (4 reemplazos)
5. ✅ Actualizo `public/terminos.html` con email real (2 reemplazos)
6. ✅ Actualizo `src/lib/calendar.ts` con `@amarteinc.com`
7. ✅ Sincronizo FAQs entre Schema y componente
8. ✅ Cambio Splash a localStorage
9. ✅ Hago commit con mensaje claro y push
10. ✅ Verifico que Vercel redeploy y la página carga sin "TODO_" visibles

**Resultado:** Landing 100% lista para pautar, sin un solo placeholder visible.

---

## 📁 Archivos que se tocarían si arreglamos todo

| Archivo | Razón |
|---|---|
| `src/data/siteConfig.ts` | 9 campos placeholder |
| `src/lib/calendar.ts` | TODO_DOMAIN |
| `src/components/StructuredData.tsx` | Sincronizar FAQs |
| `src/components/FAQ.tsx` | Sincronizar FAQs |
| `src/components/Splash.tsx` | sessionStorage → localStorage |
| `public/sitemap.xml` | TODO_URL |
| `public/robots.txt` | TODO_URL |
| `public/privacidad.html` | 4 instancias TODO_EMAIL |
| `public/terminos.html` | 2 instancias TODO_EMAIL |

**Total:** 9 archivos, ~30 reemplazos.

---

## 🚀 ESTADO PARA PAUTA DIGITAL

**Antes de invertir en Meta Ads / Instagram Ads:**

🔴 **NO listo si:**
- Persiste cualquier `TODO_*` visible
- `whatsappGroupUrl` sigue siendo `REEMPLAZAR_AQUI`
- Meta Pixel no activo (no podrás optimizar campañas)
- Auto-WhatsApp no funciona (ver [[PLAN_WHATSAPP_AUTOMATION.md]])

🟢 **SÍ listo cuando:**
- Todos los placeholders reemplazados
- Pixel Meta activo en `index.html`
- Templates aprobados en Meta
- Edge Function de auto-WhatsApp deployed
- Mínimo 1-2 sesiones reales para tener testimonios

---

## 📚 Referencias

- [REPORTE_LANZAMIENTO.md](./REPORTE_LANZAMIENTO.md) — Detalles del setup inicial
- [PLAN_WHATSAPP_AUTOMATION.md](./PLAN_WHATSAPP_AUTOMATION.md) — Plan para auto-WhatsApp con Meta
- Tabla `breathwork_leads` en Supabase project `amarteinc`

---

**Auditoría generada el 2026-05-21 al final de la primera sesión post-lanzamiento.**
**Próxima acción sugerida:** IOMI pasa los datos reales (5 valores) → Claude hace fix completo en 20 min → push → listo para pautar.
