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
    href: '/actvities',
  },

  {
    name: 'Teams',
    href: '/teams',
  },
  {
    name: 'Registration',
    href: '/Registration',
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
