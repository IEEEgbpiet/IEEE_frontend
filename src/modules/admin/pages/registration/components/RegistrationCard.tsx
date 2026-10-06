import { useState } from 'react';
import {
  Users,
  User,
  Crown,
  Calendar,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import type { RegistrationRecord } from '@/services/adminApi';

interface RegistrationCardProps {
  registration: RegistrationRecord;
  onViewDetails: (reg: RegistrationRecord) => void;
}

export default function RegistrationCard({
  registration,
  onViewDetails,
}: RegistrationCardProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);

  const isTeam = registration.mode === 'TEAM';
  const members = registration.members || [];

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(registration.registrationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyEmails = (e: React.MouseEvent) => {
    e.stopPropagation();
    const emails = members.map((m) => m.email).filter(Boolean).join(', ');
    navigator.clipboard.writeText(emails);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2000);
  };

  return (
    <div className="bg-admin-surface border border-white/10 hover:border-blue-500/30 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-lg hover:shadow-blue-500/5 space-y-5">
      {/* Top Bar: Mode, ID, Event Name & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mode Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isTeam
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {isTeam ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            {registration.mode}
          </span>

          {/* Registration ID pill */}
          <div className="flex items-center gap-1.5 bg-admin-bg px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-[10px] text-slate-500 font-bold uppercase">ID:</span>
            <span className="font-mono text-xs font-bold text-blue-400">
              {registration.registrationId}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              title="Copy Registration ID"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Event Date */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{registration.date}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyEmails}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-admin-bg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Copy member emails"
          >
            {copiedEmails ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Emails Copied</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Emails</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewDetails(registration)}
            className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
            title="View full registration modal"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content: Event & Team Info */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Event
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {registration.eventName}
            </h3>
          </div>

          {isTeam && registration.teamName && (
            <div className="sm:text-right">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Team Name
              </div>
              <div className="text-sm sm:text-base font-bold text-indigo-300 flex items-center sm:justify-end gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>{registration.teamName}</span>
                <span className="text-xs font-normal text-slate-400">
                  ({members.length} members)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          {isTeam ? `Team Members Breakdown (${members.length})` : 'Participant Information'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map((member, idx) => {
            const isLeader = isTeam && idx === 0;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                  isLeader
                    ? 'bg-blue-950/20 border-blue-500/30'
                    : 'bg-admin-bg/60 border-white/5'
                }`}
              >
                {/* Member Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {member.name}
                    </span>
                    {isLeader && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <Crown className="w-3 h-3 text-amber-400" />
                        Leader
                      </span>
                    )}
                    {!isLeader && isTeam && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-400">
                        Member {idx + 1}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    {member.branch} • Yr {member.year}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <Building className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">Roll: <span className="text-slate-200">{member.instituteId}</span></span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{member.phone}</span>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-1.5 text-slate-400 truncate">
                    <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-slate-300 hover:text-blue-400 truncate transition-colors"
                      title={member.email}
                    >
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
