import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { trackFAQOpen } from "../lib/tracking";

const faqs = [
  {
    q: "¿Esto es una clase de breathwork?",
    a: "No. Es una experiencia auditiva inmersiva que integra respiración guiada, sonido y frecuencias. No está diseñada como una clase teórica, sino como una vivencia sensorial.",
  },
  {
    q: "¿En qué ciudades hay experiencias?",
    a: "Hacemos eventos presenciales en distintas ciudades de Ecuador (Quito, Guayaquil, Cuenca y otras según demanda). También hay sesiones online para quienes están fuera del país o prefieren vivirla desde casa. Revisa el calendario para ver fechas y ciudades disponibles.",
  },
  {
    q: "¿Hay experiencias online?",
    a: "Sí. Algunas experiencias se transmiten en vivo desde nuestro estudio con calidad auditiva profesional. Solo necesitas audífonos y un lugar donde no te interrumpan. La inscripción incluye link privado el día del evento.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. La experiencia está guiada paso a paso y puedes vivirla aunque nunca hayas practicado respiración consciente.",
  },
  {
    q: "¿Qué debo llevar?",
    a: "Para presencial: ropa cómoda, mente abierta, llegar unos minutos antes. Para online: audífonos, un espacio sin interrupciones y una manta o cobija. Los detalles específicos se comparten dentro del grupo antes de cada sesión.",
  },
  {
    q: "¿Cada cuánto se realizan?",
    a: "Hacemos varias experiencias al mes, distribuidas entre ciudades de Ecuador y online. La frecuencia depende de cada ciudad — revisa el calendario para ver fechas confirmadas.",
  },
  {
    q: "¿Cuánto dura?",
    a: "La duración estimada es de 60 a 90 minutos, dependiendo del formato de cada experiencia (presencial u online).",
  },
  {
    q: "¿Es terapia o tratamiento médico?",
    a: "No. Es una experiencia de bienestar complementaria. No reemplaza atención médica, psicológica o psiquiátrica.",
  },
  {
    q: "¿Puedo ir si estoy muy estresado?",
    a: "Sí, la experiencia está pensada para personas que buscan una pausa profunda. Si tienes alguna condición médica, respiratoria, cardíaca, psiquiátrica, embarazo o estás bajo tratamiento, consulta con un profesional antes de participar.",
  },
  {
    q: "¿Cómo me entero de la próxima fecha en mi ciudad?",
    a: "Únete al grupo privado de WhatsApp. Ahí se anuncian primero las fechas por ciudad, horarios, valores y cupos disponibles. También puedes revisar el calendario en esta página.",
  },
  {
    q: "¿El grupo de WhatsApp tiene costo?",
    a: "No. El grupo es gratuito y sirve para recibir información de las próximas experiencias en todo Ecuador.",
  },
  {
    q: "¿Cómo funcionan los pagos?",
    a: "Cada experiencia tiene su valor (varía por ciudad y formato). Los métodos de pago y políticas se comunican dentro del grupo al confirmar tu cupo.",
  },
];

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
