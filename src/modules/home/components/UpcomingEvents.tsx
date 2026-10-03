import { useState, useEffect } from 'react';
import { ArrowUpRight, CalendarDays, MapPin, X, Sparkles, CalendarX, ZoomIn } from 'lucide-react';
import { adminApi, type UpcomingEvent } from '@/services/adminApi';
import ImageModal from '@/components/ImageModal';

const formatDisplayDate = (dateStr?: string) => {
  if (!dateStr) return 'TBA';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatRegistrationDate = (lastDate?: string) => {
  if (!lastDate) return null;
  try {
    const d = new Date(lastDate);
    if (isNaN(d.getTime())) return `Registration closes: ${lastDate}`;
    const formatted = d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `Registration closes: ${formatted}`;
  } catch {
    return `Registration closes: ${lastDate}`;
  }
};

const getEventImage = (image?: UpcomingEvent['image']): string => {
  if (typeof image === 'object' && image?.url) return image.url;
  if (typeof image === 'string' && image.trim().length > 0) return image;
  return '/images/sih.jpg';
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);

  // Photo preview window state
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

    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);

        const res = await adminApi.getUpcomingEvents();
        if (isMounted) {
          if (res.success && Array.isArray(res.posts)) {
            setEvents(res.posts);
          } else {
            setEvents([]);
          }
        }
      } catch (err) {
        console.error('Failed to load upcoming events from API:', err);
        if (isMounted) {
          setEvents([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUpcomingEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-24 lg:py-28">
      {/* Main container */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* -------------------------------------------------
            SECTION HEADING
            ------------------------------------------------- */}
        <div className="mb-12 text-center sm:mb-14 lg:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3.5 py-1 text-xs font-semibold text-brand-blue-light">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Live Announcements</span>
          </div>

          <h2 className="text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Upcoming <span className="text-brand-blue-dark">Events</span>
            <span className="text-yellow-400">.</span>
          </h2>

          <div className="mx-auto mt-6 flex w-fit items-center gap-2">
            <span className="h-1 w-12 rounded-full bg-[#00629b]" />
            <span className="h-1 w-3 rounded-full bg-yellow-400" />
          </div>
        </div>

        {/* -------------------------------------------------
            LOADING SKELETON
            ------------------------------------------------- */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b0f] p-5 sm:rounded-3xl"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-white/5" />
                <div className="mt-4 h-4 w-1/3 rounded bg-white/10" />
                <div className="mt-3 h-6 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-4 w-1/2 rounded bg-white/5" />
                <div className="mt-4 h-16 w-full rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          /* -------------------------------------------------
              EVENTS GRID (PURELY FROM BACKEND API)
              ------------------------------------------------- */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {events.map((event, index) => {
              const displayTitle = event.title || event.eventName || 'Upcoming Event';
              const displayEventName = event.eventName || event.title || 'IEEE Event';
              const displayLocation = event.venue || 'GBPIET Campus';
              const imageUrl = getEventImage(event.image);
              const registrationText = formatRegistrationDate(event.lastDate);

              return (
                <article
                  key={event.postId || event._id || index}
                  onClick={() => setSelectedEvent(event)}
                  className="
                    group
                    cursor-pointer
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
                    hover:shadow-[0_20px_60px_rgba(0,98,155,0.2)]
                    sm:rounded-3xl
                    flex
                    flex-col
                  "
                >
                  {/* EVENT IMAGE - CLICK TO OPEN PHOTO WINDOW */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-black/40 cursor-zoom-in"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewPhoto({
                        isOpen: true,
                        url: imageUrl,
                        title: displayTitle,
                        subtitle: `${displayLocation} • ${formatDisplayDate(event.date)}`,
                      });
                    }}
                    title="Click to view full photo"
                  >
                    <img
                      src={imageUrl}
                      alt={displayTitle}
                      width={800}
                      height={500}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        opacity-85
                        transition-all
                        duration-700
                        group-hover:scale-105
                        group-hover:opacity-100
                      "
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-black/20 to-transparent" />

                    {/* Photo zoom badge on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                        <ZoomIn size={14} className="text-brand-blue-light" />
                        <span>View Photo</span>
                      </span>
                    </div>

                    {/* Index badge */}
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] text-white/80 border border-white/10 sm:left-5 sm:top-5 sm:text-xs">
                      0{index + 1}
                    </span>
                  </div>

                  {/* EVENT CONTENT */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Event date */}
                      <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-brand-blue-light sm:text-sm">
                        <CalendarDays size={15} strokeWidth={2} />
                        <span>{formatDisplayDate(event.date)}</span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bold leading-tight text-white group-hover:text-brand-blue-light transition-colors sm:text-2xl line-clamp-2">
                        {displayTitle}
                      </h3>

                      {displayEventName !== displayTitle && (
                        <p className="mt-1 text-xs text-slate-400 font-medium truncate">
                          {displayEventName}
                        </p>
                      )}

                      {/* Location */}
                      <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-white/50">
                        <MapPin size={14} strokeWidth={1.8} className="shrink-0 text-yellow-400" />
                        <span className="truncate">{displayLocation}</span>
                      </div>

                      {/* Registration Date Badge */}
                      {registrationText && (
                        <div className="mt-3.5 rounded-xl border border-yellow-400/20 bg-yellow-400/[0.06] px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-yellow-300">
                            {registrationText}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      {event.overview && (
                        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-white/50 line-clamp-3">
                          {event.overview}
                        </p>
                      )}
                    </div>

                    {/* Read More button */}
                    <div className="pt-5 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-gradient-to-r
                          from-[#00629b]
                          to-[#004f7d]
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-white
                          shadow-[0_4px_16px_rgba(0,98,155,0.25)]
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:from-[#0b63ff]
                          hover:to-[#00629b]
                        "
                      >
                        <span>View Details</span>
                        <ArrowUpRight
                          size={14}
                          strokeWidth={2.5}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* -------------------------------------------------
              EMPTY STATE (NO DUMMY DATA)
              ------------------------------------------------- */
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="rounded-3xl border border-white/10 bg-[#080b0f] px-8 py-12 text-center max-w-md shadow-2xl">
              <CalendarX className="mx-auto h-12 w-12 text-slate-500 mb-4" />
              <h3 className="text-xl font-bold text-white">No Upcoming Events</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                There are currently no active upcoming events in the database. New events published through the IEEE Admin Portal will show up here automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------
          EVENT DETAIL MODAL
          ------------------------------------------------------- */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0a0f18] text-white shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute right-5 top-5 rounded-full p-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            {/* Modal Image - Click to view full photo in window */}
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-6 bg-black cursor-zoom-in"
              onClick={() => {
                setPreviewPhoto({
                  isOpen: true,
                  url: getEventImage(selectedEvent.image),
                  title: selectedEvent.title || selectedEvent.eventName,
                  subtitle: selectedEvent.venue,
                });
              }}
              title="Click to view full photo"
            >
              <img
                src={getEventImage(selectedEvent.image)}
                alt={selectedEvent.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent" />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white/90 border border-white/15">
                <ZoomIn size={14} className="text-brand-blue-light" />
                <span>View Full Photo</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-brand-blue-light font-semibold">
                  <CalendarDays size={14} />
                  {formatDisplayDate(selectedEvent.date)}
                </span>
                {selectedEvent.venue && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin size={14} className="text-yellow-400" />
                    {selectedEvent.venue}
                  </span>
                )}
                {selectedEvent.lastDate && (
                  <span className="rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-0.5 text-yellow-300 font-semibold text-[11px]">
                    {formatRegistrationDate(selectedEvent.lastDate)}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {selectedEvent.title || selectedEvent.eventName}
              </h3>

              {selectedEvent.eventName && selectedEvent.eventName !== selectedEvent.title && (
                <p className="text-sm font-medium text-slate-400">
                  Sub-event: {selectedEvent.eventName}
                </p>
              )}

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Event Overview
                </h4>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {selectedEvent.overview || 'No overview provided.'}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-xl bg-brand-blue px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-blue-cta transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN PHOTO PREVIEW WINDOW */}
      <ImageModal
        isOpen={previewPhoto.isOpen}
        imageUrl={previewPhoto.url}
        title={previewPhoto.title}
        subtitle={previewPhoto.subtitle}
        onClose={() => setPreviewPhoto((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/[0.03] blur-[120px]" />
    </section>
  );
}
