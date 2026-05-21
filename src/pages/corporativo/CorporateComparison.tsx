// CorporateComparison — Tabla comparativa AMARTE vs alternativas tradicionales.
// Posicionamiento: no competimos con team building / apps / charlas. Las desplazamos.
// El argumento central: ellos trabajan en la mente, AMARTE trabaja en el cuerpo y sistema nervioso.

import { motion } from "framer-motion";
import { Check, X, Minus, Sparkles } from "lucide-react";

type Cell = string | { type: "check"; label?: string } | { type: "x"; label?: string } | { type: "meh"; label?: string };

const ROWS: { label: string; teamBuilding: Cell; apps: Cell; charlas: Cell; amarte: Cell }[] = [
  {
    label: "Inversión típica",
    teamBuilding: "$600 — $1,500 / evento",
    apps: "$69 — $94 / empleado / año",
    charlas: "$200 — $500 / charla",
    amarte: "Desde $32 / persona",
  },
  {
    label: "Trabaja sobre",
    teamBuilding: "La mente / ego",
    apps: "La mente / hábito",
    charlas: "La mente / discurso",
    amarte: "Cuerpo + sistema nervioso",
  },
  {
    label: "Resultado físico inmediato",
    teamBuilding: { type: "x" },
    apps: { type: "x" },
    charlas: { type: "x" },
    amarte: { type: "check" },
  },
  {
    label: "Adopción real del equipo",
    teamBuilding: "Día del evento",
    apps: "< 15% activos al mes",
    charlas: "1 día y se olvida",
    amarte: "100% del equipo participa",
  },
  {
    label: "Memoria duradera",
    teamBuilding: { type: "meh", label: "Anécdota" },
    apps: { type: "x" },
    charlas: { type: "x" },
    amarte: { type: "check", label: "Cambio fisiológico" },
  },
  {
    label: "Setup para tu empresa",
    teamBuilding: "Logística media",
    apps: "Onboarding interno",
    charlas: "Sala + proyector + agenda",
    amarte: "Cero (lo llevamos todo)",
  },
  {
    label: "Acompañamiento posterior",
    teamBuilding: { type: "x" },
    apps: { type: "meh", label: "App self-service" },
    charlas: { type: "x" },
    amarte: { type: "check", label: "Humano + tech" },
  },
  {
    label: "Reporte para liderazgo",
    teamBuilding: { type: "meh", label: "Fotos del evento" },
    apps: { type: "meh", label: "Dashboards" },
    charlas: { type: "meh", label: "Lista de asistencia" },
    amarte: { type: "check", label: "Reporte cualitativo profundo" },
  },
];

function CellRender({ cell, highlight = false }: { cell: Cell; highlight?: boolean }) {
  if (typeof cell === "string") {
    return (
      <span className={`text-sm ${highlight ? "text-orange-glow font-medium" : "text-bone/75"}`}>
        {cell}
      </span>
    );
  }
  if (cell.type === "check") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className={`grid size-6 place-items-center rounded-full ${highlight ? "bg-orange-brand/20 text-orange-glow" : "bg-bone/10 text-bone/60"}`}>
          <Check className="size-3.5" strokeWidth={2.4} />
        </span>
        {cell.label && (
          <span className={`text-xs ${highlight ? "text-orange-glow font-medium" : "text-bone/70"}`}>
            {cell.label}
          </span>
        )}
      </div>
    );
  }
  if (cell.type === "x") {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className="grid size-6 place-items-center rounded-full bg-red-500/15 text-red-400/80">
          <X className="size-3.5" strokeWidth={2.4} />
        </span>
        {cell.label && <span className="text-xs text-bone/50">{cell.label}</span>}
      </div>
    );
  }
  // meh
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="grid size-6 place-items-center rounded-full bg-gold-warm/15 text-gold-warm/80">
        <Minus className="size-3.5" strokeWidth={2.4} />
      </span>
      {cell.label && <span className="text-xs text-bone/65">{cell.label}</span>}
    </div>
  );
}

