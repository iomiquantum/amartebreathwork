import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

export function HookRotator() {
  const [idx, setIdx] = useState(0);
  const reduced = usePrefersReducedMotion();
  const hooks = siteConfig.heroHooks ?? [];

  useEffect(() => {
    if (reduced || hooks.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % hooks.length), 5500);
    return () => clearInterval(t);
  }, [reduced, hooks.length]);

  if (!hooks.length) return null;

  return (
    <div className="relative h-[3.5em] sm:h-[3.25em]">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.6 }}
          className="absolute inset-x-0 max-w-xl text-lg sm:text-xl text-balance"
        >
          {hooks[idx].split(".").map((part, i, arr) => {
            const trimmed = part.trim();
            if (!trimmed) return null;
            const isFirst = i === 0;
            return (
              <span key={i}>
                <span className={isFirst ? "text-emerald-brand" : "text-bone/85"}>
                  {trimmed}.
                </span>
                {i < arr.length - 1 ? " " : ""}
              </span>
            );
          })}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
