export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME || 'IEEE GBPIET Student Branch',
  shortName: 'IEEE GBPIET',
  url: import.meta.env.VITE_SITE_URL || 'https://ieeestudentbranch.gbpiet.ac.in',
} as const;
