import { useState } from 'react';
import { CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';
import type { RegistrationRecord } from '@/services/adminApi';

interface RegistrationSuccessCardProps {
  registration: RegistrationRecord;
  onReset: () => void;
}

export default function RegistrationSuccessCard({
  registration,
  onReset,
}: RegistrationSuccessCardProps) {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(registration.registrationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900 to-blue-950/40 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
      {/* Header with Registration ID */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Registration Confirmed!</h2>
            <p className="text-sm text-slate-400">
              Successfully registered with IEEE GBPIET Student Branch.
            </p>
          </div>
        </div>

        {/* Registration ID Badge */}
        <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-3 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Registration ID
            </div>
            <div className="text-lg font-mono font-black text-blue-400">
              {registration.registrationId}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white transition-all cursor-pointer"
            title="Copy Registration ID"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-800 text-sm">
        <div>
          <span className="text-slate-400">Event:</span>{' '}
          <span className="font-semibold text-white">{registration.eventName}</span>
        </div>
        <div>
          <span className="text-slate-400">Date:</span>{' '}
          <span className="font-semibold text-white">{registration.date}</span>
        </div>
        <div>
          <span className="text-slate-400">Format:</span>{' '}
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {registration.mode}
          </span>
        </div>
        {registration.teamName && (
          <div>
            <span className="text-slate-400">Team Name:</span>{' '}
            <span className="font-semibold text-white">{registration.teamName}</span>
          </div>
        )}
      </div>

      {/* Participants Grid */}
      <div className="py-6 border-b border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Registered Participants ({registration.members.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {registration.members.map((m, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{m.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                  {idx === 0 && registration.mode === 'TEAM' ? 'Leader' : `Member ${idx + 1}`}
                </span>
              </div>
              <div className="text-slate-400">
                Roll Number: <span className="text-slate-200">{m.instituteId}</span>
              </div>
              <div className="text-slate-400">
                Department: <span className="text-slate-200">{m.branch} (Year {m.year})</span>
              </div>
              <div className="text-slate-400">
                Email: <span className="text-slate-200">{m.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          Register Another Participant / Team
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
