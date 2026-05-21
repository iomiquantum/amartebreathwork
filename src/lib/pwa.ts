// Registro del service worker en producción.
// En desarrollo (vite dev) se omite porque vite no genera assets servibles
// y el SW interferiría con HMR.

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;

  // Esperar a load para no competir con el critical path
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Check para nuevas versiones (silenciosas — el SW se activa al próximo navigate)
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              // Nueva versión disponible. No interrumpimos al usuario;
              // se activará en la próxima carga.
              if (import.meta.env.DEV) {
                console.info("[pwa] new service worker installed");
              }
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[pwa] sw registration failed", err);
      });
  });
}

export function unregisterServiceWorker(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!("serviceWorker" in navigator)) return Promise.resolve();
  return navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}
