// Smoke Fase 3 (forms, a11y, rate-limit cliente): prueba mínima durable.
// Uso: node scripts/smoke-fase3.mjs (exit 1 si algo falla)
// Verifica en FUENTE (sin frameworks nuevos):
//  3.2 honeypot con nombre no fijo + validación sin fricción
//  3.3 role=group + aria-pressed, focus-trap + retorno en modales,
//      contraste >= 4.5:1 en textos informativos de los 4 componentes.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => readFileSync(join(root, "src", p), "utf8");
let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "ok" : "FAIL"} - ${msg}`);
  if (!ok) failures += 1;
};

const lead = src("components/LeadForm.tsx");
const news = src("components/Newsletter.tsx");
const res = src("components/ReservationModal.tsx");
const gate = src("components/WhatsappGateModal.tsx");
const files = { lead, news, res, gate };

// --- 3.2: honeypot no fijo (nombre rotado por montaje, nunca id/name literal fijo) ---
for (const [name, content] of Object.entries(files)) {
  check(
    /HONEYPOT_NAMES|pool = \["contacto_extra"/.test(content) &&
      /Math\.random\(\)/.test(content) &&
      /el\.name = chosen/.test(content) &&
      /honeypotRef/.test(content),
    `${name}: honeypot con nombre rotado al montar (no fijo)`,
  );
  check(
    !/id="amarte_website"|name="website"/.test(content),
    `${name}: sin honeypot de nombre fijo predecible`,
  );
  check(
    /tabIndex=\{-1\}/.test(content) && /aria-hidden/.test(content) && /autoComplete="off"/.test(content),
    `${name}: honeypot invisible a humanos y fuera del tab-order`,
  );
}
// LeadForm y Newsletter no tenían honeypot: ahora envían la trampa.
check(/honeypot/.test(lead) && /honeypot: honeypot/.test(lead), "LeadForm envía honeypot en el payload");
check(/if \(honeypot\)/.test(news), "Newsletter cortocircuita bots con éxito simulado (sin llamada)");
// Validación sin fricción: mensajes amables, sin captcha, con autocomplete.
check(/Sin prisa|sin fricción|amable/i.test(lead) || /para continuar\. Sin prisa/.test(lead), "LeadForm: hint amable sin bloqueo");
check(/Revisa tu email/.test(news), "Newsletter: validación de formato con mensaje amable");
check(!/captcha|recaptcha/i.test(lead + news + res + gate), "Sin captcha en los 4 componentes");
for (const [name, content] of Object.entries(files)) {
  check(/autoComplete="(name|tel|email)"/.test(content), `${name}: autocomplete para autofill`);
}

// --- 3.3: role=group + aria-pressed donde hay opciones excluyentes ---
check(/role="group"/.test(lead) && /aria-pressed/.test(lead), "LeadForm: intenciones con role=group + aria-pressed");
check(/role="group" aria-label="Método de pago"/.test(res) && /aria-pressed/.test(res), "ReservationModal: método de pago con role=group + aria-pressed");

// --- 3.3: focus-trap + retorno en modales ---
for (const [name, content] of [ ["ReservationModal", res], ["WhatsappGateModal", gate] ]) {
  check(/dialogRef/.test(content) && /e\.key !== "Tab"/.test(content), `${name}: focus-trap con Tab`);
  check(/returnFocusRef/.test(content) && /returnFocusRef\.current\?\.focus/.test(content), `${name}: retorno de foco al cerrar`);
  check(/role="dialog"/.test(content) && /aria-modal="true"/.test(content), `${name}: role=dialog + aria-modal`);
}
check(/role="status"/.test(lead) && /role="status"/.test(news), "Éxitos anunciados con role=status");
check(/aria-live="polite"/.test(lead), "LeadForm: paso anunciado con aria-live");

// --- 3.3: contraste >= 4.5:1 en textos informativos (cálculo real WCAG) ---
const lum = (hex) => {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// Mezcla un color con opacidad sobre el fondo (los textos usan /60, /70, /80).
const over = (fg, bg, a) => {
  const p = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [f, b] = [p(fg.replace("#", "")), p(bg.replace("#", ""))];
  return "#" + f.map((v, i) => Math.round(v * a + b[i] * (1 - a)).toString(16).padStart(2, "0")).join("");
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const BG = "0B0F0D"; // ink-900, fondo de cards/diálogos
const pairs = [
  ["muted #A7A7A7 100%", "A7A7A7", 1],
  ["bone/80 (lede, hints)", "F5F2EA", 0.8],
  ["bone/60 (labels, opcional)", "F5F2EA", 0.6],
  ["emerald-brand (eyebrows, %)", "00C896", 1],
  ["gold-soft (avisos)", "E6C77A", 1],
  ["red-300 (errores)", "FCA5A5", 1],
];
for (const [label, fg, a] of pairs) {
  const eff = over(fg, BG, a);
  const r = ratio(eff, "#" + BG);
  check(r >= 4.5, `contraste ${label} sobre ink-900 = ${r.toFixed(2)}:1 (>= 4.5)`);
}
// El único texto tenue eliminado: text-muted/60 (~2.4:1) ya no aparece.
for (const [name, content] of Object.entries(files)) {
  check(!/text-muted\/60/.test(content), `${name}: sin text-muted/60 de bajo contraste`);
}

if (failures > 0) {
  console.error(`${failures} verificación(es) fallida(s)`);
  process.exit(1);
}
console.log("fase3 ok");
