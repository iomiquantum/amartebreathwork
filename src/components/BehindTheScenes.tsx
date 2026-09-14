import { motion } from "framer-motion";
import { Music4, Lightbulb, Radio, ScrollText } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

// `base` sin extensión: cada foto tiene variantes .avif / .webp / .jpg
// (JPG como fallback universal). Alts originales conservados.
const STEPS = [
  {
    n: "01",
    icon: ScrollText,
    title: "Diseño narrativo",
    body: "Cada sesión tiene una intención: soltar, integrar, abrir. Desde ahí escribimos la curva emocional del viaje completo.",
    base: "/sections/bts-01",
    alt: "Sala con candelabros y personas en sesión inmersiva AMARTE",
  },
  {
    n: "02",
    icon: Music4,
    title: "Capas sonoras",
    body: "Construimos paisajes sonoros con stems originales, voces guías, drones y texturas que respiran con la respiración real.",
    base: "/sections/bts-02",
    alt: "Grupo con antifaces y audífonos AMARTE en sesión",
  },
  {
    n: "03",
    icon: Radio,
    title: "Frecuencias específicas",
    body: "Seleccionamos rangos de frecuencia que invitan a estados de calma. No prometemos magia — son herramientas que acompañan.",
    base: "/sections/bts-03",
    alt: "Mujer sonriendo con audífonos AMARTE brillando en verde",
  },
  {
    n: "04",
    icon: Lightbulb,
    title: "Ambiente físico",
    body: "Iluminación tenue, temperatura cuidada, distancia entre personas, silencio antes y después. Todo el cuerpo importa.",
    base: "/sections/bts-04",
    alt: "Hombre en sesión AMARTE con audífonos verdes brillando",
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
          {STEPS.map(({ n, icon: Icon, title, body, base, alt }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="card-dark group relative overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Bajo el fold: loading lazy + <picture> con fallback JPG */}
                <picture className="absolute inset-0 size-full">
                  <source type="image/avif" srcSet={`${base}.avif`} />
                  <source type="image/webp" srcSet={`${base}.webp`} />
                  <img
                    src={`${base}.jpg`}
                    alt={alt}
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                  />
                </picture>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                <span className="absolute left-5 top-4 font-display text-2xl text-emerald-brand drop-shadow-lg">{n}</span>
                <div className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-ink-900/80 backdrop-blur">
                  <Icon className="size-4 text-emerald-glow" strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-bone">{title}</h3>
                <p className="mt-2 text-sm text-bone/70 leading-relaxed">{body}</p>
              </div>
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
