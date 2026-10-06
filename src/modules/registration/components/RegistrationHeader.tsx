import { Search } from 'lucide-react';

interface RegistrationHeaderProps {
  onOpenLookup: () => void;
}

export default function RegistrationHeader({ onOpenLookup }: RegistrationHeaderProps) {
  return (
    <div className="text-center space-y-4">

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
        Event Registration
      </h1>

      {/* Quick Lookup Action */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onOpenLookup}
          className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-950/70 border border-blue-500/20 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-blue-500/10 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          Already registered? Check Registration Status
        </button>
      </div>
    </div>
  );
}
