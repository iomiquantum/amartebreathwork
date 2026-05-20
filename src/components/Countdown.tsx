import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s, finished: ms === 0 };
}

interface Props {
  compact?: boolean;
}

export function Countdown({ compact = false }: Props) {
  const target = siteConfig.nextDateISO ? new Date(siteConfig.nextDateISO).getTime() : null;
  const [now, setNow] = useState(diff(target ?? 0));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) {
    return (
      <div
        className={`flex items-center gap-3 ${
          compact ? "text-sm" : "text-base"
        } text-bone/85`}
      >
        <span className="size-1.5 rounded-full bg-emerald-brand animate-pulse-soft" />
        <span className="font-display tracking-tight">Próxima fecha · Por anunciar</span>
      </div>
    );
  }

  if (now.finished) {
    return (
      <div className="text-emerald-glow font-display">
        Sesión en curso — entra al grupo para la próxima.
      </div>
    );
  }

  const cells = [
    { label: "Días", value: now.d },
    { label: "Hrs", value: now.h },
    { label: "Min", value: now.m },
    { label: "Seg", value: now.s },
  ];

  return (
    <div className={`grid ${compact ? "grid-cols-4 gap-2" : "grid-cols-4 gap-3"}`}>
      {cells.map((c) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-white/10 bg-ink/60 px-2 py-3 text-center backdrop-blur sm:px-3 sm:py-4"
        >
          <p className="font-display text-2xl tabular-nums text-bone sm:text-3xl">
            {String(c.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-eyebrow text-muted">
            {c.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
