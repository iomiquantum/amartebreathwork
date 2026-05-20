import { motion } from "framer-motion";
import { Brain, HeartPulse, Moon, Battery, BatteryWarning, Unplug } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const pains = [
  { icon: Brain, title: "Mente acelerada", body: "El día acaba pero los pensamientos no." },
  { icon: HeartPulse, title: "Cuerpo tenso", body: "Hombros, mandíbula, espalda. Tensión que ya no notas." },
  { icon: BatteryWarning, title: "Estrés acumulado", body: "Una capa que llevas hace semanas, meses, años." },
  { icon: Moon, title: "Sueño liviano", body: "Te acuestas cansado, te levantas cansado." },
  { icon: Battery, title: "Cansancio emocional", body: "Sentir que estás siempre dando y nunca soltando." },
  { icon: Unplug, title: "Desconexión interna", body: "Funcionas en automático y dejaste de sentirte." },
];

export function ProblemSection() {
  return (
    <section id="problema" className="relative bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-60" />
      <div className="container-x relative">
        <SectionHeader
          eyebrow="Vivimos con demasiado ruido"
          title="Pantallas, tráfico, presión, notificaciones."
          highlight="No necesitas hacer más. Necesitas pausar."
          subtitle="Tu mente corre. Tu cuerpo se tensa. Tu respiración se corta. Tu sistema nervioso se queda en alerta. Esta experiencia nace para crear una pausa real en medio de la vida moderna."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pains.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="card-dark group relative overflow-hidden p-6 transition-colors duration-300 hover:border-emerald-brand/30"
            >
              <div className="absolute -right-6 -top-6 size-32 rounded-full bg-emerald-brand/0 blur-3xl transition-all duration-500 group-hover:bg-emerald-brand/10" />
              <Icon className="size-6 text-emerald-brand" strokeWidth={1.6} />
              <h3 className="mt-5 text-xl font-semibold text-bone">{title}</h3>
              <p className="mt-2 text-sm text-bone/70 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
