// -------------------------------------------------------------
//  About Page - Structured Data Layer
//  IEEE GBPIET Student Branch
// -------------------------------------------------------------

// -- Hero ------------------------------------------------------
export const heroContent = {
  heading: 'IEEE',
  headingAccent: 'GBPIET',
  subtitle:
    'IEEE GBPIET Student Branch - a community of innovators, engineers, and thinkers shaping the future of technology at Govind Ballabh Pant Institute of Engineering and Technology.',
  cta: { label: 'Join the Branch', href: '/contact' },
  ctaSecondary: { label: 'Our Activities', href: '/activities' },
};

// -- Stats -----------------------------------------------------
export const statsData = [
  { number: '30+', label: 'Active Members', description: 'Passionate student engineers' },
  { number: '112+', label: 'Events Hosted', description: 'Workshops, seminars & hackathons' },
  { number: '30+', label: 'Projects Built', description: 'Research & hands-on innovation' },
  { number: '10+', label: 'Years of Legacy', description: 'Shaping futures since founding' },
];

// -- Strategic Direction (Student Branch & Aim) ----------------
export const strategicPlan = {
  branch: {
    tag: 'Student Branch',
    heading: 'IEEE Student Branch',
    body: 'IEEE is an opportunity. It will help you to interact with other IEEE members of your Student branch (SB) and also with the local section members. The membership will help you boost the technical knowledge in you and also keep oneself updated. Involving in SB activities not only helps you to acquire technical skills but helps you to get managerial skills as well as help to network with other enthusiastic students, volunteers as well as professional members. Its all about your passion towards a scientific and technical arena.',
  },
  aim: {
    tag: 'Our Aim',
    heading: 'Our Aim',
    body: 'It aims to encourage and support students to put their creativity and intelligence into action. It helps students brings up a lot of amazing ideas. It was also created with the vision to give students the opportunity to meet and learn from fellow students, as well as faculty members and professionals in the field. As we want to make every student here in GBPIET to contribute her/his own bit to science and technology.',
  },
  // Backward compatibility aliases
  get mission() {
    return this.branch;
  },
  get vision() {
    return this.aim;
  },
};

// -- Ethics & Values -------------------------------------------
export interface ValueItem {
  title: string;
  description: string;
  iconId: 'excellence' | 'integrity' | 'collaboration' | 'innovation' | 'inclusion' | 'service';
  accent: string;
}

export const ethicsValues: ValueItem[] = [
  {
    title: 'Technical Excellence',
    description:
      'We pursue mastery in engineering and science, holding ourselves to the highest standards of quality and rigour in everything we build and learn.',
    iconId: 'excellence',
    accent: 'blue',
  },
  {
    title: 'Integrity & Ethics',
    description:
      'We act with honesty, transparency and professional responsibility - guided by the IEEE Code of Ethics in all our work and interactions.',
    iconId: 'integrity',
    accent: 'cyan',
  },
  {
    title: 'Collaboration',
    description:
      'We believe the best solutions emerge from diverse minds working together, fostering a culture of open knowledge sharing and mutual respect.',
    iconId: 'collaboration',
    accent: 'purple',
  },
  {
    title: 'Innovation',
    description:
      'We challenge assumptions, experiment boldly and embrace creative problem-solving to turn ideas into impactful technological solutions.',
    iconId: 'innovation',
    accent: 'yellow',
  },
  {
    title: 'Inclusion & Diversity',
    description:
      'We welcome engineers of all backgrounds, ensuring every voice is heard and every talent is nurtured in an equitable environment.',
    iconId: 'inclusion',
    accent: 'emerald',
  },
  {
    title: 'Service to Society',
    description:
      "Guided by IEEE's core purpose, we dedicate our skills to initiatives that create tangible benefits for the community and society at large.",
    iconId: 'service',
    accent: 'orange',
  },
];

// -- Leadership Structure ---------------------------------------
export interface LeaderItem {
  name: string;
  role: string;
  image?: string;
  department: string;
  initials: string;
  isPrimary?: boolean;
}

