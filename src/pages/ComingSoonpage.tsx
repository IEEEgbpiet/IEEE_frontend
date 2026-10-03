import { Rocket, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[calc(100vh-52px)] items-center justify-center overflow-hidden bg-admin-bg px-6 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl" />

      {/* Secondary glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          {/* Animated rings */}
          <div className="absolute inset-0 animate-ping rounded-full border border-brand-blue/20" />

          <div className="absolute inset-2 rounded-full border border-brand-blue/30 bg-brand-blue/5" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-blue/30 bg-[#0b1b38] shadow-lg shadow-brand-blue/10">
            <Rocket
              size={30}
              strokeWidth={1.7}
              className="text-blue-300"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3.5 py-1.5 text-xs font-medium text-purple-300">
          <Sparkles size={14} />
          <span>Something new is coming</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
          We&apos;re working on this section to bring you a better
          experience. This feature will be available soon.
        </p>

        {/* Animated dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mt-9 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-brand-blue/30 hover:bg-brand-blue/10 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}