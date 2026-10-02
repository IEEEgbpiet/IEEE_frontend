import { useEffect, useState } from 'react';

type LoaderProps = {
  onComplete: () => void;
};

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      // Smooth random progress
      const increment = Math.floor(Math.random() * 4) + 1;
      current += increment;

      // Hold at 95% until browser is fully loaded
      if (current >= 95) {
        current = 95;
        clearInterval(interval);
      }

      setProgress(current);
    }, 120);

    const handleLoad = () => {
      clearInterval(interval);

      setProgress(100);

      // Give 100% a moment to be visible
      setTimeout(() => {
        setExiting(true);

        // Finish after exit animation
        setTimeout(() => {
          onComplete();
        }, 700);
      }, 350);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, [onComplete]);

  return (
    <div
      className={`relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-black transition-all duration-700 ${
        exiting ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/10 blur-[100px]" />

      {/* Small ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00629b]/10 blur-[60px] animate-pulse" />

      <div className="relative flex w-[85%] max-w-sm flex-col items-center">
        {/* Spinner */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-[#00629B]/20" />

          {/* Rotating Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#00629B] border-r-[#00629B]/40" />

          {/* Reverse Ring */}
          <div className="absolute inset-3 animate-[spin_2s_linear_infinite_reverse] rounded-full border border-white/10 border-b-[#00629B]/70" />

          {/* Center */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00629b]/5 shadow-[0_0_40px_rgba(0,98,155,0.25)]">
            <span className="text-lg font-black tracking-tight text-brand-blue-dark">IEEE</span>
          </div>
        </div>

        {/* Percentage */}
        <div className="mt-8 flex items-baseline">
          <span className="text-5xl font-bold tracking-tight text-white tabular-nums">
            {progress}
          </span>

          <span className="ml-1 text-xl font-medium text-brand-blue-dark">%</span>
        </div>

        {/* Loading Text */}
        <div className="mt-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00629b]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
            Loading Experience
          </span>

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00629b]" />
        </div>

        {/* Progress Bar */}
        <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="relative h-full rounded-full bg-[#00629b] transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 12px rgba(0, 98, 155, 0.8)',
            }}
          >
            {/* Moving Shine */}
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[1px]" />
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="mt-6 text-center">
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20">IEEE • GBPIET</p>

          <p className="mt-2 text-[9px] tracking-[0.3em] text-white/15">
            INNOVATE • CONNECT • LEAD
          </p>
        </div>
      </div>
    </div>
  );
}
