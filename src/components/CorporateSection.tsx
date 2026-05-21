import { motion } from "framer-motion";
import { Check, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "../data/siteConfig";

export function CorporateSection() {
  const c = siteConfig.corporate;
  const subject = encodeURIComponent("Experiencia AMARTE para empresa");
  const body = encodeURIComponent(
    "Hola,\n\nMe gustaría conversar sobre llevar una experiencia de AMARTE a mi equipo.\n\nEmpresa:\nPersonas aproximadas:\nFecha tentativa:\nObjetivo:\n\nGracias."
  );
  const mailto = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;

  return (
    <section
      id="empresas"
      aria-label="Para empresas"
      className="relative bg-ink py-24 sm:py-32"
    >
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <span className="eyebrow">Para empresas</span>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
              {c.headline}
            </h2>
            <p className="lede mt-6 max-w-xl">{c.body}</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 grid size-5 flex-shrink-0 place-items-center rounded-full bg-emerald-brand/15 text-emerald-glow">
                    <Check className="size-3" strokeWidth={2.4} />
                  </span>
                  <span className="text-sm text-bone/85">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/corporativo"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
              >
                <Building2 className="size-4" strokeWidth={1.6} />
                Ver propuesta corporativa completa
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={mailto}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-emerald-brand/40 bg-emerald-deep/30 px-6 text-sm text-bone transition-all hover:border-emerald-brand/70 hover:bg-emerald-deep/60 hover:text-emerald-glow"
              >
                {c.cta} →
              </a>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] gradient-border bg-ink">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep/50 via-ink-900 to-ink" />
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

              {/* Group of dots */}
              <div className="absolute inset-0 grid place-items-center p-10">
                <div className="grid grid-cols-5 gap-3 sm:gap-4">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.025,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="size-3 rounded-full bg-emerald-brand/60 sm:size-4"
                      style={{ boxShadow: "0 0 12px rgba(0,200,150,0.4)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-[10px] uppercase tracking-eyebrow text-bone/60">
                <span className="text-emerald-brand">●</span> Sesión privada · Equipo completo
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
