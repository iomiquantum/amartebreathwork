import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, MessageCircle, X } from "lucide-react";

type ToastTone = "success" | "info";
type Toast = { id: number; title: string; message?: string; tone: ToastTone };

interface ToastCtx {
  notify: (t: Omit<Toast, "id">) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used within <ToastProvider>");
  return v;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </Ctx.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const Icon = toast.tone === "success" ? CheckCircle2 : MessageCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-emerald-brand/30 bg-ink-900/95 p-4 shadow-glow-emerald backdrop-blur"
    >
      <span className="mt-0.5 grid size-8 flex-shrink-0 place-items-center rounded-full bg-emerald-deep/60 text-emerald-glow">
        <Icon className="size-4" strokeWidth={1.8} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-bone">{toast.title}</p>
        {toast.message && <p className="mt-0.5 text-xs text-bone/70">{toast.message}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-bone/50 transition-colors hover:text-bone"
        aria-label="Cerrar"
      >
        <X className="size-4" />
      </button>
    </motion.div>
  );
}
