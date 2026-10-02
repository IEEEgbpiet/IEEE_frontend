import type { TeamMember } from '@/data/teams/members';

const socialConfig = {
  linkedin: {
    iconColor: 'text-[#0A66C2]',
    hoverBg: 'hover:bg-[#0A66C2] hover:text-white',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  github: {
    iconColor: 'text-[#8b949e]',
    hoverBg: 'hover:bg-[#333333] hover:text-white',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  instagram: {
    iconColor: 'text-[#e130b2]',
    hoverBg: 'hover:bg-[#e130ac] hover:text-white',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  twitter: {
    iconColor: 'text-white',
    hoverBg: 'hover:bg-[#333333] hover:text-white',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <article
      id={`member-${index}`}
      className="
        group relative flex items-center gap-5 p-4
        w-full rounded-2xl overflow-hidden
        bg-transparent
        border border-cyan-500/40
        shadow-lg
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]
        max-sm:flex-col max-sm:text-center max-sm:items-center max-sm:p-5
      "
    >
      {/* Corner Glow Layer */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 z-0 
          bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.15)_0%,transparent_45%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.15)_0%,transparent_45%)]
          opacity-60 group-hover:opacity-100 transition-opacity duration-500
        "
      />

      {/* Member Photo Frame */}
      <div className="relative z-10 shrink-0 w-40 h-44 max-sm:w-36 max-sm:h-40 overflow-hidden rounded-xl bg-transparent border border-cyan-500/30">
        {member.photo && member.photo.trim() !== '' ? (
          <img
          height={200}
          width={400}
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-transparent border border-dashed border-cyan-500/30">
            <span className="text-3xl font-extrabold tracking-widest text-cyan-300">
              {getInitials(member.name)}
            </span>
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="relative z-10 flex flex-1 flex-col justify-between min-w-0 h-full py-1 max-sm:items-center">
        <div>
          {/* Member Name */}
          <h3 className="m-0 text-xl font-extrabold tracking-wide text-white truncate max-w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {member.name}
          </h3>

          <p className="m-0 mt-1.5 text-xs font-bold tracking-wide text-cyan-300 uppercase bg-transparent px-2.5 py-1 rounded-md w-fit max-sm:mx-auto border border-cyan-500/40">
            {member.role}
          </p>

          <p className="m-0 mt-2 text-xs font-semibold text-slate-200 line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {member.department}
          </p>
        </div>

        {/* Social Links */}
        <nav
          className="mt-4 flex items-center gap-2 max-sm:justify-center"
          aria-label={`${member.name}'s social links`}
        >
          {member.socials &&
            (Object.keys(member.socials) as (keyof typeof socialConfig)[]).map((key) => {
              const url = member.socials[key];
              const config = socialConfig[key];

              if (!url || !url.trim() || !config) return null;

              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className={`
                    grid place-items-center w-8 h-8 rounded-lg
                    no-underline border border-cyan-500/30 bg-transparent
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:border-cyan-400
                    ${config.iconColor} ${config.hoverBg}
                  `}
                >
                  {config.icon}
                </a>
              );
            })}
        </nav>
      </div>
    </article>
  );
}
