import { motion } from "framer-motion";
import { Wind, AudioLines, Radio, Sparkles, CircleDot, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const items = [
  {
    icon: Wind,
    title: "Respiración guiada",
    body: "Secuencias simples y acompañadas para soltar tensión, oxigenar el cuerpo y volver al presente.",
  },
  {
    icon: AudioLines,
    title: "Sonido inmersivo",
    body: "Una experiencia auditiva con audífonos que crea intimidad, profundidad y enfoque interno.",
  },
  {
    icon: Radio,
    title: "Frecuencias y paisajes sonoros",
    body: "Atmósferas, música y sonidos diseñados para acompañar calma, introspección y regulación.",
  },
  {
    icon: Sparkles,
    title: "Ambiente sensorial",
    body: "Iluminación, silencio, guía y espacio preparado para que puedas pausar de verdad.",
  },
  {
    icon: CircleDot,
    title: "Integración final",
    body: "Un cierre suave para volver al presente con mayor calma, claridad y presencia.",
  },
  {
    icon: Users,
    title: "Comunidad",
    body: "Acceso al grupo donde se anuncian próximas fechas, cupos y contenido de valor.",
  },
];

export function IncludesSection() {
  return (
    <section id="incluye" className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-50" />
      <div className="container-x relative">
        <SectionHeader
          eyebrow="Qué vivirás"
          title="Cada sesión es un viaje"
          highlight="cuidado al detalle."
          subtitle="No improvisamos. Cada elemento está pensado para acompañarte a una pausa profunda y segura."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="card-dark group relative overflow-hidden p-7 transition-all duration-300 hover:border-emerald-brand/30 hover:bg-white/[0.03]"
            >
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-emerald-brand/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-brand/10" />
              <div className="grid size-12 place-items-center rounded-xl border border-emerald-brand/20 bg-emerald-deep/30">
                <Icon className="size-5 text-emerald-glow" strokeWidth={1.6} />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-bone">{title}</h3>
              <p className="mt-3 text-sm text-bone/70 leading-relaxed">{body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