export const leadershipData: LeaderItem[] = [
  {
    name: 'Dr. Kamaljit Singh Bhatia',
    role: 'Sr. Member IEEE, Branch Counsellor',
    department: 'Coordinator Professional Societies, GBPIET',
    initials: 'KB',
    image: '/images/kamaljeet-150x150.jpg',
    isPrimary: true,
  },
  {
    name: 'Rachita Pant',
    role: 'Student Branch Chair',
    department: 'IEEE Student Branch',
    initials: 'RP',
    image: '/images/rachitamam.jpeg',
  },
  {
    name: 'Mohit Rawat',
    role: 'Student Branch Vice Chair',
    department: 'IEEE Student Branch',
    initials: 'MR',
    image: '/images/mohit.sir.jpeg',
  },
  {
    name: 'Janmejay',
    role: 'Student Secretary',
    department: 'IEEE Student Branch',
    initials: 'JP',
    image: '/images/janmajay.jpeg',
  },
  {
    name: 'Ojasvi Arora',
    role: 'Vice Chair',
    department: 'IEEE Student Branch',
    initials: 'OA',
    image: '/images/ojasss.jpeg',
  },
  {
    name: 'Harsh Sharma',
    role: 'Student Treasurer',
    department: 'IEEE Student Branch',
    initials: 'HS',
    image: '/images/harsh sharma.jpeg',
  },
  {
    name: 'Ansh Dhamija',
    role: 'Student Treasurer',
    department: 'IEEE Student Branch',
    initials: 'AD',
    image: '/images/ansh dhamija.jpeg',
  },
  {
    name: 'Rohit Thapliyal',
    role: 'Creative Media Head',
    department: 'IEEE Student Branch',
    initials: 'RT',
    image: '/images/rohit.thapliyal.jpeg',
  },
  {
    name: 'Asmi Naithani',
    role: 'Web Master',
    department: 'IEEE Student Branch',
    initials: 'AN',
    image: '/images/asmi.mam.jpeg',
  },
];

// -- Affinity Groups / Societies --------------------------------
export interface SocietyItem {
  acronym: string;
  name: string;
  fullName: string;
  description: string;
  focus: string[];
  accent: string;
  borderColor: string;
  glowColor: string;
  badgeColor: string;
  iconId: 'cs' | 'pes' | 'wie';
}

export const societiesData: SocietyItem[] = [
  {
    acronym: 'CS',
    name: 'Computer Society',
    fullName: 'IEEE Computer Society',
    description:
      'Driving the future of computing through cutting-edge research, education, and collaboration in software, hardware, and emerging technologies.',
    focus: ['Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Software Engineering'],
    accent: 'blue',
    borderColor: 'border-blue-500/20',
    glowColor: 'bg-blue-500/10',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    iconId: 'cs',
  },
  {
    acronym: 'PES',
    name: 'Power & Energy Society',
    fullName: 'IEEE Power & Energy Society',
    description:
      'Advancing the science, technology, and practice of electric power and energy for the benefit of humanity through sustainable innovation.',
    focus: ['Renewable Energy', 'Smart Grids', 'Power Electronics', 'Energy Storage'],
    accent: 'yellow',
    borderColor: 'border-yellow-500/20',
    glowColor: 'bg-yellow-500/10',
    badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    iconId: 'pes',
  },
  {
    acronym: 'WIE',
    name: 'Women in Engineering',
    fullName: 'IEEE Women in Engineering',
    description:
      'Empowering women in engineering and science, fostering an inclusive environment where every aspiring engineer can thrive and lead.',
    focus: ['STEM Outreach', 'Leadership Development', 'Mentorship', 'Community Building'],
    accent: 'pink',
    borderColor: 'border-pink-500/20',
    glowColor: 'bg-pink-500/10',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    iconId: 'wie',
  },
];

// -- Quick Links -----------------------------------------------
export interface QuickLinkItem {
  label: string;
  href: string;
  description: string;
  isExternal?: boolean;
}

export const quickLinks: QuickLinkItem[] = [
  {
    label: 'Join IEEE Global',
    href: 'https://www.ieee.org/membership/join/index.html',
    description: 'Become part of the world largest technical professional organization.',
    isExternal: true,
  },
  {
    label: 'Read Our Bylaws',
    href: 'https://www.ieee.org/about/help/structure.html',
    description: 'Governance rules and operating procedures of IEEE student branches.',
    isExternal: true,
  },
  {
    label: 'Contact the Branch',
    href: '/contact',
    description: 'Get in touch with our student branch executive committee.',
    isExternal: false,
  },
  {
    label: 'Explore Activities',
    href: '/activities',
    description: 'Browse workshops, technical sessions, and upcoming events.',
    isExternal: false,
  },
];
