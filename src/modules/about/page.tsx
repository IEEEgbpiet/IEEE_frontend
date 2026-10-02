import { useEffect } from 'react';
import AboutHero from './components/Hero';
import AboutStats from './components/Stats';
import MissionVision from './components/MissionVision';
import LeadershipStructure from './components/LeadershipStructure';
import QuickLinks from './components/QuickLinks';
import WhoWeAre from './components/whoweare';

export default function AboutPage() {

    useEffect(() => {
    document.title = "About IEEE Gbpiet";
  }, []);


  return (
    <div className="min-h-screen bg-black text-slate-200">
      <AboutHero />
      <WhoWeAre />
      <AboutStats />
      <MissionVision />
      <LeadershipStructure />
      <QuickLinks />
    </div>
  );
}
