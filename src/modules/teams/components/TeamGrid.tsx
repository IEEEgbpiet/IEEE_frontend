import type { TeamMember } from '@/data/teams/members';
import { MemberCard } from './MemberCard';

type TeamGridProps = {
  title: string;
  members: TeamMember[];
};

export function TeamGrid({ title, members }: TeamGridProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section
      id={`teams-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="relative max-w-6xl mx-auto px-6 py-12 max-sm:px-4 max-sm:py-8"
    >
      {/* Section Heading */}
      <h2 className="flex justify-center mb-12 max-sm:mb-8">
        <span
          className="
            inline-block px-8 py-3 max-sm:px-5 max-sm:py-2.5
            bg-brand-blue-cta rounded-xl
            text-2xl max-sm:text-lg font-extrabold tracking-wide uppercase text-white
            shadow-[0_4px_20px_rgba(0,102,153,0.4)]
            cursor-default select-none
            transition-all duration-300
            hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,102,153,0.5)]
          "
        >
          {title}
        </span>
      </h2>

      {/* 2-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start relative z-10">
        {members.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </section>
  );
}
