import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
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

// Narrativa visual: problema → decisión → inmersión → transformación
// `base` sin extensión: cada slide tiene variantes .avif / .webp / .jpg
// (JPG como fallback universal). Alts originales conservados.
const HERO_SLIDES = [
  {
    base: "/hero/slide-01",
    alt: "Mujer con manos en las sienes, expresión de tensión y agotamiento",
    caption: "Llegas cargado.",
  },
  {
    base: "/hero/slide-02",
    alt: "Persona con mano sobre el pecho durante sesión inmersiva AMARTE",
    caption: "Te sientas. Respiras.",
  },
  {
    base: "/hero/slide-03",
    alt: "Grupo en sillones reclinables en sesión AMARTE con audífonos verdes brillando",
    caption: "El sonido te envuelve.",
  },
  {
    base: "/hero/slide-04",
    alt: "Mujer joven con audífonos AMARTE mirando hacia arriba, expresión luminosa de transformación",
    caption: "Vuelves a ti.",
  },
];

function HeroSlider({ reduced }: { reduced: boolean }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, [reduced]);

  const slide = HERO_SLIDES[idx];

  // Movimiento reducido: un solo <picture> estático, sin JS de animación.
  // El navegador elige avif > webp > jpg sin descargar triples.
  // Los dots siguen funcionando (cambian la imagen sin animar).
  if (reduced) {
    return (
      <>
        <picture className="absolute inset-0 size-full">
          <source type="image/avif" srcSet={`${slide.base}.avif`} />
          <source type="image/webp" srcSet={`${slide.base}.webp`} />
          <img
            src={`${slide.base}.jpg`}
            alt={slide.alt}
            width={800}
            height={1000}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
        <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center px-4">
          <span className="rounded-full border border-white/15 bg-ink-900/70 px-4 py-1.5 font-display text-sm text-bone backdrop-blur-md drop-shadow-lg sm:text-base">
            {slide.caption}
          </span>
        </div>
        <div className="absolute inset-x-0 -bottom-7 z-10 flex justify-center gap-2">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.base}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === idx}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <span
                aria-hidden
                className={`h-1.5 rounded-full ${
                  i === idx ? "w-8 bg-emerald-brand" : "w-1.5 bg-bone/30 hover:bg-bone/50"
                }`}
              />
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="sync">
        {/* LCP: primer slide con fetchpriority high + dimensiones explícitas;
            el resto carga diferida. <picture> con fallback JPG.
            initial={false} en el primer slide: pinta sin esperar a motion. */}
        <motion.picture
          key={slide.base}
          initial={idx === 0 ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 size-full"
        >
          <source type="image/avif" srcSet={`${slide.base}.avif`} />
          <source type="image/webp" srcSet={`${slide.base}.webp`} />
          <img
            src={`${slide.base}.jpg`}
            alt={slide.alt}
            width={800}
            height={1000}
            fetchPriority={idx === 0 ? "high" : "low"}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </motion.picture>
      </AnimatePresence>

      {/* Caption rotating bottom-center */}
      <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={slide.caption}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
            className="rounded-full border border-white/15 bg-ink-900/70 px-4 py-1.5 font-display text-sm text-bone backdrop-blur-md drop-shadow-lg sm:text-base"
          >
            {slide.caption}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Dots indicators */}
      <div className="absolute inset-x-0 -bottom-7 z-10 flex justify-center gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.base}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={i === idx}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center"
          >
            <span
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === idx ? "w-8 bg-emerald-brand" : "w-1.5 bg-bone/30 hover:bg-bone/50"
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}

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
          {/* Copy: revelado en CSS (.hero-reveal) para pintar el H1 con el
              primer paint sin esperar al JS de framer-motion. Con
              prefers-reduced-motion el contenido queda visible al instante. */}
          <div className="lg:col-span-7">
            <span className="eyebrow hero-reveal">{siteConfig.heroEyebrow}</span>

            <h1 className="h-display hero-reveal mt-5 text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl text-balance" style={{ "--d": "0.1s" } as CSSProperties}>
              {siteConfig.heroTitle}
            </h1>

            <div className="hero-reveal mt-6" style={{ "--d": "0.2s" } as CSSProperties}>
              <HookRotator />
            </div>

            <p className="lede hero-reveal mt-5 max-w-xl" style={{ "--d": "0.3s" } as CSSProperties}>
              {siteConfig.heroParagraph}
            </p>

            <div
              className="hero-reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ "--d": "0.4s" } as CSSProperties}
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
            </div>

            <p className="hero-reveal mt-4 max-w-md text-sm text-muted" style={{ "--d": "0.6s" } as CSSProperties}>
              {siteConfig.ctaMicrocopy}
            </p>

            <div
              className="hero-reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone/70"
              style={{ "--d": "0.55s" } as CSSProperties}
            >
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-brand animate-pulse-soft" />
                {siteConfig.heroSchedule}
              </span>
            </div>
          </div>

          {/* Visual side */}
          <div className="lg:col-span-5">
            <div
              className="hero-reveal relative mx-auto aspect-[4/5] w-full max-w-md"
              style={{ "--d": "0.2s" } as CSSProperties}
            >
              {/* Frame with REAL slider */}
              <div className="absolute inset-0 rounded-[2rem] gradient-border bg-ink-900 overflow-hidden">
                <HeroSlider reduced={reduced} />

                {/* Gradient overlays for legibility (above images, below labels) */}
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-noise opacity-15 mix-blend-overlay" />

                {/* Corner labels — constant */}
                <div className="absolute left-5 top-5 z-10 flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-bone/85 drop-shadow-lg">
                  <Sparkles className="size-3 text-gold-warm" />
                  Sesión inmersiva
                </div>
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between text-[10px] uppercase tracking-eyebrow text-bone/80 drop-shadow-lg">
                  <span>Quito · Ec</span>
                  <span className="text-emerald-brand"><span className="inline-block size-1.5 rounded-full bg-emerald-brand mr-1 animate-pulse-soft" />en preparación</span>
                </div>
              </div>

              {/* Floating chips — clamp inside frame en mobile (iPhone SE), libera en sm+.
                  Con reduced-motion son estáticos (sin flotación infinita). */}
              {reduced ? (
                <>
                  <div className="absolute left-2 top-8 flex max-w-[60%] items-center gap-2 rounded-full border border-white/10 bg-ink-900/80 px-3 py-1.5 text-xs text-bone backdrop-blur sm:left-auto sm:-left-4 sm:top-10 sm:max-w-none">
                    <Wind className="size-3.5 shrink-0 text-emerald-brand" />
                    <span className="truncate">Respiración guiada</span>
                  </div>
                  <div className="absolute right-2 bottom-20 flex max-w-[55%] items-center gap-2 rounded-full border border-white/10 bg-ink-900/80 px-3 py-1.5 text-xs text-bone backdrop-blur sm:right-auto sm:-right-2 sm:bottom-16 sm:max-w-none">
                    <Waves className="size-3.5 shrink-0 text-gold-warm" />
                    <span className="truncate">Frecuencias</span>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
