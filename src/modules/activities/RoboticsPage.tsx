import { ExternalLink, Cpu } from 'lucide-react';

import { ActivityCard } from './components/ActivityCard';
import { roboticsActivities } from '@/data/activities/robotics';

export default function RoboticsPage() {
  const workshops = roboticsActivities.filter((activity) => activity.category === 'Workshops');

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 py-24 sm:px-8 sm:py-32">
      {/* =========================
          BACKGROUND EFFECTS
          ========================= */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-20 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#00629b]/15 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

        <div className="absolute -left-40 top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-[#00629b]/10 blur-[80px] sm:h-[350px] sm:w-[350px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* =========================
          PAGE CONTENT
          ========================= */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-16">
        {/* =========================
            HEADER
            ========================= */}
        <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#080b0f]/80 p-6 text-center shadow-[0_0_30px_rgba(0,141,204,0.1)] backdrop-blur-md sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00629b]/20">
            <Cpu className="h-6 w-6 text-[#008dcc]" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Robotics <span className="text-[#008dcc]">Hub</span>
          </h1>

          <p className="mt-3 text-sm text-white/50 sm:text-base">
            Discover our latest build sessions and technical workshops.
          </p>
        </div>

        {/* =========================
            WORKSHOPS
            ========================= */}
        <div className="flex w-full flex-col items-center">
          {/* Section heading */}
          <div className="mb-10 flex w-full max-w-[800px] items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00629b]" />

            <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-[#008dcc]">
              Our Workshops
            </span>

            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00629b]" />
          </div>

          {workshops.length > 0 ? (
            /*
             * RESPONSIVE GRID
             *
             * Mobile  -> 1 card
             * Tablet  -> 2 cards
             * Desktop -> 3 cards
             */
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <div key={workshop.id} className="flex min-w-0 justify-center">
                  <ActivityCard activity={workshop} />
                </div>
              ))}
            </div>
          ) : (
            /* No workshops */
            <div className="flex min-h-[350px] w-full max-w-[390px] items-center justify-center rounded-[28px] border border-white/10 bg-[#080b0f] px-6">
              <p className="text-center text-white/40">No workshops available right now.</p>
            </div>
          )}
        </div>

        {/* =========================
            BOTTOM LINK BANNER
            ========================= */}
        <a
          href="https://prasthanam-gbpiet.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full max-w-4xl flex-col items-center justify-between gap-6 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#080b0f] to-[#00629b]/20 p-6 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-[#008dcc]/50 hover:shadow-[0_10px_40px_rgba(0,141,204,0.3)] sm:flex-row sm:rounded-[32px] sm:p-8"
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#008dcc]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Text */}
          <div className="relative z-10 text-center sm:text-left">
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Visit the Official Robotics Website
            </h2>

            <p className="text-sm leading-6 text-white/60 sm:text-base">
              Explore all our projects, team members, and comprehensive resources.
            </p>
          </div>

          {/* Icon */}
          <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00629b] text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-[#008dcc]">
            <ExternalLink className="h-6 w-6" />
          </div>
        </a>
      </div>
    </section>
  );
}
