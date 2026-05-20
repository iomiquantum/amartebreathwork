import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

export function GuideSection() {
  const { guide } = siteConfig;
  return (
    <section id="guia" className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-50" />
      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <span className="eyebrow">Quién te guía</span>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
              {guide.name}
            </h2>
            <p className="mt-2 text-sm uppercase tracking-eyebrow text-emerald-brand">
              {guide.role}
            </p>
            <p className="lede mt-6 max-w-xl">{guide.bio}</p>

            {guide.credentials?.length > 0 && (
              <ul className="mt-8 space-y-3">
                {guide.credentials.map((c) => (
                  <li key={c} className="flex items-start gap-3">
                    <span className="mt-1 grid size-5 flex-shrink-0 place-items-center rounded-full bg-emerald-brand/15 text-emerald-glow">
                      <Check className="size-3" strokeWidth={2.4} />
                    </span>
                    <span className="text-sm text-bone/85">{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Portrait placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] gradient-border bg-ink">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep/60 via-ink-900 to-ink" />
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

              {/* Initials monogram */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="font-display text-[7rem] leading-none text-emerald-brand/20">
                    {guide.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-eyebrow text-bone/60">
                    Foto · Por subir
                  </p>
                </div>
              </div>

              {/* Soft frequency lines */}
              <svg className="absolute inset-x-0 bottom-0 w-full" viewBox="0 0 400 80" aria-hidden>
                {Array.from({ length: 4 }).map((_, i) => (
                  <path
                    key={i}
                    d={`M0 ${40 + i * 4} Q100 ${20 + i * 6} 200 ${40 + i * 4} T400 ${40 + i * 4}`}
                    stroke="#00C896"
                    strokeOpacity={0.18 - i * 0.03}
                    strokeWidth="1"
                    fill="none"
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
