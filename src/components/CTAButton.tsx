import { useRef, type ReactNode, type AnchorHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { usePrefersReducedMotion } from "../lib/useReducedMotion";

type Variant = "primary" | "ghost" | "gold";
type Size = "md" | "lg";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  trailingIcon?: boolean;
  fullWidth?: boolean;
  magnetic?: boolean;
}

export function CTAButton({
  variant = "primary",
  size = "lg",
  icon,
  trailingIcon = true,
  fullWidth,
  magnetic = true,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-brand/60 focus:ring-offset-2 focus:ring-offset-ink will-change-transform";
  const sizes: Record<Size, string> = {
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-7 text-base",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-emerald-brand text-ink-900 shadow-glow-emerald hover:bg-emerald-glow hover:shadow-glow-emerald-strong hover:scale-[1.015]",
    ghost:
      "border border-white/15 text-bone hover:border-emerald-brand/60 hover:text-emerald-glow hover:bg-emerald-deep/30",
    gold: "bg-gold-warm text-ink-900 shadow-glow-gold hover:bg-gold-soft hover:scale-[1.015]",
  };

  const magnet = (e: React.PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(e);
    if (!magnetic || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  };
  const reset = (e: React.PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(e);
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <a
      ref={ref}
      {...rest}
      onPointerMove={magnet}
      onPointerLeave={reset}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {icon}
      <span>{children}</span>
      {trailingIcon && (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </a>
  );
}
