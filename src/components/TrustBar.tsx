import { Wind, Waves, AudioLines, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Wind, label: "Respiración guiada" },
  { icon: AudioLines, label: "Sonido inmersivo" },
  { icon: Waves, label: "Frecuencias" },
  { icon: MapPin, label: "Experiencia presencial" },
];

export function TrustBar() {
  return (
    <section
      aria-label="Resumen rápido"
      className="relative border-y border-white/[0.06] bg-ink-900/60 py-6 backdrop-blur"
    >
      <div className="container-x">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {items.map(({ icon: Icon, label }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-3 text-sm text-bone/85"
            >
              <span className="grid size-9 place-items-center rounded-full border border-emerald-brand/30 bg-emerald-deep/30 text-emerald-glow">
                <Icon className="size-4" strokeWidth={1.6} />
              </span>
              <span className="font-medium">{label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
