import { heroContent } from '@/data/about/content';

export default function AboutHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-black py-12 sm:py-16 lg:py-20">
      {/* -- Deep radial background glow -- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/20 blur-[130px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[#00629b]/10 blur-[90px]" />
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-slate-800/30 blur-[90px]" />
      </div>

      {/* -- Subtle grid overlay -- */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,98,155,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,98,155,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* -- Bottom fade -- */}
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />

      {/* -- Content -- */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-8">
        {/* Main heading */}
        <h1 className="animate-[fadeUp_0.7s_ease-out] text-6xl font-black tracking-[-0.05em] text-white sm:text-8xl md:text-9xl lg:text-[10rem] leading-none">
          <span>IEEE</span>
          <span className="text-brand-blue-dark drop-shadow-[0_0_40px_rgba(0,98,155,0.45)]">
            {' '}
            GBPIET
          </span>
        </h1>

        {/* Decorative divider */}
        <div className="mx-auto mt-6 flex w-fit items-center gap-3">
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-brand-blue-cta" />
          <div className="h-1.5 w-1.5 rotate-45 bg-brand-blue-cta" />
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-brand-blue-cta" />
        </div>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl animate-[fadeUp_0.9s_ease-out] text-base leading-relaxed text-white/60 sm:text-lg sm:leading-8">
          {heroContent.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex animate-[fadeUp_1.1s_ease-out] flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={heroContent.cta.href}
            className="group relative overflow-hidden rounded-full bg-brand-blue-cta px-7 py-3 text-sm font-bold text-white shadow-[0_10px_35px_rgba(0,98,155,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,98,155,0.5)]"
          >
            <span className="relative z-10">{heroContent.cta.label}</span>
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0" />
          </a>

          <a
            href={heroContent.ctaSecondary.href}
            className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue-cta/40 hover:bg-white/10 hover:text-white"
          >
            {heroContent.ctaSecondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
