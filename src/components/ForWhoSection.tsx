import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const yes = [
  "Sientes que tu mente no se apaga.",
  "Vives con estrés o tensión constante.",
  "Te cuesta descansar profundamente.",
  "Sientes el cuerpo cargado o acelerado.",
  "Necesitas una pausa real.",
  "Quieres reconectar contigo sin tener que hablar demasiado.",
  "Buscas una experiencia de bienestar diferente.",
  "Te interesan la respiración, el sonido y las frecuencias.",
];

const noNeed = [
  "Experiencia previa.",
  "Saber meditar.",
  "Estar en excelente condición física.",
  "Haber hecho breathwork antes.",
];

const onlyNeed = ["Llegar.", "Respirar.", "Escuchar.", "Permitirte pausar."];

export function ForWhoSection() {
  return (
    <section id="para-quien" className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-60" />
      <div className="container-x relative">
        <SectionHeader
          eyebrow="Para quién es"
          title="Esta experiencia es para ti"
          highlight="si te reconoces."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Yes */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="card-dark p-7 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-bone">Te sientes identificado si:</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {yes.map((y) => (
                <li key={y} className="flex items-start gap-3">
                  <span className="mt-1 grid size-5 flex-shrink-0 place-items-center rounded-full bg-emerald-brand/15 text-emerald-glow">
                    <Check className="size-3" strokeWidth={2.4} />
                  </span>
                  <span className="text-sm text-bone/85 leading-relaxed">{y}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* No need / Only need */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card-dark p-6"
            >
              <h4 className="text-sm font-semibold uppercase tracking-eyebrow text-bone/60">
                No necesitas
              </h4>
              <ul className="mt-3 space-y-2">
                {noNeed.map((n) => (
                  <li key={n} className="flex items-center gap-3 text-sm text-bone/80">
                    <X className="size-4 text-muted" strokeWidth={2} />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="gradient-border rounded-2xl p-6"
            >
              <h4 className="text-sm font-semibold uppercase tracking-eyebrow text-emerald-brand">
                Solo necesitas
              </h4>
              <ul className="mt-3 space-y-2">
                {onlyNeed.map((n) => (
                  <li key={n} className="flex items-center gap-3 text-sm text-bone">
                    <Check className="size-4 text-emerald-glow" strokeWidth={2.2} />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
