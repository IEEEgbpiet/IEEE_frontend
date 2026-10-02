export default function Stats() {
  const stats = [
    {
      number: '30+',
      label: 'TEAM MEMBERS',
    },
    {
      number: '25+',
      label: 'WORKSHOPS CONDUCTED',
    },
    {
      number: '112+',
      label: 'EVENTS & ACTIVITIES',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Heading */}
        <div className="mb-10 border-b border-white/10 pb-5 sm:mb-14 sm:pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue-dark sm:mb-3 sm:text-sm">
            Our Impact
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            By the <span className="text-brand-blue-dark">Numbers.</span>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group py-7 sm:py-9 md:px-8 md:py-4 lg:px-12 ${
                index === 0 ? 'md:pl-0' : ''
              } ${index === stats.length - 1 ? 'md:pr-0' : ''}`}
            >
              {/* Number */}
              <span
                className="
                  block
                  text-5xl
                  font-black
                  leading-none
                  tracking-[-0.05em]
                  text-white
                  transition-all
                  duration-500
                  group-hover:text-brand-blue-dark

                  sm:text-6xl
                  md:text-7xl
                  lg:text-8xl
                "
              >
                {stat.number}
              </span>

              {/* Accent */}
              <span className="mt-4 block h-1 w-8 bg-[#00629b] transition-all duration-500 group-hover:w-16 sm:mt-5" />

              {/* Label */}
              <p className="mt-4 max-w-[220px] text-xs font-semibold tracking-[0.16em] text-white/45 sm:mt-5 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#00629b]/10 blur-[120px]" />
    </section>
  );
}
