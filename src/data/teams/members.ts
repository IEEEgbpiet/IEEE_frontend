// IEEE GBPIET — Team Members Data
// Source: https://edu.ieee.org/in-gbpiet/our-team/

// -----------------------------------------------------------------------------
// DATA FEEDING GUIDE / INSTRUCTIONS
// -----------------------------------------------------------------------------
// 1. PHOTO:
//    - Put image file in 'public/images/members/' folder (e.g., 'jiyanshi.jpg')
//    - Set photo field: photo: '/images/members/jiyanshi.jpg'
//    - Or paste a direct public URL: photo: 'https://example.com/photo.jpg'
//
// 2. SOCIAL LINKS:
//    - Paste full profile URL inside quotes.
//    - Example: linkedin: 'https://www.linkedin.com/in/username'
//    - If link is not available, leave it as empty string '' or omit the key.
//
// 3. ADDING NEW MEMBER:
//    - Copy-paste any block below, adjust 'priority' (ordering), and set 'committee'.
// -----------------------------------------------------------------------------

export type SocialLinks = {
  linkedin?: string; // Full LinkedIn URL
  github?: string;   // Full GitHub URL
  instagram?: string;// Full Instagram URL
  twitter?: string;  // Full Twitter/X URL
};

export type Committee = 'executive' | 'student';

export type TeamMember = {
  name: string;        // Full name
  role: string;        // Designation / Position
  department: string;  // Branch / Department
  photo?: string;      // Photo path or URL
  socials: SocialLinks;// Social links object
  priority: number;    // Sort order (1 = top display position)
  committee: Committee;// 'executive' or 'student'
};

