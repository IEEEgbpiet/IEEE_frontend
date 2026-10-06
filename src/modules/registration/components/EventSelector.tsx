import { Calendar, CheckCircle, Sparkles } from 'lucide-react';
import { PREDEFINED_EVENTS } from '../constants';
import type { PredefinedEvent } from '../types';

interface EventSelectorProps {
  selectedEvent: PredefinedEvent;
  onSelectEvent: (event: PredefinedEvent) => void;
}

export default function EventSelector({
  selectedEvent,
  onSelectEvent,
}: EventSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = PREDEFINED_EVENTS.find((event) => event.id === e.target.value);
    if (found) {
      onSelectEvent(found);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        1. Select Event
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        {/* Event Selection Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Event Name <span className="text-rose-400">*</span>
          </label>
          <select
            value={selectedEvent.id}
            onChange={handleChange}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            {PREDEFINED_EVENTS.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Predefined Event Date Badge (Read-only, passed directly from code/JSX) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Event Date (Predefined)
          </label>
          <div className="flex items-center justify-between bg-slate-950 border border-blue-500/30 rounded-xl px-3.5 py-2.5 text-sm">
            <div className="flex items-center gap-2 text-blue-300 font-semibold">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{selectedEvent.displayDate}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" />
              Auto-mapped
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
