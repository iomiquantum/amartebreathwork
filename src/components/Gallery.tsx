import { motion } from "framer-motion";
import { Headphones, Flame, AudioLines, Wind } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

const ICONS = [Headphones, Flame, AudioLines, Wind];
const TINTS = [
  "from-emerald-deep/70 to-ink",
  "from-gold-warm/30 to-ink-900",
  "from-emerald-brand/30 to-ink",
  "from-ink-700 to-ink",
];

export function Gallery() {
  const items = siteConfig.gallery ?? [];
  if (!items.length) return null;

  return (
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            const tint = TINTS[i % TINTS.length];
            return (
              <motion.figure
                key={it.label + i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.06]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tint}`} />
                <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />

                {/* Soft pulsing icon */}
                <div className="absolute inset-0 grid place-items-center">
                  <motion.div
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Icon className="size-12 text-bone/20 transition-colors group-hover:text-emerald-glow/40" strokeWidth={1.2} />
                  </motion.div>
                </div>

                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 text-[10px] uppercase tracking-eyebrow text-bone/70">
                  <span>{it.label}</span>
                  <span className="text-emerald-brand/70">{it.mood}</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
