// Dashboard overview: KPIs principales + gráficas SVG inline (sin deps).

import { useEffect, useMemo, useState } from "react";
import { Users, Calendar, Inbox, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Skeleton, ScreenReaderLoading } from "../../components/Skeleton";

type Stats = {
  totalLeads: number;
  leadsLast7d: number;
  upcomingEvents: number;
  pendingReservations: number;
  confirmedReservations: number;
};

type LeadsByDay = { date: string; count: number };
type ReservationsByMethod = { method: string; count: number };

const DAYS = 30;

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leadsByDay, setLeadsByDay] = useState<LeadsByDay[]>([]);
  const [resByMethod, setResByMethod] = useState<ReservationsByMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    async function load() {
      if (!supabase) return;
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const thirtyDaysAgo = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();

      const [totalLeads, leadsLast7d, upcoming, pending, confirmed, leadsRaw, reservationsRaw] =
        await Promise.all([
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
          supabase
            .from("breathwork_leads")
            .select("created_at")
            .gte("created_at", thirtyDaysAgo)
            .order("created_at", { ascending: true }),
          supabase
            .from("breathwork_reservations")
            .select("payment_method, payment_status"),
        ]);

      setStats({
        totalLeads: totalLeads.count ?? 0,
        leadsLast7d: leadsLast7d.count ?? 0,
        upcomingEvents: upcoming.count ?? 0,
        pendingReservations: pending.count ?? 0,
        confirmedReservations: confirmed.count ?? 0,
      });

      // Agrupar leads por día (relleno 30 días con 0)
      const buckets: Record<string, number> = {};
      for (let i = DAYS - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        buckets[d.toISOString().slice(0, 10)] = 0;
      }
      (leadsRaw.data ?? []).forEach((row: { created_at: string }) => {
        const k = row.created_at.slice(0, 10);
        if (k in buckets) buckets[k]++;
      });
      setLeadsByDay(
        Object.entries(buckets).map(([date, count]) => ({ date, count })),
      );

      // Agrupar reservas por método (solo no cancelled)
      const methodCounts: Record<string, number> = {};
      (reservationsRaw.data ?? []).forEach(
        (row: { payment_method: string; payment_status: string }) => {
          if (row.payment_status === "cancelled") return;
          methodCounts[row.payment_method] = (methodCounts[row.payment_method] ?? 0) + 1;
        },
      );
      setResByMethod(
        Object.entries(methodCounts).map(([method, count]) => ({ method, count })),
      );

      setLoading(false);
    }
    load();
  }, []);

  const conversionRate = useMemo(() => {
    if (!stats || stats.totalLeads === 0) return 0;
    return Math.round((stats.confirmedReservations / stats.totalLeads) * 1000) / 10;
  }, [stats]);

  return (
    <div>
      <h2 className="font-display text-2xl">Resumen</h2>
      <p className="mt-1 text-sm text-muted">Estado del negocio en un vistazo.</p>

      {loading ? (
        <>
          <ScreenReaderLoading label="Cargando métricas…" />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="size-9 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-9 w-16" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-48 w-full rounded-2xl" />
        </>
      ) : stats ? (
        <>
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
            <Kpi
              label="Conversión global"
              value={`${conversionRate}%`}
              sub="leads → reservas confirmadas"
              icon={TrendingUp}
              color={conversionRate >= 5 ? "emerald" : "amber"}
            />
          </div>

          <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-eyebrow text-bone/60">
                    Leads por día — últimos {DAYS} días
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Total: <strong className="text-bone">{leadsByDay.reduce((s, d) => s + d.count, 0)}</strong>
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <LeadsBarChart data={leadsByDay} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs uppercase tracking-eyebrow text-bone/60">
                Reservas por método
              </p>
              <p className="mt-1 text-xs text-muted">activas (no canceladas)</p>
              <div className="mt-4">
                {resByMethod.length > 0 ? (
                  <ReservationsDonut data={resByMethod} />
                ) : (
                  <p className="text-sm text-muted">Sin reservas activas todavía.</p>
                )}
              </div>
            </div>
          </section>
        </>
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
  value: number | string;
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

// SVG bar chart inline — sin deps externas.
function LeadsBarChart({ data }: { data: LeadsByDay[] }) {
  const W = 600;
  const H = 140;
  const padTop = 8;
  const padBottom = 18;
  const padX = 4;
  const innerH = H - padTop - padBottom;
  const max = Math.max(1, ...data.map((d) => d.count));
  const barW = (W - padX * 2) / data.length;
  const yTicks = [0, Math.ceil(max / 2), max];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Leads por día últimos 30 días"
      className="h-40 w-full"
      preserveAspectRatio="none"
    >
      {/* Grid */}
      {yTicks.map((t) => {
        const y = padTop + innerH - (t / max) * innerH;
        return (
          <g key={t}>
            <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={padX} y={y - 2} fontSize="9" fill="rgba(245,242,234,0.4)">
              {t}
            </text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const h = (d.count / max) * innerH;
        const x = padX + i * barW;
        const y = padTop + innerH - h;
        const isToday = i === data.length - 1;
        return (
          <g key={d.date}>
            <rect
              x={x + 0.5}
              y={y}
              width={Math.max(0, barW - 1.5)}
              height={Math.max(0, h)}
              fill={isToday ? "#10E0A8" : "#00C896"}
              opacity={d.count > 0 ? 0.85 : 0.2}
              rx="1.5"
            >
              <title>
                {d.date}: {d.count} leads
              </title>
            </rect>
          </g>
        );
      })}
      {/* X-axis: solo primer/medio/último día */}
      {[0, Math.floor(data.length / 2), data.length - 1].map((i) => {
        if (!data[i]) return null;
        const x = padX + i * barW + barW / 2;
        return (
          <text
            key={i}
            x={x}
            y={H - 4}
            fontSize="9"
            fill="rgba(245,242,234,0.5)"
            textAnchor="middle"
          >
            {data[i].date.slice(5)}
          </text>
        );
      })}
    </svg>
  );
}

const METHOD_COLORS: Record<string, string> = {
  payphone: "#10E0A8",
  transferencia: "#E2C879",
  efectivo: "#5B8DEF",
};

const METHOD_LABELS: Record<string, string> = {
  payphone: "PayPhone",
  transferencia: "Transferencia",
  efectivo: "Efectivo",
};

function ReservationsDonut({ data }: { data: ReservationsByMethod[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const R = 50;
  const inner = 28;
  const C = 2 * Math.PI * R;
  let accumPct = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <svg viewBox="-60 -60 120 120" role="img" aria-label="Distribución por método" className="size-32 -rotate-90">
        {data.map((d) => {
          const pct = d.count / total;
          const len = pct * C;
          const offset = -accumPct * C;
          accumPct += pct;
          return (
            <circle
              key={d.method}
              r={R}
              cx="0"
              cy="0"
              fill="transparent"
              stroke={METHOD_COLORS[d.method] ?? "#999"}
              strokeWidth={R - inner}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={offset}
            >
              <title>
                {METHOD_LABELS[d.method] ?? d.method}: {d.count} ({Math.round(pct * 100)}%)
              </title>
            </circle>
          );
        })}
        <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" fill="#F5F2EA" transform="rotate(90)">
          {total}
        </text>
      </svg>
      <ul className="flex-1 space-y-2 text-xs">
        {data.map((d) => (
          <li key={d.method} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-bone/80">
              <span
                aria-hidden
                className="inline-block size-2.5 rounded-full"
                style={{ background: METHOD_COLORS[d.method] ?? "#999" }}
              />
              {METHOD_LABELS[d.method] ?? d.method}
            </span>
            <span className="font-medium text-bone">
              {d.count}{" "}
              <span className="text-bone/50">({Math.round((d.count / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
