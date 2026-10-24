export type RegistrationMode = 'individual' | 'team';
export type EventType = 'Single' | 'Team' | 'Both' | 'single' | 'team' | 'both';

export interface MemberFormState {
  instituteId: string;
  name: string;
  phone: string;
  email: string;
  year: number;
  branch: string;
}

export interface PredefinedEvent {
  id: string;
  type?: EventType | string;
  name: string;
  date: string;
  displayDate: string;
}

export function getAllowedModes(type?: string): { allowIndividual: boolean; allowTeam: boolean } {
  const normalized = (type || 'Both').trim().toLowerCase();

  
  if (normalized === 'single' || normalized === 'individual') {
    return { allowIndividual: true, allowTeam: false };
  }
  if (normalized === 'team') {
    return { allowIndividual: false, allowTeam: true };
  }
  return { allowIndividual: true, allowTeam: true };
}
