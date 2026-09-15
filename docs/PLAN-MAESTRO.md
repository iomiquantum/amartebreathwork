# PLAN MAESTRO

## 1. Top 10 priorizado

| # | Hallazgo | Evidencia (file:línea) | Impacto × Esfuerzo |
|---|----------|------------------------|-------------------|
| 1 | BEON: éxito falso — lead no persistido responde OK y redirige a /gracias; error también redirige y borra el aviso | `amarte-be-on-web/src/lib/supabase.ts:31-33`, `src/app/actions/lead.ts:65-77`, `src/components/LeadForm.tsx:15-22` | Alto × S |
| 2 | Breathwork: PII cruda (nombre+teléfono) a Meta/TikTok/GA4 | `AMARTEBREATHWORK/src/components/LeadForm.tsx:59`, `src/lib/tracking.ts:237-246` | Alto × S |
| 3 | ICE: tracking sin gate de consent (fbq/gtag + Lead incondicional, banner decorativo) | `ICE-RESET-INMERSIVO/src/lib/tracking.ts:32-45`, `src/App.tsx:63-64`, `src/components/ThankYouPage.tsx:17-18`, `src/components/CookieConsent.tsx:4-30` | Alto × M |
| 4 | BEON sin `canonical`/`alternates` en ninguna ruta | `amarte-be-on-web/src/app/layout.tsx:21-56` (grep `canonical\|alternates` en `src/app` = 0 hits) | Alto × S |
| 5 | BEON `ogImage: "/og.png"` inexistente (404 social; el OG real vive en `/opengraph-image`) | `amarte-be-on-web/src/lib/config.ts:8`, `src/app/opengraph-image.tsx:1-8`, `src/app/layout.tsx:47` | Alto × S |
| 6 | Sin headers/CSP/HSTS en BEON ni en ICE/PLANT (solo Breathwork blindado) | `amarte-be-on-web/next.config.ts:1-7`, `AMARTEBREATHWORK/vercel.json` (headers OK) vs ICE/PLANT sin `vercel.json`/`_headers` | Alto × S |
| 7 | `tracking.ts`/`utils.ts` triplicados: ICE/PLANT emiten `console.log "[track]…"` en prod; el real solo está en BW | `ICE-RESET-INMERSIVO/src/lib/tracking.ts:1-14`, `PLANT-SOUND-IMMERSION/src/lib/tracking.ts:37l`, `AMARTEBREATHWORK/src/lib/tracking.ts:408l` | Alto × S |
| 8 | ICE/PLANT sin code-splitting: todo en un chunk (~109/97 KB gzip), ~35 componentes eager | `ICE-RESET-INMERSIVO/vite.config.ts:1-11`, `PLANT-SOUND-IMMERSION/vite.config.ts:1-14`, `ICE/src/App.tsx:1-40`, `PLANT/src/App.tsx:1-19` | Alto × S |
| 9 | BEON loguea lead completo (PII) en logs del servidor | `amarte-be-on-web/src/lib/supabase.ts:32` | Alto × S |
| 10 | Cero tests en los 4 repos + ICE/PLANT sin git + copias `public/ice\|plant` con drift sin script de regeneración | `AMARTEBREATHWORK/package.json:6`, `ICE-RESET-INMERSIVO/package.json:7`, `PLANT-SOUND-IMMERSION/package.json:6`, `amarte-be-on-web/package.json:5`; `AMARTEBREATHWORK/public/ice/index.html`, `public/plant/index.html` (M sin commit) | Alto × M |

## 2. Plan por fases

Fusión de las 8 auditorías (orden 1→8: arquitectura, SEO/GEO, performance, seguridad, formularios/datos, accesibilidad, QA/operación, tracking/privacidad). Cada tarea: dueño sugerido, dependencias, criterio de aceptación verificable.

### Fase 0 — Datos y consentimiento (bloqueante, 1–2 días)

