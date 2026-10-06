import { useState } from 'react';
import type { FormEvent } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { adminApi, type RegistrationRecord } from '@/services/adminApi';

interface RegistrationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationStatusModal({
  isOpen,
  onClose,
}: RegistrationStatusModalProps) {
  const [lookupId, setLookupId] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupResult, setLookupResult] = useState<RegistrationRecord | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    const cleanId = lookupId.trim();
    if (!cleanId) return;

    try {
      setIsLookingUp(true);
      setLookupError('');
      setLookupResult(null);

      const res = await adminApi.getRegistrationInfo(cleanId);
      if (res.success && res.data) {
        setLookupResult(res.data);
      } else {
        setLookupError('Registration record not found.');
      }
    } catch (err: unknown) {
      setLookupError(err instanceof Error ? err.message : 'Registration not found.');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Search className="w-5 h-5 text-blue-400" />
            Check Registration Status
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Enter the 7-digit registration ID generated during event submission.
        </p>

        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="e.g. 4819203"
            required
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLookingUp}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isLookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        {lookupError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium">
            {lookupError}
          </div>
        )}

        {lookupResult && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-blue-400 font-bold text-sm">
                ID: {lookupResult.registrationId}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                {lookupResult.mode}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Event:</span> {lookupResult.eventName}
            </div>
            <div>
              <span className="text-slate-400">Date:</span> {lookupResult.date}
            </div>
            {lookupResult.teamName && (
              <div>
                <span className="text-slate-400">Team:</span> {lookupResult.teamName}
              </div>
            )}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-semibold">
                Participants ({lookupResult.members.length}):
              </span>
              <ul className="mt-1.5 space-y-1">
                {lookupResult.members.map((m, i) => (
                  <li key={i} className="text-slate-300">
                    • {m.name} ({m.instituteId}) - {m.branch}, Year {m.year}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
