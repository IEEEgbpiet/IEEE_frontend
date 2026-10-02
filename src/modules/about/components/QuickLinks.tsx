import { quickLinks, type QuickLinkItem } from '@/data/about/content';

export default function QuickLinks() {
  return (
    <section className="relative overflow-hidden bg-black py-10 sm:py-12 lg:py-14 border-t border-white/[0.06]">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-8 bg-[#00629b]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue-dark">
                Resources
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Quick <span className="text-brand-blue-dark">Links</span>
            </h2>
          </div>
          <p className="text-xs text-white/40 sm:text-sm">
            Essential portals and documentation for members and visitors.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item: QuickLinkItem) => {
            const isExt = Boolean(item.isExternal);
            return (
              <a
                key={item.label}
                href={item.href}
                target={isExt ? '_blank' : undefined}
                rel={isExt ? 'noopener noreferrer' : undefined}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#00629b]/40 hover:bg-white/[0.05] hover:shadow-[0_12px_30px_rgba(0,98,155,0.12)] sm:rounded-2xl sm:p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white transition-colors duration-200 group-hover:text-blue-400 sm:text-base">
                      {item.label}
                    </span>
                    <svg
                      className="h-4 w-4 shrink-0 text-white/30 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-400"
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
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">{item.description}</p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-brand-blue-dark transition-colors group-hover:text-blue-300">
                  <span>{isExt ? 'Visit portal' : 'View section'}</span>
                  <span>-&gt;</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
