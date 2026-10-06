import { User, Users } from 'lucide-react';
import type { RegistrationMode } from '../types';

interface ModeSelectorProps {
  activeMode: RegistrationMode;
  onSelectMode: (mode: RegistrationMode) => void;
}

export default function ModeSelector({ activeMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Select Registration Mode
        </h2>

      </div>

      <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 max-w-xs w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onSelectMode('individual')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeMode === 'individual'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          Individual
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('team')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeMode === 'team'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Team (2-4)
        </button>
      </div>
    </div>
  );
}
