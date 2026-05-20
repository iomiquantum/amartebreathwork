import { motion } from "framer-motion";

const LINES = [
  "Creemos que descansar no es un lujo.",
  "Creemos que la calma se puede entrenar.",
  "Creemos que el cuerpo guarda lo que la mente no procesa.",
  "Creemos en la pausa como acto político.",
  "Creemos en escuchar antes de hablar.",
  "Creemos que volver a ti es la mejor decisión que puedes tomar hoy.",
];

export function Manifesto() {
  return (
    <section
      id="manifiesto"
      aria-label="Manifiesto"
      className="relative overflow-hidden bg-ink-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />
      <div className="container-tight relative">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          Manifiesto
        </motion.span>

        <ul className="mt-8 space-y-3 sm:space-y-4">
          {LINES.map((line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="font-display text-2xl leading-tight text-bone/95 sm:text-3xl text-balance"
            >
              {line}
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/30 px-4 py-2 text-xs uppercase tracking-eyebrow text-emerald-glow"
        >
          <span className="size-1.5 rounded-full bg-emerald-brand animate-pulse-soft" />
          Esto es AMARTE
        </motion.p>
      </div>
    </section>
  );
}
