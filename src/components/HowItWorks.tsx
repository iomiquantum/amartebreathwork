import { motion } from "framer-motion";
import { DoorOpen, Headphones, Wind, Waves, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    n: "01",
    icon: DoorOpen,
    title: "Llegas y bajas el ritmo",
    body: "Te recibimos en un ambiente preparado para desconectarte del ruido exterior.",
  },
  {
    n: "02",
    icon: Headphones,
    title: "Te colocas los audífonos",
    body: "La experiencia auditiva te envuelve con guía, sonido y frecuencias.",
  },
  {
    n: "03",
    icon: Wind,
    title: "Respiras con guía",
    body: "Una secuencia de respiración consciente te acompaña paso a paso.",
  },
  {
    n: "04",
    icon: Waves,
    title: "Entras en el viaje sonoro",
    body: "Paisajes sonoros, música y frecuencias acompañan el proceso interno.",
  },
  {
    n: "05",
    icon: Sparkles,
    title: "Integras y vuelves",
    body: "Cerramos suavemente para que regreses con calma, claridad y presencia.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Cómo funciona"
          title="Cinco pasos para una"
          highlight="pausa real."
          subtitle="Cada sesión está pensada como un arco: entras saturado, te dejas llevar, y vuelves con menos peso encima."
        />

        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-brand/0 via-emerald-brand/40 to-emerald-brand/0 sm:block lg:left-1/2" />

          <ol className="space-y-10 sm:space-y-14">
            {steps.map(({ n, icon: Icon, title, body }, i) => {
              const isRight = i % 2 === 1;
              return (
                <motion.li
                  key={n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8 lg:gap-12"
                >
                  {/* Badge */}
                  <div
                    className={`relative z-10 ${
                      isRight ? "lg:order-2 lg:ml-auto" : ""
                    } sm:flex-shrink-0`}
                  >
                    <div className="flex size-12 items-center justify-center rounded-full border border-emerald-brand/40 bg-ink-900 text-emerald-glow shadow-glow-emerald">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`card-dark group relative w-full p-6 sm:p-7 lg:max-w-xl ${
                      isRight ? "lg:mr-auto" : "lg:ml-auto"
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-3xl text-emerald-brand/70">{n}</span>
                      <h3 className="text-xl font-semibold text-bone sm:text-2xl">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-3 text-bone/70 leading-relaxed">{body}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
