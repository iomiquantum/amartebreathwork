// FrequenciesPlayer — 4 frecuencias en vivo usando Web Audio API.
// Cada una mapea a un "problema" del usuario. Preview de 40 segundos.
// El usuario escucha una capa base, se queda con la duda, y entiende que
// estas frecuencias son parte de la musicalización de las sesiones AMARTE.
//
// Implementación: OscillatorNode + GainNode con fade in/out para evitar pops.
// Solo una frecuencia puede sonar a la vez; al cambiar, hace fade-out previo.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Headphones, Volume2, Info } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { SectionHeader } from "./SectionHeader";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";
import { trackFrequencyPlay } from "../lib/tracking";

const DURATION_SEC = 40;
const FADE_SEC = 1.5;
const TARGET_GAIN = 0.18; // Volumen final tras fade-in (suave para auriculares)

export function FrequenciesPlayer() {
  const reduced = usePrefersReducedMotion();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const fadeOutTimeoutRef = useRef<number | null>(null);
  const tickIntervalRef = useRef<number | null>(null);

  const [activeHz, setActiveHz] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(DURATION_SEC);

  // Cleanup global al desmontar
  useEffect(() => {
    return () => stopAll(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ensureContext(): AudioContext {
    if (!audioCtxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function stopAll(immediate = false) {
    if (fadeOutTimeoutRef.current) {
      clearTimeout(fadeOutTimeoutRef.current);
      fadeOutTimeoutRef.current = null;
    }
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    const ctx = audioCtxRef.current;
    const osc = oscillatorRef.current;
    const gain = gainRef.current;
    if (osc && gain && ctx) {
      const now = ctx.currentTime;
      if (immediate) {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);
        try {
          osc.stop(now);
        } catch {
          /* ignore */
        }
      } else {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + FADE_SEC);
        try {
          osc.stop(now + FADE_SEC);
        } catch {
          /* ignore */
        }
      }
    }
    oscillatorRef.current = null;
    gainRef.current = null;
    setActiveHz(null);
    setRemaining(DURATION_SEC);
  }

  function play(hz: number) {
    // Si está sonando otra → fade out + arrancar la nueva
    if (activeHz !== null && activeHz !== hz) {
      stopAll(true);
    }
    if (activeHz === hz) {
      // Click sobre la activa → stop
      stopAll();
      return;
    }

    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = hz;

    // Fade in suave
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(TARGET_GAIN, now + FADE_SEC);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);

    oscillatorRef.current = osc;
    gainRef.current = gain;
    setActiveHz(hz);
    setRemaining(DURATION_SEC);

    // Track engagement (señal de alta intención)
    trackFrequencyPlay(hz);

    // Tick countdown
    let secsLeft = DURATION_SEC;
    tickIntervalRef.current = window.setInterval(() => {
      secsLeft -= 1;
      setRemaining(secsLeft);
      if (secsLeft <= 0) {
        stopAll(); // fade out
      }
    }, 1000);

    // Auto-stop con fade-out al final de los 40s
    fadeOutTimeoutRef.current = window.setTimeout(() => {
      const endCtx = audioCtxRef.current;
      const endGain = gainRef.current;
      const endOsc = oscillatorRef.current;
      if (endCtx && endGain && endOsc) {
        const t = endCtx.currentTime;
        endGain.gain.cancelScheduledValues(t);
        endGain.gain.setValueAtTime(endGain.gain.value, t);
        endGain.gain.linearRampToValueAtTime(0, t + FADE_SEC);
        try {
          endOsc.stop(t + FADE_SEC);
        } catch {
          /* ignore */
        }
      }
    }, (DURATION_SEC - FADE_SEC) * 1000);
  }

  return (
    <section
      id="frecuencias"
      aria-label="Prueba las frecuencias"
      className="relative isolate overflow-hidden bg-ink-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />

      <div className="container-x relative">
        <SectionHeader
          eyebrow="Sonido · 4 frecuencias"
          title="Escucha una capa,"
          highlight="entiende el viaje."
          subtitle="Cada experiencia integra capas de frecuencias diseñadas para distintos estados. Aquí puedes probar 4, una por cada cosa que tu cuerpo pide. 40 segundos cada una. Idealmente con audífonos."
        />

        {/* Recomendación auriculares */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-full border border-emerald-brand/20 bg-emerald-deep/15 px-5 py-3 text-xs text-bone/85"
        >
          <Headphones className="size-4 flex-shrink-0 text-emerald-glow" strokeWidth={1.6} />
          <span>Usa auriculares para sentir mejor cada capa. Volumen medio-bajo.</span>
        </motion.div>

        {/* Grid de frecuencias */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {siteConfig.frequencies.map((f, i) => {
            const isActive = activeHz === f.hz;
            const isGold = f.color === "gold";
            return (
              <motion.div
                key={f.hz}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-3xl border p-6 transition-all sm:p-7 ${
                  isActive
                    ? "border-emerald-brand/50 bg-emerald-deep/40 shadow-glow-emerald-strong"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                }`}
              >
                {/* Pulsing background cuando está activa */}
                {isActive && !reduced && (
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`pointer-events-none absolute -inset-8 rounded-full blur-3xl ${
                      isGold ? "bg-gold-warm/20" : "bg-emerald-brand/25"
                    }`}
                  />
                )}

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`font-display text-5xl leading-none tabular-nums sm:text-6xl ${
                          isGold ? "text-gold-warm" : "text-emerald-glow"
                        }`}
                      >
                        {f.hz}
                      </p>
                      <p className="mt-1.5 text-xs sm:text-[10px] uppercase tracking-eyebrow text-muted">
                        Hertz
                      </p>
                    </div>

                    {/* Play button */}
                    <button
                      type="button"
                      onClick={() => play(f.hz)}
                      aria-label={isActive ? `Detener ${f.label}` : `Reproducir ${f.label} 40 segundos`}
                      aria-pressed={isActive}
                      className={`group grid size-14 flex-shrink-0 place-items-center rounded-full transition-all ${
                        isActive
                          ? "bg-emerald-brand text-ink-900 shadow-glow-emerald-strong"
                          : isGold
                          ? "bg-gold-warm/15 text-gold-warm hover:bg-gold-warm/25"
                          : "bg-emerald-brand/15 text-emerald-glow hover:bg-emerald-brand/25"
                      }`}
                    >
                      {isActive ? (
                        <Pause className="size-5" strokeWidth={2} />
                      ) : (
                        <Play className="size-5 translate-x-0.5" strokeWidth={2} />
                      )}
                    </button>
                  </div>

                  <p className={`mt-5 text-base font-medium ${isGold ? "text-gold-soft" : "text-emerald-glow"}`}>
                    {f.problem}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-bone/75">{f.benefit}</p>

                  {/* Indicador activo */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 flex items-center justify-between rounded-xl border border-emerald-brand/30 bg-ink/40 px-4 py-3 text-xs"
                      >
                        <span className="flex items-center gap-2 text-bone/80">
                          <Volume2 className="size-3.5 text-emerald-brand" />
                          Sonando · queda {remaining}s
                        </span>
                        <div className="flex h-3 items-end gap-0.5">
                          {Array.from({ length: 12 }).map((_, b) => (
                            <motion.span
                              key={b}
                              animate={
                                reduced
                                  ? { height: "30%" }
                                  : { height: ["30%", "100%", "30%"] }
                              }
                              transition={{
                                duration: 0.8 + b * 0.05,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: b * 0.05,
                              }}
                              className="w-0.5 rounded-full bg-emerald-glow"
                              style={{ minHeight: 3 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer + Tease */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 text-center sm:p-7"
        >
          <Info className="mx-auto size-5 text-emerald-glow" strokeWidth={1.6} />
          <p className="mt-3 font-display text-lg text-bone leading-snug text-balance">
            Esto es solo <em className="not-italic text-emerald-glow">una capa base.</em>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-bone/75 text-balance">
            En las experiencias AMARTE estas frecuencias se entrelazan con paisajes sonoros,
            ambientes diseñados, respiración guiada y la energía del grupo. Lo que sientes
            aquí es apenas <strong className="text-bone">la primera capa</strong> del viaje completo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
