import { User } from 'lucide-react';
import MemberFields from './MemberFields';
import type { MemberFormState } from '../types';

interface IndividualFormProps {
  member: MemberFormState;
  onChange: (field: keyof MemberFormState, value: string | number) => void;
}

export default function IndividualForm({ member, onChange }: IndividualFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
        <User className="w-4 h-4" />
        2. Participant Details
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 shadow-sm">
        <MemberFields
          member={member}
          onChange={onChange}
          idPrefix="individual"
        />
      </div>
    </div>
  );
}