| # | Tarea (fuente) | Dueño | Depende de | Criterio de aceptación |
|---|----------------|-------|------------|------------------------|
| 0.1 | BEON: distinguir `persisted:false` — no responder éxito ni redirigir a /gracias si el lead no se guardó; mostrar aviso de reintento (aud. 5 §2, 8) | BEON Backend | — | `lead.ts` retorna estado no-persistido sin redirect; QA manual: Supabase caído → sin redirect, mensaje visible |
| 0.2 | BEON: en error no auto-redirigir a los 600ms; CTA manual al grupo (aud. 5 §3) | BEON Frontend | 0.1 | `LeadForm.tsx` solo redirige en éxito; en error el mensaje persiste |
| 0.3 | Breathwork: dejar de enviar PII cruda a píxeles — hashear (SHA-256) o enviar solo evento sin payload (aud. 8 H3; Top 10 #2) | BW Frontend | — | `tracking.ts:237-246` no contiene `name|whatsapp` en claro hacia fbq/ttq/gtag; grep lo confirma |
| 0.4 | BEON: quitar PII del log servidor, log solo `source+timestamp+persisted` (aud. 5 §1; Top 10 #9) | BEON Backend | — | `supabase.ts:32` sin objeto lead; grep `console.warn.*lead` = 0 hits con PII |
| 0.5 | ICE: gatear tracking con consent — `track*` lee `ice-reset-consent`, `ThankYouPage` no dispara `Lead` sin consent (aud. 8 H1; Top 10 #3) | ICE Frontend | — | Sin consent → 0 llamadas fbq/gtag; con consent → disparan; banner deja de ser decorativo |

### Fase 1 — SEO, headers y base legal (2–4 días)

| # | Tarea (fuente) | Dueño | Depende de | Criterio de aceptación |
|---|----------------|-------|------------|------------------------|
| 1.1 | BEON: agregar `alternates.canonical` en `layout.tsx` + por ruta (aud. 2 §1; Top 10 #4) | BEON Frontend | — | grep `canonical\|alternates` en `src/app` > 0; validación: canonical absoluto por ruta |
| 1.2 | BEON: corregir `ogImage` — apuntar a `/opengraph-image` o agregar `public/og.png` real (aud. 2 §2; Top 10 #5) | BEON Frontend | — | `config.ts:8` + `layout.tsx:47` resuelven a imagen 200 OK; share-debugger sin 404 |
| 1.3 | Resolver split de dominio BEON sin canonical: canonical único + decidir qué sirve `/` y `/test` (aud. 2 §3) | BW/BEON DevOps | 1.1 | Un solo origen canónico; `vercel.json` rewrites documentados; sin contenido duplicado en 2 orígenes |
| 1.4 | Headers/CSP/HSTS en BEON (`next.config.ts:headers()`) y en ICE/PLANT (copiar bloque BW adaptado) (aud. 4 §1; Top 10 #6) | DevOps | — | curl -I muestra HSTS+XFO+nosniff+CSP en los 3; sin regresión de píxeles/embeds |
| 1.5 | Sitemap BW: incluir `/ice /plant /test` (+ resto de `App.tsx:147-221`); `llms.txt` coherentes (aud. 2 §4) | BW Frontend | — | `sitemap.xml` contiene las rutas reales; validador sin URLs 404 |
| 1.6 | ICE/PLANT: páginas de privacidad/términos + enlaces en footer; allowlist de `source` en BEON (aud. 8 H2; aud. 5 §5) | Contenido+Frontend | — | `/privacidad /terminos` existen en ICE/PLANT; footer enlaza; `source` fuera de allowlist → "otro" |

### Fase 2 — Performance + arquitectura compartida (1–2 semanas)

| # | Tarea (fuente) | Dueño | Depende de | Criterio de aceptación |
|---|----------------|-------|------------|------------------------|
| 2.1 | ICE/PLANT: copiar `manualChunks` de BW + lazy-load de secciones bajo el fold (aud. 3 H1; Top 10 #8) | ICE/PLANT Frontend | — | `vite.config.ts` con chunks; `dist/` >1 chunk JS; JS inicial gzip < 109/97 KB actuales |
| 2.2 | Hero/imágenes: servir `.avif/.webp` primero, JPG solo fallback; comprimir `final-cta-bg/hero-bg/respirar-juntos` (aud. 3 §0) | BW Frontend | — | `<picture>`/srcset con avif+webp; peso hero < 60 KB por slide; Lighthouse LCP mejora |
| 2.3 | `framer-motion`: sacar de ruta crítica del H1/hero; envolver `smooth-scroll` CSS en `prefers-reduced-motion` (aud. 3 H2; aud. 6 B3) | BW/ICE/PLANT Frontend | — | H1 render sin esperar motion; CSS smooth solo sin reduced-motion |
| 2.4 | Unificar `lib/tracking.ts` (promover el de BW 408l como único) y `lib/utils.ts` + `data/siteConfig.ts` (aud. 1 H2–H3; Top 10 #7) | BW Arquitectura | 0.3, 0.5 | ICE/PLANT reexportan el tracking único; 0 `console.log "[track]"` en prod; configs con misma riqueza |
| 2.5 | Plan anti-fork: extraer `packages/ui-landing` (17 componentes duplicados: Hero/FAQ/Footer/…) o al menos `lib/` compartido (aud. 1 H1; ~238/53/39/18 text-xs dispersos) | Arquitectura | 2.4 | Un cambio de copy/a11y se hace 1 vez; md5/divergencia documentada o eliminada |
| 2.6 | Splash BW 1400ms + `overflow:hidden`: acortar/condicionar (aud. 3 H2) | BW Frontend | 2.3 | TTI mejora; splash no bloquea >1s en 4G |

### Fase 3 — Formularios, accesibilidad, rate-limit (3–5 días)

| # | Tarea (fuente) | Dueño | Depende de | Criterio de aceptación |
|---|----------------|-------|------------|------------------------|
| 3.1 | BEON: rate-limit en Server Action (~5/h por IP o columna ip+trigger como Breathwork) (aud. 5 §4) | BEON Backend | 0.1 | 6º envío/h → 429 con mensaje; spam masivo bloqueado |
| 3.2 | Validación/honeypot: mantener (nombre/phone/honeypot/disabled-pending/RLS+service_role) + nombre de honeypot no fijo (aud. 5 §6) | BEON/BW Frontend | — | Tests de honeypot y validación pasan; bots bloqueados sin fricción visible |
| 3.3 | A11y BW: `LeadForm:192-211` role=group+aria-pressed; `WhatsappGateModal` focus-trap+retorno de foco; contraste bone/40-60%→/70+; eyebrow/figcaption ≥12px o más contraste (aud. 6 B1–B4) | BW Frontend | — | Axe/lectura manual: grupo anuncia selección; foco atrapado y restaurado; contraste ≥4.5:1 en textos informativos |
| 3.4 | A11y ICE/PLANT/BEON: replicar patrones maduros de BW (dots 44px con aria, aria-expanded, Escape en modales) (aud. 6) | ICE/PLANT/BEON Frontend | 3.3 | Mismos patrones verificados; sin `maximum-scale` ni bloqueos de zoom (ya OK) |

### Fase 4 — QA, reproducibilidad y operación (3–5 días)

| # | Tarea (fuente) | Dueño | Depende de | Criterio de aceptación |
|---|----------------|-------|------------|------------------------|
| 4.1 | `git init` + remoto en ICE/PLANT; commitear estado actual de los 4 (incl. BEON `JsonLd.tsx`, `llms.txt`) (aud. 7 H1/H4; Top 10 #10) | DevOps | — | `git status` limpio con remoto; tag del build embebido registrado |
| 4.2 | Script que regenera `public/ice|plant` desde repos fuente + `.gitignore` para `dist/|.next/` (aud. 7 H2–H3) | BW DevOps | 4.1 | `npm run sync:embeds` reproduce las copias byte a byte; `dist/` no commiteado |
| 4.3 | Harness mínimo: `test` script + smoke de rutas/rewrites (`verify-subpaths.mjs` en CI) + tests de lead/consent/canonical (aud. 7 §1) | QA/DevOps | 0.1–1.5 | `npm test` verde en CI; 0 `*.test` → al menos smoke + lead + consent |
| 4.4 | CSP residual: plan a nonces/hashes (no bloqueante) + documentar `unsafe-inline/eval` por Vite/píxeles (aud. 4 residual) | Arquitectura | 1.4 | Documento de deuda CSP con ruta de migración; sin regresión |

## 3. Paralelo vs secuencial

Secuencial obligatorio (orden × motivo):

- 0.1 → 0.2 (BEON persisted→redirect): 0.2 cambia el mismo flujo; hacerlo antes perpetúa el éxito falso.
- 0.3 antes de 2.4 (PII→unificación tracking): unificar con la fuga de PII replicaría la fuga a ICE/PLANT.
- 0.5 antes de pegar IDs reales en ICE: sin gate, cualquier ID nuevo transmite sin consent.
- 1.1 → 1.3 (canonical→split dominio): decidir el origen canónico exige el mecanismo canonical ya implementado.
- 4.1 → 4.2 (git→script embeds): el script de regeneración necesita fuentes versionadas.

Paralelo seguro (carriles independientes, pueden ir a la vez tras la Fase 0):

- Carril A (datos/privacidad): 0.3, 0.4, 1.6, 3.1 — archivos distintos, sin dependencia cruzada.
- Carril B (SEO/headers): 1.1, 1.2, 1.4, 1.5 — BEON layout/config, next.config, sitemap; solo 1.3 espera a 1.1.
- Carril C (performance/arquitectura): 2.1, 2.2, 2.6 — por repo/archivo; 2.4/2.5 esperan a 0.3 y 0.5.
- Carril D (a11y/forms): 3.2, 3.3, 3.4 — por repo; no tocan tracking ni headers.
- Carril E (QA/ops): 4.1, 4.3 — versionado y harness avanzan mientras C y D codifican; 4.2 cierra al final.

Regla de ejecución: hacer la Fase 0 completa primero (un solo carril, 1–2 días), luego abrir B+C+D en paralelo, y cerrar con 4.2 + 4.4 como integración final.

## 4. Riesgos y no auditado

Síntesis de las 8 auditorías (solo lectura, sin cambios de código). Cada riesgo cita su evidencia estática; lo no verificado se lista explícito en §4.2.

### 4.1 Riesgos residuales (con evidencia)

- R1. Deriva de forks: ~17 componentes homónimos en 2–3 repos con md5 distintos (ej. `ICE/.../Hero.tsx:ab03b3f0` vs `PLANT/.../Hero.tsx:f91ea458`; `FAQ.tsx:114/136/119l`); todo fix se triplica (aud. 1 H1). Stack duplicado con versiones divergentes (aud. 1 H4).
- R2. Tracking dispar sin gate en ICE: `tracking.ts:32-45` + `App.tsx:63-64` + `ThankYouPage.tsx:17-18` disparan fbq/gtag/Lead incondicional; `CookieConsent.tsx:4-30` decorativo, nada lo lee (aud. 8 H1). Pegar IDs reales sin Fase 0.5 = transmisión sin consentimiento.
- R3. PII a píxeles en BW: `LeadForm.tsx:59` → `tracking.ts:237-246` reenvía `{name, whatsapp, city, intent}` en claro a fbq/ttq/gtag/dataLayer (aud. 8 H3). BEON además loguea el lead completo en servidor (`supabase.ts:32`) (aud. 5 §1).
- R4. Éxito falso BEON: `supabase.ts:31-33` + `actions/lead.ts:74-77` responden OK + redirect a /gracias con `persisted:false`; `lead.ts:65-71` + `LeadForm.tsx:15-22` redirigen a los 600ms aun en error (aud. 5 §2–3). Lead perdido + usuario engañado.
- R5. Canibalización SEO: BEON sin canonical en ninguna ruta (`layout.tsx:21-56`, grep = 0 hits); `ogImage:"/og.png"` (`config.ts:8`) inexistente en `public/` (OG real en `opengraph-image.tsx:1-8` pero `layout.tsx:47` fuerza `/og.png` → 404 social); rewrite `BW/vercel.json:4-17` sirve mismo contenido en 2 orígenes sin canonical; sitemap BW sin `/ice /plant /test` (rutas reales en `App.tsx:147-221`) (aud. 2 §1–4).
- R6. Sin blindaje en 3/4 repos: BEON `next.config.ts:1-7` sin `headers()`; ICE/PLANT sin `vercel.json`/`_headers`; solo BW tiene HSTS+CSP+XFO en `vercel.json`. CSP BW residual con `unsafe-inline/unsafe-eval` + `img-src https: blob: data:` (aud. 4 §1 + residual).
- R7. Sin fricción anti-spam en BEON: `lead.ts:17-78` sin throttle/IP/captcha; `source` viaja en hidden input sin allowlist (`LeadForm.tsx:26`, `lead.ts:24`) (aud. 5 §4–5). ICE/PLANT sin páginas legales ni enlaces en footer (grep `privacidad|terminos` en `PLANT/src` = 0) (aud. 8 H2).
- R8. Performance 4G: ICE/PLANT sin `manualChunks` (`vite.config.ts:1-11/1-14`), un solo chunk 109/97 KB gzip con ~35 componentes eager (`ICE/App.tsx:1-40`, `PLANT/App.tsx:1-19`); `framer-motion` en ruta crítica del H1/hero (~56 ficheros BW, vendor 131 KB/43 KB gzip) + splash 1400ms con `overflow:hidden`; hero JPG 75–200 KB pudiendo servir `.avif/.webp` (29–58 KB) (aud. 3 §0–H2).
- R9. A11y adultos mayores: 238/53/39/18 `text-xs` (BW/ICE/BEON/PLANT); grupo `LeadForm.tsx:192-211` sin `aria-pressed`; `WhatsappGateModal.tsx:160-186` con Escape/foco inicial pero sin focus-trap ni retorno; contraste `text-bone/40-60%` sobre ink <4.5:1; `scroll-behavior:smooth` global sin `prefers-reduced-motion` (aud. 6 B1–B4).
- R10. Cero red de seguridad: 0 `*.test|vitest|jest|playwright|cypress` y sin script `test` en los 4 `package.json`; sin `.github/`; ICE/PLANT sin git (`not a git repository`); copias `public/ice|plant/index.html` con `M` sin commit y sin script de regeneración; `dist/|.next/` presentes en disco; BEON con `M JsonLd.tsx` + `?? llms.txt` sin commit (aud. 7 §1–H4).

### 4.2 Lo NO verificado (explícito, no auditado)

Auditorías estáticas de código — no se ejecutó nada en producción. Pendiente antes de declarar "done":

1. Performance real: sin Lighthouse ni Web Vitals de campo/lab (aud. 3: sin servidor, 4G estimado a ~180 KB/s); sin medición en gama baja ni 4G real.
2. Píxeles en prod: IDs de Meta/GA4/TikTok/Clarity vacíos en BW y con env+consent en BEON — no verificado ningún disparo real permitido/denegado por estado de consentimiento.
3. SEO en vivo: sin crawl de dominio prod (canonical resuelto, sitemap con 200, `og.png` vs `/opengraph-image` con share-debugger, robots/sitemap BEON servidos).
4. Headers en vivo: sin `curl -I` contra orígenes prod (HSTS/CSP/XFO efectivos en BEON/ICE/PLANT/BW); sin test dinámico (ZAP/XSS/iframe-clickjacking).
5. Datos en vivo: sin prueba E2E contra Supabase real (insert OK, caída → sin redirect, error → sin auto-redirect, honeypot, rate-limit 5/h bajo carga, RLS/policies efectivas, columna IP/trigger BW).
6. Canales externos: no verificado Payphone (`frame-src https://*.payphone.app`), entrega/redirect a WhatsApp, ni Vercel Analytics/SpeedInsights en prod.
7. A11y con usuarios: sin lector de pantalla, navegación solo-teclado, ni prueba en móvil real con adultos mayores; contraste no medido con herramienta (solo inferencia `bone/40-60%`).
8. Operación: sin restore de backup (`daily-backup` + Vault solo leído), sin CI corriendo `verify-subpaths.mjs`, sin harness smoke/lead/consent/canonical en verde.
9. Contenido legal: texto LOPDP de privacidad/términos no validado por asesoría; `llms.txt`/llms de campaña no cotejados post-fix.
10. BEON con basePath revertido (`a014271`): compatibilidad del proxy `vercel.json:5-20` con el estado actual no verificada en deploy (cambios BEON sin commit).

