import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NavItem } from './types';
import { isRouteActive } from './routeActive';

interface MobileNavItemProps {
  link: NavItem;
  pathname: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export default function MobileNavItem({
  link,
  pathname,
  isOpen,
  isActive,
  onToggle,
  onNavigate,
}: MobileNavItemProps) {
  const dropdownItems = link.dropdown;

  if (!dropdownItems && link.href) {
    return (
      <Link
        to={link.href}
        onClick={onNavigate}
        className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-all ${
          isActive
            ? 'bg-[#00629b]/20 text-[#00a3ff] font-semibold'
            : 'text-white/80 hover:bg-white/5 hover:text-white'
        }`}
      >
        <span>{link.name}</span>
        <ChevronRight
          size={18}
          className={`transition-colors ${isActive ? 'text-[#00a3ff]' : 'text-white/30'}`}
        />
      </Link>
    );
  }

  if (!dropdownItems) return null;

  return (
    <div className="rounded-xl overflow-hidden transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base font-medium transition-all ${
          isActive ? 'text-[#00a3ff]' : 'text-white/80 hover:bg-white/5 hover:text-white'
        }`}
      >
        <span className={isActive ? 'font-semibold' : ''}>{link.name}</span>
        <ChevronDown
          size={18}
          className={`text-white/40 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-blue-dark' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-3 my-1 space-y-1 border-l-2 border-white/10 pl-3">
          {dropdownItems.map((subItem) => {
            if (subItem.isExternal) {
              return (
                <a
                  key={subItem.name}
                  href={subItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onNavigate}
                  className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span>{subItem.name}</span>
                  <ExternalLink size={14} className="text-brand-blue-dark" />
                </a>
              );
            }

            const isSubActive = isRouteActive(pathname, subItem.href);

            return (
              <Link
                key={subItem.name}
                to={subItem.href}
                onClick={onNavigate}
                className={`block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isSubActive
                    ? 'bg-[#00629b]/20 text-[#00a3ff] font-semibold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {subItem.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
