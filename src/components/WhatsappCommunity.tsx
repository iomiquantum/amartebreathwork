import { motion } from "framer-motion";
import { MessageCircle, Lock, BellRing } from "lucide-react";
import { CTAButton } from "./CTAButton";
import { useWhatsappCTA } from "../lib/whatsapp";

const inside = [
  "Fechas disponibles",
  "Ubicación",
  "Horarios",
  "Valores",
  "Cupos anticipados",
  "Recomendaciones antes de asistir",
  "Contenido sobre respiración, sonido y regulación",
];

export function WhatsappCommunity() {
  const wa = useWhatsappCTA("whatsapp_community");
  return (
    <section id="comunidad" className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald" />
      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <span className="eyebrow">Grupo privado</span>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
              Únete y recibe primero{" "}
              <span className="bg-gradient-to-r from-emerald-brand to-gold-warm bg-clip-text text-transparent">
                las próximas fechas.
              </span>
            </h2>
            <p className="lede mt-6 max-w-xl">
              Anunciamos las experiencias dentro del grupo antes de abrirlas al público.
              Así tienes prioridad sobre cupos limitados y precios anticipados.
            </p>

            <div className="mt-8 flex items-center gap-6 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <Lock className="size-3.5" /> Grupo privado
              </span>
              <span className="inline-flex items-center gap-2">
                <BellRing className="size-3.5" /> Acceso anticipado
              </span>
            </div>

            <CTAButton
              {...wa}
              icon={<MessageCircle className="size-5" strokeWidth={1.8} />}
              className="mt-8"
            >
              Entrar al grupo privado de WhatsApp
            </CTAButton>

            <p className="mt-3 max-w-md text-xs text-muted">
              Puedes salir del grupo cuando quieras. Solo compartiremos información
              relacionada con las experiencias.
            </p>
          </motion.div>

          {/* Inside list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="gradient-border rounded-2xl p-6">
              <p className="text-xs uppercase tracking-eyebrow text-emerald-brand">
                Dentro del grupo
              </p>
              <ul className="mt-5 space-y-3">
                {inside.map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-sm text-bone/90"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-brand" />
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-muted">
                Los cupos son limitados para cuidar la calidad de la experiencia.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
