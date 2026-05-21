import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { useWhatsappCTA } from "../lib/whatsapp";
import { scrollToId } from "../lib/utils";

const links = [
  { id: "experiencia", label: "Experiencia" },
  { id: "how-it-works", label: "Cómo funciona" },
  { id: "formato", label: "Formato" },
  { id: "voces", label: "Voces" },
  { id: "faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.4 });
  const waHeader = useWhatsappCTA("hero_primary");
  const waMobile = useWhatsappCTA("hero_primary");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const ids = links.map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
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
    <>
      {/* Skip link */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-emerald-brand focus:px-4 focus:py-2 focus:text-sm focus:text-ink-900"
      >
        Saltar al contenido
      </a>

      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-emerald-brand via-emerald-glow to-gold-warm"
      />

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-ink/85 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5"
            aria-label={siteConfig.brandName}
          >
            <span className="relative grid size-7 place-items-center">
              <span className="absolute inset-0 rounded-full bg-emerald-brand/30 blur-md transition-opacity group-hover:bg-emerald-brand/50" />
              <span className="relative size-3 rounded-full bg-emerald-brand shadow-glow-emerald" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-bone">
              {siteConfig.brandName}
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => scrollToId(l.id)}
                  className={`relative text-sm transition-colors ${
                    isActive ? "text-emerald-glow" : "text-bone/70 hover:text-bone"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-emerald-brand"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <a
              {...waHeader}
              className="hidden h-10 items-center gap-2 rounded-full bg-emerald-brand px-4 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong sm:inline-flex"
            >
              <MessageCircle className="size-4" strokeWidth={1.8} />
              <span className="hidden md:inline">WhatsApp</span>
              <span className="md:hidden">Únete</span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menú"
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-bone/80 transition-colors hover:text-emerald-glow lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="border-t border-white/[0.06] bg-ink-900/95 backdrop-blur-xl lg:hidden"
            >
              <ul className="container-x flex flex-col gap-1 py-4">
                {links.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => {
                        scrollToId(l.id);
                        setOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-3 text-left text-bone/85 transition-colors hover:bg-white/[0.04] hover:text-bone"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
                <li>
                  <a
                    {...waMobile}
                    onClick={(e) => {
                      waMobile.onClick(e);
                      setOpen(false);
                    }}
                    className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald"
                  >
                    <MessageCircle className="size-4" />
                    Unirme al grupo de WhatsApp
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
