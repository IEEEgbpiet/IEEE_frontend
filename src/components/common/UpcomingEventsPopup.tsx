import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminApi, type UpcomingEvent } from '@/services/adminApi';
import ImageModal from '@/components/ImageModal';
import fallbackEventsData from '@/data/upcomingEventsFallback.json';

const STORAGE_KEY_POPUP_DISMISSED = 'ieee_upcoming_popup_dismissed';
const STORAGE_KEY_PILL_DISMISSED = 'ieee_upcoming_pill_dismissed';

interface UpcomingEventsPopupProps {
  isParentLoading?: boolean;
}

const getEventImage = (image?: UpcomingEvent['image']): string => {
  if (typeof image === 'object' && image?.url) return image.url;
  if (typeof image === 'string' && image.trim().length > 0) return image;
  return '/images/sih.jpg';
};

export default function UpcomingEventsPopup({ isParentLoading = false }: UpcomingEventsPopupProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize with all upcoming events so all events are immediately loaded
  const [events, setEvents] = useState<UpcomingEvent[]>(() => {
    return Array.isArray(fallbackEventsData) && fallbackEventsData.length > 0
      ? (fallbackEventsData as UpcomingEvent[])
      : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

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
  }>({
    isOpen: false,
    url: '',
  });

  // Fetch all upcoming events from backend API (with fallback to live Render backend)
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const res = await adminApi.getUpcomingEvents();
        if (isMounted && res.success && Array.isArray(res.posts) && res.posts.length > 0) {
          setEvents(res.posts);
          return;
        }
      } catch (err) {
        console.warn('Could not load upcoming events from primary API:', err);
      }

      // If local API failed or was empty, query live Render backend to get all events
      try {
        const fallbackRes = await fetch(
          'https://ieee-backend-7z25.onrender.com/api/v1/upcomingevents/all'
        );
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          if (isMounted && data.success && Array.isArray(data.posts) && data.posts.length > 0) {
            setEvents(data.posts);
            return;
          }
        }
      } catch (fallbackErr) {
        console.warn('Fallback backend unreachable, using bundled events:', fallbackErr);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-cycle through events every 4.5 seconds if popup is open and user is not interacting
  useEffect(() => {
    if (!isOpen || isPaused || events.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, events.length]);

  // Control auto-opening logic
  useEffect(() => {
    const isEventsPage = location.pathname.startsWith('/activities/events');
    const isAdminPage = location.pathname.startsWith('/admin');

    if (isEventsPage || isAdminPage) {
      setIsOpen(false);
      return;
    }

    if (isParentLoading || hasDismissed || events.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isParentLoading, hasDismissed, events.length, location.pathname]);

  // Handle ESC and Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePopup();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, events.length]);

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

  const handleGoToEvents = () => {
    handleClosePopup();
    navigate('/activities/events?tab=upcoming');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevEvent = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNextEvent = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextEvent();
      } else {
        handlePrevEvent();
      }
    }
    touchStartX.current = null;
  };

  if (events.length === 0) {
    return null;
  }

  const imageUrl = getEventImage(activeEvent?.image);
  const displayTitle = activeEvent?.title || activeEvent?.eventName || 'Upcoming Event';

  return (
    <>
      {/* ========================================================
          STREAMLINED UPCOMING EVENTS MODAL POPUP
          - Shows ALL upcoming events with smooth navigation
          - Mobile & Tablet: Portrait Mode only
          - Insets: 10vw left & right, 15vh top & bottom (width: 80vw, height: 70vh)
          - Laptop: 30vw left & right, 15vh top & bottom (width: 40vw, height: 70vh)
          - Content: Image, Title, and "Go to Events" button ONLY
          ======================================================== */}
      {isOpen && activeEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upcoming-event-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 animate-fadeIn"
          onClick={handleClosePopup}
        >
          {/* Main Card Container */}
          <div
            className="
              relative
              flex
              flex-col
              w-[80vw]
              h-[70vh]
              lg:w-[40vw]
              overflow-hidden
              rounded-2xl
              sm:rounded-3xl
              border
              border-white/15
              bg-[#080d1a]
              text-white
              shadow-[0_25px_80px_rgba(0,98,155,0.45)]
              animate-modalPop
            "
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#00629b] via-[#0b63ff] to-[#5aa2ff] shrink-0" />

            {/* ----------------------------------------------------
                IMAGE SECTION (Fills flexible remaining portrait height)
                ---------------------------------------------------- */}
            <div className="relative w-full flex-1 min-h-0 bg-[#040711] overflow-hidden flex items-center justify-center select-none">
              {/* Blurred Ambient Backdrop */}
              <img
                key={`bg-${activeEvent.postId || currentIndex}`}
                src={imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none transition-opacity duration-500"
              />

              {/* Main Event Poster Image */}
              <img
                key={`img-${activeEvent.postId || currentIndex}`}
                src={imageUrl}
                alt={displayTitle}
                className="relative max-h-full max-w-full object-contain z-10 select-none cursor-pointer transition-opacity duration-300"
                onClick={() =>
                  setPreviewPoster({
                    isOpen: true,
                    url: imageUrl,
                    title: displayTitle,
                  })
                }
                loading="eager"
              />

              {/* Top-Right Close Button */}
              <button
                type="button"
                onClick={handleClosePopup}
                className="
                  absolute
                  top-3
                  right-3
                  z-30
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/65
                  backdrop-blur-md
                  border
                  border-white/20
                  text-white/80
                  hover:text-white
                  hover:bg-black/90
                  hover:scale-105
                  transition-all
                  duration-200
                  active:scale-95
                  shadow-lg
                  cursor-pointer
                "
                aria-label="Close popup"
                title="Close"
              >
                <X size={18} strokeWidth={2.2} />
              </button>

              {/* Previous / Next Arrows (Icon-only, across all upcoming events) */}
              {events.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevEvent}
                    className="
                      absolute
                      left-2.5
                      top-1/2
                      -translate-y-1/2
                      z-30
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-black/65
                      backdrop-blur-md
                      border
                      border-white/20
                      text-white/80
                      hover:text-white
                      hover:bg-black/90
                      hover:scale-110
                      transition-all
                      active:scale-95
                      shadow-md
                      cursor-pointer
                    "
                    aria-label="Previous event"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextEvent}
                    className="
                      absolute
                      right-2.5
                      top-1/2
                      -translate-y-1/2
                      z-30
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-black/65
                      backdrop-blur-md
                      border
                      border-white/20
                      text-white/80
                      hover:text-white
                      hover:bg-black/90
                      hover:scale-110
                      transition-all
                      active:scale-95
                      shadow-md
                      cursor-pointer
                    "
                    aria-label="Next event"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Sleek Pagination Dots */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 max-w-[85%] overflow-x-auto scrollbar-none">
                    {events.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                          idx === currentIndex
                            ? 'w-5 bg-brand-blue-light'
                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Event ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ----------------------------------------------------
                BOTTOM SECTION: TITLE & "GO TO EVENTS" BUTTON ONLY
                ---------------------------------------------------- */}
            <div className="shrink-0 p-4 sm:p-5 flex flex-col items-center justify-center gap-3 bg-[#060a14] border-t border-white/10">
              {/* Event Title ONLY */}
              <h3
                id="upcoming-event-popup-title"
                className="text-base sm:text-lg md:text-xl font-bold text-white text-center line-clamp-2 w-full px-2 leading-snug"
              >
                {displayTitle}
              </h3>

              {/* "Go to Events" Button ONLY */}
              <button
                type="button"
                onClick={handleGoToEvents}
                className="
                  group
                  relative
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#00629b]
                  via-[#0b63ff]
                  to-[#00a3ff]
                  py-3
                  px-6
                  text-sm
                  sm:text-base
                  font-bold
                  text-white
                  shadow-[0_0_20px_rgba(11,99,255,0.4)]
                  transition-all
                  duration-200
                  hover:shadow-[0_0_30px_rgba(11,99,255,0.65)]
                  hover:scale-[1.01]
                  active:scale-[0.99]
                  cursor-pointer
                "
              >
                <span>Go to Events</span>
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOATING PILL / BADGE TRIGGER (WHEN POPUP IS DISMISSED)
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

            <span className="max-w-[140px] sm:max-w-[200px] truncate text-white/90 group-hover:text-white font-medium">
              {displayTitle}
            </span>

            <span className="rounded-full bg-brand-blue-cta px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
              Go to Events
            </span>

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
        onClose={() => setPreviewPoster((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
