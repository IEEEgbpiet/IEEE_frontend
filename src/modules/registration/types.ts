export type RegistrationMode = 'individual' | 'team';

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
  name: string;
  date: string;
  displayDate: string;
}
