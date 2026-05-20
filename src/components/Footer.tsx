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
              className="inline-flex items-center gap-2 transition-colors hover:text-emerald-glow"
            >
              <InstagramGlyph className="size-4" />
              {siteConfig.instagram}
            </a>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
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
