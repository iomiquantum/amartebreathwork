import { motion } from "framer-motion";

const MANIFIESTOS = [
  {
    src: "/manifiestos/encontrarnos.jpg",
    alt: "Pareja con audífonos AMARTE en sesión de breathwork, ella sonriendo con manos en pecho, él en lágrimas",
    title: "Encontrarnos",
  },
  {
    src: "/manifiestos/respirar-juntos.jpg",
    alt: "Vista aérea de un círculo de personas con audífonos AMARTE meditando en sesión grupal",
    title: "Respirar juntos",
  },
  {
    src: "/manifiestos/seguro-y-paz.jpg",
    alt: "Mujer con audífonos AMARTE brillando en verde, lágrima de paz en el rostro",
    title: "Seguro y en paz",
  },
];

export function Manifestos() {
  return (
    <section
      id="manifiestos"
      aria-label="Manifiestos visuales"
      className="relative bg-ink py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-900 to-transparent"
      />

      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Manifiestos</span>
          <h2 className="h-display mt-3 text-2xl sm:text-3xl lg:text-4xl">
            Lo que pasa <span className="text-emerald-brand">adentro</span> también se ve.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            No es una clase, ni una conferencia. Es una experiencia inmersiva que
            tu sistema nervioso recuerda mucho después de salir del espacio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {MANIFIESTOS.map((item, i) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-900"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                width={1000}
                height={1250}
                className="absolute inset-0 size-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-brand/40 to-transparent"
              />
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 text-center text-xs uppercase tracking-eyebrow text-bone/40">
          · Experiencias reales · AMARTE Breathwork ·
        </p>
      </div>
    </section>
  );
}
