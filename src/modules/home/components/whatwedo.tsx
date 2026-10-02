import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FlaskConical,
  HandCoins,
  Presentation,
  Users,
} from 'lucide-react';

const activities = [
  {
    title: 'College Events',
    description:
      'Technical and professional events that bring students together to learn, compete and connect.',
    image: '/images/events.ieee.jpg',
    icon: CalendarDays,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/15',
  },
  {
    title: 'Workshops',
    description:
      'Hands-on sessions focused on practical skills, emerging technologies and real-world applications.',
    image: '/images/workshop.ieee.jpg',
    icon: Presentation,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-400/15',
  },
  {
    title: 'Research Support',
    description:
      'Guidance and opportunities for students interested in research, experimentation and technical exploration.',
    image: '/images/researchsupport.ieee.jpg',
    icon: FlaskConical,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-400/15',
  },
  {
    title: 'Paper Publication',
    description:
      'Encouraging students to document their work and explore technical paper writing and publication.',
    image: '/images/paperpublication.ieee.jpg',
    icon: BookOpen,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/15',
  },
  {
    title: 'Student Activities',
    description:
      'Collaborative activities that develop communication, leadership, creativity and technical confidence.',
    image: '/images/activies.ieee.jpg',
    icon: Users,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/15',
  },
  {
    title: 'Funding Support',
    description:
      'Supporting promising student initiatives and projects through guidance and available funding opportunities.',
    image: '/images/funding.ieee.jpg',
    icon: HandCoins,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-400/15',
  },
];

export default function WhatWeDo() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* ================= HEADING ================= */}
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="animate-[fadeUp_0.8s_ease-out] text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            What We{' '}
            <span className="text-brand-blue-dark drop-shadow-[0_0_25px_rgba(0,98,155,0.3)]">
              Do
            </span>
            <span className="text-yellow-400">?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/40 sm:text-base sm:leading-7 lg:text-lg">
            Creating opportunities for students to learn, experiment, collaborate and turn ideas
            into meaningful work.
          </p>

          {/* Animated accent */}
          <div className="mx-auto mt-7 flex w-fit items-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#00629b] transition-all duration-500 hover:w-20" />
            <span className="h-1 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {activities.map((item, index) => {
            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b0f] shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 hover:border-[#00629b]/40 hover:shadow-[0_25px_70px_rgba(0,98,155,0.12)] sm:rounded-3xl"
                style={{
                  animation: `fadeUp 0.7s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* ================= IMAGE ================= */}
                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Top number */}
                  <span className="absolute left-3 top-3 text-[10px] font-bold tracking-[0.2em] text-white/60 sm:left-5 sm:top-5 sm:text-xs">
                    0{index + 1}
                  </span>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-3.5 sm:p-5 lg:p-6">
                  <h3 className="text-sm font-bold leading-tight text-white sm:text-lg lg:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-[11px] leading-[1.55] text-white/40 sm:text-sm sm:leading-6">
                    {item.description}
                  </p>

                  {/* ================= READ MORE ================= */}
                  <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-2 text-[10px] font-bold text-black shadow-[0_5px_20px_rgba(250,204,21,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-[0_8px_25px_rgba(250,204,21,0.3)] sm:mt-5 sm:px-4 sm:py-2.5 sm:text-xs">
                    Read More
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </div>

                {/* Bottom blue glow */}
                <div className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#00629b]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </article>
            );
          })}
        </div>
      </div>

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/[0.025] blur-[120px]" />
    </section>
  );
}
