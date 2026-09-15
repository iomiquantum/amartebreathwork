// WhatsApp Gate — Captura de leads ANTES de redirigir al grupo de WhatsApp.
//
// Flujo:
// 1. Usuario click cualquier CTA de WhatsApp en la landing
// 2. Si NO está registrado en este dispositivo (localStorage) → abre modal con form
// 3. Form pide: nombre + país (selector default Ecuador) + WhatsApp + email opcional
// 4. Al enviar → guarda en breathwork_leads + marca registrado en localStorage
// 5. Ahora aparece botón "Entrar al grupo" → redirige a WhatsApp group URL
// 6. Próximas veces que click WhatsApp en este dispositivo → directo al grupo (sin form)
//
// Neuromarketing: el form aparece después de leer info, no al inicio.
// El gate también sirve para desbloquear el calendar de eventos.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "amarte_lead_registered";

export interface RegisteredLead {
  name: string;
  whatsapp: string;
  countryCode: string;
  countryName: string;
  email?: string;
  registeredAt: string; // ISO date
}

interface WhatsappGateContextValue {
  /** Si el usuario ya completó el form en este dispositivo */
  isRegistered: boolean;
  /** Datos del lead registrado, si existe */
  lead: RegisteredLead | null;
  /** Si el modal del gate está abierto */
  isOpen: boolean;
  /** Source del último click (para tracking) */
  source: string;
  /** Abrir el gate. Si ya está registrado, ejecuta onSuccess inmediatamente (skip form) */
  openGate: (source: string, onSuccess?: () => void) => void;
  /** Cerrar el modal sin completar */
  closeGate: () => void;
  /** Llamado por el modal cuando el usuario completa el form */
  markRegistered: (lead: RegisteredLead) => void;
  /** Callback que se ejecuta al completar el form (configurado al abrir) */
  pendingSuccessCallback: (() => void) | null;
}

const WhatsappGateContext = createContext<WhatsappGateContextValue | null>(null);

export function WhatsappGateProvider({ children }: { children: ReactNode }) {
  const [lead, setLead] = useState<RegisteredLead | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("");
  const [pendingSuccessCallback, setPendingSuccessCallback] = useState<(() => void) | null>(null);

  // Cargar de localStorage al montar
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const old = JSON.parse(raw);
        if (typeof old.registeredAt === "string" && Date.parse(old.registeredAt) > Date.now() - 90 * 86400000) {
          const minimal = {name:"",whatsapp:"",countryCode:"",countryName:"",registeredAt:old.registeredAt};
          setLead(minimal);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({registeredAt:old.registeredAt}));
        } else localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore corrupted
    }
  }, []);

  const isRegistered = lead !== null;

  const openGate = useCallback(
    (src: string, onSuccess?: () => void) => {
      setSource(src);
      if (isRegistered && onSuccess) {
        // Ya registrado → ejecutar callback directo (ej. redirigir a WhatsApp)
        onSuccess();
        return;
      }
      setPendingSuccessCallback(() => onSuccess ?? null);
      setIsOpen(true);
    },
    [isRegistered]
  );

  const closeGate = useCallback(() => {
    setIsOpen(false);
    setPendingSuccessCallback(null);
  }, []);

  const markRegistered = useCallback(
    (newLead: RegisteredLead) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({registeredAt:newLead.registeredAt}));
      } catch {
        // ignore quota
      }
      setLead(newLead);
      setIsOpen(false);
      // Ejecutar callback pendiente (ej. abrir WhatsApp)
      pendingSuccessCallback?.();
      setPendingSuccessCallback(null);
    },
    [pendingSuccessCallback]
  );

  const value = useMemo(
    () => ({
      isRegistered,
      lead,
      isOpen,
      source,
      openGate,
      closeGate,
      markRegistered,
      pendingSuccessCallback,
    }),
    [isRegistered, lead, isOpen, source, openGate, closeGate, markRegistered, pendingSuccessCallback]
  );

  return <WhatsappGateContext.Provider value={value}>{children}</WhatsappGateContext.Provider>;
}

export function useWhatsappGate() {
  const ctx = useContext(WhatsappGateContext);
  if (!ctx) throw new Error("useWhatsappGate must be used within WhatsappGateProvider");
  return ctx;
}
