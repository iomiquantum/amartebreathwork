// Skeleton components — UX percibida más rápida que spinner.
// Usar con clases Tailwind para tamaño/forma.

import type { ReactNode } from "react";

export function Skeleton({
  className = "",
  rounded = "rounded-lg",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-white/[0.05] ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      {children ?? (
        <>
          <Skeleton className="mb-3 h-3 w-24" />
          <Skeleton className="mb-2 h-7 w-1/2" />
          <SkeletonText lines={2} />
        </>
      )}
    </div>
  );
}

export function ScreenReaderLoading({ label }: { label: string }) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {label}
    </p>
  );
}
