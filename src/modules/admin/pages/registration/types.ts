import type { RegistrationRecord, RegistrationMember } from '@/services/adminApi';

export type { RegistrationRecord, RegistrationMember };

export interface RegistrationStatsData {
  totalRegistrations: number;
  totalParticipants: number;
  totalTeams: number;
  totalIndividuals: number;
}
