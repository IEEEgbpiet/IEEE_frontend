import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight, ChevronDown } from 'lucide-react';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [activitiesOpen, setActivitiesOpen] = useState(false);

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },

    {
      name: 'Activities',
      dropdown: [
        { name: 'Events', href: '/activities/events' },
        { name: 'Robotics', href: '/activities/robotics' },
      ],
    },
     { name: 'Login', href: '/login' },
    { name: 'Teams', href: '/teams' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#00629b]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 sm:pt-14 lg:px-12 lg:pb-8 lg:pt-20">
        {/* =========================
            MAIN FOOTER
            ========================= */}
        <div
          className="
            grid
            gap-10
            sm:grid-cols-2
            sm:gap-x-12
            sm:gap-y-12
            lg:grid-cols-[1.5fr_1fr_1fr]
            lg:gap-20
          "
        >
          {/* =========================
              BRAND
              ========================= */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/images/IeeeLogo.webp"
                alt="IEEE Logo"
                style={{ filter: 'hue-rotate(15deg)' }}

                className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16"
              />

              <div>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                  <span className="text-brand-blue-dark">IEEE</span>{' '}
                  <span className="text-white">GBPIET</span>
                </h2>

                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:text-xs sm:tracking-[0.25em]">
                  Student Branch
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-6 text-white/45 sm:mt-7 sm:text-base sm:leading-7">
              IEEE GBPIET Student Branch is a community of students passionate about technology,
              innovation, research and creating meaningful impact.
            </p>

            {/* Location */}
            <div className="mt-5 sm:mt-6">
              <p className="text-sm font-semibold text-white/80">GBPIET Pauri</p>

              <p className="mt-1 text-xs text-white/35">Uttarakhand, India</p>
            </div>

            {/* Socials */}
            <div className="mt-6 flex items-center gap-3 sm:mt-7">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-white/10
                  text-white/45
                  transition-all duration-300
                  hover:border-[#00629b]
                  hover:bg-[#00629b]
                  hover:text-white
                "
              >
                <FaInstagram size={17} />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-white/10
                  text-white/45
                  transition-all duration-300
                  hover:border-[#00629b]
                  hover:bg-[#00629b]
                  hover:text-white
                "
              >
                <FaLinkedinIn size={17} />
              </a>

              {/* Email */}
              <a
                href="mailto:ieee@gbpiet.ac.in"
                aria-label="Email"
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  border border-white/10
                  text-white/45
                  transition-all duration-300
                  hover:border-[#00629b]
                  hover:bg-[#00629b]
                  hover:text-white
                "
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* =========================
              QUICK LINKS
              ========================= */}
          <div>
            <p className="mb-5 text-lg font-bold uppercase tracking-[0.2em] text-brand-blue-dark sm:mb-6 sm:text-xl sm:tracking-[0.25em]">
              Quick Links
            </p>

            <nav className="flex flex-col items-start">
              {quickLinks.map((link) => (
                <div key={link.name} className="group relative w-full">
                  {/* Normal link */}
                  {!link.dropdown && (
                    <Link
                      to={link.href}
                      className="
                        group/link
                        flex items-center gap-2
                        py-2
                        text-base
                        text-white/50
                        transition-all duration-300
                        hover:pl-2
                        hover:text-white
                      "
                    >
                      <span>{link.name}</span>

                      <ArrowUpRight
                        size={13}
                        className="
                          opacity-0
                          transition-all duration-300
                          group-hover/link:translate-x-1
                          group-hover/link:-translate-y-1
                          group-hover/link:opacity-100
                          group-hover/link:text-brand-blue-dark
                        "
                      />
                    </Link>
                  )}

                  {/* Activities */}
                  {link.dropdown && (
                    <div className="w-full">
                      {/* Activities heading */}
                      <button
                        type="button"
                        onClick={() => setActivitiesOpen(!activitiesOpen)}
                        className="
                          flex w-full
                          items-center gap-2
                          py-2
                          text-left
                          text-base
                          font-medium
                          text-white/50
                          transition-colors
                          hover:text-white
                          lg:cursor-default
                        "
                      >
                        <span>{link.name}</span>

                        <ChevronDown
                          size={15}
                          className={`
                            transition-transform duration-300
                            ${activitiesOpen ? 'rotate-180' : ''}
                            lg:group-hover:rotate-180
                          `}
                        />
                      </button>

                      {/* Activities submenu */}
                      <div
                        className={`
                          ml-3
                          overflow-hidden
                          border-l border-white/10
                          pl-4
                          transition-all duration-300
                          ${activitiesOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}
                          lg:max-h-0
                          lg:opacity-0
                          lg:group-hover:max-h-32
                          lg:group-hover:opacity-100
                        `}
                      >
                        <Link
                          to="/activities/events"
                          className="
                            flex items-center gap-2
                            py-2
                            text-sm
                            text-white/40
                            transition-colors
                            hover:text-[#008dcc]
                          "
                        >
                          <span>Events</span>
                          <ArrowUpRight size={12} />
                        </Link>

                        <Link
                          to="/activities/robotics"
                          className="
                            flex items-center gap-2
                            py-2
                            text-sm
                            text-white/40
                            transition-colors
                            hover:text-[#008dcc]
                          "
                        >
                          <span>Robotics</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* =========================
              GET INVOLVED
              ========================= */}
          <div>
            <p className="mb-5 text-lg font-bold uppercase tracking-[0.2em] text-brand-blue-dark sm:mb-6 sm:text-xl sm:tracking-[0.25em]">
              Get Involved
            </p>

            <div className="space-y-4 sm:space-y-5">
              {/* Join IEEE */}
              <Link to="/contact" className="group block">
                <p className="text-base font-semibold text-white transition-colors group-hover:text-brand-blue-dark">
                  Join IEEE
                </p>

                <p className="mt-1 text-sm text-white/35">Become part of the community</p>
              </Link>

              {/* Explore Activities */}
              <Link to="/activities/events" className="group block">
                <p className="text-base font-semibold text-white transition-colors group-hover:text-brand-blue-dark">
                  Explore Activities
                </p>

                <p className="mt-1 text-sm text-white/35">Events, projects and workshops</p>
              </Link>

              {/* Meet Team */}
              <Link to="/teams" className="group block">
                <p className="text-base font-semibold text-white transition-colors group-hover:text-brand-blue-dark">
                  Meet Our Team
                </p>

                <p className="mt-1 text-sm text-white/35">Discover the people behind IEEE</p>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================
            DIVIDER
            ========================= */}
        <div className="my-8 h-px bg-white/10 sm:my-10 lg:my-12" />

        {/* =========================
            BOTTOM BAR
            ========================= */}
        <div
          className="
            flex flex-col gap-3
            text-center text-xs text-white/30
            sm:flex-row sm:items-center sm:justify-between
            sm:text-sm
          "
        >
          <p>© 2026 IEEE GBPIET Student Branch. All rights reserved.</p>

          <p className="text-white/20">Technology · Innovation · Impact</p>
        </div>
      </div>
    </footer>
  );
}
