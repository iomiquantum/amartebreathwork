import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, MessageCircle, Activity } from "lucide-react";
import { useWhatsappCTA } from "../lib/whatsapp";

const QUESTIONS = [
  {
    q: "Cuando intentas dormir, tu mente…",
    options: [
      { label: "Se apaga rápido", score: 0 },
      { label: "Tarda en bajar", score: 1 },
      { label: "No para de correr", score: 2 },
    ],
  },
  {
    q: "¿Cómo está tu cuerpo al final del día?",
    options: [
      { label: "Cansado pero suelto", score: 0 },
      { label: "Tenso en hombros o mandíbula", score: 1 },
      { label: "Rígido, contraído, agotado", score: 2 },
    ],
  },
  {
    q: "Tu respiración suele ser…",
    options: [
      { label: "Profunda, casi no la noto", score: 0 },
      { label: "Algo corta cuando hay presión", score: 1 },
      { label: "Superficial casi todo el día", score: 2 },
    ],
  },
  {
    q: "Cuando tienes 10 minutos libres…",
    options: [
      { label: "Disfruto el silencio", score: 0 },
      { label: "Tomo el celular en automático", score: 1 },
      { label: "Me cuesta estar sin hacer nada", score: 2 },
    ],
  },
  {
    q: "¿Hace cuánto te diste una pausa real?",
    options: [
      { label: "Esta semana", score: 0 },
      { label: "Hace algunas semanas", score: 1 },
      { label: "Ni me acuerdo", score: 2 },
    ],
  },
];

type Result = {
  level: "alerta" | "saturación" | "calma";
  title: string;
  body: string;
  tone: string;
};

function classify(score: number): Result {
  if (score >= 8) {
    return {
      level: "alerta",
      title: "Tu sistema nervioso está en alerta sostenida.",
      body: "Estás funcionando con el motor encendido todo el día. Una pausa sensorial profunda no es un lujo — es lo que tu cuerpo te está pidiendo.",
      tone: "from-rose-500/30 to-emerald-deep/30",
    };
  }
  if (score >= 4) {
    return {
      level: "saturación",
      title: "Tu sistema nervioso está saturado.",
      body: "Cargas más de lo que sueltas. Una experiencia inmersiva cada 15 días puede crear el espacio que tu cuerpo no se está dando solo.",
      tone: "from-gold-warm/30 to-emerald-deep/30",
    };
  }
  return {
    level: "calma",
    title: "Estás en una fase de calma — y eso también se cuida.",
    body: "Hay momentos así. La práctica regular ayuda a sostenerlos cuando la vida vuelve a apretar.",
    tone: "from-emerald-brand/30 to-emerald-deep/30",
  };
}

export function NerveTest() {
  const wa = useWhatsappCTA("hero_secondary");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const finished = step >= QUESTIONS.length;
  const score = answers.reduce((a, b) => a + b, 0);
  const result = finished ? classify(score) : null;

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const onPick = (s: number) => {
    setAnswers((prev) => [...prev, s]);
    setStep((s) => s + 1);
  };

  const progress = Math.round((step / QUESTIONS.length) * 100);

  return (
    <section
      id="test"
      aria-label="Test de saturación nerviosa"
      className="relative bg-ink-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-50" />
      <div className="container-tight relative">
        <div className="text-center">
          <span className="eyebrow">Test · 1 minuto</span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            ¿Tu sistema nervioso{" "}
            <span className="bg-gradient-to-r from-emerald-brand to-gold-warm bg-clip-text text-transparent">
              está saturado?
            </span>
          </h2>
          <p className="lede mx-auto mt-5 max-w-xl text-balance">
            Cinco preguntas rápidas. Sin emails, sin trampa. Solo para que sepas dónde
            estás parado.
          </p>
        </div>

        <div className="mt-12 gradient-border rounded-3xl p-6 sm:p-10">
          {/* Progress */}
          {!finished && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs uppercase tracking-eyebrow text-muted">
                <span>
                  Pregunta {step + 1} de {QUESTIONS.length}
                </span>
                <span className="text-emerald-brand">{progress}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-brand to-gold-warm"
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="font-display text-2xl text-bone sm:text-3xl text-balance">
                  {QUESTIONS[step].q}
                </h3>
                <ul className="mt-7 grid gap-3">
                  {QUESTIONS[step].options.map((opt) => (
                    <li key={opt.label}>
                      <button
                        onClick={() => onPick(opt.score)}
                        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-left text-bone/90 transition-all duration-200 hover:border-emerald-brand/40 hover:bg-emerald-deep/30 hover:text-bone"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="size-4 text-bone/40 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-glow" />
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  role="region"
                  aria-live="polite"
                  aria-label="Resultado del test"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${result.tone} p-6 sm:p-8`}
                  >
                    <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 px-3 py-1 text-xs sm:text-[10px] uppercase tracking-eyebrow text-bone/80 backdrop-blur">
                        <Activity className="size-3 text-emerald-glow" />
                        Resultado · {score}/10
                      </span>
                      <h3 className="font-display mt-4 text-2xl text-bone sm:text-3xl text-balance">
                        {result.title}
                      </h3>
                      <p className="mt-4 text-bone/85 leading-relaxed text-balance">
                        {result.body}
                      </p>

                      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <a
                          {...wa}
                          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
                        >
                          <MessageCircle className="size-4" strokeWidth={1.8} />
                          Únete al grupo de WhatsApp
                        </a>
                        <button
                          onClick={reset}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm text-bone/85 transition-colors hover:border-bone/30 hover:text-bone"
                        >
                          <RotateCcw className="size-4" />
                          Hacer el test de nuevo
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-xs text-muted">
                    Este test es orientativo y no reemplaza una valoración profesional.
                  </p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
