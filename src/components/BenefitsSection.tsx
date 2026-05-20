import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const benefits = [
  "Soltar estrés acumulado",
  "Calmar la mente",
  "Relajar el cuerpo",
  "Respirar con más conciencia",
  "Bajar la tensión interna",
  "Sentirte más presente",
  "Dormir con mayor tranquilidad",
  "Salir del modo automático",
  "Reconectar contigo",
  "Crear un ritual de pausa cada 15 días",
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Una noche para volver a ti"
          title="Bajar el ruido"
          highlight="y respirar de nuevo."
          subtitle="Esta experiencia puede ayudarte a crear una pausa profunda y a reconectar con sensaciones de calma, presencia y claridad."
        />

        <div className="mt-14 grid gap-3 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] px-5 py-4 transition-colors duration-300 hover:border-emerald-brand/30 hover:bg-white/[0.03]"
            >
              <span className="grid size-8 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40 text-emerald-glow">
                <Check className="size-4" strokeWidth={2.2} />
              </span>
              <span className="text-bone/90">{b}</span>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          Esta experiencia es complementaria. No sustituye atención médica, psicológica
          ni psiquiátrica.
        </p>
      </div>
    </section>
  );
}
