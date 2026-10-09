import { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Building2,
  Clock,
  Send,
  ExternalLink,
  ShieldCheck,
  Hash,
} from 'lucide-react';
import type { StudentDirectoryRecord } from '@/services/adminApi';

interface StudentDetailModalProps {
  student: StudentDirectoryRecord | null;
  onClose: () => void;
}

function getInitials(name: string = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'ST';
}

export default function StudentDetailModal({
  student,
  onClose,
}: StudentDetailModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (student) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [student, onClose]);

  if (!student) return null;

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const initials = getInitials(student.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-admin-bg/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div
        className="fixed inset-0 -z-10 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-admin-card to-admin-surface shadow-2xl animate-modalPop">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Student Directory Profile
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Hero Profile Info */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-blue-600/40 via-indigo-600/30 to-purple-600/40 text-lg font-bold text-white shadow-md">
                {initials}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white truncate">
                {student.name}
              </h2>
              <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="font-mono text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded">
                  {student.instituteId}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-200 uppercase tracking-wide">
                  {student.branch || 'General'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Overview Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-white/10 bg-admin-subtle/50 p-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Branch
              </span>
              <p className="mt-1 text-sm font-bold text-white uppercase tracking-wide">
                {student.branch || '—'}
              </p>
              <p className="text-[11px] text-slate-400">Department</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-admin-subtle/50 p-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-400" />
                Institute Roll No
              </span>
              <p className="mt-1 text-sm font-semibold font-mono text-white">
                {student.instituteId}
              </p>
              <p className="text-[11px] text-slate-400">Enrollment ID</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-admin-subtle/50 p-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                Current Year
              </span>
              <p className="mt-1 text-sm font-semibold text-white">
                Year {student.year || '—'}
              </p>
              <p className="text-[11px] text-slate-400">
                {student.year === 1
                  ? 'First Year'
                  : student.year === 2
                  ? 'Second Year'
                  : student.year === 3
                  ? 'Third Year'
                  : student.year === 4
                  ? 'Final Year'
                  : 'Undergraduate'}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-admin-subtle/50 p-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Graduation Batch
              </span>
              <p className="mt-1 text-sm font-semibold text-white">
                Class of {student.batchYear || '—'}
              </p>
              <p className="text-[11px] text-slate-400">
                Batch {student.batchYear || '—'}
              </p>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-xl border border-white/10 bg-admin-subtle/30 p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Communication & Contact
            </h4>

            {/* Email Row */}
            <div className="flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-400">Email:</span>
                <span className="text-white font-medium truncate">
                  {student.email || 'Not available'}
                </span>
              </div>
              {student.email && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy('email', student.email!)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Copy Email"
                  >
                    {copiedKey === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`mailto:${student.email}`}
                    className="p-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 transition-colors"
                    title="Open Mail Client"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Phone Row */}
            <div className="flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-400">Phone:</span>
                <span className="text-white font-medium font-mono">
                  {student.phone || 'Not available'}
                </span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy('phone', student.phone!)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Copy Phone"
                  >
                    {copiedKey === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`tel:${student.phone}`}
                    className="p-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 transition-colors"
                    title="Call Phone"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* System Records & Timestamps */}
          <div className="rounded-xl border border-white/10 bg-admin-subtle/20 p-3 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3 h-3" /> Record ID:
              </span>
              <button
                type="button"
                onClick={() => handleCopy('docId', student._id)}
                className="font-mono text-slate-300 hover:text-white inline-flex items-center gap-1"
                title="Copy MongoDB ID"
              >
                <span>{student._id}</span>
                {copiedKey === 'docId' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60" />
                )}
              </button>
            </div>

            {student.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Created:</span>
                <span className="text-slate-300">
                  {new Date(student.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}

            {student.updatedAt && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Updated:</span>
                <span className="text-slate-300">
                  {new Date(student.updatedAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-white/10 px-6 py-3.5 flex items-center justify-between bg-admin-card/50">
          <button
            type="button"
            onClick={() =>
              handleCopy(
                'json',
                JSON.stringify(student, null, 2)
              )
            }
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {copiedKey === 'json' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy Raw Record</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
