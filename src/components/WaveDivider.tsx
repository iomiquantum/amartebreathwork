interface Props {
  flip?: boolean;
  intensity?: "soft" | "medium";
}

export function WaveDivider({ flip = false, intensity = "soft" }: Props) {
  const opacity = intensity === "soft" ? 0.18 : 0.32;
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative h-12 sm:h-16 ${flip ? "rotate-180" : ""}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`wd-${flip ? "f" : "n"}-${intensity}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C896" stopOpacity="0" />
            <stop offset="50%" stopColor="#00C896" stopOpacity={opacity} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 4 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${30 + i * 4} Q360 ${10 + i * 6} 720 ${30 + i * 4} T1440 ${30 + i * 4}`}
            stroke={`url(#wd-${flip ? "f" : "n"}-${intensity})`}
            strokeWidth="1"
            fill="none"
            opacity={1 - i * 0.18}
          />
        ))}
      </svg>
    </div>
  );
}
