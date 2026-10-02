import type { Activity } from './events';

export const roboticsActivities: Activity[] = [
  // =========================
  // Computer Vision Workshop
  // =========================
  {
    id: 'ROB26001',

    title: 'Computer Vision with OpenCV and MediaPipe',
    category: 'Workshops',
    branch: 'Robotics',

    date: 'September 24, 2026',
    time: '10:00 AM - 1:00 PM',
    venue: 'CS/IT Lab 3, GBPIET',
    organizedBy: 'IEEE GBPIET Student Branch - Robotics',

    reportAuthor: 'Robotics Team',

    overview:
      'A hands-on technical workshop exploring image processing, computer vision, and real-time visual perception using OpenCV and MediaPipe.',

    description:
      'Teaching machines to see. This workshop introduces participants to the fundamentals of image processing and real-time computer vision using OpenCV and MediaPipe. The session explores object detection, gesture recognition, motion tracking, and the use of vision systems for controlling hardware in real time, bridging the gap between AI perception and physical action.',

    keyDiscussion: [
      'Introduction to computer vision and image processing.',
      'Fundamentals of OpenCV and real-time image processing.',
      'Using MediaPipe for gesture and motion tracking.',
      'Object detection and visual feature extraction.',
      'Connecting computer vision systems with physical hardware.',
      'Real-time vision-based interaction and control.',
    ],

    studentsPresent: [
      'Chandan Singh',
      'Rahul Sharma',
      'Aman Rawat',
      'Priya Bisht',
      'Aditya Negi',
    ],

    image: '/images/roboticsImages/computer-vision.jpg',
  },

  // =========================
  // RAG & Generative AI Workshop
  // =========================
  {
    id: 'ROB26002',

    title: 'RAG-Based Campus Assistant (Generative AI)',
    category: 'Workshops',
    branch: 'Robotics',

    date: 'October 8, 2026',
    time: '10:00 AM - 1:00 PM',
    venue: 'Auditorium C, GBPIET',
    organizedBy: 'IEEE GBPIET Student Branch - Robotics',

    reportAuthor: 'Robotics Team',

    overview:
      'A practical Generative AI workshop focused on building a campus information assistant using Retrieval-Augmented Generation, embeddings, and vector search.',

    description:
      'Building an AI that actually knows your campus. This workshop introduces participants to Retrieval-Augmented Generation (RAG), one of the practical applications of modern Generative AI. Participants learn how open-source Large Language Models can be combined with a custom knowledge base to build a functional campus information assistant using embeddings, vector search, and prompt engineering.',

    keyDiscussion: [
      'Introduction to Generative AI and Large Language Models.',
      'Understanding Retrieval-Augmented Generation (RAG).',
      'Creating and managing a custom knowledge base.',
      'Generating embeddings from documents and information.',
      'Understanding vector databases and semantic search.',
      'Prompt engineering for reliable AI responses.',
      'Building a practical campus information assistant.',
    ],

    studentsPresent: [
      'Chandan Singh',
      'Kunal Singh',
      'Rahul Sharma',
      'Aman Rawat',
      'Priya Bisht',
    ],

    image: '/images/roboticsImages/rag-ai.jpg',
  },

  // =========================
  // Cybersecurity & CTF Workshop
  // =========================
  {
    id: 'ROB26003',

    title: 'Cybersecurity and CTF Basics',
    category: 'Workshops',
    branch: 'Robotics',

    date: 'October 22, 2026',
    time: '10:00 AM - 1:00 PM',
    venue: 'Seminar Hall 1, GBPIET',
    organizedBy: 'IEEE GBPIET Student Branch - Robotics',

    reportAuthor: 'Robotics Team',

    overview:
      'An introductory cybersecurity workshop covering security fundamentals, ethical hacking concepts, attack-and-defense scenarios, and Capture the Flag challenges.',

    description:
      'Think like an attacker, defend like a pro. This workshop introduces participants to the world of cybersecurity through hands-on and practical learning. It covers foundational security concepts, simulated attack-and-defense scenarios, ethical hacking fundamentals, and an introduction to Capture the Flag competitions, giving students practical exposure to cybersecurity problem-solving.',

    keyDiscussion: [
      'Introduction to cybersecurity fundamentals.',
      'Understanding common security threats and vulnerabilities.',
      'Basics of ethical hacking and defensive security.',
      'Simulated attack-and-defense scenarios.',
      'Introduction to Capture the Flag (CTF) competitions.',
      'Practical cybersecurity problem-solving techniques.',
      'Importance of secure systems and responsible security practices.',
    ],

    studentsPresent: [
      'Chandan Singh',
      'Rahul Sharma',
      'Aman Rawat',
      'Aditya Negi',
      'Vivek Rawat',
    ],

    image: '/images/roboticsImages/cybersecurity.jpg',
  },
];