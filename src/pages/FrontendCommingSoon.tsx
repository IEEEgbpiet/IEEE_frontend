import { ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* Animated grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 20%, transparent 75%)",
        }}
      />

      {/* Main glowing orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />

      {/* Floating glow */}
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />

      <div
        className="pointer-events-none absolute bottom-[15%] right-[15%] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <section className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-9">
          {/* Outer animated ring */}
          <div className="absolute -inset-6 rounded-full border border-blue-500/10 animate-[spin_8s_linear_infinite]" />

          {/* Inner animated ring */}
          <div className="absolute -inset-3 rounded-full border border-dashed border-blue-400/20 animate-[spin_5s_linear_infinite_reverse]" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
            <Rocket
              size={38}
              strokeWidth={1.5}
              className="text-blue-400 animate-[float_3s_ease-in-out_infinite]"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-4 py-2 text-xs font-medium text-blue-300 backdrop-blur-md">
          <Sparkles size={14} className="animate-pulse" />
          <span>Something exciting is coming</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Coming Soon
          </span>
        </h1>

        {/* Animated line */}
        <div className="mt-6 h-px w-32 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 animate-[slide_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        </div>

        {/* Description */}
        <p className="mt-7 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
          We&apos;re building something new behind the scenes.
          <br className="hidden sm:block" />
          This experience will be available soon.
        </p>

        {/* Loading */}
        <div className="mt-9 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />

          <span
            className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />

          <span
            className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group mt-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-slate-400 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Go Back
        </button>
      </section>

      {/* Bottom text */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-700">
          Stay tuned
        </p>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </main>
  );
}