import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

const STORAGE_KEY = "amarte_splash_seen";

export function Splash() {
  const reduced = usePrefersReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    if (reduced) return false;
    return localStorage.getItem(STORAGE_KEY) !== "1";
  });

  useEffect(() => {
    if (!show) return;
    localStorage.setItem(STORAGE_KEY, "1");
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), 1400);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="relative mx-auto grid size-20 place-items-center"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-brand/30 blur-xl" />
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="relative size-7 rounded-full bg-emerald-brand shadow-glow-emerald"
              />
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 1.4, delay: 0.2 + i * 0.4, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-emerald-brand/50"
                />
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-7 font-display text-2xl tracking-tight text-bone"
            >
              {siteConfig.brandName}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.6, delay: 0.7 }}
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
