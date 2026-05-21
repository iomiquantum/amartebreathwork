import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Users, Moon, Timer } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { CTAButton } from "./CTAButton";
import { SectionHeader } from "./SectionHeader";
import { Countdown } from "./Countdown";
import { useWhatsappCTA } from "../lib/whatsapp";

const facts = [
  { icon: MapPin, label: "Modalidad", value: "Presencial + Online" },
  { icon: CalendarDays, label: "Disponibilidad", value: "Multi-ciudad EC" },
  { icon: Moon, label: "Momento", value: "Tarde / Noche" },
  { icon: Clock, label: "Cuándo", value: "Varias al mes" },
  { icon: Timer, label: "Duración", value: "60–90 min" },
  { icon: Users, label: "Cupos", value: "Limitados" },
];

export function EventFormat() {
  const wa = useWhatsappCTA("event_format");
  return (
    <section id="formato" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Formato del evento"
          title="Eventos en todo Ecuador"
          highlight="+ sesiones online."
          subtitle="Llevamos AMARTE a distintas ciudades del país y también lo transmitimos en vivo para quien quiera vivirlo desde casa. Revisa el calendario abajo para ver fechas confirmadas por ciudad."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* Facts */}
          <div className="lg:col-span-7">
            <ul className="grid gap-3 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="card-dark flex flex-col gap-3 p-5"
                >
                  <Icon className="size-5 text-emerald-brand" strokeWidth={1.6} />
                  <div>
                    <p className="text-[11px] uppercase tracking-eyebrow text-muted">
                      {label}
                    </p>
                    <p className="mt-1 font-display text-lg text-bone">{value}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Próxima experiencia */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="gradient-border relative overflow-hidden rounded-2xl p-7">
              <div className="absolute -right-10 -top-10 size-44 rounded-full bg-emerald-brand/10 blur-3xl" />
              <p className="text-xs uppercase tracking-eyebrow text-emerald-brand">
                Próxima experiencia
              </p>
              <p className="mt-3 font-display text-3xl text-bone">{siteConfig.nextDate}</p>

              {siteConfig.nextDateISO && (
                <div className="mt-5">
                  <Countdown compact />
                </div>
              )}

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <dt className="text-muted">Lugar</dt>
                  <dd className="text-bone">{siteConfig.location}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <dt className="text-muted">Horario</dt>
                  <dd className="text-bone">{siteConfig.time}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Cupos</dt>
                  <dd className="text-emerald-brand">{siteConfig.capacity}</dd>
                </div>
              </dl>

              <CTAButton {...wa} fullWidth className="mt-7">
                Entrar al grupo para recibir la fecha
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
