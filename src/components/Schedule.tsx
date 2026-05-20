import { motion } from "framer-motion";
import { CalendarPlus, MapPin, Users } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { downloadICS } from "../lib/calendar";
import { SectionHeader } from "./SectionHeader";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-EC", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function Schedule() {
  const sessions = siteConfig.upcomingSessions ?? [];
  if (!sessions.length) return null;

  return (
    <section id="agenda" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Agenda"
          title="Próximas"
          highlight="experiencias."
          subtitle="Las fechas confirmadas se anuncian primero dentro del grupo. Aquí queda la lista pública para que veas con anticipación."
        />

        <ul className="mt-14 grid gap-4 lg:grid-cols-2">
          {sessions.map((s, i) => (
            <motion.li
              key={s.dateISO + i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="card-dark group relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-deep/30 px-5 py-4 text-emerald-glow sm:min-w-[110px]">
                <p className="font-display text-3xl tabular-nums leading-none text-bone">
                  {new Date(s.dateISO).getDate()}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-eyebrow">
                  {new Date(s.dateISO).toLocaleDateString("es-EC", { month: "short" })}
                </p>
              </div>

              <div className="flex-1">
                <p className="font-display text-lg text-bone">{s.label}</p>
                <p className="mt-1 text-sm capitalize text-bone/70">
                  {formatDate(s.dateISO)} · {formatTime(s.dateISO)}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3" /> {s.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3" /> {s.spots} cupos
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  downloadICS({
                    dateISO: s.dateISO,
                    title: `${siteConfig.brandName} · ${s.label}`,
                    location: s.location,
                  })
                }
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 text-xs text-bone/85 transition-all hover:border-emerald-brand/50 hover:bg-emerald-deep/30 hover:text-emerald-glow"
              >
                <CalendarPlus className="size-3.5" />
                Agregar al calendario
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
