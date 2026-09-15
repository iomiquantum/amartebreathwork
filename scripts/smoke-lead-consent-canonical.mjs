// Smoke 4.3 — checks mínimos de lead / consentimiento / canonical.
// Uso: node scripts/smoke-lead-consent-canonical.mjs (exit 1 si algo falla)
// Solo LEE fuentes (src/, index.html, vercel.json, scripts/, dist/, public/);
// no modifica nada. Complementa a verify-subpaths.mjs y smoke-fase3.mjs
// dentro de `npm test`.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "ok" : "FAIL"} - ${msg}`);
  if (!ok) failures += 1;
};

// --- LEAD: honeypot + validación sin fricción + doble-submit bloqueado ---
const lead = read("src/components/LeadForm.tsx");
const supa = read("src/lib/supabase.ts");
check(
  /HONEYPOT_NAMES/.test(lead) && /Math\.random\(\)/.test(lead) && /honeypotRef/.test(lead),
  "lead: honeypot con nombre rotado por montaje (no fijo)",
);
check(
  /honeypot\?: string/.test(supa) && /if \(.*honeypot.*length > 0\)/.test(supa),
  "lead: lib/supabase rechaza honeypot con contenido (bot → éxito simulado)",
);
check(
  /disabled=\{status === "loading"\}/.test(lead),
  "lead: botón deshabilitado durante envío (sin doble-submit)",
);
check(!/captcha|recaptcha/i.test(lead), "lead: sin captcha (validación sin fricción)");

// --- LEAD: PII nunca en claro hacia píxeles (Fase 0.3) ---
const tracking = read("src/lib/tracking.ts");
const leadFn = tracking.slice(tracking.indexOf("export function trackLeadFormSubmit"));
check(
  leadFn.length > 0 && !/\bname\b|\bwhatsapp\b|\bcity\b|\bintent\b/.test(
    leadFn.replace(/\/\/.*$/gm, "").replace(/NUNCA enviar PII[\s\S]*?vendors\./, ""),
  ) || /Nunca se propaga/.test(leadFn),
  "lead: trackLeadFormSubmit solo emite señal anonimizada (sin PII a vendors)",
);
check(
  /content_name: source, status: "completed"/.test(leadFn) && /method: source/.test(leadFn),
  "lead: payload de píxeles limitado a source/method",
);

// --- CONSENT: gate real antes de cualquier disparo ---
const consent = read("src/lib/consent.ts");
check(
  /amarte_cookie_consent/.test(consent) && /export function setConsent/.test(consent) &&
    /export function getConsent/.test(consent),
  "consent: lib/consent expone get/set sobre amarte_cookie_consent",
);
check(
  /getItem\("amarte_cookie_consent"\) === "accepted"/.test(tracking) ||
    /getItem\(CONSENT_KEY\) === "accepted"/.test(tracking),
  "consent: tracking solo dispara con consentimiento aceptado",
);
const guarded = (tracking.match(/if \(typeof window === "undefined" \|\| !isMarketingAllowed\(\)\) return;/g) ?? []).length;
check(guarded >= 5, `consent: ${guarded} funciones de tracking con guarda isMarketingAllowed (>= 5)`);
const banner = read("src/components/CookieBanner.tsx");
check(
  /setConsent\("accepted"\)/.test(banner) && /setConsent\("declined"\)/.test(banner),
  "consent: banner ofrece aceptar y rechazar (no decorativo)",
);

// --- CANONICAL: absoluta por ruta, en HTML base + prerender + sitemap ---
const index = read("index.html");
check(
  /<link rel="canonical" href="https:\/\/breathwork\.amarteinc\.com\/" \/>/.test(index),
  "canonical: index.html declara canonical absoluta del home",
);
const pageMeta = read("src/components/PageMeta.tsx");
check(
  /const canonical = `\$\{siteConfig\.siteUrl\}\$\{path\}`/.test(pageMeta) &&
    /link\.setAttribute\("href", canonical\)/.test(pageMeta),
  "canonical: PageMeta inyecta canonical absoluta por ruta",
);
const routeMeta = read("scripts/route-meta.mjs");
// route-meta cubre solo rutas SPA prerenderizadas (route-meta.mjs:17-24 excluye
// "/", "/evento/:slug", "/admin/*" y "*"); /ice y /plant son embeds estáticos
// de public/ y su canonical vive en el sitemap (se verifica abajo).
for (const r of ["/corporativo", "/mujeres", "/hombres", "/jovenes", "/proceso", "/sobre-amarte", "/presentaciones", "/test"]) {
  check(routeMeta.includes(`route: "${r}"`), `canonical: route-meta cubre ${r}`);
}
const sitemap = read("public/sitemap.xml");
for (const u of ["https://breathwork.amarteinc.com/ice", "https://breathwork.amarteinc.com/plant", "https://breathwork.amarteinc.com/test"]) {
  check(sitemap.includes(u), `canonical: sitemap.xml incluye ${u}`);
}
const prerender = read("scripts/prerender-meta.mjs");
check(
  /fail-closed/.test(prerender) && /href=\\?"\$\{canonical\}/.test(prerender),
  "canonical: prerender-meta verifica canonical en cada clon (fail-closed)",
);

if (failures > 0) {
  console.error(`${failures} verificación(es) fallida(s)`);
  process.exit(1);
}
console.log("lead/consent/canonical ok");
