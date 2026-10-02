import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JoinCTA() {
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 lg:py-24">
      {/* Subtle blue glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Small heading */}
        <div className="mb-7 flex items-center justify-center gap-3 sm:mb-9">
          <span className="h-[2px] w-10 bg-brand-blue-cta sm:w-16" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 sm:text-xs md:text-sm">
            Be a part of something bigger
          </p>

          <span className="h-[2px] w-10 bg-brand-blue-cta sm:w-16" />
        </div>

        {/* CTA wrapper */}
        <div className="relative mx-auto max-w-5xl">
          {/* Main CTA */}
          <Link
            to="/contact"
            className="group relative mx-auto flex min-h-[130px] items-center justify-center overflow-visible rounded-[70px] border-2 border-brand-blue-cta bg-[#03070b] px-6 shadow-[0_0_40px_rgba(0,98,155,0.15)] transition-all duration-500 hover:border-brand-blue-hover hover:shadow-[0_0_70px_rgba(0,98,155,0.28)] sm:min-h-[155px] sm:px-10 md:min-h-[175px]"
          >
            {/* Blue inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-[70px] bg-brand-blue-cta/[0.04] transition-all duration-500 group-hover:bg-brand-blue-cta/[0.08]" />

            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-7 md:gap-10">
              {/* JOIN NOW */}
              <span className="text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                JOIN NOW
              </span>

              {/* IEEE Logo */}
              <div className="flex items-center gap-3 sm:gap-5">
                <img
                  src="/images/IeeeLogo.webp"
                  alt="IEEE Logo"
                  style={{ filter: 'hue-rotate(15deg)' }}

                  className="h-12 w-12 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20"
                />

                <span className="text-4xl font-black tracking-[-0.05em] text-brand-blue-dark sm:text-6xl md:text-7xl lg:text-8xl">
                  IEEE
                </span>
              </div>
            </div>

            {/* Cartoon hand */}
            <div
              className="
                absolute
                -right-7
                bottom-[-45px]
                z-30
                rotate-[-18deg]
                text-[70px]
                drop-shadow-[0_5px_15px_rgba(0,98,155,0.4)]
                transition-transform
                duration-500
                group-hover:translate-x-2
                group-hover:rotate-[-12deg]
                sm:-right-10
                sm:bottom-[-55px]
                sm:text-[90px]
                md:-right-14
                md:bottom-[-65px]
                md:text-[110px]
              "
            >
              👌
            </div>

            {/* Click rays */}
            <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 translate-x-full flex-col gap-3 sm:flex">
              <span className="h-1 w-8 rotate-[25deg] rounded-full bg-brand-blue-cta" />
              <span className="h-1 w-5 rounded-full bg-brand-blue-cta" />
              <span className="h-1 w-8 -rotate-[25deg] rounded-full bg-brand-blue-cta" />
            </div>

            {/* Left decorative rays */}
            <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 -translate-x-full flex-col gap-3 sm:flex">
              <span className="h-1 w-8 -rotate-[25deg] rounded-full bg-brand-blue-cta" />
              <span className="h-1 w-5 rounded-full bg-brand-blue-cta" />
              <span className="h-1 w-8 rotate-[25deg] rounded-full bg-brand-blue-cta" />
            </div>
          </Link>

          {/* Bottom tagline */}
          <div className="mt-7 flex items-center justify-center gap-3 text-[9px] font-medium uppercase tracking-[0.25em] text-white/45 sm:mt-9 sm:text-xs">
            <span>Learn</span>
            <span className="text-brand-blue-dark">|</span>
            <span>Innovate</span>
            <span className="text-brand-blue-dark">|</span>
            <span>Grow</span>
            <span className="text-brand-blue-dark">|</span>
            <span>Make an Impact</span>
          </div>

          {/* Small arrow */}
          <div className="mt-5 flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/30 transition-colors group-hover:text-brand-blue-dark">
              <ArrowUpRight size={15} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
