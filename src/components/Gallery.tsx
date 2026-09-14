import { motion } from "framer-motion";
import { Manifestos } from "./Manifestos";

// `base` sin extensión: cada foto tiene variantes .avif / .webp / .jpg
// (JPG como fallback universal). Alts originales conservados.
const GALLERY = [
  {
    base: "/gallery/01-soltarla",
    alt: "Hombre con audífonos AMARTE brillando en verde, manos sobre el pecho, ojos cerrados",
    label: "Soltar",
    mood: "Intimidad sonora",
  },
  {
    base: "/gallery/02-descansar",
    alt: "Hombre joven con gorra negra y audífonos AMARTE en primer plano lateral",
    label: "Descansar",
    mood: "Quietud cinematográfica",
  },
  {
    base: "/gallery/03-comunidad",
    alt: "Grupo de personas en sesión grupal con manos en pecho y audífonos AMARTE brillando",
    label: "Comunidad",
    mood: "Respiración compartida",
  },
  {
    base: "/gallery/04-espacio",
    alt: "Sesión de breathwork en loft con plantas tropicales y luz cálida",
    label: "Espacio",
    mood: "Atmósfera viva",
  },
  {
    base: "/gallery/05-conexion",
    alt: "Mujer y hombre con manos sobre el pecho durante sesión inmersiva",
    label: "Conexión",
    mood: "Sistema nervioso en calma",
  },
  {
    base: "/gallery/06-transformacion",
    alt: "Mujer con audífonos AMARTE brillando en verde, expresión de paz profunda",
    label: "Transformación",
    mood: "Volver al centro",
  },
];

export function Gallery() {
  return (
    <>
      <Manifestos />

      <section
        id="atmosfera"
        aria-label="Atmósfera"
        className="relative bg-ink py-20 sm:py-24"
      >
        <div className="container-x">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">Atmósfera</span>
              <h2 className="h-display mt-3 text-2xl sm:text-3xl">
                Una pausa que también se ve.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-muted sm:block">
              Cada detalle del espacio está pensado para acompañar el viaje.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-4">
            {GALLERY.map((item, i) => (
              <motion.figure
                key={item.base}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900"
              >
                {/* Bajo el fold: loading lazy + <picture> con fallback JPG */}
                <picture className="absolute inset-0 size-full">
                  <source type="image/avif" srcSet={`${item.base}.avif`} />
                  <source type="image/webp" srcSet={`${item.base}.webp`} />
                  <img
                    src={`${item.base}.jpg`}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    width={1000}
                    height={1250}
                    className="absolute inset-0 size-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                </picture>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60"
                />

                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 text-[10px] uppercase tracking-eyebrow text-bone/85 sm:p-4">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-emerald-brand/80">{item.mood}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
