# CSP — Deuda residual: `unsafe-inline` / `unsafe-eval` (Tarea 4.4)

Tarea 4.4 del PLAN-MAESTRO (`docs/PLAN-MAESTRO.md:70`): documentar por qué la
CSP actual necesita `unsafe-inline`/`unsafe-eval` y la ruta de migración a
nonces/hashes. No bloqueante: no se toca `vercel.json` en esta tarea.

## 1. Inventario actual (verificable)

CSP efectiva: `vercel.json:46-47` (header `Content-Security-Policy` para `/(.*)`).

| Directiva | Valor permisivo | Ocurrencias en `vercel.json` |
|---|---|---|
| `script-src` | `'unsafe-inline'` | 1 (`vercel.json:47`) |
| `script-src` | `'unsafe-eval'` | 1 (`vercel.json:47`) |
| `style-src` | `'unsafe-inline'` | 1 (`vercel.json:47`) |

Hosts de terceros ya allowlisteados en `script-src` (`vercel.json:47`):
`va.vercel-scripts.com`, `*.vercel-insights.com`, `www.googletagmanager.com`,
`connect.facebook.net`, `analytics.tiktok.com`, `*.clarity.ms`, `www.clarity.ms`.

Inline real en el HTML base: `index.html:58` — `onload="this.media='all'"`
(patrón de carga no bloqueante de Google Fonts, con `<noscript>` fallback en
`index.html:61-66`). Es el único `on*` inline del documento.

Búsqueda en fuente (`src/` + `index.html`): **cero** `eval(`, **cero**
`new Function`, **cero** `dangerouslySetInnerHTML`. El JS propio no necesita
`unsafe-eval` por código escrito a mano.

## 2. Por qué existe cada permiso

1. `script-src 'unsafe-inline'` — los píxeles de marketing inyectan
   `<script>` inline en runtime: Meta (`connect.facebook.net`),
   GA4 (`www.googletagmanager.com`), TikTok (`analytics.tiktok.com`) y
   Clarity (`*.clarity.ms`). Sin este permiso, el primer pageview tras
   aceptar consentimiento rompe esos vendors. Los IDs viven en
   `src/data/siteConfig.ts:169-172` (hoy vacíos: píxeles apagados hasta
   Fase 0.5) y la carga gateada por consentimiento está en
   `src/lib/tracking.ts:67-71` (`isMarketingAllowed`) y
   `src/lib/pixels.ts`.
2. `script-src 'unsafe-eval'` — colchón para (a) Vite/React en dev/HMR
   (`@vitejs/plugin-react`, `vite.config.ts:1-11`) y (b) librerías de
   terceros (píxeles, Vercel Analytics/Speed Insights) que compilan o
   evalúan snippets en runtime. El build de producción propio no lo
   requiere por código, pero quitarlo hoy rompería vendors sin aviso.
3. `style-src 'unsafe-inline'` — Tailwind genera estilos inline/`<style>` en
   runtime en algunos componentes, y el patrón de fuentes usa
   `media="print"` + `onload` (`index.html:54-60`). Vite también inyecta
   `<style>` en dev.

## 3. Ruta de migración a nonces/hashes (propuesta, sin regresión)

1. **Medir primero**: activar `Content-Security-Policy-Report-Only` en
   paralelo (misma política, solo reporte) y recoger violaciones reales
   1–2 semanas en prod. Sin datos de campo, cualquier endurecimiento es
   adivinanza (ver `docs/PLAN-MAESTRO.md:113-114`).
2. **`style-src`**: eliminar el `onload` inline (`index.html:58`) moviendo
   el swap `media print → all` a un `<script src>` propio o a CSS
   `font-display: swap` con fuentes auto-hospedadas; luego fijar hashes
   de los `<style>` que Tailwind/Vite emitan en el build.
3. **`script-src 'unsafe-inline'`**: migrar a **nonces por respuesta**.
   Vercel estático no puede firmar nonces por request sin Edge Middleware;
   opciones: (a) Middleware que añada nonce a la CSP y lo propague a los
   `<script>` propios; (b) `'strict-dynamic'` + nonce para los bundles
   propios, manteniendo la allowlist de hosts para píxeles mientras vivan.
4. **`script-src 'unsafe-eval'`**: quitarlo cuando (a) los píxeles activos
   funcionen sin él (verificar en Report-Only) y (b) el build de prod se
   verifique sin `eval` (grep en `dist/assets/*.js`). Meta/Clarity son los
   candidatos a exigirlo; si alguno lo exige, aislarlo en iframe sandbox
   o aceptar la excepción documentada solo para ese host.
5. **Píxeles**: evaluar carga vía Tag Manager server-side o `web worker`
   (partytown) para sacar los vendors del `script-src` principal.
6. **Cierre**: una vez en verde 2 semanas en Report-Only, promover a
   enforce, quitar `unsafe-*` y dejar este documento como registro del
   cambio (fecha + hash del deploy).

## 4. Qué NO hacer

- No quitar `unsafe-inline`/`unsafe-eval` de `vercel.json:47` sin pasar por
  Report-Only: rompería píxeles y carga de fuentes sin error visible en CI.
- No añadir más hosts a `script-src` sin registrar aquí el motivo y el
  dueño (cada host es superficie de XSS de terceros).
