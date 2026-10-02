import { ethicsValues, type ValueItem } from '@/data/about/content';

// --- Inline SVG icons keyed by iconId --------------------------
function ValueIcon({ iconId }: { iconId: ValueItem['iconId'] }) {
  const base = 'h-6 w-6';
  switch (iconId) {
    case 'excellence':
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      );
    case 'integrity':
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      );
    case 'collaboration':
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      );
    case 'innovation':
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
      );
    case 'inclusion':
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
          />
        </svg>
      );
    case 'service':
      return (
        <svg
          className={base}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      );
  }
}

// Accent colour map
const accentMap: Record<string, { icon: string; border: string; bg: string; glow: string }> = {
  blue: {
    icon: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    glow: 'bg-blue-500/20',
  },
  cyan: {
    icon: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/10',
    glow: 'bg-cyan-500/20',
  },
  purple: {
    icon: 'text-purple-400',
    border: 'border-purple-500/20',
    bg: 'bg-purple-500/10',
    glow: 'bg-purple-500/20',
  },
  yellow: {
    icon: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10',
    glow: 'bg-yellow-500/20',
  },
  emerald: {
    icon: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    glow: 'bg-emerald-500/20',
  },
  orange: {
    icon: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/10',
    glow: 'bg-orange-500/20',
  },
};

export default function EthicsValues() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#00629b]/[0.06] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue-dark">
            Our Foundation
          </p>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Ethics &amp;{' '}
            <span className="text-brand-blue-dark drop-shadow-[0_0_25px_rgba(0,98,155,0.3)]">
              Values
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
            The core principles that every IEEE GBPIET member embodies in their work and conduct.
          </p>
          <div className="mx-auto mt-6 flex w-fit items-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#00629b]" />
            <span className="h-1 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* Values grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {ethicsValues.map((value, index) => {
            const colors = accentMap[value.accent] ?? accentMap.blue;
            return (
              <article
                key={value.title}
                className={`group relative overflow-hidden rounded-2xl border bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.05] sm:rounded-3xl sm:p-7 ${colors.border} hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]`}
                style={{ animation: `fadeUp 0.6s ease-out ${index * 0.08}s both` }}
              >
                {/* Bottom glow on hover */}
                <div
                  className={`pointer-events-none absolute -bottom-8 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${colors.glow}`}
                />

                {/* Icon */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-500 group-hover:scale-110 ${colors.bg} ${colors.border} ${colors.icon}`}
                >
                  <ValueIcon iconId={value.iconId} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white sm:text-xl">{value.title}</h3>

                {/* Accent bar */}
                <div
                  className={`mt-3 h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-14 ${colors.glow.replace('bg-', 'bg-')}`}
                  style={{ background: 'currentColor' }}
                />

                {/* Description */}
                <p className="mt-4 text-sm leading-7 text-white/45 sm:text-sm">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
