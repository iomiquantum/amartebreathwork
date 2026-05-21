import { motion } from "framer-motion";
import { Waves, Wind, Sparkles } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { CTAButton } from "./CTAButton";
import { trackWhatsappClick } from "../lib/tracking";
import { scrollToId } from "../lib/utils";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";
import { HookRotator } from "./HookRotator";
import { CursorGlow } from "./CursorGlow";
import { Aurora } from "./Aurora";
import { useWhatsappCTA } from "../lib/whatsapp";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const wa = useWhatsappCTA("hero_primary");
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-ink pb-20 pt-28 sm:pt-32 lg:pb-28"
    >
      {/* Aurora — animated gradient blobs */}
      <Aurora />

      {/* Cursor glow (only desktop, only no reduced-motion) */}
      <CursorGlow />

      {/* Background visuals */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-emerald" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-gold" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120%] bg-noise opacity-[0.35] mix-blend-overlay" />

      {/* Soft frequency lines */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full opacity-30"
        viewBox="0 0 1440 200"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="freq-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C896" stopOpacity="0" />
            <stop offset="50%" stopColor="#00C896" stopOpacity="1" />
            <stop offset="100%" stopColor="#00C896" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${100 + i * 4} Q360 ${60 + i * 6} 720 ${100 + i * 4} T1440 ${
              100 + i * 4
            }`}
            stroke="url(#freq-grad)"
            strokeWidth="1"
            opacity={1 - i * 0.12}
          />
        ))}
      </svg>

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="eyebrow"
            >
              {siteConfig.heroEyebrow}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-display mt-5 text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl text-balance"
            >
              {siteConfig.heroTitle}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6"
            >
              <HookRotator />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lede mt-5 max-w-xl"
            >
              {siteConfig.heroParagraph}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <CTAButton {...wa} fullWidth className="sm:w-auto">
                {siteConfig.ctaPrimary}
              </CTAButton>
              <CTAButton
                href="#how-it-works"
                variant="ghost"
                trailingIcon={false}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("how-it-works");
                  trackWhatsappClick("hero_secondary");
                }}
                fullWidth
                className="sm:w-auto"
              >
                {siteConfig.ctaSecondary}
              </CTAButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-4 max-w-md text-sm text-muted"
            >
              {siteConfig.ctaMicrocopy}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone/70"
            >
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-brand animate-pulse-soft" />
                {siteConfig.heroSchedule}
              </span>
            </motion.div>
          </div>

          {/* Visual side */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative mx-auto aspect-[4/5] w-full max-w-md"
            >
              {/* Frame with REAL photo */}
              <div className="absolute inset-0 rounded-[2rem] gradient-border bg-ink-900 overflow-hidden">
                <img
                  src="/hero/hero-portrait.jpg"
                  alt="Persona en sesión inmersiva AMARTE con audífonos brillando en verde, manos en las sienes en gesto de respiración"
                  width={800}
                  height={1000}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div aria-hidden className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />

                {/* Subtle pulsing ring overlay */}
                {!reduced && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.4], opacity: [0.35, 0] }}
                        transition={{ duration: 5, delay: i * 1.5, repeat: Infinity, ease: "easeOut" }}
                        className="absolute size-32 rounded-full border border-emerald-glow/30"
                      />
                    ))}
                  </div>
                )}

                {/* Corner labels */}
                <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-bone/80 drop-shadow-lg">
                  <Sparkles className="size-3 text-gold-warm" />
                  Sesión inmersiva
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[10px] uppercase tracking-eyebrow text-bone/80 drop-shadow-lg">
                  <span>Quito · Ec</span>
                  <span className="text-emerald-brand"><span className="inline-block size-1.5 rounded-full bg-emerald-brand mr-1 animate-pulse-soft" />en preparación</span>
                </div>
              </div>

              {/* Floating chips — clamp inside frame en mobile (iPhone SE), libera en sm+ */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-2 top-8 flex max-w-[60%] items-center gap-2 rounded-full border border-white/10 bg-ink-900/80 px-3 py-1.5 text-xs text-bone backdrop-blur sm:left-auto sm:-left-4 sm:top-10 sm:max-w-none"
              >
                <Wind className="size-3.5 shrink-0 text-emerald-brand" />
                <span className="truncate">Respiración guiada</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-2 bottom-20 flex max-w-[55%] items-center gap-2 rounded-full border border-white/10 bg-ink-900/80 px-3 py-1.5 text-xs text-bone backdrop-blur sm:right-auto sm:-right-2 sm:bottom-16 sm:max-w-none"
              >
                <Waves className="size-3.5 shrink-0 text-gold-warm" />
                <span className="truncate">Frecuencias</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
