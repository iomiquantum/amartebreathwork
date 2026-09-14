// CorporateAfterCare — El "después" que nadie más ofrece.
// Mensaje central: AMARTE no termina cuando termina la sesión.
// Mix de tecnología (frecuencias en vivo, respiraciones) + humano (check-ins, reporte).

import { motion } from "framer-motion";
import {
  Waves,
  MessageCircleHeart,
  ClipboardCheck,
  Repeat,
  Heart,
} from "lucide-react";

const AFTERCARE = [
  {
    icon: Waves,
    badge: "Tecnología",
    title: "Tu equipo se lleva el estado",
    body: "Cada participante recibe acceso continuo a las 4 frecuencias en vivo de AMARTE (174, 396, 528, 741 Hz) y respiraciones guiadas. El estado regulado no se queda en la sesión — viaja con ellos.",
  },
  {
    icon: MessageCircleHeart,
    badge: "Humano",
    title: "Check-in real a los 7 días",
    body: "No es un email automático con encuesta NPS. Es nuestro equipo escribiéndote para saber cómo siguió tu gente, qué reportaron, y qué te recomendamos para sostener el ritmo.",
  },
  {
    icon: ClipboardCheck,
    badge: "Reporte",
    title: "Análisis cualitativo profundo",
    body: "Testimonios reales del equipo, momentos transformadores observados durante la sesión, patrones que detectamos y oportunidades concretas de seguimiento.",
  },
  {
    icon: Repeat,
    badge: "Opcional",
    title: "Programa anual para empresas conscientes",
    body: "Para quienes entienden que el bienestar no es un evento aislado, es un sistema. Sesiones recurrentes alineadas con hitos del año: cierres de Q, onboardings, reorganizaciones, lanzamientos.",
  },
];

export function CorporateAfterCare() {
  return (
    <section id="acompanamiento" className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-gold-warm">
            Después de la sesión
          </span>
          <h2 className="h-display mt-4 text-4xl sm:text-5xl text-balance">
            No te soltamos cuando{" "}
            <span className="bg-gradient-to-r from-gold-warm via-orange-glow to-orange-brand bg-clip-text text-transparent">
              termina el evento.
            </span>
          </h2>
          <p className="lede mt-5">
            La sesión enciende el cambio. El acompañamiento posterior lo sostiene.
            <br className="hidden sm:block" />
            Mitad tecnología, mitad presencia humana real.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {AFTERCARE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="card-dark group relative overflow-hidden p-7 transition-all hover:border-orange-brand/30"
              >
                {/* Glow decorativo */}
                <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-orange-brand/[0.04] blur-3xl transition-all group-hover:bg-orange-brand/[0.08]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-2xl border border-orange-brand/40 bg-orange-deep/40 text-orange-glow">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </div>
                  <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs sm:text-[10px] uppercase tracking-eyebrow text-bone/70">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-display mt-5 text-xl text-bone sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-bone/75 leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quote cierre */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="gradient-border rounded-3xl bg-ink p-8 text-center sm:p-10">
            <Heart className="mx-auto size-7 text-orange-glow" strokeWidth={1.5} />
            <p className="font-display mt-5 text-balance text-xl text-bone leading-relaxed sm:text-2xl">
              Otras propuestas terminan cuando guardan el equipo.
              <br />
              <span className="text-orange-glow">Nosotros recién empezamos ahí.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
