import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { trackFAQOpen } from "../lib/tracking";
import { FAQS as faqs } from "../data/faqs";


function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs.map((f, i) => ({ ...f, idx: i }));
    const q = normalize(query);
    return faqs
      .map((f, i) => ({ ...f, idx: i }))
      .filter((f) => normalize(f.q).includes(q) || normalize(f.a).includes(q));
  }, [query]);

  return (
    <section id="faq" className="relative bg-ink-900 py-24 sm:py-32">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Preguntas frecuentes"
          title="Lo que necesitas saber"
          highlight="antes de venir."
        />

        {/* Search */}
        <div className="relative mx-auto mt-10 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en preguntas…"
            aria-label="Buscar pregunta"
            className="h-12 w-full rounded-full border border-white/10 bg-white/[0.02] pl-11 pr-11 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-bone"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 text-center text-sm text-muted">
            No encontramos preguntas con ese término. Escríbenos y te respondemos directo.
          </div>
        ) : (
        <div className="mt-8 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          {filtered.map((f) => {
            const i = f.idx;
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(isOpen ? null : i);
                    if (!isOpen) trackFAQOpen(f.q);
                  }}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.025]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-bone sm:text-lg">{f.q}</span>
                  <span
                    className={`grid size-9 flex-shrink-0 place-items-center rounded-full border border-white/10 transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 border-emerald-brand/50 bg-emerald-deep/40 text-emerald-glow"
                        : "text-bone/70"
                    }`}
                  >
                    <Plus className="size-4" strokeWidth={1.8} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pr-16 text-sm text-bone/80 leading-relaxed sm:text-base">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
