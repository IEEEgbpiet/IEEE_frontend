import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Clock,
  Radio,
} from 'lucide-react';
import { adminApi, type UpcomingEvent } from '@/services/adminApi';
import ImageModal from '@/components/ImageModal';

const STORAGE_KEY_POPUP_DISMISSED = 'ieee_upcoming_popup_dismissed';
const STORAGE_KEY_PILL_DISMISSED = 'ieee_upcoming_pill_dismissed';

interface UpcomingEventsPopupProps {
  isParentLoading?: boolean;
}

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

const formatDeadline = (dateStr?: string) => {
  if (!dateStr) return null;
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

const getEventImage = (image?: UpcomingEvent['image']): string => {
  if (typeof image === 'object' && image?.url) return image.url;
  if (typeof image === 'string' && image.trim().length > 0) return image;
  return '/images/sih.jpg';
};

export default function UpcomingEventsPopup({ isParentLoading = false }: UpcomingEventsPopupProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_POPUP_DISMISSED) === 'true';
    } catch {
      return false;
    }
  });
  const [isPillDismissed, setIsPillDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_PILL_DISMISSED) === 'true';
    } catch {
      return false;
    }
  });

  const [previewPoster, setPreviewPoster] = useState<{
    isOpen: boolean;
    url: string;
    title?: string;
    subtitle?: string;
  }>({
    isOpen: false,
    url: '',
  });

  // Fetch upcoming events from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const res = await adminApi.getUpcomingEvents();
        if (isMounted && res.success && Array.isArray(res.posts) && res.posts.length > 0) {
          setEvents(res.posts);
        }
      } catch (err) {
        console.warn('Could not load upcoming events for popup:', err);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Control auto-opening logic
  useEffect(() => {
    // If user is already on the events page or admin route, don't show the popup
    const isEventsPage = location.pathname.startsWith('/activities/events');
    const isAdminPage = location.pathname.startsWith('/admin');

    if (isEventsPage || isAdminPage) {
      setIsOpen(false);
      return;
    }

    // If loading or dismissed or no events, don't auto-open
    if (isParentLoading || hasDismissed || events.length === 0) {
      return;
    }

    // Comfortable entrance delay after page loader finishes
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [isParentLoading, hasDismissed, events.length, location.pathname]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const activeEvent = useMemo(() => {
    if (events.length === 0) return null;
    return events[currentIndex] || events[0];
  }, [events, currentIndex]);

  const handleClosePopup = () => {
    setIsOpen(false);
    setHasDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY_POPUP_DISMISSED, 'true');
    } catch {
      // ignore
    }
  };

  const handleDismissPill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPillDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY_PILL_DISMISSED, 'true');
    } catch {
      // ignore
    }
  };

  const handleReopenPopup = () => {
    setIsOpen(true);
  };

  const handleCheckItNow = () => {
    handleClosePopup();
    // Navigate to activities events page with upcoming tab activated
    navigate('/activities/events?tab=upcoming');
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNextEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  if (events.length === 0) {
    return null;
  }

  const imageUrl = getEventImage(activeEvent?.image);
  const displayTitle = activeEvent?.title || activeEvent?.eventName || 'Upcoming Event';
  const displaySubTitle =
    activeEvent?.eventName && activeEvent.eventName !== displayTitle
      ? activeEvent.eventName
      : null;
  const deadline = formatDeadline(activeEvent?.lastDate);
  const locationVenue = activeEvent?.venue || 'GBPIET Campus';

  return (
    <>
      {/* ========================================================
          FULL MODAL / FLASH SCREEN POPUP
          ======================================================== */}
      {isOpen && activeEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upcoming-event-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={handleClosePopup}
        >
          {/* Main Card Container */}
          <div
            className="
              relative
              w-full
              max-w-4xl
              max-h-[92vh]
              overflow-hidden
              rounded-2xl
              sm:rounded-3xl
              border
              border-white/15
              bg-[#080d1a]
              text-white
              shadow-[0_25px_80px_rgba(0,98,155,0.4)]
              animate-modalPop
              flex
              flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Glowing IEEE Gradient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00629b] via-[#0b63ff] to-[#5aa2ff]" />

            {/* Header row with announcement pill & CROSS CLOSE BUTTON */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 bg-[#050811]/90">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>

                <div className="flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-0.5 text-[11px] font-semibold text-brand-blue-light tracking-wide">
                  <Sparkles size={12} className="text-yellow-400" />
                  <span>UPCOMING EVENT ALERT</span>
                </div>

                {events.length > 1 && (
                  <span className="hidden sm:inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                    {currentIndex + 1} of {events.length}
                  </span>
                )}
              </div>

              {/* CROSS OPTION TO CUT DOWN / CLOSE */}
              <button
                type="button"
                onClick={handleClosePopup}
                className="
                  group
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white/70
                  transition-all
                  duration-200
                  hover:scale-105
                  hover:border-red-500/40
                  hover:bg-red-500/20
                  hover:text-white
                  hover:rotate-90
                  active:scale-95
                  focus:outline-none
                  focus:ring-2
                  focus:ring-brand-blue
                "
                aria-label="Close upcoming events popup"
                title="Close (Esc)"
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* ----------------------------------------------------
                    LEFT COLUMN: POSTER / IMAGE PREVIEW
                    ---------------------------------------------------- */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div
                    className="
                      group/poster
                      relative
                      w-full
                      aspect-[16/10]
                      md:aspect-[4/3]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/15
                      bg-black
                      shadow-xl
                      cursor-zoom-in
                    "
                    onClick={() =>
                      setPreviewPoster({
                        isOpen: true,
                        url: imageUrl,
                        title: displayTitle,
                        subtitle: `${locationVenue} • ${formatDisplayDate(activeEvent.date)}`,
                      })
                    }
                    title="Click to zoom event poster"
                  >
                    <img
                      src={imageUrl}
                      alt={displayTitle}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover/poster:scale-105
                      "
                      loading="eager"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Hover Zoom Badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/poster:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/80 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                        <ZoomIn size={14} className="text-brand-blue-light" />
                        <span>View Poster</span>
                      </span>
                    </div>

                    {/* Date Pill Overlaid on Poster */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 border border-white/15 text-brand-blue-light">
                        <Calendar size={13} />
                        <span>{formatDisplayDate(activeEvent.date)}</span>
                      </span>

                      {deadline && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-400/90 text-black px-2 py-1 text-[10px] font-bold">
                          <Clock size={11} />
                          <span>Closing soon</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multiple Events Pagination Controls */}
                  {events.length > 1 && (
                    <div className="mt-3 flex items-center justify-between w-full px-1">
                      <button
                        type="button"
                        onClick={handlePrevEvent}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-all text-xs"
                        aria-label="Previous event"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {events.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentIndex
                                ? 'w-6 bg-brand-blue-light'
                                : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                            aria-label={`Jump to event ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleNextEvent}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-all text-xs"
                        aria-label="Next event"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* ----------------------------------------------------
                    RIGHT COLUMN: EVENT DETAILS & CTA
                    ---------------------------------------------------- */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  {/* Category / Sub-heading */}
                  {displaySubTitle && (
                    <p className="text-xs font-semibold tracking-wider uppercase text-brand-blue-light line-clamp-1 mb-1">
                      {displaySubTitle}
                    </p>
                  )}

                  {/* Title */}
                  <h3
                    id="upcoming-event-popup-title"
                    className="
                      text-2xl
                      sm:text-3xl
                      font-black
                      leading-tight
                      tracking-tight
                      text-white
                      line-clamp-2
                    "
                  >
                    {displayTitle}
                  </h3>

                  {/* Event Meta Badges */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200">
                      <Calendar size={13} className="text-brand-blue-light shrink-0" />
                      <span>{formatDisplayDate(activeEvent.date)}</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200">
                      <MapPin size={13} className="text-yellow-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{locationVenue}</span>
                    </div>

                    {deadline && (
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-2.5 py-1 text-yellow-300 font-medium">
                        <Clock size={13} className="shrink-0" />
                        <span>Deadline: {deadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Overview snippet */}
                  {activeEvent.overview && (
                    <div className="mt-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs sm:text-sm text-slate-300/90 leading-relaxed line-clamp-3 sm:line-clamp-4 whitespace-pre-line">
                      {activeEvent.overview}
                    </div>
                  )}

                  {/* Quick Highlight Pills */}
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/5">
                      ✓ Hands-on Learning
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/5">
                      ✓ Certificate Included
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/5">
                      ✓ Open for Students
                    </span>
                  </div>

                  {/* Call to Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* CHECK IT NOW BUTTON */}
                    <button
                      type="button"
                      onClick={handleCheckItNow}
                      className="
                        group
                        relative
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        gap-2.5
                        rounded-xl
                        bg-gradient-to-r
                        from-[#00629b]
                        via-[#0b63ff]
                        to-[#00a3ff]
                        px-6
                        py-3.5
                        text-sm
                        font-bold
                        text-white
                        shadow-[0_0_25px_rgba(11,99,255,0.45)]
                        transition-all
                        duration-300
                        hover:shadow-[0_0_35px_rgba(11,99,255,0.7)]
                        hover:scale-[1.02]
                        active:scale-[0.98]
                      "
                    >
                      <span>Check It Now</span>
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>

                    {/* DISMISS / MAYBE LATER */}
                    <button
                      type="button"
                      onClick={handleClosePopup}
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/5
                        px-4
                        py-3.5
                        text-xs
                        font-semibold
                        text-slate-300
                        transition-colors
                        hover:bg-white/10
                        hover:text-white
                        text-center
                      "
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar Info */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 sm:px-6 bg-[#04060d] text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Radio size={12} className="text-brand-blue-light animate-pulse" />
                <span>IEEE GBPIET Student Branch Official Announcement</span>
              </span>

              <button
                type="button"
                onClick={handleCheckItNow}
                className="text-brand-blue-light hover:underline font-semibold"
              >
                Go to Activities &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOATING PILL / BADGE TRIGGER (WHEN POPUP IS DISMISSED)
          Allows users to easily re-open the popup anytime!
          ======================================================== */}
      {!isOpen && hasDismissed && !isPillDismissed && activeEvent && !location.pathname.startsWith('/activities/events') && (
        <div className="fixed bottom-6 left-6 z-40 animate-fadeIn">
          <div
            onClick={handleReopenPopup}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleReopenPopup();
            }}
            className="
              group
              flex
              items-center
              gap-2.5
              rounded-full
              border
              border-brand-blue/40
              bg-[#080d1a]/95
              py-2
              pl-3
              pr-2
              text-xs
              font-semibold
              text-white
              shadow-[0_8px_30px_rgba(0,98,155,0.4)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-brand-blue
              hover:scale-105
              hover:shadow-[0_10px_35px_rgba(0,98,155,0.6)]
              cursor-pointer
            "
            title="Click to view upcoming events"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="flex items-center gap-1.5 text-white/90 group-hover:text-white">
              <Sparkles size={13} className="text-yellow-400" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate">{displayTitle}</span>
            </span>

            <span className="rounded-full bg-brand-blue-cta px-2 py-0.5 text-[10px] font-bold text-white shadow">
              Check Now
            </span>

            {/* Cross button on floating pill to cut it down */}
            <button
              type="button"
              onClick={handleDismissPill}
              className="ml-1 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Dismiss floating event banner"
              title="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* FULL-WINDOW POSTER LIGHTBOX */}
      <ImageModal
        isOpen={previewPoster.isOpen}
        imageUrl={previewPoster.url}
        title={previewPoster.title}
        subtitle={previewPoster.subtitle}
        onClose={() => setPreviewPoster((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
