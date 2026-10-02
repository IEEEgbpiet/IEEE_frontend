import { leadershipData, type LeaderItem } from '@/data/about/content';

function LeaderCard({ leader, index }: { leader: LeaderItem; index: number }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 sm:rounded-3xl ${
        leader.isPrimary
          ? 'border-[#00629b]/30 bg-[#00629b]/5 hover:border-[#00629b]/50 hover:shadow-[0_20px_50px_rgba(0,98,155,0.18)]'
          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
      }`}
      style={{ animation: `fadeUp 0.6s ease-out ${index * 0.08}s both` }}
    >
      {/* Subtle top accent line */}
      <div
        className={`h-0.5 w-full ${
          leader.isPrimary
            ? 'bg-gradient-to-r from-transparent via-[#00629b] to-transparent'
            : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
        }`}
      />

      <div className="flex items-center gap-5 p-5 sm:p-6">
        {/* Left Side: Photo / Avatar */}
        <div
          className={`relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-xl font-black transition-all duration-500 group-hover:scale-105 sm:h-24 sm:w-24 sm:text-2xl ${
            leader.isPrimary
              ? 'bg-[#00629b] text-white shadow-[0_8px_25px_rgba(0,98,155,0.4)]'
              : 'bg-white/[0.08] text-white/60'
          }`}
        >
          {leader.image ? (
            <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" />
          ) : (
            leader.initials
          )}

          {leader.isPrimary && (
            <span className="absolute inset-0 rounded-2xl ring-2 ring-[#00629b]/30 ring-offset-2 ring-offset-transparent" />
          )}
        </div>

        {/* Right Side: Information */}
        <div className="min-w-0 flex-1">
          {leader.isPrimary && (
            <span className="mb-2 inline-block rounded-full border border-[#00629b]/30 bg-[#00629b]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue-dark">
              Faculty Advisor
            </span>
          )}

          {/* Department / Category */}
          <p
            className={`truncate text-xs font-semibold uppercase tracking-[0.2em] ${
              leader.isPrimary ? 'text-brand-blue-dark' : 'text-white/35'
            }`}
          >
            {leader.department}
          </p>

          {/* Name */}
          <h3 className="mt-1 truncate text-lg font-bold text-white sm:text-xl">{leader.name}</h3>

          {/* Role subtitle */}
          <p className="mt-0.5 truncate text-sm text-white/45">{leader.role}</p>
        </div>
      </div>

      {/* Hover bottom glow */}
      <div
        className={`pointer-events-none absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          leader.isPrimary ? 'bg-[#00629b]/30' : 'bg-white/10'
        }`}
      />
    </article>
  );
}

export default function LeadershipStructure() {
  const counselor = leadershipData.find((l) => l.isPrimary);
  const committee = leadershipData.filter((l) => !l.isPrimary);

  return (
    <section className="relative overflow-hidden bg-black py-10 sm:py-12 lg:py-14">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#00629b]/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/3 h-80 w-80 rounded-full bg-slate-700/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-10 bg-[#00629b]" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue-dark">
              Leadership
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Our{' '}
            <span className="text-brand-blue-dark drop-shadow-[0_0_25px_rgba(0,98,155,0.3)]">
              Leadership
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
            The dedicated team guiding IEEE GBPIET Student Branch towards excellence and impact.
          </p>
        </div>

        {/* Branch Counselor - spotlight */}
        {counselor && (
          <div className="mb-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30">
              Branch Counselor
            </p>
            <div className="max-w-md">
              <LeaderCard leader={counselor} index={0} />
            </div>
          </div>
        )}

        {/* Executive Committee */}
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30">
            Executive Committee
          </p>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5">
            {committee.map((leader, index) => (
              <LeaderCard key={leader.name} leader={leader} index={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
