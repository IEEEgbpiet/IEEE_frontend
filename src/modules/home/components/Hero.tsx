'use client';

import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  ChevronDown,
  Users,
  Lightbulb,
  UsersRound,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { u } from '@/lib/responsiveUnit';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface Pose {
  x: number;
  y: number;
  scale: number;
  brightness: number;
  glow: number;
  captionLeft: number;
}

const slides: Slide[] = [
  { image: '/Home/HomeBanner4.png', title: 'Learning Today', subtitle: 'Skills for Tomorrow' },
  { image: '/Home/HomeBanner2.jpg', title: 'Building Communities', subtitle: 'Stronger Together' },
  {
    image: '/Home/HomeBanner3.jpg',
    title: 'Creating Opportunities',
    subtitle: 'Beyond the Classroom',
  },
  {
    image: '/Home/HomeBanner1.jpg',
    title: 'Driving Real Impact',
    subtitle: 'For a Better Tomorrow',
  },
];

const stats: Stat[] = [
  { icon: Users, value: '1000+', label: 'Students Impacted' },
  { icon: Lightbulb, value: '50+', label: 'Events & Workshops' },
  { icon: UsersRound, value: '10+', label: 'Technical Teams' },
  { icon: Globe, value: 'Global', label: 'IEEE Network' },
];

const CARD_W = 258;
const CARD_H = 480;
const STACK_W = 845;

const POSES: Pose[] = [
  { x: 0, y: 0, scale: 1, brightness: 1, glow: 1, captionLeft: 36 },
  { x: 197, y: 0, scale: 0.93, brightness: 0.72, glow: 0.45, captionLeft: 88 },
  { x: 390, y: 0, scale: 0.89, brightness: 0.6, glow: 0.3, captionLeft: 76 },
  { x: 579, y: -20, scale: 0.79, brightness: 0.5, glow: 0.2, captionLeft: 76 },
];

