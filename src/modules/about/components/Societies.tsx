import { societiesData, type SocietyItem } from '@/data/about/content';

// -- Society icons (inline SVG) ----------------------------------
function SocietyIcon({ iconId }: { iconId: SocietyItem['iconId'] }) {
  switch (iconId) {
    case 'cs':
      return (
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409A2.25 2.25 0 012.25 5.493V5.25"
          />
        </svg>
      );
    case 'pes':
      return (
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      );
    case 'wie':
      return (
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      );
  }
}

function SocietyCard({ society, index }: { society: SocietyItem; index: number }) {
  const accentTextMap: Record<string, string> = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    pink: 'text-pink-400',
  };
  const accentGlowMap: Record<string, string> = {
    blue: 'bg-blue-500/20',
    yellow: 'bg-yellow-500/20',
    pink: 'bg-pink-500/20',
  };
  const iconBgMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };
  const accentBarMap: Record<string, string> = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
  };

  const accentText = accentTextMap[society.accent] ?? 'text-blue-400';
  const accentGlow = accentGlowMap[society.accent] ?? 'bg-blue-500/20';
  const iconBg = iconBgMap[society.accent] ?? iconBgMap.blue;
  const accentBar = accentBarMap[society.accent] ?? 'bg-blue-500';

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 sm:rounded-3xl ${society.borderColor} hover:bg-white/[0.05] hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)]`}
      style={{ animation: `fadeUp 0.6s ease-out ${index * 0.12}s both` }}
    >
      {/* Top gradient bar */}
      <div className={`h-0.5 w-full opacity-60 ${accentBar}`} />

      <div className="p-7 sm:p-8 lg:p-9">
        {/* Icon + Acronym row */}
        <div className="mb-6 flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110 ${iconBg}`}
          >
            <SocietyIcon iconId={society.iconId} />
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black tracking-wider ${society.badgeColor}`}
          >
            {society.acronym}
          </span>
        </div>

        {/* Name */}
        <h3 className={`text-xl font-black sm:text-2xl ${accentText}`}>{society.name}</h3>
        <p className="mt-0.5 text-xs font-medium text-white/30">{society.fullName}</p>

        {/* Divider */}
        <div className={`my-5 h-px opacity-20 ${accentBar}`} />

        {/* Description */}
        <p className="text-sm leading-7 text-white/50 sm:text-base">{society.description}</p>

        {/* Focus tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {society.focus.map((tag) => (
            <span
              key={tag}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${society.badgeColor}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Learn more link */}
        <a
          href="https://www.ieee.org/membership/societies/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 ${accentText}`}
        >
          Learn more
          {/* Arrow right SVG */}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>

      {/* Bottom glow on hover */}
      <div
        className={`pointer-events-none absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${accentGlow}`}
      />
    </article>
  );
}

export default function Societies() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-32">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[#00629b]/[0.05] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue-dark">
            Expanding Collaboration
          </p>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Affinity{' '}
            <span className="text-brand-blue-dark drop-shadow-[0_0_25px_rgba(0,98,155,0.3)]">
              Groups
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
            Specialized IEEE societies within our branch, enabling focused collaboration across key
            domains of technology.
          </p>
          <div className="mx-auto mt-6 flex w-fit items-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#00629b]" />
            <span className="h-1 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {societiesData.map((society, index) => (
            <SocietyCard key={society.acronym} society={society} index={index} />
          ))}
        </div>

        {/* Bottom IEEE note */}
        <div className="mt-14 flex flex-col items-center gap-3 border-t border-white/[0.06] pt-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-white/30">
            All societies are affiliated with the global{' '}
            <a
              href="https://www.ieee.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue-dark transition-colors duration-300 hover:text-blue-400"
            >
              IEEE organization
            </a>
            .
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00629b]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20">
              GBPIET Student Branch
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
