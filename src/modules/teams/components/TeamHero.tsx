import { useState, useEffect } from 'react';

// Slideshow images — tech/engineering team group photos
const heroImages = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
];

export function TeamHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="teams-hero"
      className="relative flex items-center justify-center text-center overflow-hidden"
      style={{ minHeight: '420px' }}
    >
      {/* Hero images */}
      {heroImages.map((src, i) => (
        <img
          key={i}
          src={src}
          height={1080}
          width={1920}
          alt="IEEE GBPIET team"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out"
          style={{ zIndex: 0, opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-[640px] px-8 py-20">
        <h1 className="m-0 text-5xl max-sm:text-3xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg">
          Meet Our Team
        </h1>
        <p className="mt-4 text-lg text-white/90 leading-relaxed max-w-[520px] mx-auto drop-shadow-sm">
          The passionate minds driving innovation, knowledge, and community across disciplines.
        </p>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
