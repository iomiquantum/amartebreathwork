/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#050505",
          900: "#0B0F0D",
          800: "#0F1411",
          700: "#1A1A1A",
          600: "#222628",
        },
        emerald: {
          brand: "#00C896",
          deep: "#0F3D34",
          glow: "#10E0A8",
        },
        gold: {
          warm: "#D4AF37",
          soft: "#E6C77A",
        },
        bone: "#F5F2EA",
        muted: "#A7A7A7",
        lavender: {
          soft: "#C7B8FF",
          deep: "#8B7AB8",
        },
        coral: {
          warm: "#FCA5A5",
          soft: "#FED7D7",
        },
        orange: {
          brand: "#FF6B35",
          deep: "#3D1F15",
          glow: "#FF8C5C",
        },
        // Paleta dinámica para landings por género (/mujeres /hombres).
        // Valores reales en .theme-women / .theme-men en src/index.css.
        // Fallback al verde marca si no hay clase aplicada.
        primary: {
          DEFAULT: "rgb(var(--color-primary, 0 200 150) / <alpha-value>)",
          glow: "rgb(var(--color-primary-glow, 16 224 168) / <alpha-value>)",
          deep: "rgb(var(--color-primary-deep, 15 61 52) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary, 212 175 55) / <alpha-value>)",
          soft: "rgb(var(--color-secondary-soft, 230 199 122) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Inter Tight"', "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.28em",
      },
      backgroundImage: {
        "radial-emerald":
          "radial-gradient(ellipse at top, rgba(0,200,150,0.18) 0%, rgba(5,5,5,0) 60%)",
        "radial-gold":
          "radial-gradient(ellipse at bottom right, rgba(212,175,55,0.12) 0%, rgba(5,5,5,0) 55%)",
        "radial-lavender":
          "radial-gradient(ellipse at top left, rgba(199,184,255,0.18) 0%, rgba(5,5,5,0) 60%)",
        "radial-coral":
          "radial-gradient(ellipse at bottom right, rgba(252,165,165,0.14) 0%, rgba(5,5,5,0) 55%)",
        "radial-orange":
          "radial-gradient(ellipse at top, rgba(255,107,53,0.18) 0%, rgba(5,5,5,0) 60%)",
        "radial-primary":
          "radial-gradient(ellipse at top, rgb(var(--color-primary, 0 200 150) / 0.18) 0%, rgba(5,5,5,0) 60%)",
        "radial-secondary":
          "radial-gradient(ellipse at bottom right, rgb(var(--color-secondary, 212 175 55) / 0.12) 0%, rgba(5,5,5,0) 55%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        "glow-emerald":
          "0 0 0 1px rgba(0,200,150,0.25), 0 10px 40px -10px rgba(0,200,150,0.45)",
        "glow-emerald-strong":
          "0 0 0 1px rgba(0,200,150,0.4), 0 18px 60px -10px rgba(0,200,150,0.65)",
        "glow-gold":
          "0 0 0 1px rgba(212,175,55,0.25), 0 10px 40px -10px rgba(212,175,55,0.4)",
        "glow-orange":
          "0 0 0 1px rgba(255,107,53,0.28), 0 10px 40px -10px rgba(255,107,53,0.5)",
        "glow-orange-strong":
          "0 0 0 1px rgba(255,107,53,0.45), 0 18px 60px -10px rgba(255,107,53,0.7)",
        "glow-primary":
          "0 0 0 1px rgb(var(--color-primary, 0 200 150) / 0.25), 0 10px 40px -10px rgb(var(--color-primary, 0 200 150) / 0.45)",
        "glow-primary-strong":
          "0 0 0 1px rgb(var(--color-primary, 0 200 150) / 0.4), 0 18px 60px -10px rgb(var(--color-primary, 0 200 150) / 0.65)",
      },
      animation: {
        "wave-slow": "wave 18s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        "float-y": "floatY 6s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%,100%": { transform: "translateX(-2%) scaleY(1)" },
          "50%": { transform: "translateX(2%) scaleY(1.06)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
