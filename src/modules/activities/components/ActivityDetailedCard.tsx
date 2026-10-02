
import { X } from "lucide-react";

type Activity = {
  id: string;
  title: string;
  category: string;
  branch: string;
  date: string;
  time: string;
  venue: string;
  organizedBy: string;
  reportAuthor: string;
  overview: string;
  description: string;
  keyDiscussion: string[];
  studentsPresent: string[];
  image: string;
};

interface ActivityDetailedCardProps {
  activity: Activity;
  onClose: () => void;
}

export default function ActivityDetailedCard({
  activity,
  onClose,
}: ActivityDetailedCardProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#080b0f] shadow-2xl">
          
          {/* Header */}
          <div className="relative">
            <img
              width={1200}
              height={700}
              src={activity.image}
              alt={activity.title}
              className="h-52 w-full object-cover sm:h-64 lg:h-80"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-black/30 to-transparent" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white transition hover:bg-black/80"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-8 sm:right-8">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-400">
                  {activity.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                  {activity.branch}
                </span>
              </div>

              <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
                {activity.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">

            {/* Event Information */}
            <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-5 border-b border-white/10 pb-8 sm:grid-cols-4">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Date
                </p>
                <p className="text-sm text-gray-300 sm:text-base">
                  {activity.date}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Time
                </p>
                <p className="text-sm text-gray-300 sm:text-base">
                  {activity.time}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Venue
                </p>
                <p className="text-sm text-gray-300 sm:text-base">
                  {activity.venue}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Organized By
                </p>
                <p className="text-sm text-gray-300 sm:text-base">
                  {activity.organizedBy}
                </p>
              </div>
            </div>

            {/* Overview */}
            <section className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Overview
              </h2>

              <p className="text-base leading-8 text-gray-300 sm:text-lg sm:leading-9">
                {activity.overview}
              </p>
            </section>

            {/* Description */}
            <section className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Description
              </h2>

              <p className="text-base leading-8 text-gray-300 sm:text-lg sm:leading-9">
                {activity.description}
              </p>
            </section>

            {/* Key Discussion */}
            <section className="mb-10">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Key Discussion
              </h2>

              <ul className="space-y-4">
                {activity.keyDiscussion.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8"
                  >
                    <span className="mt-[11px] h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Students Present */}
            <section className="mb-8">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Following Students Were Present
              </h2>

              <div className="space-y-3">
                {activity.studentsPresent.map((student, index) => (
                  <p
                    key={index}
                    className="text-base leading-7 text-gray-300 sm:text-lg sm:leading-8"
                  >
                    <span className="mr-3 text-cyan-400">
                      {index + 1}.
                    </span>
                    {student}
                  </p>
                ))}
              </div>
            </section>

            {/* Report Author */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Report Author
              </p>

              <p className="mt-2 text-sm text-gray-300 sm:text-base">
                {activity.reportAuthor}
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-5 py-5 sm:px-8">
            <p className="text-center text-xs tracking-wide text-gray-500 sm:text-sm">
              IEEE GBPIET Student Branch • Activity Report
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}