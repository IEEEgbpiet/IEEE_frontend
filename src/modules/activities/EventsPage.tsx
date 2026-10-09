import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, Layers, MapPin, ArrowUpRight, X, CalendarX, ZoomIn } from 'lucide-react';
import { ActivityCard } from './components/ActivityCard';
import ActivityDetailedCard from './components/ActivityDetailedCard';
import ImageModal from '@/components/ImageModal';
import { adminApi, type DepartmentPost, type UpcomingEvent } from '@/services/adminApi';
import fallbackEventsData from '@/data/upcomingEventsFallback.json';

export interface Activity {
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
}

const branches = ['CSE', 'AIML', 'BT', 'EE', 'ECE'];

const formatDepartmentPost = (post: DepartmentPost): Activity => {
  const imageUrl =
    typeof post.image === 'object' && post.image?.url
      ? post.image.url
      : typeof post.image === 'string' && post.image.trim().length > 0
      ? post.image
      : '/images/sih.jpg';

  const parseList = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.map(String).filter(Boolean);
    if (typeof val === 'string' && val.trim()) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      } catch {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [val.trim()];
    }
    return [];
  };

  return {
    id: (post.postId || post.id || post._id || `DEP-${Math.random()}`) as string,
    title: post.title || 'Department Activity',
    category: post.category || 'Workshop',
    branch: (post.branch || 'CSE').toUpperCase(),
    date: post.date || 'Recent',
    time: post.time || '',
    venue: post.venue || 'GBPIET',
    organizedBy: post.organizedBy || 'IEEE GBPIET',
    reportAuthor: post.reportAuthor || 'IEEE Member',
    overview: post.overview || post.description || '',
    description: post.description || post.overview || '',
    keyDiscussion: parseList(post.keyDiscussion),
    studentsPresent: parseList(post.studentsPresent),
    image: imageUrl,
  };
};

