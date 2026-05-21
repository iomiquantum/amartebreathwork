// Service Worker AMARTE Breathwork
// Estrategia:
//  - HTML (navigate): network-first, fallback al cache (offline). No cachear /admin*.
//  - Static (CSS/JS/fonts/images en /assets/): cache-first con stale-while-revalidate.
//  - Resto: network-first transparente.

const VERSION = "v1-2026-05-21";
const STATIC_CACHE = `amarte-static-${VERSION}`;
const HTML_CACHE = `amarte-html-${VERSION}`;

const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(HTML_CACHE);
      try {
        await cache.add(OFFLINE_URL);
      } catch {
        /* offline at install — ignore */
      }
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("amarte-") && !k.endsWith(VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/assets/") ||
    /\.(woff2?|ttf|otf|eot|png|jpg|jpeg|webp|avif|svg|ico)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // No cachear requests cross-origin (Supabase, ipapi, etc.)
  if (url.origin !== self.location.origin) return;
  // No interceptar el admin (datos sensibles + queremos siempre fresco)
  if (url.pathname.startsWith("/admin")) return;
  // No interceptar HMR / sourcemaps
  if (url.pathname.includes("__vite") || url.pathname.endsWith(".map")) return;

  // HTML navigation: network-first
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(HTML_CACHE);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(HTML_CACHE);
          const cached = await cache.match(req);
          if (cached) return cached;
          const fallback = await cache.match(OFFLINE_URL);
          return fallback ?? Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets: cache-first + stale-while-revalidate
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => null);
        return cached ?? (await network) ?? Response.error();
      })(),
    );
    return;
  }

  // Default: passthrough
});
