// Inicialización de pixels de marketing.
// Cuando llenes los IDs en siteConfig.ts, estos scripts se cargan automáticamente.
// Si están vacíos, no se carga nada (útil en dev).
//
// IDs necesarios:
// - Meta Pixel: business.facebook.com → Events Manager → tu pixel → Settings
// - Google Analytics 4: analytics.google.com → Admin → Data Streams → Web → Measurement ID
// - TikTok Pixel: ads.tiktok.com → Events → Web Events → Pixel ID
// - Microsoft Clarity: clarity.microsoft.com → Project Settings → Setup → Project ID

import { siteConfig } from "../data/siteConfig";

let initialized = false;

export function initPixels() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const { metaPixelId, gaMeasurementId, tiktokPixelId, clarityProjectId } = siteConfig;

  // ── Meta Pixel (Facebook + Instagram Ads) ──────────────────────────
  if (metaPixelId) {
    /* eslint-disable */
    // @ts-expect-error fbq global setup script (snippet oficial de Meta)
    !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq?.("init", metaPixelId);
    window.fbq?.("track", "PageView");
  }

  // ── Google Analytics 4 ─────────────────────────────────────────────
  if (gaMeasurementId) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    // gtag must use arguments object (not arrow) for GA4 internal compat
    function gtag(..._args: unknown[]) {
      window.dataLayer?.push(arguments);
    }
    window.gtag = gtag as typeof window.gtag;
    window.gtag?.("js", new Date());
    window.gtag?.("config", gaMeasurementId, { send_page_view: true });
  }

  // ── TikTok Pixel ──────────────────────────────────────────────────
  if (tiktokPixelId) {
    /* eslint-disable */
    // @ts-expect-error ttq global setup script (snippet oficial de TikTok)
    !(function (w: any, d: any, t: any) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
      ];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t: any) {
        var e = ttq._i[t] || [];
        for (var n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      };
      ttq.load = function (e: any, n: any) {
        var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = i;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        var o = document.createElement("script");
        o.type = "text/javascript";
        o.async = !0;
        o.src = i + "?sdkid=" + e + "&lib=" + t;
        var a = document.getElementsByTagName("script")[0];
        a.parentNode!.insertBefore(o, a);
      };
      ttq.load(tiktokPixelId);
      ttq.page();
    })(window, document, "ttq");
    /* eslint-enable */
  }

  // ── Microsoft Clarity (heatmaps + session recordings) ──────────────
  // Free, ilimitado, GDPR-compliant. Game-changer para entender UX.
  if (clarityProjectId) {
    /* eslint-disable */
    (function (c: any, l: any, a: any, r: any, i: any) {
      c[a] = c[a] || function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
      const t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", clarityProjectId);
    /* eslint-enable */
  }
}
