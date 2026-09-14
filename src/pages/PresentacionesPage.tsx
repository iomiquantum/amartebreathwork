// Presentaciones — hub con todas las categorías para no perderse.
// Cada tarjeta abre su vertical. Ruta: /presentaciones

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, Heart, Sparkles, GraduationCap, LayoutGrid, Snowflake, Leaf, Globe } from "lucide-react";
import { PageMeta } from "../components/PageMeta";
import { siteConfig } from "../data/siteConfig";

type Item = {
  to?: string;
  href?: string;
  icon: typeof Building2;
  title: string;
  desc: string;
};

const items: Item[] = [
  {
    to: "/corporativo",
    icon: Building2,
    title: "Corporativo",
    desc: "Breathwork para empresas y equipos en Ecuador.",
  },
  {
    to: "/jovenes",
    icon: GraduationCap,
    title: "Jóvenes · Niños · Colegios · Familias",
    desc: "Regulación emocional 9-17 años, colegios y AMARTE en Familia.",
  },
  {
    to: "/mujeres",
    icon: Heart,
    title: "Mujeres",
    desc: "Espacio dedicado para mujeres.",
  },
  {
    to: "/hombres",
    icon: Users,
    title: "Hombres",
    desc: "Espacio dedicado para hombres.",
  },
  {
    to: "/",
    icon: Sparkles,
    title: "Sesión general",
    desc: "La experiencia AMARTE Breathwork abierta.",
  },
  // Otras webs (proyectos separados — viven como subrutas del mismo dominio)
  {
    href: "/ice",
    icon: Snowflake,
    title: "ICE Reset Inmersivo",
    desc: "Hielo, respiración, música y frecuencias.",
  },
  {
    href: "/plant",
    icon: Leaf,
    title: "Plant Sound Immersion",
    desc: "Música de las plantas en Ecuador.",
  },
  {
    href: "/be-on",
    icon: Globe,
    title: "Amarte Be On",
    desc: "Web principal Amarte Be On 2026.",
  },
];

export function PresentacionesPage() {
  useEffect(() => {
    document.title = `Presentaciones — ${siteConfig.brandName}`;
  }, []);

  return (
    <div className="min-h-screen bg-ink text-bone">
      <PageMeta
        title={`Presentaciones — ${siteConfig.brandName}`}
        description="Todas las experiencias AMARTE en un solo lugar: corporativo, jóvenes y colegios, mujeres, hombres y eventos. Elige una categoría para abrir su presentación."
        path="/presentaciones"
      />
      <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/20 px-3 py-1 text-xs sm:text-[11px] uppercase tracking-eyebrow text-emerald-glow">
          <LayoutGrid className="size-3" /> Presentaciones
        </div>
        <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl">
          Todas las categorías
        </h1>
        <p className="mt-4 text-base text-bone/80 sm:text-lg">
          Elige una para abrir su presentación. Siempre puedes volver aquí.
        </p>

        <ul className="mt-10 space-y-3">
          {items.map((item) => {
            const inner = (
              <>
                <item.icon className="size-6 shrink-0 text-emerald-glow" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-bone group-hover:text-emerald-glow">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{item.desc}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-bone/40 group-hover:translate-x-0.5 group-hover:text-emerald-glow" />
              </>
            );
            const cls =
              "group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-emerald-brand/30 hover:bg-white/[0.04]";
            return (
              <li key={(item.to ?? item.href) + item.title}>
                {item.to ? (
                  <Link to={item.to} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <a href={item.href} className={cls}>
                    {inner}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
