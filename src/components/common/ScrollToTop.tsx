import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down past 280px
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed
        bottom-6
        right-6
        z-40
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        border
        border-white/20
bg-brand-blue-cta
        text-white
        shadow-[0_4px_20px_rgba(0,98,155,0.45)]
        backdrop-blur-sm
        transition-all
        duration-300
        hover:border-white/40
        hover:bg-brand-blue-light
        hover:shadow-[0_6px_25px_rgba(0,98,155,0.65)]
        hover:-translate-y-1
        active:scale-95
        sm:bottom-8
        sm:right-8
        sm:h-12
        sm:w-12
        ${
          isVisible
            ? 'pointer-events-auto translate-y-0 opacity-100 scale-100'
            : 'pointer-events-none translate-y-6 opacity-0 scale-90'
        }
      `}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}
