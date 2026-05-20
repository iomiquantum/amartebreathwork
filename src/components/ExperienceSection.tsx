import { motion } from "framer-motion";
import { Headphones, Wind, Waves } from "lucide-react";

export function ExperienceSection() {
  return (
    <section id="experiencia" className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-gold" />
      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6 }}
              className="eyebrow"
            >
              No es una clase
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7 }}
              className="h-display mt-4 text-3xl sm:text-5xl text-balance"
            >
              Es una experiencia{" "}
              <span className="bg-gradient-to-r from-emerald-brand via-emerald-glow to-gold-warm bg-clip-text text-transparent">
                inmersiva.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lede mt-6 max-w-xl"
            >
              AMARTE combina respiración guiada, sonido envolvente, frecuencias y
              paisajes sonoros en una experiencia presencial diseñada para ayudarte a
              volver al cuerpo.
            </motion.p>

            <ul className="mt-8 space-y-4 text-bone/85">
              {[
                "Cierras los ojos.",
                "Te colocas los audífonos.",
                "Respiras.",
                "Escuchas.",
                "Y poco a poco, el ruido externo empieza a bajar.",
              ].map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-baseline gap-3"
                >
                  <span className="size-1.5 rounded-full bg-emerald-brand mt-2.5" />
                  <span>{line}</span>
                </motion.li>
              ))}
            </ul>

            <motion.blockquote
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="mt-10 border-l-2 border-gold-warm/70 pl-6 font-display text-2xl sm:text-3xl text-bone text-balance"
            >
              “No vienes solo a respirar. Vienes a vivir una experiencia.”
            </motion.blockquote>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
            className="relative lg:col-span-5"
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] gradient-border bg-ink">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep/50 via-ink to-ink-900" />
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

              {/* Concentric grid */}
              <svg className="absolute inset-0 size-full" viewBox="0 0 400 400" aria-hidden>
                {Array.from({ length: 9 }).map((_, i) => (
                  <circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={20 + i * 18}
                    fill="none"
                    stroke="#00C896"
                    strokeOpacity={0.08 + i * 0.015}
                    strokeWidth="1"
                  />
                ))}
              </svg>

              {/* Center */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[Wind, Waves, Headphones].map((Icon, i) => (
                      <div
                        key={i}
                        className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-ink-900/80 backdrop-blur"
                      >
                        <Icon className="size-6 text-emerald-glow" strokeWidth={1.5} />
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="font-display text-xs uppercase tracking-eyebrow text-bone/60">
                      Secuencia
                    </p>
                    <p className="mt-1 font-display text-lg text-bone">
                      Respira · Escucha · Suelta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
