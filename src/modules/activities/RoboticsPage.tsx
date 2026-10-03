import { useState, useEffect } from 'react';
import { ExternalLink, Cpu, Layers } from 'lucide-react';
import { ActivityCard } from './components/ActivityCard';
import ActivityDetailedCard from './components/ActivityDetailedCard';
import ImageModal from '@/components/ImageModal';
import { adminApi, type DepartmentPost } from '@/services/adminApi';
import type { Activity } from './EventsPage';

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
    id: (post.postId || post.id || post._id || `ROBO-${Math.random()}`) as string,
    title: post.title || 'Robotics Activity',
    category: post.category || 'Workshops',
    branch: (post.branch || 'ECE').toUpperCase(),
    date: post.date || 'Recent',
    time: post.time || '',
    venue: post.venue || 'GBPIET Robotics Lab',
    organizedBy: post.organizedBy || 'IEEE Robotics & Automation Society',
    reportAuthor: post.reportAuthor || 'IEEE Member',
    overview: post.overview || post.description || '',
    description: post.description || post.overview || '',
    keyDiscussion: parseList(post.keyDiscussion),
    studentsPresent: parseList(post.studentsPresent),
    image: imageUrl,
  };
};

export default function RoboticsPage() {
  const [workshops, setWorkshops] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Photo viewer modal state
  const [previewPhoto, setPreviewPhoto] = useState<{
    isOpen: boolean;
    url: string;
    title?: string;
    subtitle?: string;
  }>({
    isOpen: false,
    url: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchRoboticsPosts = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDepartmentPosts();
        if (isMounted && res.success && Array.isArray(res.posts)) {
          const roboPosts = res.posts
            .filter((p) => {
              const cat = (p.category || '').toLowerCase();
              const tit = (p.title || '').toLowerCase();
              const ov = (p.overview || '').toLowerCase();
              const br = (p.branch || '').toLowerCase();
              return (
                cat.includes('workshop') ||
                cat.includes('robot') ||
                tit.includes('robot') ||
                ov.includes('robot') ||
                br === 'ece' ||
                br === 'ee'
              );
            })
            .map(formatDepartmentPost);

          setWorkshops(roboPosts);
        }
      } catch (err) {
        console.warn('Could not fetch robotics activities from API:', err);
        if (isMounted) setWorkshops([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRoboticsPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 py-24 sm:px-8 sm:py-32">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-20 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#00629b]/15 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
        <div className="absolute -left-40 top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full bg-[#00629b]/10 blur-[80px] sm:h-[350px] sm:w-[350px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-16">
        {/* Header */}
        <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#080b0f]/80 p-6 text-center shadow-[0_0_30px_rgba(0,141,204,0.1)] backdrop-blur-md sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00629b]/20">
            <Cpu className="h-6 w-6 text-[#008dcc]" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Robotics <span className="text-[#008dcc]">Hub</span>
          </h1>

          <p className="mt-3 text-sm text-white/50 sm:text-base">
            Discover our latest build sessions, hardware projects, and technical workshops.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="flex w-full flex-col items-center">
          <div className="mb-10 flex w-full max-w-[800px] items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00629b]" />
            <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-[#008dcc]">
              Our Workshops & Builds
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00629b]" />
          </div>

          {loading ? (
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse rounded-[24px] border border-white/10 bg-[#080b0f] p-5"
                >
                  <div className="h-[230px] w-full rounded-2xl bg-white/5" />
                  <div className="mt-4 h-4 w-1/4 rounded bg-white/10" />
                  <div className="mt-3 h-6 w-3/4 rounded bg-white/10" />
                  <div className="mt-3 h-12 w-full rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : workshops.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="flex min-w-0 justify-center cursor-pointer"
                  onClick={() => setSelectedActivity(workshop)}
                >
                  <ActivityCard
                    activity={workshop}
                    onClick={() => setSelectedActivity(workshop)}
                    onImageClick={() =>
                      setPreviewPhoto({
                        isOpen: true,
                        url: workshop.image,
                        title: workshop.title,
                        subtitle: `${workshop.branch} • ${workshop.category}`,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] w-full max-w-[420px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#080b0f] p-8 text-center shadow-xl">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400">
                <Layers size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">No Workshops in Database</h3>
              <p className="mt-1.5 text-xs text-white/50 leading-relaxed">
                There are currently no published robotics workshops in the database. New workshops published through the Admin Portal will automatically appear here.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Link Banner */}
        <a
          href="https://prasthanam-gbpiet.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full max-w-4xl flex-col items-center justify-between gap-6 overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#080b0f] to-[#00629b]/20 p-6 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-[#008dcc]/50 hover:shadow-[0_10px_40px_rgba(0,141,204,0.3)] sm:flex-row sm:rounded-[32px] sm:p-8"
        >
          <div className="absolute inset-0 bg-[#008dcc]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 text-center sm:text-left">
            <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Visit the Official Robotics Website
            </h2>
            <p className="text-sm leading-6 text-white/60 sm:text-base">
              Explore all our projects, team members, and comprehensive resources.
            </p>
          </div>
          <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00629b] text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-[#008dcc]">
            <ExternalLink className="h-6 w-6" />
          </div>
        </a>
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

      {/* Photo Lightbox Window */}
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