const formatDisplayDate = (dateStr?: string) => {
  if (!dateStr) return 'TBA';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export default function EventsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // View mode: 'department' or 'upcoming'
  const [activeTab, setActiveTab] = useState<'department' | 'upcoming'>(() => {
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam === 'upcoming' || window.location.hash === '#upcoming') {
      return 'upcoming';
    }
    return 'department';
  });

  // Sync tab with URL search params or hash changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'upcoming' || location.hash === '#upcoming') {
      setActiveTab('upcoming');
    } else if (tab === 'department') {
      setActiveTab('department');
    }
  }, [searchParams, location.hash]);

  // Department posts state (strictly loaded from backend API)
  const [departmentActivities, setDepartmentActivities] = useState<Activity[]>([]);
  const [loadingDepartment, setLoadingDepartment] = useState(true);

  // Upcoming events state (strictly loaded from backend API)
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [selectedUpcoming, setSelectedUpcoming] = useState<UpcomingEvent | null>(null);

  // Filters
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Photo viewer window state
  const [previewPhoto, setPreviewPhoto] = useState<{
    isOpen: boolean;
    url: string;
    title?: string;
    subtitle?: string;
  }>({
    isOpen: false,
    url: '',
  });

  // Fetch department posts strictly from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchDepartmentPosts = async () => {
      try {
        setLoadingDepartment(true);
        const res = await adminApi.getDepartmentPosts();
        if (isMounted) {
          if (res.success && Array.isArray(res.posts)) {
            const apiFormatted = res.posts.map(formatDepartmentPost);
            setDepartmentActivities(apiFormatted);
          } else {
            setDepartmentActivities([]);
          }
        }
      } catch (err) {
        console.error('Could not fetch department posts from API:', err);
        if (isMounted) {
          setDepartmentActivities([]);
        }
      } finally {
        if (isMounted) {
          setLoadingDepartment(false);
        }
      }
    };

    fetchDepartmentPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch upcoming events strictly from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchUpcoming = async () => {
      try {
        setLoadingUpcoming(true);
        const res = await adminApi.getUpcomingEvents();
        if (isMounted) {
          if (res.success && Array.isArray(res.posts) && res.posts.length > 0) {
            setUpcomingEvents(res.posts);
          } else {
            setUpcomingEvents((fallbackEventsData as UpcomingEvent[]) || []);
          }
        }
      } catch (err) {
        console.error('Could not fetch upcoming events in EventsPage, using bundled events:', err);
        if (isMounted) {
          setUpcomingEvents((fallbackEventsData as UpcomingEvent[]) || []);
        }
      } finally {
        if (isMounted) {
          setLoadingUpcoming(false);
        }
      }
    };

    fetchUpcoming();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available categories dynamically from API data for the selected branch
  const availableCategories = useMemo(() => {
    const branchPosts = departmentActivities.filter((a) => a.branch === selectedBranch);
    const set = new Set<string>();
    branchPosts.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ['All', ...Array.from(set)];
  }, [departmentActivities, selectedBranch]);

  // Filter department activities strictly from API records
  const filteredActivities = useMemo(() => {
    return departmentActivities.filter((activity) => {
      const branchMatch = activity.branch === selectedBranch;
      const categoryMatch =
        selectedCategory === 'All' || activity.category.toLowerCase() === selectedCategory.toLowerCase();
      return branchMatch && categoryMatch;
    });
  }, [departmentActivities, selectedBranch, selectedCategory]);

  useEffect(() => {
    setSelectedActivity(null);
  }, [selectedBranch, selectedCategory]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 pb-24 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
      {/* Background Glows */}
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
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3.5 py-1 text-xs font-semibold text-brand-blue-light">
            <Sparkles className="h-3.5 w-3.5" />
            <span>IEEE Student Branch Activities</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Explore Our
            <span className="block bg-gradient-to-r from-brand-blue-cta via-brand-blue-light to-white bg-clip-text text-transparent">
              Activities & Events
            </span>
          </h1>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3 sm:mt-7">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-brand-blue-cta sm:w-16" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-blue-light" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-brand-blue-cta sm:w-16" />
          </div>
        </div>

        {/* Tab Switcher: Department Posts vs Upcoming Events */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-2xl border border-white/10 bg-[#080b0f]/80 p-1.5 backdrop-blur-xl shadow-lg">
            <button
              type="button"
              onClick={() => setActiveTab('department')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'department'
                  ? 'bg-brand-blue-cta text-white shadow-[0_0_20px_rgba(0,98,155,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={16} />
              <span>Department Posts</span>
              {departmentActivities.length > 0 && (
                <span className="ml-1 rounded-full bg-brand-blue-light/20 text-brand-blue-light px-2 py-0.5 text-[10px] font-bold">
                  {departmentActivities.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-brand-blue-cta text-white shadow-[0_0_20px_rgba(0,98,155,0.4)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={16} />
              <span>Upcoming Events</span>
              {upcomingEvents.length > 0 && (
                <span className="ml-1 rounded-full bg-yellow-400 px-1.5 py-0.2 text-[10px] font-bold text-black">
                  {upcomingEvents.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================
            TAB 1: DEPARTMENT POSTS (STRICTLY FROM BACKEND API)
        ============================================================ */}
        {activeTab === 'department' && (
          <div>
            {/* Branch Filter */}
            <div className="mb-5 flex justify-center sm:mb-6">
              <div
                className="flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#080b0f]/80 p-2 shadow-2xl backdrop-blur-xl"
                style={{
                  scrollbarWidth: 'none',
                  touchAction: 'pan-x',
                }}
              >
                {branches.map((branch) => {
                  const countForBranch = departmentActivities.filter((a) => a.branch === branch).length;

                  return (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => {
                        setSelectedBranch(branch);
                        setSelectedCategory('All');
                      }}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:py-3 sm:text-sm ${
                        selectedBranch === branch
                          ? 'bg-brand-blue-cta text-white shadow-[0_0_30px_rgba(0,98,155,0.35)]'
                          : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{branch}</span>
                      {countForBranch > 0 && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                            selectedBranch === branch
                              ? 'bg-white/20 text-white'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {countForBranch}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter */}
            {availableCategories.length > 1 && (
              <div className="mb-8 flex justify-center sm:mb-12">
                <div
                  className="flex max-w-full gap-6 overflow-x-auto border-b border-white/10 px-3 sm:gap-7 sm:px-4"
                  style={{
                    scrollbarWidth: 'none',
                    touchAction: 'pan-x',
                  }}
                >
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`relative whitespace-nowrap pb-3 text-xs font-medium transition-colors duration-300 sm:pb-4 sm:text-sm capitalize ${
                        selectedCategory.toLowerCase() === category.toLowerCase()
                          ? 'text-brand-blue-light'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {category}

                      {selectedCategory.toLowerCase() === category.toLowerCase() && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-blue-light shadow-[0_0_12px_#008dcc]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loadingDepartment ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse rounded-[24px] border border-white/10 bg-[#080b0f] p-5 sm:rounded-[28px]"
                  >
                    <div className="h-[230px] w-full rounded-2xl bg-white/5 sm:h-[270px]" />
                    <div className="mt-4 h-4 w-1/4 rounded bg-white/10" />
                    <div className="mt-3 h-6 w-3/4 rounded bg-white/10" />
                    <div className="mt-3 h-12 w-full rounded bg-white/5" />
                  </div>
                ))}
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity)}
                    className="cursor-pointer"
                  >
                    <ActivityCard
                      activity={activity}
                      onClick={() => setSelectedActivity(activity)}
                      onImageClick={() =>
                        setPreviewPhoto({
                          isOpen: true,
                          url: activity.image,
                          title: activity.title,
                          subtitle: `${activity.branch} • ${activity.category}`,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[350px] items-center justify-center">
                <div className="rounded-3xl border border-white/10 bg-[#080b0f] px-8 py-12 text-center shadow-2xl sm:px-12 sm:py-14 max-w-md">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                    <Layers size={26} />
                  </div>
                  <h2 className="text-xl font-bold text-white">No Activities in Database</h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/50">
                    There are currently no published activity posts for{' '}
                    <span className="font-semibold text-brand-blue-light">{selectedBranch}</span>
                    {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: UPCOMING EVENTS (STRICTLY FROM BACKEND API)
        ============================================================ */}
        {activeTab === 'upcoming' && (
          <div>
            {loadingUpcoming ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse rounded-3xl border border-white/10 bg-[#080b0f] p-5"
                  >
                    <div className="aspect-[16/10] w-full rounded-2xl bg-white/5" />
                    <div className="mt-4 h-4 w-1/3 rounded bg-white/10" />
                    <div className="mt-3 h-6 w-3/4 rounded bg-white/10" />
                    <div className="mt-3 h-12 w-full rounded bg-white/5" />
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((evt, idx) => {
                  const imgUrl =
                    typeof evt.image === 'object' && evt.image?.url
                      ? evt.image.url
                      : typeof evt.image === 'string' && evt.image
                      ? evt.image
                      : '/images/sih.jpg';

                  return (
                    <div
                      key={evt.postId || evt._id || idx}
                      onClick={() => setSelectedUpcoming(evt)}
                      className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#080b0f] p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue/40"
                    >
                      {/* Photo with click to view window */}
                      <div
                        className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black cursor-zoom-in"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPhoto({
                            isOpen: true,
                            url: imgUrl,
                            title: evt.title || evt.eventName,
                            subtitle: `${evt.venue || 'GBPIET Campus'} • ${formatDisplayDate(evt.date)}`,
                          });
                        }}
                        title="Click to view full photo"
                      >
                        <img
                          src={imgUrl}
                          alt={evt.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        {/* Hover badge */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-3 py-1 text-xs font-semibold text-white">
                            <ZoomIn size={13} className="text-brand-blue-light" />
                            <span>View Photo</span>
                          </span>
                        </div>

                        <span className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-brand-blue-light z-10">
                          <Calendar size={13} />
                          {formatDisplayDate(evt.date)}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-brand-blue-light transition-colors line-clamp-1">
                          {evt.title || evt.eventName}
                        </h3>
                        {evt.venue && (
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin size={13} className="text-yellow-400" />
                            {evt.venue}
                          </p>
                        )}
                        {evt.lastDate && (
                          <div className="mt-2 text-[11px] font-semibold text-yellow-300 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2.5 py-1 w-fit">
                            Registration deadline: {formatDisplayDate(evt.lastDate)}
                          </div>
                        )}
                        <p className="mt-3 text-xs text-white/50 line-clamp-2 leading-relaxed">
                          {evt.overview}
                        </p>

                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                          <span className="text-xs font-semibold text-brand-blue-light">
                            View details
                          </span>
                          <ArrowUpRight size={15} className="text-brand-blue-light" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="rounded-3xl border border-white/10 bg-[#080b0f] px-8 py-10 text-center max-w-md">
                  <CalendarX className="mx-auto h-10 w-10 text-slate-500 mb-3" />
                  <h3 className="text-lg font-bold text-white">No Upcoming Events</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    No upcoming events are currently scheduled in the database.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Activity Modal */}
      {selectedActivity && (
        <ActivityDetailedCard
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onImageClick={(imgUrl, title) =>
            setPreviewPhoto({
              isOpen: true,
              url: imgUrl,
              title: title,
              subtitle: `${selectedActivity.branch} • ${selectedActivity.category}`,
            })
          }
        />
      )}

      {/* Detailed Upcoming Event Modal */}
      {selectedUpcoming && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedUpcoming(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0a0f18] text-white shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedUpcoming(null)}
              className="absolute right-5 top-5 rounded-full p-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Clickable Modal Image */}
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-6 bg-black cursor-zoom-in"
              onClick={() => {
                const img =
                  typeof selectedUpcoming.image === 'object' && selectedUpcoming.image?.url
                    ? selectedUpcoming.image.url
                    : typeof selectedUpcoming.image === 'string' && selectedUpcoming.image
                    ? selectedUpcoming.image
                    : '/images/sih.jpg';
                setPreviewPhoto({
                  isOpen: true,
                  url: img,
                  title: selectedUpcoming.title || selectedUpcoming.eventName,
                  subtitle: selectedUpcoming.venue,
                });
              }}
              title="Click to view full photo"
            >
              <img
                src={
                  typeof selectedUpcoming.image === 'object' && selectedUpcoming.image?.url
                    ? selectedUpcoming.image.url
                    : typeof selectedUpcoming.image === 'string' && selectedUpcoming.image
                    ? selectedUpcoming.image
                    : '/images/sih.jpg'
                }
                alt={selectedUpcoming.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent" />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 border border-white/15">
                <ZoomIn size={14} className="text-brand-blue-light" />
                <span>View Full Photo</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-brand-blue-light font-semibold">
                  <Calendar size={14} />
                  {formatDisplayDate(selectedUpcoming.date)}
                </span>
                {selectedUpcoming.venue && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin size={14} className="text-yellow-400" />
                    {selectedUpcoming.venue}
                  </span>
                )}
                {selectedUpcoming.lastDate && (
                  <span className="rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-0.5 text-yellow-300 font-semibold text-[11px]">
                    Closes: {formatDisplayDate(selectedUpcoming.lastDate)}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-white">
                {selectedUpcoming.title || selectedUpcoming.eventName}
              </h3>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {selectedUpcoming.overview || 'No event description available.'}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedUpcoming(null)}
                  className="rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-blue-cta"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-WINDOW PHOTO LIGHTBOX MODAL */}
      <ImageModal
        isOpen={previewPhoto.isOpen}
        imageUrl={previewPhoto.url}
        title={previewPhoto.title}
        subtitle={previewPhoto.subtitle}
        onClose={() => setPreviewPhoto((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
