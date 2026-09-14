import { motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";

export function PressStrip() {
  const press = siteConfig.press ?? [];
  if (!press.length) return null;

  return (
    <section
      aria-label="Como visto en"
      className="relative border-y border-white/[0.04] bg-ink py-8"
    >
      <div className="container-x">
        <p className="text-center text-xs sm:text-[10px] uppercase tracking-eyebrow text-muted">
          Mencionados en
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
          {press.map((p, i) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 0.55, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="font-display text-base text-bone transition-opacity duration-300 hover:!opacity-100 sm:text-lg"
            >
              {p}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
