import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { SectionHeader } from "./SectionHeader";

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating ? "fill-gold-warm text-gold-warm" : "text-white/15"
          }`}
          strokeWidth={1.4}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  if (!siteConfig.testimonials?.length) return null;

  return (
    <section id="voces" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Voces"
          title="Lo que se siente"
          highlight="después de la sesión."
          subtitle="Pequeñas frases reales de quienes ya pasaron por la experiencia."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {siteConfig.testimonials.map((t, i) => (
            <motion.figure
              key={t.name + i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="card-dark group relative overflow-hidden p-7"
            >
              <Quote className="absolute right-4 top-4 size-10 text-emerald-brand/10" strokeWidth={1.4} />
              <Stars rating={t.rating ?? 5} />
              <blockquote className="relative mt-4 font-display text-lg leading-relaxed text-bone/95 text-balance">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full border border-emerald-brand/30 bg-emerald-deep/40 font-display text-xs text-emerald-glow">
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-medium text-bone">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Voces compartidas con consentimiento.
        </p>
      </div>
    </section>
  );
}
