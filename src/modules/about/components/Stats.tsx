import { statsData } from '@/data/about/content';

export default function AboutStats() {
  return (
    <section className="relative overflow-hidden bg-black py-10 sm:py-12 lg:py-14">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/[0.06] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue-dark">
            Our Impact
          </p>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            By the <span className="text-brand-blue-dark">Numbers.</span>
          </h2>
          <div className="mx-auto mt-4 flex w-fit items-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#00629b]" />
            <span className="h-1 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#00629b]/40 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_rgba(0,98,155,0.12)] sm:rounded-3xl sm:p-8"
              style={{ animation: `fadeUp 0.6s ease-out ${index * 0.1}s both` }}
            >
              {/* Glow on hover */}
              <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[#00629b]/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Number */}
              <span className="block bg-gradient-to-br from-white to-white/60 bg-clip-text text-5xl font-black leading-none tracking-[-0.05em] text-transparent transition-all duration-500 group-hover:from-[#00629b] group-hover:to-blue-300 sm:text-6xl lg:text-7xl">
                {stat.number}
              </span>

              {/* Accent bar */}
              <span className="mt-4 block h-0.5 w-8 bg-[#00629b] transition-all duration-500 group-hover:w-14 sm:mt-5" />

              {/* Label */}
              <p className="mt-4 text-sm font-bold tracking-wide text-white/90 sm:text-base">
                {stat.label}
              </p>

              {/* Description */}
              <p className="mt-1.5 text-[11px] leading-5 text-white/35 sm:text-xs">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
