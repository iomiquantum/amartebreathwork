import { AdminMfa } from "../../components/AdminMfa";
// Layout compartido del admin: sidebar con navegación + outlet.
// Aplica AuthGuard implícito (si no hay sesión válida, redirige a /admin/login).

import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Loader2, LogOut, Calendar, Inbox, Users, LayoutDashboard } from "lucide-react";
import { isAdminEmail, signOut, subscribeToAuth } from "../../lib/auth";

export function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  // onAuthStateChange dispara INITIAL_SESSION después de que Supabase procesa el URL
  // hash del magic link, así que es el único listener que necesitamos (evita race
  // condition contra getSession() corriendo antes de que el hash se procese).
  useEffect(() => {
    let mounted = true;
    const unsub = subscribeToAuth((session) => {
      if (!mounted) return;
      if (!session || !isAdminEmail(session.user.email)) {
        navigate("/admin/login", { replace: true });
      } else {
        setEmail(session.user.email ?? null);
        setChecking(false);
      }
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, [navigate]);

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-bone">
        <Loader2 className="size-6 animate-spin text-emerald-glow" />
      </div>
    );
  }

  return (
    <AdminMfa>
    <div className="min-h-screen bg-ink text-bone">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-12 pt-24 sm:px-6 lg:flex-row lg:gap-8">
        <aside className="w-full shrink-0 lg:w-60">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <Link to="/" className="block text-xs uppercase tracking-eyebrow text-bone/50 hover:text-emerald-glow">
              ← Volver al sitio
            </Link>
            <p className="mt-3 font-display text-lg">Admin</p>
            <p className="mt-0.5 truncate text-xs text-muted">{email}</p>
          </div>

          <nav className="mt-4 space-y-1" aria-label="Navegación admin">
            <AdminNavItem to="/admin" exact icon={LayoutDashboard} label="Dashboard" />
            <AdminNavItem to="/admin/events" icon={Calendar} label="Eventos" />
            <AdminNavItem to="/admin/reservations" icon={Inbox} label="Reservas" />
            <AdminNavItem to="/admin/leads" icon={Users} label="Leads" />
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 flex w-full items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2.5 text-sm text-bone/80 transition-colors hover:border-bone/30 hover:text-bone"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
    </AdminMfa>
  );
}

function AdminNavItem({
  to,
  icon: Icon,
  label,
  exact,
}: {
  to: string;
  icon: typeof Calendar;
  label: string;
  exact?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? "bg-emerald-deep/30 text-emerald-glow"
            : "text-bone/75 hover:bg-white/[0.04] hover:text-bone"
        }`
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  );
}
