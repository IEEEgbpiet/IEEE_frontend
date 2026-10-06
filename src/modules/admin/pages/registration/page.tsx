import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Loader2,
  AlertTriangle,
  FolderOpen,
  FilterX,
} from 'lucide-react';
import { adminApi, type RegistrationRecord } from '@/services/adminApi';

// Child Components
import EventFilterTabs from './components/EventFilterTabs';
import RegistrationSearchBar from './components/RegistrationSearchBar';
import RegistrationCard from './components/RegistrationCard';
import ExportButton from './components/ExportButton';

export default function AdminRegistrationPage() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedEvent, setSelectedEvent] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | 'INDIVIDUAL' | 'TEAM'>('all');

  useEffect(() => {
    document.title = 'Event Registrations | IEEE Admin Portal';
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getAllRegistrations();

      // Defensive parsing
      const list: RegistrationRecord[] = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? (res as unknown as RegistrationRecord[])
        : [];

      setRegistrations(list);
    } catch (err: unknown) {
      console.error('Failed to load registrations:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to fetch registration entries from backend.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Extract unique events with registration counts
  const eventTabs = useMemo(() => {
    const countsMap = new Map<string, number>();

    for (const r of registrations) {
      const eventName = r.eventName?.trim() || 'Untitled Event';
      countsMap.set(eventName, (countsMap.get(eventName) || 0) + 1);
    }

    return Array.from(countsMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [registrations]);

  // Filtered List based on Event Tab, Mode, and User Data Search
  const filteredRegistrations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return registrations.filter((reg) => {
      // 1. Event tab filter
      if (selectedEvent !== 'ALL') {
        if (reg.eventName?.toLowerCase() !== selectedEvent.toLowerCase()) {
          return false;
        }
      }

      // 2. Mode filter
      if (modeFilter !== 'all' && reg.mode !== modeFilter) {
        return false;
      }

      // 3. User data search
      if (!query) return true;

      // Search in registration ID
      if (reg.registrationId?.toLowerCase().includes(query)) return true;

      // Search in Event Name
      if (reg.eventName?.toLowerCase().includes(query)) return true;

      // Search in Team Name
      if (reg.teamName && reg.teamName.toLowerCase().includes(query)) return true;

      // Search in Participant details
      const members = reg.members || [];
      const matchInMembers = members.some((m) => {
        return (
          m.name?.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query) ||
          m.instituteId?.toLowerCase().includes(query) ||
          m.phone?.toLowerCase().includes(query) ||
          m.branch?.toLowerCase().includes(query) ||
          String(m.year).includes(query)
        );
      });

      return matchInMembers;
    });
  }, [registrations, selectedEvent, modeFilter, searchQuery]);

  // Human-readable label for the current filter (used in export file names)
  const filterLabel = useMemo(() => {
    const parts: string[] = [];
    if (selectedEvent !== 'ALL') parts.push(selectedEvent);
    if (modeFilter !== 'all') parts.push(modeFilter);
    if (searchQuery.trim()) parts.push(`search:${searchQuery.trim()}`);
    return parts.length > 0 ? parts.join(' | ') : 'All Events';
  }, [selectedEvent, modeFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar on main left side + Export PDF, Mode Filter, Refresh on right */}
      <RegistrationSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        modeFilter={modeFilter}
        onModeFilterChange={setModeFilter}
        onRefresh={fetchRegistrations}
        isLoading={loading}
        totalFiltered={filteredRegistrations.length}
        exportAction={
          <ExportButton
            filteredRegistrations={filteredRegistrations}
            allRegistrations={registrations}
            filterLabel={filterLabel}
          />
        }
      />

      {/* Event Filter Tabs */}
      <EventFilterTabs
        events={eventTabs}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        totalCount={registrations.length}
      />

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div className="flex-1 font-medium">{error}</div>
          <button
            type="button"
            onClick={fetchRegistrations}
            className="text-xs underline hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-admin-surface border border-white/10 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-sm text-slate-400">Loading registrations from backend...</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-16 bg-admin-surface border border-white/10 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-slate-400">
            {searchQuery || selectedEvent !== 'ALL' || modeFilter !== 'all' ? (
              <FilterX className="w-6 h-6" />
            ) : (
              <FolderOpen className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-base font-bold text-white">No Registrations Found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedEvent !== 'ALL' || modeFilter !== 'all'
              ? 'No registration matches your current search or event filter criteria.'
              : 'There are currently no event registrations submitted.'}
          </p>
          {(searchQuery || selectedEvent !== 'ALL' || modeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedEvent('ALL');
                setModeFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRegistrations.map((reg) => (
            <RegistrationCard
              key={reg._id || reg.registrationId}
              registration={reg}
            />
          ))}
        </div>
      )}
    </div>
  );
}
