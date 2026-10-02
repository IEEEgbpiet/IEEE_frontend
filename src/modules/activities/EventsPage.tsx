import { useEffect, useMemo, useState } from 'react';

import { ActivityCard } from './components/ActivityCard';
import ActivityDetailedCard from './components/ActivityDetailedCard';
import { activities } from '@/data/activities/events';

const branches = ['CSE', 'AIML', 'BT', 'EE', 'ECE'];

const categories = ['All', 'Workshops', 'Projects'];

export default function EventsPage() {
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedActivity, setSelectedActivity] = useState<(typeof activities)[number] | null>(
    null,
  );

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const branchMatch = activity.branch === selectedBranch;

      const categoryMatch = selectedCategory === 'All' || activity.category === selectedCategory;

      return branchMatch && categoryMatch;
    });
  }, [selectedBranch, selectedCategory]);

  useEffect(() => {
    setSelectedActivity(null);
  }, [selectedBranch, selectedCategory]);

  const handleActivityClick = (activity: (typeof activities)[number]) => {
    setSelectedActivity(activity);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 pb-24 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#00629b]/10 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="absolute -left-40 top-1/2 h-[250px] w-[250px] rounded-full bg-[#00629b]/5 blur-[80px] sm:h-[350px] sm:w-[350px] sm:blur-[100px]" />
        <div className="absolute -right-40 bottom-20 h-[250px] w-[250px] rounded-full bg-[#00629b]/5 blur-[80px] sm:h-[350px] sm:w-[350px] sm:blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Explore Our
            <span className="block bg-gradient-to-r from-brand-blue-cta via-brand-blue-light to-white bg-clip-text text-transparent">
              Activities
            </span>
          </h1>

          <div className="mx-auto mt-7 flex items-center justify-center gap-3 sm:mt-8">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue-cta sm:w-16" />

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-blue-light" />

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand-blue-cta sm:w-16" />
          </div>
        </div>

        {/* Branch Filter */}
        <div className="mb-5 flex justify-center sm:mb-6">
          <div
            className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#080b0f]/80 p-2 shadow-2xl backdrop-blur-xl"
            style={{
              scrollbarWidth: 'none',
              touchAction: 'pan-x',
            }}
          >
            {branches.map((branch) => (
              <button
                key={branch}
                type="button"
                onClick={() => setSelectedBranch(branch)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:py-3 sm:text-sm ${
                  selectedBranch === branch
                    ? 'bg-brand-blue-cta text-white shadow-[0_0_30px_rgba(0,98,155,0.35)]'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex justify-center sm:mb-12">
          <div
            className="flex max-w-full gap-6 overflow-x-auto border-b border-white/10 px-3 sm:gap-7 sm:px-4"
            style={{
              scrollbarWidth: 'none',
              touchAction: 'pan-x',
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`relative whitespace-nowrap pb-3 text-xs font-medium transition-colors duration-300 sm:pb-4 sm:text-sm ${
                  selectedCategory === category
                    ? 'text-brand-blue-light'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {category}

                {selectedCategory === category && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-blue-light shadow-[0_0_12px_#008dcc]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Cards */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="cursor-pointer"
              >
                <ActivityCard activity={activity} onClick={() => handleActivityClick(activity)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="rounded-3xl border border-white/10 bg-[#080b0f] px-8 py-12 text-center shadow-2xl sm:px-12 sm:py-14">
              <div className="mx-auto mb-6 h-3 w-3 animate-pulse rounded-full bg-brand-blue-light shadow-[0_0_20px_#008dcc]" />

              <h2 className="text-2xl font-semibold text-white">No activities yet</h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">
                Activities for {selectedBranch} will appear here soon.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Activity */}
      {selectedActivity && (
        <ActivityDetailedCard
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </section>
  );
}
