import type { NavItem } from './types';

export const navLinks: NavItem[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'About',
    dropdown: [
      {
        name: 'About IEEE GBPIET',
        href: '/about',
        isExternal: false,
      },
      {
        name: 'About IEEE',
        href: 'https://www.ieee.org',
        isExternal: true,
      },
      {
        name: 'IEEE UP Section',
        href: 'https://ieeeup.org',
        isExternal: true,
      },
    ],
  },
  {
    name: 'Activities',
    dropdown: [
      {
        name: 'Events',
        href: '/activities/events',
        isExternal: false,
      },
      {
        name: 'Robotics',
        href: '/activities/robotics',
        isExternal: false,
      },
    ],
  },
  {
    name: 'Teams',
    href: '/teams',
  },
  {
    name: 'Events',
    href: '/activities/events',
  },
    {
    name: 'Certificate',
    href: '/certificate',
  },

  {
    name: 'Contact',
    href: '/contact',
  },
];
