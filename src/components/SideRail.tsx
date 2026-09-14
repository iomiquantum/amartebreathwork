import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scrollToId } from "../lib/utils";

const SECTIONS = [
  { id: "hero", label: "Inicio" },
  { id: "experiencia", label: "Experiencia" },
  { id: "how-it-works", label: "Cómo funciona" },
  { id: "sonido", label: "Sonido" },
  { id: "test", label: "Test" },
  { id: "comparativa", label: "Comparativa" },
  { id: "origen", label: "Origen" },
  { id: "guia", label: "Guía" },
  { id: "voces", label: "Voces" },
  { id: "formato", label: "Formato" },
  { id: "comunidad", label: "Comunidad" },
  { id: "faq", label: "FAQ" },
  { id: "empresas", label: "Empresas" },
];

export function SideRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegación lateral"
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-3 rounded-full border border-white/[0.06] bg-ink-900/40 p-2 backdrop-blur-xl">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToId(s.id)}
                aria-label={`Ir a ${s.label}`}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex h-3 items-center"
              >
                <motion.span
                  animate={{
                    width: isActive ? 18 : 6,
                    backgroundColor: isActive ? "#10E0A8" : "rgba(245,242,234,0.25)",
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="block h-1 rounded-full"
                />
                <span className="absolute right-full mr-3 whitespace-nowrap rounded-full border border-white/10 bg-ink-900/95 px-2 py-1 text-xs sm:text-[10px] uppercase tracking-eyebrow text-bone opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
