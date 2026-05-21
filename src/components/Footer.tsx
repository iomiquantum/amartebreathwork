import { Mail } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink py-14">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl tracking-tightest text-bone">
              {siteConfig.brandName}
            </p>
            <p className="mt-2 text-sm text-muted">{siteConfig.tagline}</p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-bone/80 sm:items-end">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram AMARTE"
              className="inline-flex items-center gap-2 transition-colors hover:text-emerald-glow"
            >
              <InstagramGlyph className="size-4" />
              {siteConfig.instagram}
            </a>
            <a
              href={siteConfig.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok AMARTE"
              className="inline-flex items-center gap-2 transition-colors hover:text-emerald-glow"
            >
              <TikTokGlyph className="size-4" />
              {siteConfig.tiktok}
            </a>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              aria-label="Enviar email a AMARTE"
              className="inline-flex items-center gap-2 transition-colors hover:text-emerald-glow"
            >
              <Mail className="size-4" strokeWidth={1.6} />
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brandName}. Todos los derechos reservados.
          </p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Legal">
            <a href="/privacidad.html" className="transition-colors hover:text-bone">
              Privacidad
            </a>
            <a href="/terminos.html" className="transition-colors hover:text-bone">
              Términos
            </a>
            <span>Quito · Ecuador</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
