// Lista de eventos. Permite cambiar el status (publicado / borrador / sold_out / past).
// Para editar contenido completo, redirige a Supabase Studio (cambios de copy son raros).

import { useEffect, useState } from "react";
import { Loader2, ExternalLink, Calendar, MapPin, Video, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Event = {
  id: string;
  slug: string;
  title: string;
  date_iso: string;
  format: string;
  city: string | null;
  venue_name: string | null;
  spots_total: number;
  spots_available: number;
  status: string;
  is_featured: boolean;
};

const STATUSES = ["draft", "published", "sold_out", "cancelled", "past"];

export function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("breathwork_events")
      .select("*")
      .order("date_iso", { ascending: false });
    setEvents((data ?? []) as Event[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    if (!supabase) return;
    setUpdating(id);
    await supabase.from("breathwork_events").update({ status: newStatus }).eq("id", id);
    setUpdating(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Eventos</h2>
          <p className="mt-1 text-sm text-muted">Cambia status rápido. Edita contenido en Supabase Studio.</p>
        </div>
        <a
          href="https://supabase.com/dashboard/project/ajhajtousbarhsfugxbo/editor"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-bone/80 hover:border-bone/30 hover:text-bone"
        >
          Editar en Supabase Studio <ExternalLink className="size-3" />
        </a>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" /> Cargando eventos…
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-emerald-brand">
                    {ev.format === "online" ? <Video className="size-3" /> : <MapPin className="size-3" />}
                    {ev.format}
                    {ev.city && ` · ${ev.city}`}
                    {ev.is_featured && <span className="text-gold-warm">★ destacado</span>}
                  </div>
                  <p className="mt-1 font-display text-lg text-bone">{ev.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      {new Date(ev.date_iso).toLocaleString("es-EC", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3" />
                      {ev.spots_available}/{ev.spots_total} disponibles
                    </span>
                    <span className="text-[10px] text-bone/40">slug: {ev.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={ev.status}
                    disabled={updating === ev.id}
                    onChange={(e) => updateStatus(ev.id, e.target.value)}
                    className="h-9 rounded-lg border border-white/10 bg-ink-900 px-3 text-xs text-bone focus:border-emerald-brand/50 focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {updating === ev.id && <Loader2 className="size-3.5 animate-spin text-muted" />}
                </div>
              </div>
            </li>
          ))}
          {events.length === 0 && <p className="text-sm text-muted">No hay eventos todavía.</p>}
        </ul>
      )}
    </div>
  );
}