// ── Member Data Source ───────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  // ===========================================================================
  // EXECUTIVE COMMITTEE
  // ===========================================================================
  {
    name: 'Dr. V.K Banga',
    role: 'Chief Patron & Director',
    department: 'GBPIET',
    photo: '/images/vk banga director.jpeg',
    priority: 1,
    committee: 'executive',
    socials: {
      linkedin: 'https://www.linkedin.com/in/dr-vijay-kumar-banga-200167b',
    },
  },
  {
    name: 'Dr. Kamaljit Singh Bhatia',
    role: 'Sr. Member IEEE, Branch Counsellor',
    department: 'Coordinator Professional Societies, GBPIET',
    photo: '/images/kamaljeet-150x150.jpg',
    priority: 2,
    committee: 'executive',
    socials: {
      linkedin: 'https://in.linkedin.com/in/dr-kamaljit-singh-bhatia-19693049',
    },
  },
  {
    name: 'Dr. Mamta Baunthiyal',
    role: 'DEAN R&D',
    department: 'GBPIET',
    photo: '/images/mamta dean.jpeg',
    priority: 3,
    committee: 'executive',
    socials: {
      linkedin: 'https://in.linkedin.com/in/mamta-baunthiyal-27780420',
    },
  },
  {
    name: 'Dr. Sanjay Gairola',
    role: 'Sr. Member IEEE, OIC Library',
    department: 'GBPIET',
    photo: '/images/sanjay-gairola-e1774373677242.jpg',
    priority: 4,
    committee: 'executive',
    socials: {
      linkedin: 'https://linkedin.com/in/',
    },
  },
  {
    name: 'Dr. Jitendra Singh Rauthan',
    role: 'Member IEEE & Branch Advisor',
    department: 'CSE Department',
    photo: '/images/rauthan.jpeg',
    priority: 5,
    committee: 'executive',
    socials: {
      linkedin: 'https://www.linkedin.com/in/dr-jitendra-singh-rauthan-86852b306',
    },
  },
  {
    name: 'Mr. Neem Sagar',
    role: 'Member IEEE & Branch Advisor',
    department: 'EE Department',
    photo: '/images/neemsagar.jpeg',
    priority: 6,
    committee: 'executive',
    socials: {
      linkedin: 'https://linkedin.com/in/',
    },
  },
  {
    name: 'Dr. Sandeep Kumar',
    role: 'Member IEEE & Branch Advisor',
    department: 'ECE Department',
    photo: '/images/sandeeppp.jpeg',
    priority: 7,
    committee: 'executive',
    socials: {
      linkedin: 'https://linkedin.com/in/',
    },
  },
  {
    name: 'Mr. Pranshu Dangwal',
    role: 'Member IEEE & Branch Advisor',
    department: 'BT Department',
    photo: '/images/pranshudangwal.jpeg',
    priority: 8,
    committee: 'executive',
    socials: {
      linkedin: 'https://www.linkedin.com/in/pranshu-dangwal-761967a2',
    },
  },

  // ===========================================================================
  // STUDENT COMMITTEE
  // ===========================================================================
  {
    name: 'Rachita Pant',
    role: 'Student Branch Chair',
    department: 'IEEE Student Branch',
    photo: '/images/rachitamam.jpeg',
    priority: 1,
    committee: 'student',
    socials: {
      linkedin: 'https://in.linkedin.com/in/rachita-pant',
      github: 'https://github.com/',
      instagram: 'https://www.instagram.com/rachitaa._?stkn=MWJpMTV1YTlyNWJjOA==',
    },
  },
  {
    name: 'Mohit Rawat',
    role: 'Student Branch Vice Chair',
    department: 'IEEE Student Branch',
    photo: '/images/mohit.sir.jpeg',
    priority: 2,
    committee: 'student',
    socials: {
      linkedin: 'https://in.linkedin.com/in/mohit-rawat-00764a290',
      github: 'https://github.com/',
      instagram: '',
    },
  },
  {
    name: 'Janmejay',
    role: 'Student Secretary',
    department: 'IEEE Student Branch',
    photo: '/images/janmajay.jpeg',
    priority: 3,
    committee: 'student',
    socials: {
      linkedin: 'https://in.linkedin.com/in/janmejay-pant-b2329b289',
      instagram: 'https://instagram.com/',
    },
  },
  {
    name: 'Ojasvi Arora',
    role: 'Vice Chair',
    department: 'IEEE Student Branch',
    photo: '/images/ojasss.jpeg',
    priority: 3,
    committee: 'student',
    socials: {
      linkedin: 'https://in.linkedin.com/in/ojasviarora',
      instagram: 'https://instagram.com/',
    },
  },
  {
    name: 'Harsh Sharma',
    role: 'Student Treasurer',
    department: 'IEEE Student Branch',
    photo: '/images/harsh sharma.jpeg',
    priority: 4,
    committee: 'student',
    socials: {
      linkedin: 'https://in.linkedin.com/in/harsh-sharma-948186321',
      instagram: 'https://instagram.com/',
    },
  },
  {
    name: 'Ansh Dhamija',
    role: 'Student Treasurer',
    department: 'IEEE Student Branch',
    photo: '/images/ansh dhamija.jpeg',
    priority: 4,
    committee: 'student',
    socials: {
      linkedin: 'https://www.linkedin.com/in/ansh-dhamija-0540ab295?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      instagram: 'https://instagram.com/',
    },
  },
  {
    name: 'Rohit Thapliyal',
    role: 'Creative Media Head',
    department: 'IEEE Student Branch',
    photo: '/images/rohit.thapliyal.jpeg',
    priority: 5,
    committee: 'student',
    socials: {
      linkedin: 'https://in.linkedin.com/in/rohit-thapliyal-a089b02a2',
      instagram: 'https://instagram.com/',
    },
  },
  {
    name: 'Asmi Naithani',
    role: 'Web Master',
    department: 'IEEE Student Branch',
    photo: '/images/asmi.mam.jpeg',
    priority: 6,
    committee: 'student',
    socials: {
      linkedin: 'https://www.linkedin.com/in/asminaithani',
      github: 'https://github.com/',
      instagram: 'https://www.instagram.com/asmi_naithani',
    },
  },
];