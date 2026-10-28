import type { MemberFormState, PredefinedEvent } from '../modules/registration/types';

// Predefined IEEE events with fixed, predefined dates
export const PREDEFINED_EVENTS: PredefinedEvent[] = [

  { // Both , Single , Team ... types for event Type 
    id: 'KiCAD-2026',
    name: 'KiCAD-competition',
    date: '2026-10-29',
    displayDate: '29 October 2026',
  },
    { // Both , Single , Team ... types for event Type 
    id: 'KiCAD-2026',
    name: 'KiCAD-Workshop',
    date: '2026-10-28',
    displayDate: '28 October 2026',
  },
];


export const BRANCH_OPTIONS = [
  { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { value: 'AIML', label: 'Artificial Intelligence & Machine Learning (AIML)' },
  { value: 'ECE', label: 'Electronics & Communication Engineering (ECE)' },
  { value: 'EE', label: 'Electrical Engineering (EE)' },
  { value: 'ME', label: 'Mechanical Engineering (ME)' },
  { value: 'CE', label: 'Civil Engineering (CE)' },
  { value: 'BT', label: 'Biotechnology (BT)' },
  { value: 'MFG', label: 'Manufacturing Engineering (MFG)' },
  { value: 'BCA', label: 'Bachleor of Computer application (BCA)' },
];

// Academic Year Options 1 to 4
export const YEAR_OPTIONS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
];


export const createEmptyMember = (): MemberFormState => ({
  instituteId: '',
  name: '',
  phone: '',
  email: '',
  year: 1,
  branch: 'CSE',
});