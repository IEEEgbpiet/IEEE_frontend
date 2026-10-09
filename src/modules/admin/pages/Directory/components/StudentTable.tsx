import { useState, type MouseEvent } from 'react';
import {
  Copy,
  Check,
  Eye,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';
import type { StudentDirectoryRecord } from '@/services/adminApi';

interface StudentTableProps {
  students: StudentDirectoryRecord[];
  onViewDetails: (student: StudentDirectoryRecord) => void;
}

function getInitials(name: string = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'ST';
}

export default function StudentTable({ students, onViewDetails }: StudentTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (e: MouseEvent, key: string, value: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-admin-surface shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-white/10 bg-admin-card/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Student
              </th>
              <th scope="col" className="px-4 py-3.5">
                Institute ID
              </th>
              <th scope="col" className="px-4 py-3.5">
                Branch
              </th>
              <th scope="col" className="px-4 py-3.5">
                Year & Batch
              </th>
              <th scope="col" className="px-4 py-3.5">
                Email
              </th>
              <th scope="col" className="px-4 py-3.5">
                Phone
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((student) => {
              const initials = getInitials(student.name);

              return (
                <tr
                  key={student._id || student.instituteId}
                  onClick={() => onViewDetails(student)}
                  className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  {/* Student column: Avatar & Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-blue-600/30 to-purple-600/30 text-xs font-bold text-white shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {student.name}
                        </div>
                        {student.createdAt && (
                          <div className="text-[10px] text-slate-500">
                            Reg: {new Date(student.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Institute ID */}
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={(e) =>
                        handleCopy(e, `id-${student.instituteId}`, student.instituteId)
                      }
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-admin-bg hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/10 transition-colors cursor-pointer"
                      title="Click to copy Institute ID"
                    >
                      <span>{student.instituteId}</span>
                      {copiedKey === `id-${student.instituteId}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      )}
                    </button>
                  </td>

                  {/* Branch (plain text, no badge color/border) */}
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-200 uppercase tracking-wide">
                      {student.branch || '—'}
                    </span>
                  </td>

                  {/* Year & Batch */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-white flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        Year {student.year || '—'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Batch {student.batchYear || '—'}
                      </span>
                    </div>
                  </td>

                  {/* Email column (in place of gender) */}
                  <td className="px-4 py-3.5">
                    {student.email ? (
                      <div className="flex items-center gap-1.5 max-w-[220px]">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <a
                          href={`mailto:${student.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-300 truncate text-slate-300 transition-colors"
                          title={student.email}
                        >
                          {student.email}
                        </a>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopy(e, `email-${student.email}`, student.email!)
                          }
                          className="p-1 text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                          title="Copy Email"
                        >
                          {copiedKey === `email-${student.email}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Phone column */}
                  <td className="px-4 py-3.5">
                    {student.phone ? (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <a
                          href={`tel:${student.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono hover:text-blue-300 transition-colors"
                        >
                          {student.phone}
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(student);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-admin-bg hover:bg-blue-600 hover:border-blue-500 hover:text-white text-slate-300 transition-all cursor-pointer font-medium"
                      title="View full profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
