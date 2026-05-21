// Login con magic link de Supabase Auth. Solo emails en allowlist.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { isAdminEmail, sendMagicLink, subscribeToAuth } from "../../lib/auth";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Si ya hay sesión válida (incluyendo después del magic link), redirigir a /admin.
  // onAuthStateChange dispara INITIAL_SESSION una vez Supabase procesa el URL hash.
  useEffect(() => {
    let mounted = true;
    const unsub = subscribeToAuth((session) => {
      if (!mounted) return;
      if (session && isAdminEmail(session.user.email)) {
        navigate("/admin", { replace: true });
      }
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError("");
    const res = await sendMagicLink(email.trim().toLowerCase());
    if (res.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(res.error ?? "No pudimos enviar el link.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 text-bone">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40">
              <Lock className="size-4 text-emerald-glow" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-eyebrow text-emerald-brand">
                Acceso restringido
              </p>
              <h1 className="font-display text-xl">Admin AMARTE</h1>
            </div>
          </div>

          {status === "sent" ? (
            <div className="mt-6 rounded-2xl border border-emerald-brand/30 bg-emerald-deep/20 p-5">
              <CheckCircle2 className="size-6 text-emerald-glow" />
              <p className="mt-3 font-medium text-bone">Revisa tu email</p>
              <p className="mt-1 text-sm text-bone/80">
                Te enviamos un link de un solo uso a <strong>{email}</strong>.
                Es válido por 1 hora.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="mt-4 text-sm text-emerald-glow underline-offset-2 hover:underline"
              >
                Usar otro email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="text-xs uppercase tracking-eyebrow text-bone/60"
                >
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bone/40" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@amarteinc.com"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-10 pr-4 text-base text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                  />
                </div>
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enviando link…
                  </>
                ) : (
                  "Enviar magic link"
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted">
            Solo emails autorizados pueden ingresar.
          </p>
        </div>
      </div>
    </div>
  );
}
