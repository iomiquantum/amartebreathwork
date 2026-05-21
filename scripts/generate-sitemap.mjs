// scripts/generate-sitemap.mjs
// Genera public/sitemap.xml en prebuild. Lee eventos publicados de Supabase
// y arma URLs estáticas + dinámicas. Si Supabase falla, escribe el sitemap
// con solo rutas estáticas (graceful degradation — el build no falla).

import { createClient } from "@supabase/supabase-js";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Cargar .env.local en dev (Vercel ya inyecta env vars en CI).
async function loadDotenv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const content = await readFile(join(process.cwd(), file), "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq < 1) continue;
        const k = trimmed.slice(0, eq).trim();
        let v = trimmed.slice(eq + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        if (!(k in process.env)) process.env[k] = v;
      }
    } catch {
      /* no env file, ok */
    }
  }
}
await loadDotenv();

const SITE_URL = "https://breathwork.amarteinc.com";
const OUTPUT = join(process.cwd(), "public", "sitemap.xml");

const STATIC_ROUTES = [
  { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE_URL}/corporativo`, priority: "0.9", changefreq: "weekly" },
  { loc: `${SITE_URL}/mujeres`, priority: "0.9", changefreq: "weekly" },
  { loc: `${SITE_URL}/hombres`, priority: "0.9", changefreq: "weekly" },
];

function escapeXml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry({ loc, priority = "0.7", changefreq = "weekly", lastmod }) {
  const parts = [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].filter(Boolean);
  return parts.join("\n");
}

async function fetchPublishedEvents() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn(
      "[sitemap] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — usando solo rutas estáticas",
    );
    return [];
  }
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("breathwork_events")
      .select("slug, updated_at, date_iso, status")
      .in("status", ["published", "sold_out"])
      .not("slug", "is", null);
    if (error) {
      console.warn("[sitemap] supabase error:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("[sitemap] fetch failed:", err?.message ?? err);
    return [];
  }
}

async function main() {
  const events = await fetchPublishedEvents();
  const eventRoutes = events.map((e) => ({
    loc: `${SITE_URL}/evento/${e.slug}`,
    priority: "0.8",
    changefreq: "daily",
    lastmod: (e.updated_at ?? e.date_iso ?? new Date().toISOString()).slice(0, 10),
  }));

  const allRoutes = [...STATIC_ROUTES, ...eventRoutes];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    allRoutes.map(urlEntry).join("\n") +
    "\n</urlset>\n";

  await writeFile(OUTPUT, xml, "utf8");
  console.log(`[sitemap] generated ${allRoutes.length} URLs → ${OUTPUT}`);
}

main().catch((err) => {
  console.error("[sitemap] fatal:", err);
  // No reventar el build: escribir fallback estático
  const fallback =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    STATIC_ROUTES.map(urlEntry).join("\n") +
    "\n</urlset>\n";
  writeFile(OUTPUT, fallback, "utf8").catch(() => undefined);
});
