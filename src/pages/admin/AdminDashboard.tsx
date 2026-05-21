// Dashboard overview: KPIs principales del negocio.

import { useEffect, useState } from "react";
import { Users, Calendar, Inbox, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Stats = {
  totalLeads: number;
  leadsLast7d: number;
  upcomingEvents: number;
  pendingReservations: number;
  confirmedReservations: number;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    async function load() {
      if (!supabase) return;
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [totalLeads, leadsLast7d, upcoming, pending, confirmed] = await Promise.all([
        supabase.from("breathwork_leads").select("id", { count: "exact", head: true }),
        supabase
          .from("breathwork_leads")
          .select("id", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo),
        supabase
          .from("breathwork_events")
          .select("id", { count: "exact", head: true })
          .eq("status", "published")
          .gte("date_iso", new Date().toISOString()),
        supabase
          .from("breathwork_reservations")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "pending"),
        supabase
          .from("breathwork_reservations")
          .select("id", { count: "exact", head: true })
          .eq("payment_status", "confirmed"),
      ]);

      setStats({
        totalLeads: totalLeads.count ?? 0,
        leadsLast7d: leadsLast7d.count ?? 0,
        upcomingEvents: upcoming.count ?? 0,
        pendingReservations: pending.count ?? 0,
        confirmedReservations: confirmed.count ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl">Resumen</h2>
      <p className="mt-1 text-sm text-muted">Estado del negocio en un vistazo.</p>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" /> Cargando métricas…
        </div>
      ) : stats ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Kpi
            label="Leads totales"
            value={stats.totalLeads}
            sub={`+${stats.leadsLast7d} esta semana`}
            icon={Users}
            color="emerald"
          />
          <Kpi
            label="Eventos próximos"
            value={stats.upcomingEvents}
            sub="publicados, futuros"
            icon={Calendar}
            color="gold"
          />
          <Kpi
            label="Reservas pendientes"
            value={stats.pendingReservations}
            sub="por confirmar"
            icon={Inbox}
            color={stats.pendingReservations > 0 ? "amber" : "emerald"}
          />
          <Kpi
            label="Reservas confirmadas"
            value={stats.confirmedReservations}
            sub="histórico"
            icon={TrendingUp}
            color="emerald"
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-red-300">No se pudieron cargar las métricas.</p>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: typeof Users;
  color: "emerald" | "gold" | "amber";
}) {
  const colorMap = {
    emerald: "text-emerald-glow bg-emerald-deep/30 border-emerald-brand/30",
    gold: "text-gold-warm bg-gold-warm/10 border-gold-warm/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  };
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-eyebrow text-bone/60">{label}</p>
        <div className={`grid size-9 place-items-center rounded-full border ${colorMap[color]}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}
