// Reservas: confirmar / cancelar con un click. El trigger DB auto-decrementa spots al confirmar.

import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  CreditCard,
  Building2,
  Filter,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Reservation = {
  id: string;
  event_id: string;
  name: string;
  email: string;
  whatsapp: string;
  country_code: string;
  country_name: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  proof_url: string | null;
  proof_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  confirmed_at: string | null;
};

type EventLookup = { id: string; title: string; date_iso: string };

const FILTERS = ["pending", "confirmed", "cancelled", "all"] as const;
type FilterKey = (typeof FILTERS)[number];

export function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<Record<string, EventLookup>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("pending");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    if (!supabase) return;
    setLoading(true);
    let q = supabase.from("breathwork_reservations").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("payment_status", filter);
    const { data: resv } = await q;
    setReservations((resv ?? []) as Reservation[]);

    const eventIds = Array.from(new Set((resv ?? []).map((r) => r.event_id)));
    if (eventIds.length > 0) {
      const { data: evs } = await supabase
        .from("breathwork_events")
        .select("id, title, date_iso")
        .in("id", eventIds);
      const lookup: Record<string, EventLookup> = {};
      (evs ?? []).forEach((e) => {
        lookup[e.id] = e as EventLookup;
      });
      setEvents(lookup);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function confirm(id: string) {
    if (!supabase) return;
    setUpdating(id);
    await supabase
      .from("breathwork_reservations")
      .update({ payment_status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", id);
    setUpdating(null);
    load();
  }

  async function cancel(id: string) {
    if (!supabase) return;
    setUpdating(id);
    await supabase.from("breathwork_reservations").update({ payment_status: "cancelled" }).eq("id", id);
    setUpdating(null);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Reservas</h2>
          <p className="mt-1 text-sm text-muted">Confirma pagos manualmente. El trigger DB decrementa spots al confirmar.</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1 text-xs">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 transition-colors ${
                filter === f ? "bg-emerald-brand text-ink-900" : "text-bone/70 hover:text-bone"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" /> Cargando reservas…
        </div>
      ) : reservations.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-muted">
          <Filter className="mx-auto size-6 text-bone/30" />
          <p className="mt-3">Sin reservas con status <strong>{filter}</strong>.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {reservations.map((r) => {
            const ev = events[r.event_id];
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow">
                      <span
                        className={
                          r.payment_status === "confirmed"
                            ? "text-emerald-glow"
                            : r.payment_status === "pending"
                            ? "text-amber-300"
                            : "text-red-300"
                        }
                      >
                        ● {r.payment_status}
                      </span>
                      <span className="text-bone/40">{r.payment_method}</span>
                    </div>
                    <p className="mt-1 font-display text-lg text-bone">{r.name}</p>
                    {ev && <p className="text-xs text-bone/60">{ev.title}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="size-3" />
                        <a href={`mailto:${r.email}`} className="hover:text-emerald-glow">
                          {r.email}
                        </a>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3" />
                        <a
                          href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-glow"
                        >
                          {r.whatsapp}
                        </a>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        {r.payment_method === "payphone" ? (
                          <CreditCard className="size-3" />
                        ) : (
                          <Building2 className="size-3" />
                        )}
                        ${r.amount} {r.currency}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] text-bone/40">
                      Creada: {new Date(r.created_at).toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>

                  {r.payment_status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => confirm(r.id)}
                        disabled={updating === r.id}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-brand px-3 text-xs font-medium text-ink-900 hover:bg-emerald-glow disabled:opacity-60"
                      >
                        {updating === r.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3.5" />
                        )}
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => cancel(r.id)}
                        disabled={updating === r.id}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-500/30 px-3 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                      >
                        <XCircle className="size-3.5" />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
