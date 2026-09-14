import { motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";

export function OriginStory() {
  const o = siteConfig.origin;
  return (
    <section
      id="origen"
      aria-label="Origen"
      className="relative overflow-hidden bg-ink py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-40" />
      <div className="container-x relative">
        <div className="grid items-start gap-14 lg:grid-cols-12">
          {/* Sticky title side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-28 lg:col-span-5"
          >
            <span className="eyebrow">{o.eyebrow}</span>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
              {o.title}
            </h2>

            {/* Real photo */}
            <div className="relative mt-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl gradient-border bg-ink-900">
              {/* Bajo el fold: loading lazy + <picture> con fallback JPG */}
              <picture className="absolute inset-0 size-full">
                <source type="image/avif" srcSet="/sections/origin.avif" />
                <source type="image/webp" srcSet="/sections/origin.webp" />
                <img
                  src="/sections/origin.jpg"
                  alt="Grupo en sesión AMARTE con sillones reclinables, audífonos verdes brillando en ambiente cálido"
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
              </picture>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-xs sm:text-[10px] uppercase tracking-eyebrow text-bone/85 drop-shadow-lg">
                <span className="size-1.5 rounded-full bg-emerald-brand animate-pulse-soft" />
                Una historia honesta
              </div>
            </div>
          </motion.div>

          {/* Paragraphs */}
          <div className="lg:col-span-7">
            <ol className="relative space-y-10 border-l border-white/[0.06] pl-8 sm:space-y-12">
              {o.paragraphs.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="relative"
                >
                  <span className="absolute -left-[2.1rem] top-1 grid size-7 place-items-center rounded-full border border-emerald-brand/40 bg-ink-900 font-display text-xs sm:text-[10px] text-emerald-glow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed text-bone/90 sm:text-xl text-balance">
                    {p}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
