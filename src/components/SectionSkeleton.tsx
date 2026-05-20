export function SectionSkeleton() {
  return (
    <div aria-hidden className="container-x py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="mx-auto mt-5 h-9 w-3/4 animate-pulse rounded-2xl bg-white/[0.04]" />
        <div className="mx-auto mt-4 h-4 w-2/3 animate-pulse rounded-full bg-white/[0.03]" />
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.02]"
          />
        ))}
      </div>
    </div>
  );
}
