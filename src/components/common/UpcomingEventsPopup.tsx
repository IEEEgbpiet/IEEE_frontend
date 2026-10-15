import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { adminApi, type AnnouncementRecord } from '@/services/adminApi';
import ImageModal from '@/components/ImageModal';
import fallbackAnnouncementsData from '@/data/announcementsFallback.json';

const STORAGE_KEY_POPUP_DISMISSED = 'ieee_announcement_popup_dismissed';
const STORAGE_KEY_PILL_DISMISSED = 'ieee_announcement_pill_dismissed';

interface UpcomingEventsPopupProps {
  isParentLoading?: boolean;
}

const getAnnouncementImage = (image?: AnnouncementRecord['image']): string => {
  if (typeof image === 'object' && image?.url && image.url.trim().length > 0) {
    return image.url;
  }
  return '';
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

export default function UpcomingEventsPopup({
  isParentLoading = false,
}: UpcomingEventsPopupProps) {
  const location = useLocation();

  // Initialize with fallback announcements if available
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>(() => {
    return Array.isArray(fallbackAnnouncementsData) && fallbackAnnouncementsData.length > 0
      ? (fallbackAnnouncementsData as AnnouncementRecord[])
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

  // Fetch announcements from /api/v1/announcement/getAll
  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      try {
        const res = await adminApi.getAnnouncements();
        if (isMounted && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAnnouncements(res.data);
          return;
        }
      } catch (err) {
        console.warn('Could not load announcements from primary API:', err);
      }

      // If primary API failed, query Render backend directly
      try {
        const fallbackRes = await fetch(
          'https://ieee-backend-7z25.onrender.com/api/v1/announcement/getAll',
          { cache: 'no-store' }
        );
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
            setAnnouncements(data.data);
            return;
          }
        }
      } catch (fallbackErr) {
        console.warn('Fallback backend unreachable for announcements:', fallbackErr);
      }
    };

    fetchAnnouncements();

    const handleAnnouncementsUpdated = () => {
      void fetchAnnouncements();
    };

    window.addEventListener('ieee:announcements-changed', handleAnnouncementsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('ieee:announcements-changed', handleAnnouncementsUpdated);
    };
  }, []);

  // Auto-cycle through announcements every 5 seconds if popup is open and user is not interacting
  useEffect(() => {
    if (!isOpen || isPaused || announcements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, announcements.length]);

  // Auto-open logic
  useEffect(() => {
    const isAdminPage = location.pathname.startsWith('/admin');

    if (isAdminPage) {
      setIsOpen(false);
      return;
    }

    if (isParentLoading || hasDismissed || announcements.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [isParentLoading, hasDismissed, announcements.length, location.pathname]);

  // Handle ESC and Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePopup();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, announcements.length]);

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

  const activeAnnouncement = useMemo(() => {
    if (announcements.length === 0) return null;
    return announcements[currentIndex] || announcements[0];
  }, [announcements, currentIndex]);

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

  const handlePrevAnnouncement = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNextAnnouncement = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
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
        handleNextAnnouncement();
      } else {
        handlePrevAnnouncement();
      }
    }
    touchStartX.current = null;
  };

  if (announcements.length === 0) {
    return null;
  }

  const imageUrl = getAnnouncementImage(activeAnnouncement?.image);
  const displayTitle =
    activeAnnouncement?.title?.trim() || 'IEEE Student Branch Announcement';
  const displayDescription = activeAnnouncement?.description?.trim() || '';
  const formattedDate = formatDate(activeAnnouncement?.createdAt);

  return (
    <>
      {/* ========================================================
          STREAMLINED ANNOUNCEMENT MODAL POPUP
          - Powered by /api/v1/announcement/getAll
          - Shows live branch announcements with smooth navigation
          - Responsive: Portrait Mode
          - Top accent gradient bar & announcement badge
          ======================================================== */}
      {isOpen && activeAnnouncement && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-popup-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
          onClick={handleClosePopup}
        >
          {/* Main Card Container */}
          <div
            className="
              relative
              flex
              flex-col
              w-[90vw]
              max-w-[480px]
              h-[75vh]
              max-h-[640px]
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
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00629b] via-[#0b63ff] to-[#00d2ff] shrink-0" />

            {/* Top Header Strip with Badge and Close Button */}
            <div className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-[#060a14]/90 border-b border-white/10 shrink-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                <Megaphone size={13} className="text-blue-400" />
                <span className="uppercase tracking-wider text-[11px]">Announcement</span>
                {announcements.length > 1 && (
                  <span className="ml-1 text-[10px] text-blue-300/70 font-mono">
                    ({currentIndex + 1}/{announcements.length})
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClosePopup}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  hover:bg-white/20
                  text-white/80
                  hover:text-white
                  transition-all
                  duration-200
                  active:scale-95
                  cursor-pointer
                "
                aria-label="Close popup"
                title="Close"
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* ----------------------------------------------------
                CONTENT SECTION: IMAGE OR TEXT CARD
                ---------------------------------------------------- */}
            <div className="relative w-full flex-1 min-h-0 bg-[#040711] overflow-hidden flex flex-col items-center justify-center select-none">
              {imageUrl ? (
                /* Poster Image Area */
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Ambient Backdrop */}
                  <img
                    key={`bg-${activeAnnouncement.AnnouncementId || activeAnnouncement._id || currentIndex}`}
                    src={imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none transition-opacity duration-500"
                  />

                  {/* Main Announcement Image */}
                  <img
                    key={`img-${activeAnnouncement.AnnouncementId || activeAnnouncement._id || currentIndex}`}
                    src={imageUrl}
                    alt={displayTitle}
                    className="relative max-h-full max-w-full object-contain z-10 select-none cursor-pointer transition-opacity duration-300 p-2"
                    onClick={() =>
                      setPreviewPoster({
                        isOpen: true,
                        url: imageUrl,
                        title: displayTitle,
                      })
                    }
                    loading="eager"
                  />
                </div>
              ) : (
                /* Rich Typography Card when Announcement has no poster image */
                <div className="relative w-full h-full flex flex-col justify-center items-center p-6 text-center overflow-y-auto">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 shadow-inner">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white leading-snug max-w-sm mb-3">
                    {displayTitle}
                  </h4>
                  {displayDescription && (
                    <p className="text-sm text-slate-300 leading-relaxed max-w-sm line-clamp-6">
                      {displayDescription}
                    </p>
                  )}
                </div>
              )}

              {/* Previous / Next Arrows (when multiple announcements) */}
              {announcements.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevAnnouncement}
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
                      bg-black/70
                      backdrop-blur-md
                      border
                      border-white/20
                      text-white/90
                      hover:text-white
                      hover:bg-black/90
                      hover:scale-110
                      transition-all
                      active:scale-95
                      shadow-md
                      cursor-pointer
                    "
                    aria-label="Previous announcement"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextAnnouncement}
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
                      bg-black/70
                      backdrop-blur-md
                      border
                      border-white/20
                      text-white/90
                      hover:text-white
                      hover:bg-black/90
                      hover:scale-110
                      transition-all
                      active:scale-95
                      shadow-md
                      cursor-pointer
                    "
                    aria-label="Next announcement"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Sleek Pagination Dots */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 max-w-[85%] overflow-x-auto scrollbar-none">
                    {announcements.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                          idx === currentIndex
                            ? 'w-5 bg-blue-400'
                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Announcement ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ----------------------------------------------------
                BOTTOM SECTION: TITLE, DESCRIPTION & DATE
                ---------------------------------------------------- */}
            <div className="shrink-0 p-4 sm:p-5 flex flex-col gap-2.5 bg-[#060a14] border-t border-white/10">
              <div className="flex items-center justify-between gap-2">
                <h3
                  id="announcement-popup-title"
                  className="text-base sm:text-lg font-bold text-white line-clamp-1 leading-snug"
                >
                  {displayTitle}
                </h3>
                {formattedDate && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 font-medium">
                    <Calendar size={12} className="text-blue-400" />
                    {formattedDate}
                  </span>
                )}
              </div>

              {imageUrl && displayDescription && (
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {displayDescription}
                </p>
              )}

              {/* Dismiss / Got it Button */}
              <button
                type="button"
                onClick={handleClosePopup}
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
                  py-2.5
                  px-4
                  text-sm
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
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOATING PILL / BADGE TRIGGER (WHEN POPUP IS DISMISSED)
          ======================================================== */}
      {!isOpen && hasDismissed && !isPillDismissed && activeAnnouncement && !location.pathname.startsWith('/admin') && (
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
            title="Click to view branch announcements"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>

            <span className="max-w-[140px] sm:max-w-[200px] truncate text-white/90 group-hover:text-white font-medium">
              {displayTitle}
            </span>

            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              Announcement
            </span>

            <button
              type="button"
              onClick={handleDismissPill}
              className="ml-1 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Dismiss floating announcement banner"
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
export { UpcomingEventsPopup as AnnouncementPopup };
