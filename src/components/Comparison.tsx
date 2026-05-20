import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Cell = "yes" | "partial" | "no";

interface Row {
  label: string;
  ours: Cell;
  classic: Cell;
  app: Cell;
}

const ROWS: Row[] = [
  { label: "Experiencia presencial e inmersiva", ours: "yes", classic: "partial", app: "no" },
  { label: "Audífonos individuales con sonido envolvente", ours: "yes", classic: "no", app: "partial" },
  { label: "Frecuencias y paisajes sonoros diseñados", ours: "yes", classic: "no", app: "partial" },
  { label: "Respiración guiada en vivo", ours: "yes", classic: "yes", app: "partial" },
  { label: "Ambiente cuidado para regular el sistema nervioso", ours: "yes", classic: "partial", app: "no" },
  { label: "Cupos limitados y comunidad cercana", ours: "yes", classic: "partial", app: "no" },
  { label: "Sin pantalla, sin notificaciones, sin distracción", ours: "yes", classic: "yes", app: "no" },
  { label: "Sin requisitos previos", ours: "yes", classic: "partial", app: "yes" },
];

const CELL_STYLES: Record<Cell, { bg: string; icon: typeof Check; text: string }> = {
  yes: { bg: "bg-emerald-deep/40 text-emerald-glow", icon: Check, text: "Sí" },
  partial: { bg: "bg-gold-warm/15 text-gold-soft", icon: Minus, text: "Parcial" },
  no: { bg: "bg-white/[0.04] text-muted", icon: X, text: "No" },
};

function CellView({ cell }: { cell: Cell }) {
  const s = CELL_STYLES[cell];
  const Icon = s.icon;
  return (
    <div className={`mx-auto inline-flex items-center gap-1.5 rounded-full ${s.bg} px-2.5 py-1 text-xs`}>
      <Icon className="size-3.5" strokeWidth={2.2} />
      <span className="hidden sm:inline">{s.text}</span>
    </div>
  );
}

export function Comparison() {
  return (
    <section id="comparativa" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Comparativa"
          title="¿En qué se diferencia"
          highlight="esta experiencia?"
          subtitle="No es una clase. No es una app. Es algo distinto, y queremos que veas exactamente qué."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]"
        >
          {/* Header row */}
          <div className="grid grid-cols-[1.6fr,1fr,1fr,1fr] items-center gap-2 border-b border-white/[0.06] bg-white/[0.025] px-3 py-4 text-xs uppercase tracking-eyebrow text-bone/60 sm:grid-cols-[2fr,1fr,1fr,1fr] sm:px-6">
            <span className="pl-1">Característica</span>
            <span className="text-center text-emerald-brand">AMARTE</span>
            <span className="text-center hidden sm:block">Clase tradicional</span>
            <span className="text-center sm:hidden">Clase</span>
            <span className="text-center hidden sm:block">App de meditación</span>
            <span className="text-center sm:hidden">App</span>
          </div>

          {/* Body rows */}
          <ul className="divide-y divide-white/[0.04]">
            {ROWS.map((r, i) => (
              <motion.li
                key={r.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="grid grid-cols-[1.6fr,1fr,1fr,1fr] items-center gap-2 px-3 py-4 text-left transition-colors hover:bg-white/[0.02] sm:grid-cols-[2fr,1fr,1fr,1fr] sm:px-6"
              >
                <span className="pl-1 text-xs text-bone/85 sm:text-sm">{r.label}</span>
                <span className="text-center"><CellView cell={r.ours} /></span>
                <span className="text-center"><CellView cell={r.classic} /></span>
                <span className="text-center"><CellView cell={r.app} /></span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted">
          Comparativa orientativa. Cada formato tiene su valor — AMARTE no busca
          reemplazarlos, busca darte algo distinto.
        </p>
      </div>
    </section>
  );
}
