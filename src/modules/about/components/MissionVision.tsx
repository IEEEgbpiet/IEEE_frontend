import { strategicPlan } from '@/data/about/content';

function MissionVisionCard({
  heading,
  body,
  isMission,
}: {
  heading: string;
  body: string;
  isMission: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-6 sm:p-8 lg:p-10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 sm:rounded-3xl ${
        isMission
          ? 'border-[#00629b]/25 bg-[#00629b]/5 hover:border-[#00629b]/45 hover:bg-[#00629b]/10 hover:shadow-[0_20px_50px_rgba(0,98,155,0.15)]'
          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_rgba(255,255,255,0.04)]'
      }`}
    >
      {/* Subtle corner accent */}
      <div
        className={`pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-full transition-all duration-500 group-hover:h-36 group-hover:w-36 ${
          isMission ? 'bg-[#00629b]/10' : 'bg-white/[0.03]'
        }`}
      />

      {/* Large white heading */}
      <h3 className="text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">
        {heading}
      </h3>

      {/* Subtle accent divider */}
      <div
        className={`mt-4 h-0.5 w-12 transition-all duration-500 group-hover:w-20 ${
          isMission ? 'bg-[#00629b]' : 'bg-white/30'
        }`}
      />

      {/* Paragraph text */}
      <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg sm:leading-8">{body}</p>

      {/* Bottom glow */}
      <div
        className={`pointer-events-none absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          isMission ? 'bg-[#00629b]/25' : 'bg-white/10'
        }`}
      />
    </div>
  );
}

export default function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-black py-10 sm:py-12 lg:py-14">
      {/* Background accent */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#00629b]/[0.06] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-10 bg-[#00629b]" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue-dark">
              Strategic Direction
            </span>
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Mission &amp;{' '}
            <span className="text-brand-blue-dark drop-shadow-[0_0_25px_rgba(0,98,155,0.3)]">
              Vision
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45 sm:text-base">
            The guiding principles that drive everything we do at IEEE GBPIET.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <MissionVisionCard
            heading={strategicPlan.mission.heading}
            body={strategicPlan.mission.body}
            isMission={true}
          />
          <MissionVisionCard
            heading={strategicPlan.vision.heading}
            body={strategicPlan.vision.body}
            isMission={false}
          />
        </div>
      </div>
    </section>
  );
}
