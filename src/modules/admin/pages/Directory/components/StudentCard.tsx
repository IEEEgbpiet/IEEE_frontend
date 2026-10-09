import { useState, type MouseEvent } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  Copy,
  Check,
  Eye,
  Calendar,
} from 'lucide-react';
import type { StudentDirectoryRecord } from '@/services/adminApi';

interface StudentCardProps {
  student: StudentDirectoryRecord;
  onViewDetails: (student: StudentDirectoryRecord) => void;
}

function getInitials(name: string = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'ST';
}

export default function StudentCard({ student, onViewDetails }: StudentCardProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyId = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(student.instituteId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1800);
  };

  const handleCopyEmail = (e: MouseEvent) => {
    e.stopPropagation();
    if (student.email) {
      navigator.clipboard.writeText(student.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    }
  };

  const initials = getInitials(student.name);

  return (
    <div
      onClick={() => onViewDetails(student)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface p-4 sm:p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_12px_28px_rgba(43,123,255,0.12)] cursor-pointer"
    >
      {/* Subtle top ambient accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Header: Avatar, Name & Institute ID badge */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-blue-600/30 to-purple-600/30 text-white font-bold text-sm tracking-wide shadow-inner group-hover:border-blue-400/50 transition-colors">
              {initials}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
              {student.name}
            </h4>

            {/* Institute ID with copy */}
            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-admin-bg/80 hover:bg-white/10 hover:text-white px-2 py-0.5 rounded-md border border-white/10 transition-colors cursor-pointer"
                title="Click to copy Institute ID"
              >
                <span>ID: {student.instituteId}</span>
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Academic Details: Branch as plain text + Year & Batch */}
        <div className="mt-3.5 flex items-center gap-2 flex-wrap">
          {/* Branch as plain text without badge color */}
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
            {student.branch || '—'}
          </span>

          <span className="text-slate-600">•</span>

          <span className="inline-flex items-center gap-1 text-xs text-slate-300">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            <span>Year {student.year || '—'}</span>
          </span>

          <span className="text-slate-600">•</span>

          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>Batch {student.batchYear || '—'}</span>
          </span>
        </div>

        {/* Contact Info Items */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-400">
          {student.email ? (
            <div className="flex items-center justify-between group/mail">
              <a
                href={`mailto:${student.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors truncate"
                title="Send email"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{student.email}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="opacity-0 group-hover/mail:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                title="Copy email"
              >
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Mail className="w-3.5 h-3.5 opacity-40" />
              <span>No email provided</span>
            </div>
          )}

          {student.phone ? (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <a
                href={`tel:${student.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-slate-300 hover:text-blue-300 transition-colors font-mono"
                title="Call phone"
              >
                {student.phone}
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Phone className="w-3.5 h-3.5 opacity-40" />
              <span>No phone provided</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Card Actions */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          {student.createdAt
            ? `Joined ${new Date(student.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}`
            : 'Active Profile'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(student);
          }}
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 group-hover:translate-x-0.5 transition-all font-medium cursor-pointer"
        >
          <span>View Profile</span>
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
