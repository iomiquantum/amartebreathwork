import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const items = [
  {
    n: "01",
    title: "Es auditiva e inmersiva",
    body: "El uso de audífonos crea una experiencia íntima, profunda y envolvente.",
  },
  {
    n: "02",
    title: "No es una clase tradicional",
    body: "No vienes a aprender teoría. Vienes a vivir una pausa sensorial.",
  },
  {
    n: "03",
    title: "Combina respiración, sonido y frecuencias",
    body: "La respiración guía el cuerpo. El sonido acompaña el viaje. Las frecuencias crean atmósfera.",
  },
  {
    n: "04",
    title: "Diseñada para la vida moderna",
    body: "Pensada para personas con estrés, pantallas, ruido mental y tensión acumulada.",
  },
  {
    n: "05",
    title: "Presencial y cuidada",
    body: "Cada sesión tiene cupos limitados para mantener calidad, guía y ambiente.",
  },
  {
    n: "06",
    title: "Simple de vivir",
    body: "No necesitas experiencia previa. Solo cerrar los ojos, respirar y escuchar.",
  },
];

export function Differentiators() {
  return (
    <section id="diferenciadores" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Diferenciadores"
          title="¿Por qué esta experiencia"
          highlight="se siente diferente?"
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ n, title, body }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-ink-900 p-7 transition-colors duration-300 hover:bg-ink-800"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-emerald-brand/60">{n}</span>
                <h3 className="text-lg font-semibold text-bone">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-bone/70 leading-relaxed">{body}</p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-brand/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
