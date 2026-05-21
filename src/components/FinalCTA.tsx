import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { CTAButton } from "./CTAButton";
import { useWhatsappCTA } from "../lib/whatsapp";

export function FinalCTA() {
  const wa = useWhatsappCTA("final_cta");
  return (
    <section
      id="final-cta"
      className="relative isolate overflow-hidden bg-ink py-24 sm:py-32"
    >
      {/* Real photo background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url(/sections/final-cta-bg.jpg)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink" />
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      <div className="container-tight relative text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          Cierre
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="h-display mt-4 text-4xl sm:text-6xl text-balance"
        >
          Respira. Escucha. Regula.{" "}
          <span className="bg-gradient-to-r from-emerald-brand via-emerald-glow to-gold-warm bg-clip-text text-transparent">
            Vuelve a ti.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lede mt-6 text-balance"
        >
          Una noche cada 15 días para bajar el ruido, soltar el estrés y reconectar con
          tu cuerpo a través de respiración, sonido y frecuencias.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <CTAButton {...wa} icon={<MessageCircle className="size-5" strokeWidth={1.8} />}>
            {siteConfig.ctaPrimary}
          </CTAButton>
        </motion.div>

        <p className="mt-4 text-sm text-muted">{siteConfig.ctaMicrocopy}</p>
      </div>
    </section>
  );
}
