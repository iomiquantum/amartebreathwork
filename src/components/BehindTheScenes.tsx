import { motion } from "framer-motion";
import { Music4, Lightbulb, Radio, ScrollText } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const STEPS = [
  {
    n: "01",
    icon: ScrollText,
    title: "Diseño narrativo",
    body: "Cada sesión tiene una intención: soltar, integrar, abrir. Desde ahí escribimos la curva emocional del viaje completo.",
  },
  {
    n: "02",
    icon: Music4,
    title: "Capas sonoras",
    body: "Construimos paisajes sonoros con stems originales, voces guías, drones y texturas que respiran con la respiración real.",
  },
  {
    n: "03",
    icon: Radio,
    title: "Frecuencias específicas",
    body: "Seleccionamos rangos de frecuencia que invitan a estados de calma. No prometemos magia — son herramientas que acompañan.",
  },
  {
    n: "04",
    icon: Lightbulb,
    title: "Ambiente físico",
    body: "Iluminación tenue, temperatura cuidada, distancia entre personas, silencio antes y después. Todo el cuerpo importa.",
  },
];

export function BehindTheScenes() {
  return (
    <section
      id="detras"
      aria-label="Cómo se construye una sesión"
      className="relative bg-ink py-24 sm:py-32"
    >
      <div className="container-x">
        <SectionHeader
          eyebrow="Behind the scenes"
          title="Cómo se construye"
          highlight="una sesión."
          subtitle="No es improvisar y prender música. Hay un proceso detrás de cada experiencia. Esto es lo que pasa antes de que entres."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-4">
          {STEPS.map(({ n, icon: Icon, title, body }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="card-dark group relative overflow-hidden p-6"
            >
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-emerald-brand/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-brand/10" />
              <span className="font-display text-2xl text-emerald-brand/50">{n}</span>
              <Icon className="mt-3 size-6 text-emerald-glow" strokeWidth={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-bone">{title}</h3>
              <p className="mt-2 text-sm text-bone/70 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs italic text-muted">
          Cada sesión es distinta. Mismo proceso, viaje único.
        </p>
      </div>
    </section>
  );
}
