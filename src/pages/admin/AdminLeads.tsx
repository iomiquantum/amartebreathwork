// Lista de leads con filtro por búsqueda + export CSV.

import { useEffect, useMemo, useState } from "react";
import { Loader2, Download, Search, Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  whatsapp: string;
  email: string | null;
  country_code: string | null;
  country_name: string | null;
  city: string | null;
  intent: string | null;
  source: string | null;
};

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!supabase) return;
    async function load() {
      if (!supabase) return;
      const { data } = await supabase
        .from("breathwork_leads")
        .select("id, created_at, name, whatsapp, email, country_code, country_name, city, intent, source")
        .order("created_at", { ascending: false })
        .limit(1000);
      setLeads((data ?? []) as Lead[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.whatsapp, l.email, l.city, l.country_name, l.source, l.intent]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [leads, search]);

  function exportCSV() {
    const headers = ["created_at", "name", "whatsapp", "email", "country_name", "city", "intent", "source"];
    const rows = filtered.map((l) =>
      headers
        .map((h) => {
          const val = (l as unknown as Record<string, unknown>)[h];
          if (val == null) return "";
          const str = String(val).replaceAll('"', '""');
          return /[",\n]/.test(str) ? `"${str}"` : str;
        })
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amarte-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Leads</h2>
          <p className="mt-1 text-sm text-muted">Últimos 1000 leads capturados. Buscar y exportar CSV.</p>
        </div>
        <button
          type="button"
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-bone/80 hover:border-bone/30 hover:text-bone disabled:opacity-50"
        >
          <Download className="size-3.5" />
          Exportar CSV ({filtered.length})
        </button>
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bone/40" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email, WhatsApp, ciudad…"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-10 pr-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
        />
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" /> Cargando leads…
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.06] text-[10px] uppercase tracking-eyebrow text-bone/50">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Contacto</th>
                <th className="px-4 py-3 text-left">Ubicación</th>
                <th className="px-4 py-3 text-left">Intent / source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-bone/60">
                    {new Date(l.created_at).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-bone">{l.name}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <a
                        href={`https://wa.me/${l.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-bone/80 hover:text-emerald-glow"
                      >
                        <Phone className="size-3" />
                        {l.whatsapp}
                      </a>
                      {l.email && (
                        <a
                          href={`mailto:${l.email}`}
                          className="inline-flex items-center gap-1.5 text-bone/60 hover:text-emerald-glow"
                        >
                          <Mail className="size-3" />
                          {l.email}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-bone/70">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3 text-bone/40" />
                      {[l.city, l.country_name].filter(Boolean).join(", ") || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-bone/80">{l.intent ?? "—"}</span>
                      <span className="text-[10px] text-bone/40">{l.source ?? "—"}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                    No hay leads que coincidan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
