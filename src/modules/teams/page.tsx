import { useEffect } from 'react';
import { teamMembers } from '@/data/teams/members';
import { TeamHero } from './components/TeamHero';
import { TeamGrid } from './components/TeamGrid';
import { PreviousMember } from './components/previousmember';

export function TeamsPage() {
  useEffect(() => {
    document.title = 'IEEE Gbpiet Teams';
  }, []);

  const executiveMembers = teamMembers
    .filter((m) => m.committee === 'executive')
    .sort((a, b) => a.priority - b.priority);

  const studentMembers = teamMembers
    .filter((m) => m.committee === 'student')
    .sort((a, b) => a.priority - b.priority);

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden pb-20">
      <TeamHero />
      <TeamGrid title="Executive Committee" members={executiveMembers} />
      <TeamGrid title="Student Committee" members={studentMembers} />
      <PreviousMember />
    </div>
  );
}

export default TeamsPage;