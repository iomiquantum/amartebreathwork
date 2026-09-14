import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

const BAR_COUNT = 48;

export function AudioWavePreview() {
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const valuesRef = useRef<number[]>(new Array(BAR_COUNT).fill(0.2));
  const [, force] = useState(0);

  useEffect(() => {
    if (!playing || reduced) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      valuesRef.current = new Array(BAR_COUNT).fill(0.2);
      force((v) => v + 1);
      return;
    }
    let t = 0;
    const tick = () => {
      t += 0.04;
      // Multi-frequency synthesis for organic feel
      valuesRef.current = valuesRef.current.map((_, i) => {
        const phase = i / BAR_COUNT;
        const f1 = Math.sin(t + phase * 6) * 0.5 + 0.5;
        const f2 = Math.sin(t * 1.7 + phase * 12) * 0.3;
        const f3 = Math.sin(t * 0.6 + phase * 3) * 0.2;
        const env = Math.sin(phase * Math.PI); // edge fade
        return Math.max(0.1, (f1 + f2 + f3) * env);
      });
      force((v) => v + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, reduced]);

  return (
    <section
      id="sonido"
      aria-label="Cómo suena"
      className="relative bg-ink-900 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-40" />
      <div className="container-tight relative">
        <div className="text-center">
          <span className="eyebrow">Vista previa</span>
          <h2 className="h-display mt-4 text-3xl sm:text-4xl text-balance">
            Una idea de{" "}
            <span className="bg-gradient-to-r from-emerald-brand to-gold-warm bg-clip-text text-transparent">
              cómo suena.
            </span>
          </h2>
          <p className="lede mx-auto mt-4 max-w-xl text-balance">
            Frecuencias, paisajes sonoros y respiración guiada se entretejen en una
            atmósfera que envuelve. La sesión real es presencial — esto es solo una
            sugerencia visual.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="gradient-border relative mt-12 overflow-hidden rounded-3xl bg-ink p-6 sm:p-10"
        >
          <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />

          {/* Waveform */}
          <div className="relative flex h-40 items-center justify-center gap-[3px] sm:h-52 sm:gap-1">
            {valuesRef.current.map((v, i) => (
              <span
                key={i}
                className="block w-[3px] rounded-full bg-gradient-to-t from-emerald-brand via-emerald-glow to-gold-warm transition-[height] duration-100 sm:w-[4px]"
                style={{
                  height: `${Math.max(8, v * 100)}%`,
                  opacity: 0.55 + v * 0.45,
                  filter: playing ? "drop-shadow(0 0 6px rgba(0,200,150,0.5))" : "none",
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="relative mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-emerald-brand px-5 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
              aria-pressed={playing}
              aria-label={playing ? "Pausar visualización" : "Iniciar visualización"}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
              {playing ? "Pausar" : "Visualizar"}
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-eyebrow text-muted">
              <Volume2 className="size-3.5" />
              {playing ? "Sonando…" : "En pausa"}
            </div>
          </div>

          <p className="relative mt-5 text-center text-xs sm:text-[11px] text-muted">
            Esta es una representación visual. El audio real solo se vive en la sesión.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