export default function Hero() {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((p: number) => (p + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const next = (): void => setCurrent((p: number) => (p + 1) % slides.length);
  const prev = (): void => setCurrent((p: number) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="relative flex -mt-14 min-h-svh pt-14 sm:-mt-16 sm:pt-16 lg:-mt-[76px] items-center overflow-hidden bg-black text-white [--u:0.5px] md:[--u:0.6px] lg:[--u:min(1px,0.052083vw)]">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-[#020a1c]/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-[#031028]/55 to-[#041a4a]/25" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-navy/80 to-transparent" />

      {/* Scroll indicator */}
      <div
        className="pointer-events-none absolute top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center text-white/45 lg:flex"
        style={{ left: u(44) }}
      >
        <span className="w-px bg-white/25" style={{ height: u(235) }} />
        <span
          className="[writing-mode:vertical-rl]"
          style={{ fontSize: u(10, 9), letterSpacing: '0.3em', margin: `${u(10)} 0` }}
        >
          SCROLL
        </span>
        <span className="w-px bg-white/25" style={{ height: u(15) }} />
        <span className="rounded-full bg-white/50" style={{ width: u(6, 4), height: u(6, 4) }} />
        <span className="w-px bg-white/25" style={{ height: u(75) }} />
        <ChevronDown size={12} />
      </div>

      {/* Inner container */}
      <div className="relative z-10 mx-auto w-full max-w-[1920px] pl-5 pr-5 py-12 lg:pl-[calc(118*var(--u))] lg:pr-0 lg:py-[calc(50*var(--u))]">
        {/* Left column */}
        <div className="lg:max-w-[calc(700*var(--u))]">
          <p
            className="font-medium text-white/60"
            style={{ fontSize: u(13, 11), letterSpacing: '0.34em' }}
          >
            STUDENTS &times; TECHNOLOGY &times; SOCIETY
          </p>

          <h1
            className="font-black"
            style={{
              marginTop: u(22),
              fontSize: u(104, 46),
              lineHeight: 1,
              letterSpacing: '-0.025em',
            }}
          >
            <span className="text-white">IEEE </span>
            <span className="bg-gradient-to-r from-[#1d6bff] to-[#4db2ff] bg-clip-text text-transparent">
              GBPIET
            </span>
          </h1>

          <p
            className="font-semibold"
            style={{ marginTop: u(18), fontSize: u(33, 20), lineHeight: 1.3 }}
          >
            More Than a Student Chapter.
            <br />
            <span className="text-[#2277ff]">A Launchpad for What&rsquo;s Next.</span>
          </p>

          <p
            className="text-white/70"
            style={{
              marginTop: u(18),
              maxWidth: u(500),
              fontSize: u(17, 14),
              lineHeight: 1.45,
            }}
          >
            Empowering students through technology, innovation, leadership and professional
            excellence.
          </p>

          <div className="hidden lg:flex flex-wrap items-center" style={{ marginTop: u(30), gap: u(22) }}>
            <a
              href="/contact"
              className="inline-flex items-center whitespace-nowrap rounded-full font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
              style={{
                height: u(52, 46),
                padding: `0 ${u(30)}`,
                gap: u(12),
                fontSize: u(15, 14),
                background: 'var(--color-brand-blue-cta)',
              }}
            >
              Join Our Community
              <ArrowRight size={17} />
            </a>
            <a
              href="/activities/events"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-white/30 font-semibold text-white transition-all hover:border-white/60 hover:bg-white/5"
              style={{
                height: u(52, 46),
                padding: `0 ${u(12)} 0 ${u(32)}`,
                gap: u(26),
                fontSize: u(15, 14),
              }}
            >
              Explore Activities
              <span
                className="grid place-items-center rounded-full border border-[#2f6bff] bg-[#0b2a7a]/50"
                style={{ width: u(30, 26), height: u(30, 26) }}
              >
                <Play size={10} fill="currentColor" />
              </span>
            </a>
          </div>

          {/* Stats */}
          <div
            className="mx-auto w-full grid gap-6 sm:gap-8 lg:w-max lg:flex lg:flex-nowrap"
            style={{
              marginTop: u(90, 40),
              gridTemplateColumns: 'repeat(2, 1fr)',
              maxWidth: 'calc(100% - 40px)',
            }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-start"
                style={{
                  gap: u(12),
                  paddingLeft: 0,
                  paddingRight: 0,
                  minHeight: 'auto',
                }}
              >
                <Icon
                  strokeWidth={2}
                  className="shrink-0 text-brand-blue"
                  style={{ width: u(28, 20), height: u(28, 20) }}
                />
                <div style={{ marginTop: 0 }}>
                  <p
                    className="font-bold leading-none text-brand-blue"
                    style={{ fontSize: u(20, 16) }}
                  >
                    {value}
                  </p>
                  <p className="text-white/70" style={{ marginTop: u(4), fontSize: u(11, 10) }}>
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 lg:hidden" style={{ marginTop: u(30) }}>
            <a
              href="/contact"
              className="inline-flex items-center whitespace-nowrap rounded-full font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
              style={{
                padding: `0 ${u(24)}`,
                height: u(44, 40),
                fontSize: u(14, 13),
                background: 'var(--color-brand-blue-cta)',
              }}
            >
              Join Us
              <ArrowRight size={16} style={{ marginLeft: u(8) }} />
            </a>
            <a
              href="/activities/events"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-white/30 font-semibold text-white transition-all hover:border-white/60 hover:bg-white/5"
              style={{
                padding: `0 ${u(24)}`,
                height: u(44, 40),
                fontSize: u(14, 13),
              }}
            >
              Explore
            </a>
          </div>
        </div>

        {/* Signature: Ideas / People / Impact */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            left: u(745),
            top: `calc(50% + ${u(55)})`,
            transform: 'translateY(-50%) rotate(-19deg)',
            transformOrigin: 'left center',
          }}
        >
          <p
            style={{
              fontFamily: "'Mrs Saint Delafield','Allura','Segoe Script','Brush Script MT',cursive",
              fontSize: u(46),
              lineHeight: 1,
              color: '#2f7cff',
            }}
          >
            Ideas
            <br />
            People
            <br />
            Impact
          </p>
          <svg
            viewBox="0 0 170 20"
            preserveAspectRatio="none"
            style={{
              width: u(170),
              height: u(20),
              marginTop: u(10),
              marginLeft: u(-25),
              overflow: 'visible',
              filter: 'drop-shadow(0 0 6px rgba(47,124,255,0.7))',
            }}
          >
            <defs>
              <linearGradient id="swoosh" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#2f7cff" stopOpacity="0" />
                <stop offset="0.3" stopColor="#2f7cff" />
                <stop offset="1" stopColor="#5fb0ff" />
              </linearGradient>
            </defs>
            <path
              d="M0 18 C 50 15, 110 9, 170 1"
              fill="none"
              stroke="url(#swoosh)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 3D fanned carousel (lg and up) */}
        <div
          className="pointer-events-none absolute hidden lg:block"
          style={{
            right: u(70),
            top: `calc(50% - ${u(74)})`,
            transform: 'translateY(-50%)',
            width: u(STACK_W),
            height: u(CARD_H),
          }}
        >
          {slides.map((slide, index) => {
            const offset = (index - current + slides.length) % slides.length;
            const p = POSES[offset];
            const isFront = offset === 0;

            return (
              <div
                key={slide.image}
                onClick={() => !isFront && setCurrent(index)}
                className={`pointer-events-auto absolute bottom-0 left-0 overflow-hidden transition-all duration-[600ms] ease-out ${
                  isFront ? '' : 'cursor-pointer'
                }`}
                style={{
                  width: u(CARD_W),
                  height: u(CARD_H),
                  borderRadius: u(18, 12),
                  zIndex: 40 - offset * 10,
                  transformOrigin: '0 100%',
                  transform: `translate(${u(p.x)}, ${u(p.y)}) scale(${p.scale}) skewX(-9deg) skewY(2deg)`,
                  filter: `brightness(${p.brightness})`,
                  border: `1px solid rgba(70,150,255,${0.25 + 0.65 * p.glow})`,
                  boxShadow: `0 0 ${40 * p.glow}px rgba(37,99,235,${0.6 * p.glow}), 0 24px 48px rgba(0,0,0,0.55)`,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div
                  className="absolute transition-all duration-[600ms] ease-out"
                  style={{
                    left: u(p.captionLeft),
                    right: isFront ? u(14) : u(50),
                    bottom: u(34),
                  }}
                >
                  <p
                    className="font-semibold leading-tight"
                    style={{ fontSize: u(isFront ? 18 : 15, 12) }}
                  >
                    {slide.title}
                  </p>
                  <p
                    className="text-white/70"
                    style={{ fontSize: u(isFront ? 14 : 12.5, 10), marginTop: u(6) }}
                  >
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Prev / next */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="pointer-events-auto absolute z-50 flex items-center justify-center rounded-full bg-brand-navy-deep/85 text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-black"
            style={{
              left: u(15),
              top: '53%',
              width: u(44, 36),
              height: u(44, 36),
              transform: 'translate(-50%,-50%)',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="pointer-events-auto absolute z-50 flex items-center justify-center rounded-full bg-brand-navy-deep/85 text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-black"
            style={{
              left: u(810),
              top: '53%',
              width: u(44, 36),
              height: u(44, 36),
              transform: 'translate(-50%,-50%)',
            }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Progress + counter */}
          <div
            className="absolute z-50 flex items-center"
            style={{ left: u(290), top: u(CARD_H + 46) }}
          >
            {slides.map((slide, index) => (
              <span
                key={slide.image}
                className="rounded-full transition-all duration-300"
                style={{
                  height: u(3, 2),
                  width: u(index === current ? 48 : 34),
                  marginRight: u(6),
                  background: index === current ? '#1a73ff' : 'rgba(255,255,255,0.22)',
                }}
              />
            ))}
            <span
              className="tabular-nums tracking-wider text-white/55"
              style={{ marginLeft: u(6), fontSize: u(12, 11) }}
            >
              0{current + 1} / 0{slides.length}
            </span>
          </div>
        </div>

        {/* Bottom-right tagline */}
        <div
          className="pointer-events-none absolute hidden text-right lg:block"
          style={{ right: u(77), bottom: u(58) }}
        >
          <p className="text-white/55" style={{ fontSize: u(11, 10), letterSpacing: '0.4em' }}>
            A BRIGHTER TOMORROW
          </p>
          <p
            className="flex items-center justify-end text-[#2f7cff]"
            style={{ marginTop: u(8), gap: u(18), fontSize: u(11, 10), letterSpacing: '0.4em' }}
          >
            <span
              className="h-px bg-gradient-to-r from-transparent to-white/40"
              style={{ width: u(205) }}
            />
            TOGETHER
          </p>
        </div>
      </div>
    </section>
  );
}
