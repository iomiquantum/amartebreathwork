import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SectionBannerProps {
  eyebrow?: string;
  title: string;
  description?: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
  reverse?: boolean;
}

export function SectionBanner({
  eyebrow,
  title,
  description,
  cta,
  href,
  image,
  alt,
  reverse = false,
}: SectionBannerProps) {
  return (
    <section className="relative bg-ink py-20 sm:py-24">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className={`group relative grid gap-8 overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-900 lg:grid-cols-2 lg:gap-0 ${
            reverse ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* Image side */}
          <Link
            to={href}
            className="relative aspect-[4/3] overflow-hidden lg:aspect-auto"
            aria-label={cta}
          >
            <img
              src={image}
              alt={alt}
              loading="lazy"
              decoding="async"
              width={1000}
              height={750}
              className="absolute inset-0 size-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent lg:bg-gradient-to-r"
            />
          </Link>

          {/* Text side */}
          <div className="relative flex flex-col justify-center gap-5 p-8 sm:p-12 lg:[direction:ltr]">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h3 className="h-display text-2xl text-balance sm:text-3xl lg:text-4xl">
              {title}
            </h3>
            {description && (
              <p className="text-base text-bone/75 leading-relaxed sm:text-lg">
                {description}
              </p>
            )}
            <Link
              to={href}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-brand px-6 py-3 text-sm font-semibold text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
            >
              {cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.2} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
