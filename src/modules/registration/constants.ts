import type { MemberFormState, PredefinedEvent } from './types';

// Predefined IEEE events with fixed, predefined dates
export const PREDEFINED_EVENTS: PredefinedEvent[] = [
  {
    id: 'rag-ai-systems',
    name: 'RAG Based AI & LLM Systems Workshop',
    date: '2026-07-03',
    displayDate: '3 July 2026',
  },
  {
    id: 'web-dev-bootcamp',
    name: 'IEEE Web Development Bootcamp 2026',
    date: '2026-04-15',
    displayDate: '15 April 2026',
  },
  {
    id: 'day-hackathon',
    name: 'IEEE Day Hackathon 2026',
    date: '2026-04-20',
    displayDate: '20 April 2026',
  },
  {
    id: 'robotics-bootcamp',
    name: 'Robotics & Embedded Systems Bootcamp',
    date: '2026-04-25',
    displayDate: '25 April 2026',
  },
  {
    id: 'genai-summit',
    name: 'Generative AI Summit',
    date: '2026-05-02',
    displayDate: '2 May 2026',
  },
  {
    id: 'national-hackathon',
    name: 'National Hackathon 2026',
    date: '2026-05-15',
    displayDate: '15 May 2026',
  },
  {
    id: 'technexus-code-sprint',
    name: 'TechNexus Code Sprint 2026',
    date: '2026-05-28',
    displayDate: '28 May 2026',
  },
  {
    id: 'cyber-ctf',
    name: 'Cyber Security & CTF Challenge 2026',
    date: '2026-06-10',
    displayDate: '10 June 2026',
  },
  {
    id: 'iot-smart-systems',
    name: 'IoT & Smart Systems Workshop 2026',
    date: '2026-06-22',
    displayDate: '22 June 2026',
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
