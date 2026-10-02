import { ChevronDown, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NavItem } from './types';
import { isRouteActive } from './routeActive';

interface DesktopNavItemProps {
  link: NavItem;
  pathname: string;
  isOpen: boolean;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export default function DesktopNavItem({
  link,
  pathname,
  isOpen,
  isActive,
  onOpen,
  onClose,
  onToggle,
}: DesktopNavItemProps) {
  const dropdownItems = link.dropdown;

  return (
    <div className="group relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      {!dropdownItems && link.href && (
        <Link
          to={link.href}
          className={`relative inline-block text-sm font-medium leading-6 transition-colors duration-200 xl:text-[15px] ${
            isActive ? 'text-white' : 'text-white/90 hover:text-white'
          }`}
        >
          {link.name}
          <span
            className={`absolute -bottom-[6px] left-0 h-[2px] rounded-full bg-brand-blue transition-all duration-300 ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            }`}
          />
        </Link>
      )}

      {dropdownItems && (
        <>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className={`flex items-center gap-2 text-sm font-medium leading-6 transition-colors duration-200 xl:text-[15px] ${
              isActive || isOpen ? 'text-white' : 'text-white/90 hover:text-white'
            }`}
          >
            <span>{link.name}</span>
            <ChevronDown
              size={14}
              strokeWidth={2}
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-brand-blue' : ''
              }`}
            />
          </button>

          <div
            className={`absolute left-1/2 top-full w-56 -translate-x-1/2 pt-4 transition-all duration-200 ${
              isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'
            }`}
          >
            <div className="rounded-xl border border-white/10 bg-brand-navy-deep/95 p-2 shadow-2xl backdrop-blur-xl">
              {dropdownItems.map((subItem) => {
                if (subItem.isExternal) {
                  return (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <span>{subItem.name}</span>
                      <ExternalLink size={14} className="text-brand-blue" />
                    </a>
                  );
                }

                const isSubActive = isRouteActive(pathname, subItem.href);

                return (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    onClick={onClose}
                    className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isSubActive
                        ? 'bg-brand-blue/15 font-semibold text-brand-blue-light'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {subItem.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
