import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';

// ============================================================
// GALLERY DATA
// ============================================================

const galleryImages = [
  {
    src: '/images/engineering.day.avif',
    title: 'Engineering Day',
    category: 'EVENT',
  },
  {
    src: '/images/sih.jpg',
    title: 'Smart India Hackathon',
    category: 'HACKATHON',
  },
  {
    src: '/images/ieee.day.jpg',
    title: 'IEEE Day',
    category: 'IEEE EVENT',
  },
  {
    src: '/images/workshop.ieee.jpg',
    title: 'Technical Workshop',
    category: 'WORKSHOP',
  },
  {
    src: '/images/hero_engineering_lab.jpg',
    title: 'Banner about ',
    category: 'HERO SECTION',
  },
];

// Number of cards that will remain visible in the stack

export default function Gallery() {
  // ==========================================================
  // CURRENT CARD INDEX
  // ==========================================================

  const [activeIndex, setActiveIndex] = useState(0);

  // ==========================================================
  // ANIMATION STATE
  //
  // Prevents users from clicking buttons multiple times
  // while the previous animation is still running.
  // ==========================================================

  const [isAnimating, setIsAnimating] = useState(false);

  // ==========================================================
  // FULLSCREEN STATE
  // ==========================================================

  const [fullscreen, setFullscreen] = useState(false);

  // ==========================================================
  // NEXT CARD
  // ==========================================================

  const handleNext = () => {
    if (isAnimating || galleryImages.length <= 1) return;

    setIsAnimating(true);

    // Small delay allows CSS transition to play smoothly
    setTimeout(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % galleryImages.length);

      setIsAnimating(false);
    }, 450);
  };

  // ==========================================================
  // PREVIOUS CARD
  // ==========================================================

  const handlePrevious = () => {
    if (isAnimating || galleryImages.length <= 1) return;

    setIsAnimating(true);

    setTimeout(() => {
      setActiveIndex(
        (previousIndex) => (previousIndex - 1 + galleryImages.length) % galleryImages.length,
      );

      setIsAnimating(false);
    }, 450);
  };

  // ==========================================================
  // KEYBOARD CONTROLS
  //
  // ← Previous
  // → Next
  // ESC Close fullscreen
  // ==========================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fullscreen && event.key === 'Escape') {
        setFullscreen(false);
        return;
      }

      if (event.key === 'ArrowRight') {
        handleNext();
      }

      if (event.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreen, isAnimating]);

  // ==========================================================
  // GET CARD POSITION
  //
  // Every card gets a different transform depending on its
  // distance from the active/front card.
  //
  // position 0 -> FRONT
  // position 1 -> slightly behind
  // position 2 -> more behind
  // position 3 -> deepest card
  // ==========================================================

  const getCardPosition = (index: number) => {
    const total = galleryImages.length;

    // Circular distance from active card
    const relativePosition = (index - activeIndex + total) % total;

    // --------------------------------------------------------
    // FRONT CARD
    // --------------------------------------------------------

    if (relativePosition === 0) {
      return {
        transform: 'translateX(0px) translateY(0px) scale(1) rotate(0deg)',
        opacity: 1,
        zIndex: 50,
      };
    }

    // --------------------------------------------------------
    // CARD 1 - Behind front card
    // --------------------------------------------------------

    if (relativePosition === 1) {
      return {
        transform: 'translateX(55px) translateY(10px) scale(0.94) rotate(2deg)',
        opacity: 0.75,
        zIndex: 40,
      };
    }

    // --------------------------------------------------------
    // CARD 2 - Further behind
    // --------------------------------------------------------

    if (relativePosition === 2) {
      return {
        transform: 'translateX(105px) translateY(20px) scale(0.88) rotate(4deg)',
        opacity: 0.45,
        zIndex: 30,
      };
    }

    // --------------------------------------------------------
    // CARD 3 - Deepest visible card
    // --------------------------------------------------------

    if (relativePosition === 3) {
      return {
        transform: 'translateX(145px) translateY(30px) scale(0.82) rotate(6deg)',
        opacity: 0.2,
        zIndex: 20,
      };
    }

    // --------------------------------------------------------
    // Remaining cards stay hidden behind the stack
    // --------------------------------------------------------

    return {
      transform: 'translateX(170px) translateY(35px) scale(0.78)',
      opacity: 0,
      zIndex: 10,
    };
  };

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <>
      {/* ======================================================
          GALLERY SECTION
          ====================================================== */}

      <section className="relative overflow-hidden  bg-black py-10 sm:py-24 lg:py-22">
        {/* ----------------------------------------------------
            Background glow
            ---------------------------------------------------- */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#00629b]/[0.05]
            blur-[130px]
          "
        />

        {/* ----------------------------------------------------
            Main container
            ---------------------------------------------------- */}

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* ==================================================
              HEADING
              ================================================== */}

          <div className="mb-12 text-center sm:mb-16">
            {/* Small label */}

            {/* Main heading */}

            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Gallery <span className="text-amber-300">that</span>
              <span className="text-brand-blue-dark"> Matter's</span>
              <span className="text-yellow-400">.</span>
            </h2>
          </div>

          {/* ==================================================
              STACKED CARD AREA
              ================================================== */}

          <div className="mx-auto flex max-w-5xl flex-col items-center">
            {/* ------------------------------------------------
                CARD STACK
                ------------------------------------------------ */}

            <div
              className="
                relative
                h-[430px]
                w-full
                max-w-[340px]
                sm:h-[520px]
                sm:max-w-[430px]
                md:h-[580px]
                md:max-w-[500px]
                lg:h-[620px]
                lg:max-w-[540px]
              "
            >
              {galleryImages.map((image, index) => {
                const position = getCardPosition(index);

                return (
                  <article
                    key={image.src}
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[22px]
                      border
                      border-white/10
                      bg-[#080b0f]
                      shadow-[0_30px_80px_rgba(0,0,0,0.55)]
                      transition-all
                      duration-[450ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      sm:rounded-[28px]
                    "
                    style={{
                      transform: position.transform,
                      opacity: position.opacity,
                      zIndex: position.zIndex,
                    }}
                  >
                    {/* ========================================
                        IMAGE AREA
                        ======================================== */}

                    <div className="absolute inset-0 flex items-center justify-center bg-[#050608]">
                      {/* Image */}

                      <img
                        src={image.src}
                        alt={image.title}
                        width={1200}
                        height={700}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                      {/* Dark overlay */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black
                          via-black/20
                          to-transparent
                        "
                      />
                    </div>

                    {/* ========================================
                        CARD CONTENT
                        ======================================== */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-5
                        sm:p-7
                        md:p-8
                      "
                    >
                      {/* Category */}

                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue-dark sm:text-xs">
                        {image.category}
                      </p>

                      {/* Title */}

                      <h3 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                        {image.title}
                      </h3>
                    </div>

                    {/* ========================================
                        FULLSCREEN BUTTON
                        ======================================== */}

                    {index === activeIndex && (
                      <button
                        type="button"
                        onClick={() => setFullscreen(true)}
                        aria-label="View image fullscreen"
                        className="
                          absolute
                          right-4
                          top-4
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/10
                          bg-black/50
                          text-white/70
                          backdrop-blur-md
                          transition-all
                          duration-300
                          hover:bg-brand-blue-cta
                          hover:text-white
                          sm:right-6
                          sm:top-6
                        "
                      >
                        <Maximize2 size={17} />
                      </button>
                    )}
                  </article>
                );
              })}

              {/* =================================================
                  LEFT BUTTON
                  ================================================= */}

              <button
                type="button"
                onClick={handlePrevious}
                disabled={isAnimating || galleryImages.length <= 1}
                aria-label="Previous image"
                className="
                  absolute
                  left-0
                  top-1/2
                  z-[60]
                  flex
                  h-11
                  w-11
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-black/90
                  text-white
                  shadow-xl
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-brand-blue-cta
                  disabled:pointer-events-none
                  disabled:opacity-40
                  sm:h-13
                  sm:w-13
                  md:left-[-10px]
                "
              >
                <ArrowLeft size={20} />
              </button>

              {/* =================================================
                  RIGHT BUTTON
                  ================================================= */}

              <button
                type="button"
                onClick={handleNext}
                disabled={isAnimating || galleryImages.length <= 1}
                aria-label="Next image"
                className="
                  absolute
                  right-0
                  top-1/2
                  z-[60]
                  flex
                  h-11
                  w-11
                  translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-black/90
                  text-white
                  shadow-xl
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-brand-blue-cta
                  disabled:pointer-events-none
                  disabled:opacity-40
                  sm:h-13
                  sm:w-13
                  md:right-[-10px]
                "
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* ==================================================
                BOTTOM CONTROLS
                ================================================== */}

            <div className="mt-8 flex w-full max-w-[540px] items-center justify-between">
              {/* Counter */}

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>

                <span className="text-sm text-white/25">/</span>

                <span className="text-sm text-white/35">
                  {String(galleryImages.length).padStart(2, '0')}
                </span>
              </div>

              {/* Progress dots */}

              <div className="flex items-center gap-1.5">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => {
                      if (!isAnimating) {
                        setActiveIndex(index);
                      }
                    }}
                    aria-label={`Go to image ${index + 1}`}
                    className={`
                      h-1.5
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        index === activeIndex
                          ? 'w-8 bg-brand-blue-cta'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }
                    `}
                  />
                ))}
              </div>

              {/* Keyboard hint */}

              <span className="hidden text-xs text-white/25 sm:block">← &nbsp; →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FULLSCREEN MODAL
          ======================================================== */}

      {fullscreen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/95
            p-4
            backdrop-blur-xl
          "
          onClick={() => setFullscreen(false)}
        >
          {/* Close */}

          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
            className="
              absolute
              right-5
              top-5
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/5
              text-white
              transition-all
              hover:bg-white/10
            "
          >
            <X size={22} />
          </button>

          {/* Fullscreen image */}

          <img
            src={galleryImages[activeIndex].src}
            alt={galleryImages[activeIndex].title}
            onClick={(event) => event.stopPropagation()}
            className="
              max-h-[90vh]
              max-w-[94vw]
              object-contain
            "
          />
        </div>
      )}
    </>
  );
}
