export default function WhoWeAre() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-28 lg:py-36">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#00629b]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-yellow-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ================= LEFT ================= */}
          <div className="animate-[fadeUp_0.8s_ease-out]">
            {/* Small label */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#00629b]" />

              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue-dark">
                IEEE GBPIET
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-6xl font-black leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl">
              <span className="block text-white">WHO</span>

              <span className="block text-brand-blue-dark drop-shadow-[0_0_25px_rgba(0,98,155,0.25)]">
                WE
              </span>

              <span className="block text-white">
                ARE ????<span className="text-brand-blue-dark">?</span>
              </span>
            </h2>

            {/* Decorative line */}
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1 w-16 bg-[#00629b]" />
              <div className="h-1 w-5 bg-yellow-400" />
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="animate-[fadeUp_1s_ease-out] lg:pl-4">
            <p className="mt-6 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
              <span className="font-semibold text-white">IEEE GBPIET Student Branch</span> seeks to
              enhance the learning experience of the student community in GBPIET. The Student Branch
              focuses on conducting social and technical activities for students, and also
              encourages the students to take full advantage of IEEE membership, including
              scholarships, competitions, and conference grants.
            </p>

            <p className="mt-6 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
              The Student Branch also intends to provide opportunities for students to network with
              peers in other institutes, academicians, professionals, engineers, and scientists
              through the on campus IEEE Student Branch and the Local IEEE Section, thereby
              encouraging students to be a part of the global IEEE community.
            </p>

            <p className="mt-6 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
              The IEEE student branch GBPIET is the complete institute level part of the IEEE Uttar
              Pradesh Section{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
