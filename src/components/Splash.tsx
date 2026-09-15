import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

const STORAGE_KEY = "amarte_splash_seen";
// Presupuesto 4G: visible 750ms + salida 200ms = 950ms (<1s de bloqueo).
// El contenido de la página pinta por debajo desde el primer paint:
// el splash es solo un overlay con marca, jamás una pantalla en blanco.
const DISPLAY_MS = 750;
const EXIT_S = 0.2;

function shouldSkipSplash(): boolean {
  if (typeof window === "undefined") return true;
  // Lectura síncrona (sin esperar al efecto del hook): evita un flash
  // del splash en usuarios con movimiento reducido.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (localStorage.getItem(STORAGE_KEY) === "1") return true;
  // Ahorro de datos o red lenta: no bloquear, ir directo al contenido.
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return true;
  return false;
}

export function Splash() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(() => !shouldSkipSplash());
  // Derivado en render (sin setState en efectos): con reduced-motion
  // el splash nunca se muestra, sin renders en cascada.
  const visible = show && !reduced;

  useEffect(() => {
    if (!visible) return;
    localStorage.setItem(STORAGE_KEY, "1");
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), DISPLAY_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShow(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_S }}
          onClick={() => setShow(false)}
          role="presentation"
          className="fixed inset-0 z-[80] grid place-items-center bg-ink"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative mx-auto grid size-20 place-items-center"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-brand/30 blur-xl" />
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="relative size-7 rounded-full bg-emerald-brand shadow-glow-emerald"
              />
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.75, delay: 0.1 + i * 0.25, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-emerald-brand/50"
                />
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-7 font-display text-2xl tracking-tight text-bone"
            >
              {siteConfig.brandName}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-1 text-xs uppercase tracking-eyebrow text-emerald-brand"
            >
              {siteConfig.tagline}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
