import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";
import { useWhatsappCTA } from "../lib/whatsapp";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

// Patrón 4-4-4 simplificado: inhala, sostén, exhala
const PHASES = [
  { label: "Inhala", duration: 4000, scale: 1.5 },
  { label: "Sostén", duration: 4000, scale: 1.5 },
  { label: "Exhala", duration: 4000, scale: 0.85 },
];

function BreathPacer() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % PHASES.length), PHASES[idx].duration);
    return () => clearTimeout(t);
  }, [idx, reduced]);

  const phase = PHASES[idx];
  return (
    <div className="mx-auto mt-12 flex flex-col items-center gap-4">
      <div className="relative grid size-32 place-items-center sm:size-40">
        <motion.div
          animate={
            reduced
              ? { scale: 1 }
              : { scale: phase.scale, opacity: phase.label === "Exhala" ? 0.5 : 0.9 }
          }
          transition={{ duration: phase.duration / 1000, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-emerald-brand/40 bg-emerald-deep/30 backdrop-blur"
        />
        <motion.div
          animate={reduced ? { scale: 1 } : { scale: phase.scale * 0.6 }}
          transition={{ duration: phase.duration / 1000, ease: "easeInOut" }}
          className="size-12 rounded-full bg-emerald-brand shadow-glow-emerald sm:size-16"
        />
      </div>
      <p className="font-display text-sm uppercase tracking-eyebrow text-emerald-brand">
        {reduced ? "Respira a tu ritmo" : phase.label}
      </p>
    </div>
  );
}

const lines = [
  "Cierra los ojos.",
  "El mundo baja el volumen.",
  "Tu respiración vuelve.",
  "El sonido te envuelve.",
  "Y poco a poco,",
  "vuelves a ti.",
];

export function CinematicQuote() {
  const wa = useWhatsappCTA("cinematic_quote");
  return (
    <section
      id="cinematica"
      className="relative isolate overflow-hidden bg-ink py-32 sm:py-40"
    >
      {/* Layered atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink-900 to-ink" />
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />

      {/* Animated waveform */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2"
        viewBox="0 0 1440 400"
        aria-hidden
      >
        <defs>
          <linearGradient id="cin-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C896" stopOpacity="0" />
            <stop offset="50%" stopColor="#00C896" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${200 + i * 6} Q360 ${120 + i * 10} 720 ${200 + i * 6} T1440 ${200 + i * 6}`}
            stroke="url(#cin-grad)"
            strokeWidth="1"
            fill="none"
            opacity={0.5 - i * 0.08}
          />
        ))}
      </svg>

      <div className="container-tight relative text-center">
        <div className="space-y-3 sm:space-y-4">
          {lines.map((line, i) => (
            <motion.p
              key={line + i}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.18 }}
              className="font-display text-3xl leading-tight text-bone sm:text-5xl text-balance"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <BreathPacer />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12"
        >
          <CTAButton {...wa}>
            Quiero vivir la experiencia
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
}
