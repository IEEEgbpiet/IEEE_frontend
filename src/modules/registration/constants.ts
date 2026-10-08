import type { MemberFormState, PredefinedEvent } from './types';

// Predefined IEEE events with fixed, predefined dates
export const PREDEFINED_EVENTS: PredefinedEvent[] = [
  {
    id: 'ieee-introductory-workshop-2026',
    name: 'IEEE Introductory Workshop',
    date: '2026-10-09',
    displayDate: '9 October 2026',
  },
  {
    id: 'ui-design-showcase-2026',
    name: 'UI Design Showcase',
    date: '2026-10-10',
    displayDate: '10 October 2026',
  },
  {
    id: 'poster-making-2026',
    name: 'Poster Making',
    date: '2026-10-10',
    displayDate: '10 October 2026',
  },
  {
    id: 'sociothon-2026',
    name: 'Sociothon',
    date: '2026-10-10',
    displayDate: '10 October 2026',
  },
  {
    id: 'opencv-filter-showcase-2026',
    name: 'OpenCV Filter Showcase',
    date: '2026-10-11',
    displayDate: '11 October 2026',
  },
  {
    id: 'rag-chatbot-workshop-2026',
    name: 'RAG-Based Chatbot Workshop',
    date: '2026-10-11',
    displayDate: '11 October 2026',
  },
  {
    id: 'genai-building-challenge-2026',
    name: 'GenAI Building Challenge',
    date: '2026-10-11',
    displayDate: '11 October 2026',
  },
  {
    id: 'precision-run-2026',
    name: 'Precision Run',
    date: '2026-10-11',
    displayDate: '11 October 2026',
  },
];

// 8 Engineering Branches
export const BRANCH_OPTIONS = [
  { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { value: 'AIML', label: 'Artificial Intelligence & Machine Learning (AIML)' },
  { value: 'ECE', label: 'Electronics & Communication Engineering (ECE)' },
  { value: 'EE', label: 'Electrical Engineering (EE)' },
  { value: 'ME', label: 'Mechanical Engineering (ME)' },
  { value: 'CE', label: 'Civil Engineering (CE)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'BT', label: 'Biotechnology (BT)' },
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