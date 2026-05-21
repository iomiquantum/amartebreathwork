// EventsCalendar — Lee eventos publicados de Supabase y los muestra agrupados por mes.
// Cada evento tiene CTA al gate de WhatsApp para reservar.
// Filtros: ciudad y formato (presencial/online/híbrido).
//
// Crear eventos: por ahora desde Supabase Studio (Table Editor → breathwork_events).
// Status válidos: draft (no se ve), published, sold_out, cancelled, past.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Building2,
  Sparkles,
  CalendarPlus,
  MessageCircle,
  CreditCard,
} from "lucide-react";
import { fetchUpcomingEvents, type EventRow } from "../lib/supabase";
import { useWhatsappCTA } from "../lib/whatsapp";
import { trackAddToCart, trackViewContent } from "../lib/tracking";
import { SectionHeader } from "./SectionHeader";
import { downloadICS } from "../lib/calendar";
import { siteConfig } from "../data/siteConfig";
import { ReservationModal } from "./ReservationModal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function monthKey(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-EC", { month: "long", year: "numeric" });
}

function FormatBadge({ format }: { format: EventRow["format"] }) {
  const cfg = {
    presencial: { icon: Building2, label: "Presencial", color: "text-emerald-glow border-emerald-brand/30 bg-emerald-deep/30" },
    online: { icon: Video, label: "Online", color: "text-gold-soft border-gold-warm/30 bg-gold-warm/10" },
    hibrido: { icon: Sparkles, label: "Híbrido", color: "text-bone border-white/20 bg-white/[0.04]" },
  }[format];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-eyebrow ${cfg.color}`}>
      <Icon className="size-3" strokeWidth={1.8} />
      {cfg.label}
    </span>
  );
}

export function EventsCalendar() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFormat, setFilterFormat] = useState<"all" | EventRow["format"]>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const wa = useWhatsappCTA("event_format");

  useEffect(() => {
    let mounted = true;
    fetchUpcomingEvents(50).then((data) => {
      if (!mounted) return;
      setEvents(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.city) set.add(e.city);
    });
    return Array.from(set).sort();
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filterFormat !== "all" && e.format !== filterFormat) return false;
      if (filterCity !== "all" && e.city !== filterCity) return false;
      return true;
    });
  }, [events, filterFormat, filterCity]);

  const grouped = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    filtered.forEach((e) => {
      const k = monthKey(e.date_iso);
      const arr = map.get(k) ?? [];
      arr.push(e);
      map.set(k, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <section id="agenda" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Agenda · Ecuador + Online"
          title="Próximas"
          highlight="experiencias."
          subtitle="Eventos en distintas ciudades de Ecuador y sesiones online. Reserva tu cupo dejándonos tus datos."
        />

        {loading ? (
          /* Loading skeleton */
          <div className="mx-auto mt-14 grid max-w-3xl gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card-dark animate-pulse h-24 rounded-2xl"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="mx-auto mt-14 max-w-2xl rounded-3xl border border-white/[0.06] bg-white/[0.015] p-10 text-center"
          >
            <Calendar className="mx-auto size-10 text-emerald-glow" strokeWidth={1.4} />
            <h3 className="font-display mt-5 text-2xl text-bone">
              Pronto publicaremos las próximas fechas
            </h3>
            <p className="mt-3 text-sm text-bone/75 leading-relaxed">
              Estamos coordinando experiencias en varias ciudades de Ecuador + sesiones online.
              Únete al grupo para enterarte primero apenas confirmemos calendario.
            </p>
            <a
              {...wa}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-emerald-brand px-7 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
            >
              <MessageCircle className="size-4" strokeWidth={1.8} />
              Quiero ser el primero en saber
            </a>
          </motion.div>
        ) : (
          <>
            {/* Filtros */}
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setFilterFormat("all")}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-eyebrow transition-colors ${
                  filterFormat === "all"
                    ? "bg-emerald-brand text-ink-900"
                    : "border border-white/10 text-bone/70 hover:border-white/30"
                }`}
              >
                Todos
              </button>
              {(["presencial", "online", "hibrido"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterFormat(f)}
                  className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-eyebrow transition-colors ${
                    filterFormat === f
                      ? "bg-emerald-brand text-ink-900"
                      : "border border-white/10 text-bone/70 hover:border-white/30"
                  }`}
                >
                  {f}
                </button>
              ))}

              {cities.length > 0 && (
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  aria-label="Filtrar por ciudad"
                  className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs uppercase tracking-eyebrow text-bone/80 focus:border-emerald-brand/50 focus:outline-none"
                >
                  <option value="all" className="bg-ink-900">Todas ciudades</option>
                  {cities.map((c) => (
                    <option key={c} value={c} className="bg-ink-900">{c}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Lista por mes */}
            <div className="mx-auto mt-12 max-w-3xl space-y-12">
              {grouped.map(([month, monthEvents]) => (
                <div key={month}>
                  <h3 className="font-display text-xl capitalize text-emerald-glow border-l-2 border-emerald-brand/40 pl-4">
                    {month}
                  </h3>
                  <ul className="mt-5 grid gap-4">
                    {monthEvents.map((e, i) => (
                      <motion.li
                        key={e.id}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className={`card-dark group relative p-6 sm:p-7 ${
                          e.status === "sold_out" ? "opacity-70" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                          {/* Date badge */}
                          <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-center sm:justify-center sm:gap-1 sm:rounded-xl sm:bg-emerald-deep/30 sm:px-5 sm:py-4 sm:min-w-[90px]">
                            <p className="font-display text-4xl tabular-nums leading-none text-bone sm:text-3xl">
                              {new Date(e.date_iso).getDate()}
                            </p>
                            <p className="text-[10px] uppercase tracking-eyebrow text-emerald-glow">
                              {new Date(e.date_iso).toLocaleDateString("es-EC", { month: "short" })}
                            </p>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <FormatBadge format={e.format} />
                              {e.is_featured && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-gold-warm/30 bg-gold-warm/10 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-gold-soft">
                                  <Sparkles className="size-3" /> Destacado
                                </span>
                              )}
                              {e.status === "sold_out" && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-rose-300">
                                  Cupos agotados
                                </span>
                              )}
                            </div>
                            <h4 className="font-display mt-3 text-lg text-bone">
                              {e.slug ? (
                                <Link
                                  to={`/evento/${e.slug}`}
                                  className="transition-colors hover:text-emerald-glow"
                                >
                                  {e.title}
                                </Link>
                              ) : (
                                e.title
                              )}
                            </h4>
                            <p className="mt-1 text-sm capitalize text-bone/70">
                              {formatDate(e.date_iso)} · {formatTime(e.date_iso)}
                            </p>
                            {e.description && (
                              <p className="mt-3 text-sm text-bone/70 leading-relaxed">
                                {e.description}
                              </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                              {e.city && (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="size-3.5" />
                                  {e.city}
                                  {e.venue_name && ` · ${e.venue_name}`}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1.5">
                                <Users className="size-3.5" />
                                {e.spots_available > 0
                                  ? `${e.spots_available} de ${e.spots_total} cupos`
                                  : "Sin cupos"}
                              </span>
                              {e.price_amount !== null && (
                                <span className="text-emerald-brand">
                                  {e.price_currency} {Number(e.price_amount).toFixed(0)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-row gap-2 sm:flex-col sm:gap-2.5">
                            <button
                              type="button"
                              disabled={e.status === "sold_out" || e.spots_available <= 0}
                              onClick={() => {
                                trackAddToCart(e.title, e.deposit_amount ?? 20, e.id);
                                trackViewContent(e.title, e.id);
                                setSelectedEvent(e);
                              }}
                              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-emerald-brand px-5 text-xs font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CreditCard className="size-3.5" strokeWidth={1.8} />
                              {e.status === "sold_out" || e.spots_available <= 0 ? "Agotado" : "Reservar"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                downloadICS({
                                  dateISO: e.date_iso,
                                  title: `${siteConfig.brandName} · ${e.title}`,
                                  location: e.city ?? "Online",
                                  durationMin: e.duration_min,
                                  description: e.description ?? undefined,
                                })
                              }
                              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-4 text-xs text-bone/85 transition-all hover:border-emerald-brand/50 hover:bg-emerald-deep/30 hover:text-emerald-glow"
                            >
                              <CalendarPlus className="size-3.5" />
                              <span className="hidden sm:inline">Calendario</span>
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de reserva */}
      <ReservationModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
