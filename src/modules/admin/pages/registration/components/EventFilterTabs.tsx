import { Calendar } from 'lucide-react';

interface EventFilterTabsProps {
  events: { name: string; count: number }[];
  selectedEvent: string;
  onSelectEvent: (eventName: string) => void;
  totalCount: number;
}

export default function EventFilterTabs({
  events,
  selectedEvent,
  onSelectEvent,
  totalCount,
}: EventFilterTabsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          Filter By Event
        </span>
        {selectedEvent !== 'ALL' && (
          <button
            type="button"
            onClick={() => onSelectEvent('ALL')}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            Show All Events
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        {/* All Events Tab */}
        <button
          type="button"
          onClick={() => onSelectEvent('ALL')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedEvent === 'ALL'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50'
              : 'bg-admin-surface border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <span>All Events</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedEvent === 'ALL'
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-slate-400'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Dynamic Event Tabs */}
        {events.map((event) => {
          const isSelected = selectedEvent.toLowerCase() === event.name.toLowerCase();

          return (
            <button
              key={event.name}
              type="button"
              onClick={() => onSelectEvent(event.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50'
                  : 'bg-admin-surface border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="truncate max-w-[220px]" title={event.name}>
                {event.name}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                {event.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
