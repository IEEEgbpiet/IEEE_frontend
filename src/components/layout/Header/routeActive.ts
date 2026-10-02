import type { DropdownItem } from './types';

export const isRouteActive = (pathname: string, href?: string): boolean => {
  if (!href) return false;
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
};

export const isDropdownActive = (pathname: string, items?: DropdownItem[]): boolean => {
  if (!items) return false;
  return items.some((item) => !item.isExternal && isRouteActive(pathname, item.href));
};
