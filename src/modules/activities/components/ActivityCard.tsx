import type { Activity } from '@/data/activities/events';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  return (
    <article
      onClick={onClick}
      className="
        group
        relative
        w-full
        max-w-[390px]
        cursor-pointer
        overflow-hidden
        rounded-[24px]
        border
        border-white/10
        bg-[#080b0f]
        shadow-[0_25px_80px_rgba(0,0,0,0.6)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#008dcc]/60
        hover:shadow-[0_25px_80px_rgba(0,98,155,0.2)]
        sm:w-[390px]
        sm:rounded-[28px]
      "
    >
      {/* =========================
          IMAGE
          ========================= */}
      <div className="relative h-[230px] overflow-hidden sm:h-[270px]">
        <img
          width={800}
          height={500}
          src={activity.image}
          alt={activity.title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-black/10 to-transparent" />
      </div>

      {/* =========================
          CONTENT
          ========================= */}
      <div className="p-5 sm:p-7">
        {/* Date */}
        <p
          className="
            mb-2
            text-xs
            font-semibold
            uppercase
            tracking-[0.18em]
            text-[#008dcc]
            sm:mb-3
            sm:tracking-[0.2em]
          "
        >
          {activity.date}
        </p>

        {/* Title */}
        <h2
          className="
            mb-3
            text-xl
            font-bold
            leading-tight
            text-white
            sm:mb-4
            sm:text-2xl
          "
        >
          {activity.title}
        </h2>

        {/* Overview */}
        <p
          className="
            min-h-[72px]
            overflow-hidden
            text-sm
            leading-6
            text-white/50
            [display:-webkit-box]
            [-webkit-box-orient:vertical]
            [-webkit-line-clamp:3]
          "
        >
          {activity.overview}
        </p>

        {/* =========================
            CLICK INDICATOR
            ========================= */}
        <div className="mt-5 flex items-center gap-3 sm:mt-7">
          <div
            className="
              h-px
              flex-1
              bg-white/10
              transition-all
              duration-500
              group-hover:bg-[#00629b]
            "
          />

          <span
            className="
              text-xl
              text-white/30
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:text-[#008dcc]
            "
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}
