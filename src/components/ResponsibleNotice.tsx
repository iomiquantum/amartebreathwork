import { ShieldCheck } from "lucide-react";

export function ResponsibleNotice() {
  return (
    <section aria-label="Aviso responsable" className="bg-ink py-12">
      <div className="container-tight">
        <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <ShieldCheck className="mt-0.5 size-5 flex-shrink-0 text-emerald-brand" strokeWidth={1.6} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-bone/70">
              Aviso responsable
            </p>
            <p className="mt-2 text-sm text-bone/70 leading-relaxed">
              Esta experiencia es una práctica de bienestar complementaria basada en
              respiración, sonido y regulación corporal. No reemplaza diagnóstico,
              tratamiento médico, atención psicológica ni psiquiátrica. Si tienes
              condiciones médicas, respiratorias, cardíacas, neurológicas, embarazo,
              crisis de pánico severas, epilepsia o estás bajo tratamiento, consulta con
              un profesional antes de participar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