export function CorporateComparison() {
  return (
    <section id="comparativa" className="relative bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-orange opacity-30" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Comparativa honesta
          </span>
          <h2 className="h-display mt-4 text-4xl sm:text-5xl text-balance">
            Por qué AMARTE no compite —{" "}
            <span className="bg-gradient-to-r from-orange-brand to-gold-warm bg-clip-text text-transparent">
              desplaza.
            </span>
          </h2>
          <p className="lede mt-5">
            Lo que probaste antes no falló porque tu equipo sea distinto.
            Falló porque trabajaba en el lugar equivocado.
          </p>
        </div>

        {/* DESKTOP TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-14 hidden lg:block"
        >
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/40">
            {/* Header */}
            <div className="grid grid-cols-5 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="p-5 text-[10px] uppercase tracking-eyebrow text-bone/50">
                Criterio
              </div>
              <div className="p-5 text-center text-xs uppercase tracking-eyebrow text-bone/70">
                Team Building
                <div className="mt-1 text-[10px] normal-case text-bone/40 tracking-normal">
                  cuerdas · paintball · escape
                </div>
              </div>
              <div className="p-5 text-center text-xs uppercase tracking-eyebrow text-bone/70">
                Apps Meditación
                <div className="mt-1 text-[10px] normal-case text-bone/40 tracking-normal">
                  Calm · Headspace
                </div>
              </div>
              <div className="p-5 text-center text-xs uppercase tracking-eyebrow text-bone/70">
                Charlas wellbeing
                <div className="mt-1 text-[10px] normal-case text-bone/40 tracking-normal">
                  talleres · workshops
                </div>
              </div>
              <div className="relative p-5 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-deep/30 to-orange-deep/10" />
                <div className="relative flex flex-col items-center gap-1">
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-eyebrow text-orange-glow">
                    <Sparkles className="size-3" /> AMARTE
                  </span>
                  <span className="text-[10px] text-bone/50">breathwork inmersivo</span>
                </div>
              </div>
            </div>

            {/* Rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-5 border-b border-white/[0.05] last:border-0 ${
                  i % 2 === 0 ? "bg-white/[0.005]" : ""
                }`}
              >
                <div className="p-5 text-sm font-medium text-bone/85">{row.label}</div>
                <div className="grid place-items-center p-5">
                  <CellRender cell={row.teamBuilding} />
                </div>
                <div className="grid place-items-center p-5">
                  <CellRender cell={row.apps} />
                </div>
                <div className="grid place-items-center p-5">
                  <CellRender cell={row.charlas} />
                </div>
                <div className="relative grid place-items-center p-5">
                  <div className="absolute inset-0 bg-orange-deep/10" />
                  <div className="relative">
                    <CellRender cell={row.amarte} highlight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MOBILE STACK */}
        <div className="mt-12 grid gap-5 lg:hidden">
          {[
            { name: "Team Building tradicional", subtitle: "cuerdas · paintball · escape room", key: "teamBuilding" as const },
            { name: "Apps de meditación", subtitle: "Calm · Headspace for Work", key: "apps" as const },
            { name: "Charlas de wellbeing", subtitle: "talleres · workshops", key: "charlas" as const },
            { name: "AMARTE", subtitle: "breathwork inmersivo + sonido", key: "amarte" as const, highlight: true },
          ].map((col) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl border p-5 ${
                col.highlight
                  ? "border-orange-brand/40 bg-orange-deep/15 shadow-glow-orange"
                  : "border-white/[0.08] bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2">
                {col.highlight && <Sparkles className="size-4 text-orange-glow" />}
                <h3 className={`font-display text-lg ${col.highlight ? "text-orange-glow" : "text-bone"}`}>
                  {col.name}
                </h3>
              </div>
              <p className="mt-0.5 text-[11px] text-bone/45">{col.subtitle}</p>

              <ul className="mt-4 space-y-3">
                {ROWS.map((row) => (
                  <li key={row.label} className="flex items-start justify-between gap-3 border-t border-white/[0.04] pt-3 first:border-0 first:pt-0">
                    <span className="text-[11px] uppercase tracking-eyebrow text-bone/50">
                      {row.label}
                    </span>
                    <div className="flex-shrink-0 text-right">
                      <CellRender cell={row[col.key]} highlight={col.highlight} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quote final */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-3xl text-center"
        >
          <p className="font-display text-balance text-2xl text-bone leading-snug sm:text-3xl">
            El team building tradicional le habla{" "}
            <span className="text-bone/55">al ego.</span>
            <br />
            Las apps de meditación{" "}
            <span className="text-bone/55">al algoritmo.</span>
            <br />
            Las charlas de bienestar{" "}
            <span className="text-bone/55">al PowerPoint.</span>
          </p>
          <p className="mt-6 font-display text-balance text-2xl sm:text-3xl">
            <span className="bg-gradient-to-r from-orange-brand via-orange-glow to-gold-warm bg-clip-text text-transparent">
              AMARTE le habla al sistema nervioso.
            </span>
          </p>
          <p className="mt-3 font-display text-xl text-bone/75 sm:text-2xl">
            Y ese, sí escucha.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
