import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';

// ---------------------------------------------------------
// Upcoming events ka data
// NOTE: Registration dates ko apne actual event details
// ke according update kar dena.
// ---------------------------------------------------------
const upcomingEvents = [
  {
    title: 'Engineering Day',
    date: '15 September 2026',
    location: 'GBPIET Campus',

    // Registration ki separate date
    registration: 'Registration closes: 12 Sep 2026',

    description:
      'A celebration of engineering, creativity and the ideas that shape the future of technology.',

    image: '/images/engineering.day.avif',
  },

  {
    title: 'Smart India Hackathon',
    date: 'Coming Soon',
    location: 'GBPIET',

    registration: 'Registration: Coming Soon',

    description:
      'Students come together to solve real-world problems through innovation, technology and teamwork.',

    image: '/images/sih.jpg',
  },

  {
    title: 'IEEE Day',
    date: '7 October 2026',
    location: 'GBPIET Campus',

    registration: 'Registration closes: Coming Soon',

    description: 'Celebrating the global IEEE community and the impact of technology on our world.',

    image: '/images/ieee.day.jpg',
  },
];

export default function UpcomingEvents() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      {/* Main container */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* -------------------------------------------------
            SECTION HEADING
            ------------------------------------------------- */}
        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
          {/* Small IEEE GBPIET label */}
          <div className="mb-4 flex items-center justify-center gap-3"></div>

          {/* Main heading */}
          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Upcoming <span className="text-brand-blue-dark">Events</span>
            <span className="text-yellow-400">.</span>
          </h2>

          {/* Small decorative line */}
          <div className="mx-auto mt-6 flex w-fit items-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#00629b]" />
            <span className="h-1 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* -------------------------------------------------
            EVENTS GRID

            Mobile  : 1 column
            Tablet  : 2 columns
            Laptop  : 3 columns
            ------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {upcomingEvents.map((event, index) => (
            <article
              key={event.title}
              className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.08]
                bg-[#080b0f]
                shadow-[0_10px_40px_rgba(0,0,0,0.35)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-[#00629b]/40
                hover:shadow-[0_20px_60px_rgba(0,98,155,0.12)]
                sm:rounded-3xl
              "
            >
              {/* -------------------------------------------------
                  EVENT IMAGE

                  Date image ke andar nahi hai.
                  Image clean rahegi.
                  ------------------------------------------------- */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={500}
                  className="
                    h-full
                    w-full
                    object-cover
                    opacity-80
                    transition-all
                    duration-700
                    group-hover:scale-105
                    group-hover:opacity-100
                  "
                />

                {/* Image ke upar subtle dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Event number */}
                <span className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.2em] text-white/60 sm:left-5 sm:top-5 sm:text-xs">
                  0{index + 1}
                </span>
              </div>

              {/* -------------------------------------------------
                  EVENT CONTENT
                  ------------------------------------------------- */}
              <div className="p-5 sm:p-6">
                {/* Event date */}
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-brand-blue-dark sm:text-sm">
                  <CalendarDays size={15} strokeWidth={1.8} />

                  <span>{event.date}</span>
                </div>

                {/* Event title */}
                <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                  {event.title}
                </h3>

                {/* -------------------------------------------------
                    LOCATION
                    Title/date ke neeche location
                    ------------------------------------------------- */}
                <div className="mt-3 flex items-center gap-2 text-sm text-white/45">
                  <MapPin size={15} strokeWidth={1.8} className="shrink-0 text-yellow-400" />

                  <span>{event.location}</span>
                </div>

                {/* -------------------------------------------------
                    REGISTRATION DATE

                    Location se separate rakha hai.
                    ------------------------------------------------- */}
                <div className="mt-4 rounded-xl border border-yellow-400/10 bg-yellow-400/[0.04] px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-yellow-400/80 sm:text-xs">
                    {event.registration}
                  </p>
                </div>

                {/* Event description */}
                <p className="mt-4 text-sm leading-6 text-white/40">{event.description}</p>

                {/* -------------------------------------------------
                    READ MORE BUTTON
                    ------------------------------------------------- */}
                <button
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-10
                    bg-gray-400
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-black
                    shadow-[0_5px_20px_rgba(250,204,21,0.12)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-yellow-300
                    hover:shadow-[0_8px_25px_rgba(250,204,21,0.25)]
                  "
                >
                  Read More
                  <ArrowUpRight
                    size={15}
                    strokeWidth={2.5}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------
          SUBTLE BACKGROUND GLOW
          Bahut strong nahi rakha, taaki design professional
          IEEE-style lage aur over-designed na ho.
          ------------------------------------------------------- */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#00629b]/[0.025]
          blur-[120px]
        "
      />
    </section>
  );
}
