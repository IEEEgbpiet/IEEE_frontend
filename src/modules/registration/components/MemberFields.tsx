import { User, Building, Mail, Phone } from 'lucide-react';
import { BRANCH_OPTIONS, YEAR_OPTIONS } from '../constants';
import type { MemberFormState } from '../types';

interface MemberFieldsProps {
  member: MemberFormState;
  onChange: (field: keyof MemberFormState, value: string | number) => void;
  idPrefix: string;
}

export default function MemberFields({ member, onChange, idPrefix }: MemberFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Full Name */}
      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          Full Name <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={member.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. Aarav Sharma"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Institute Roll Number / ID */}
      <div>
        <label
          htmlFor={`${idPrefix}-instituteId`}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          Institute Roll Number / Student ID <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            id={`${idPrefix}-instituteId`}
            type="text"
            value={member.instituteId}
            onChange={(e) => onChange('instituteId', e.target.value)}
            placeholder="e.g. 22010101"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor={`${idPrefix}-email`}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          Email Address <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            id={`${idPrefix}-email`}
            type="email"
            value={member.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="e.g. aarav.sharma@example.com"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          Contact Phone <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            value={member.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="e.g. 9876543210"
            required
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Academic Year: 1 to 4 */}
      <div>
        <label
          htmlFor={`${idPrefix}-year`}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          Academic Year <span className="text-rose-400">*</span>
        </label>
        <select
          id={`${idPrefix}-year`}
          value={member.year}
          onChange={(e) => onChange('year', Number(e.target.value))}
          required
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      {/* Branch: 8 branches */}
      <div>
        <label
          htmlFor={`${idPrefix}-branch`}
          className="block text-xs font-semibold text-slate-300 mb-1.5"
        >
          Engineering Branch (8 Options) <span className="text-rose-400">*</span>
        </label>
        <select
          id={`${idPrefix}-branch`}
          value={member.branch}
          onChange={(e) => onChange('branch', e.target.value)}
          required
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          {BRANCH_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
