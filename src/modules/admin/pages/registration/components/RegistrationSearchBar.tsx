import { Search, X, RotateCw, Filter } from 'lucide-react';

interface RegistrationSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  modeFilter: 'all' | 'INDIVIDUAL' | 'TEAM';
  onModeFilterChange: (mode: 'all' | 'INDIVIDUAL' | 'TEAM') => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalFiltered: number;
}

export default function RegistrationSearchBar({
  searchQuery,
  onSearchChange,
  modeFilter,
  onModeFilterChange,
  onRefresh,
  isLoading,
  totalFiltered,
}: RegistrationSearchBarProps) {
  return (
    <div className="bg-admin-surface border border-white/10 rounded-xl p-3 sm:p-4 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input for User Data */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by participant name, roll no, email, team name, phone, reg ID, branch..."
            className="w-full bg-admin-bg border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter by Mode */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={modeFilter}
              onChange={(e) =>
                onModeFilterChange(e.target.value as 'all' | 'INDIVIDUAL' | 'TEAM')
              }
              className="bg-admin-bg border border-white/10 rounded-xl pl-8 pr-8 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Formats</option>
              <option value="TEAM">Teams Only</option>
              <option value="INDIVIDUAL">Individual Only</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-admin-bg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Registrations"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Results status indicator */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <div>
          Showing <span className="text-white font-medium">{totalFiltered}</span> registration records
          {searchQuery && (
            <span>
              {' '}matching query &quot;<span className="text-blue-400">{searchQuery}</span>&quot;
            </span>
          )}
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Reset Search
          </button>
        )}
      </div>
    </div>
  );
}
