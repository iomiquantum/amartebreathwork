// scripts/prerender-meta.mjs
// Prerender de meta por ruta (T4, opción A: inyección post-build).
// Lee dist/index.html (salida de `vite build`), clona un HTML por cada ruta
// de scripts/route-meta.mjs con title/description/canonical/OG de esa ruta
// y lo escribe en dist/<ruta>/index.html.
//
// Garantías de bajo riesgo:
// - No toca el pipeline (tsc+vite intactos), no añade dependencias.
// - Solo reescribe tags <head>; los assets (/assets/*.js con hash) quedan
//   byte-idénticos → la SPA arranca igual en cada ruta prerenderizada.
// - No toca public/ice, public/plant ni vercel.json → embeds /ice y /plant
//   y el proxy /be-on quedan intactos.
// - No toca dist/index.html (home) ni crea copias de /admin/* o /evento/*.
// - El fallback SPA sigue intacto: rutas sin HTML estático caen al rewrite
//   catch-all `/(.*) → /` de vercel.json.
// - Fail-closed: si falta la base o algún patrón esperado, exit 1 para que
//   el deploy falle en voz alta en vez de publicar meta desfasada.
// Uso: `node scripts/prerender-meta.mjs` (también vía `postbuild`).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { SITE_URL, ROUTE_META } from "./route-meta.mjs";

const DIST = join(process.cwd(), "dist");
const BASE = join(DIST, "index.html");

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Reemplazo único verificado: falla si el patrón no aparece exactamente 1 vez. */
function replaceOnce(html, pattern, replacement, label) {
  const matches = html.match(pattern);
  if (!matches || matches.length !== 1 || matches.index === undefined) {
    throw new Error(`patrón ${label} no encontrado exactamente 1 vez en dist/index.html`);
  }
  return html.slice(0, matches.index) + replacement + html.slice(matches.index + matches[0].length);
}

async function main() {
  let base;
  try {
    base = await readFile(BASE, "utf8");
  } catch {
    console.error("[prerender-meta] FAIL: dist/index.html no existe — corre `vite build` primero");
    process.exit(1);
  }

  for (const { route, title, description } of ROUTE_META) {
    const t = escapeHtml(title);
    const d = escapeHtml(description);
    const canonical = `${SITE_URL}${route}`;
    let html = base;
    try {
      html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, "<title>");
      html = replaceOnce(
        html,
        /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
        `<meta name="description" content="${d}" />`,
        "meta description",
      );
      html = replaceOnce(
        html,
        /<link rel="canonical" href="[^"]*"\s*\/>/,
        `<link rel="canonical" href="${canonical}" />`,
        "canonical",
      );
      html = replaceOnce(
        html,
        /<meta property="og:title" content="[^"]*"\s*\/>/,
        `<meta property="og:title" content="${t}" />`,
        "og:title",
      );
      html = replaceOnce(
        html,
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
        `<meta property="og:description" content="${d}" />`,
        "og:description",
      );
      html = replaceOnce(
        html,
        /<meta property="og:url" content="[^"]*"\s*\/>/,
        `<meta property="og:url" content="${canonical}" />`,
        "og:url",
      );
      html = replaceOnce(
        html,
        /<meta name="twitter:title" content="[^"]*"\s*\/>/,
        `<meta name="twitter:title" content="${t}" />`,
        "twitter:title",
      );
      html = replaceOnce(
        html,
        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
        `<meta name="twitter:description" content="${d}" />`,
        "twitter:description",
      );
    } catch (err) {
      console.error(`[prerender-meta] FAIL ${route}: ${err.message}`);
      process.exit(1);
    }

    // Verificación fail-closed: el clon debe llevar su title + canonical.
    if (!html.includes(`<title>${t}</title>`) || !html.includes(`href="${canonical}"`)) {
      console.error(`[prerender-meta] FAIL ${route}: verificación de inyección falló`);
      process.exit(1);
    }

    const dir = join(DIST, route.slice(1));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html, "utf8");
    console.log(`[prerender-meta] ${route} → dist${route}/index.html (${html.length} B)`);
  }
  console.log(`[prerender-meta] ok: ${ROUTE_META.length} rutas`);
}

main().catch((err) => {
  console.error("[prerender-meta] fatal:", err?.message ?? err);
  process.exit(1);
});
