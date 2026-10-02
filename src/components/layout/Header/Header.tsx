import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Search, ArrowRight, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from './navLinks';
import { isDropdownActive, isRouteActive } from './routeActive';
import DesktopNavItem from './DesktopNavItem';
import MobileNavItem from './MobileNavItem';

export default function Header() {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const desktopNavRef = useRef<HTMLElement>(null);

  /*  client-side portal mounting */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* Auto-open active dropdown category on mobile if current route matches */
  useEffect(() => {
    if (mobileMenuOpen) {
      navLinks.forEach((link) => {
        if (link.dropdown && isDropdownActive(location.pathname, link.dropdown)) {
          setMobileDropdownOpen(link.name);
        }
      });
    }
  }, [mobileMenuOpen, location.pathname]);

  /* =========================
     CLOSE EVERYTHING ON ROUTE CHANGE
     ========================= */
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopDropdownOpen(null);
    setMobileDropdownOpen(null);
  }, [location.pathname]);

  /* =========================
     LOCK BODY SCROLL WHEN MOBILE MENU OPEN
     ========================= */
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  /* =========================
     CLICK OUTSIDE + ESCAPE KEY
     ========================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (desktopNavRef.current && !desktopNavRef.current.contains(target)) {
        setDesktopDropdownOpen(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopDropdownOpen(null);
        setMobileMenuOpen(false);
        setMobileDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  /* =========================
     CLOSE MOBILE MENU
     ========================= */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 w-full border-b border-white/[0.12] bg-gradient-to-b from-brand-navy/40 to-brand-navy/20 backdrop-blur-sm backdrop-saturate-180 sm:h-16 lg:h-[76px] lg:[--u:min(1px,0.052083vw)]">
        {' '}
        <div className="mx-auto flex h-full max-w-[1920px] items-center px-4 sm:px-6 lg:pl-[calc(114*var(--u))] lg:pr-[calc(47*var(--u))]">
          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-2.5 focus:outline-none lg:gap-3"
          >
            <img
              src="/images/IeeeLogo.webp"
              alt="IEEE Logo"
              className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105 sm:h-9 sm:w-9 lg:h-[46px] lg:w-[46px]"
              style={{ filter: 'hue-rotate(15deg)' }}
            />
            <div className="leading-none">
              <div className="text-base font-extrabold uppercase tracking-tight sm:text-xl lg:text-[23px]">
                <span className="text-brand-blue-dark">IEEE</span>
                <span className="ml-1.5 text-white">GBPIET</span>
              </div>
              <p className="mt-1 hidden text-[8.5px] font-medium tracking-[0.32em] text-white/70 sm:block">
                STUDENT BRANCH
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV: left-aligned after the logo */}
          <nav
            ref={desktopNavRef}
            aria-label="Desktop Navigation"
            className="hidden items-center lg:ml-8 lg:flex xl:ml-[calc(240*var(--u))]"
            style={{ gap: 'max(20px, calc(51 * var(--u)))' }}
          >
            {navLinks.map((link) => {
              const dropdownItems = link.dropdown;
              const isCurrentActive = dropdownItems
                ? isDropdownActive(location.pathname, dropdownItems)
                : isRouteActive(location.pathname, link.href);

              return (
                <DesktopNavItem
                  key={link.name}
                  link={link}
                  pathname={location.pathname}
                  isOpen={desktopDropdownOpen === link.name}
                  isActive={isCurrentActive}
                  onOpen={() => dropdownItems && setDesktopDropdownOpen(link.name)}
                  onClose={() => setDesktopDropdownOpen(null)}
                  onToggle={() =>
                    setDesktopDropdownOpen((prev) => (prev === link.name ? null : link.name))
                  }
                />
              );
            })}
          </nav>

          {/* RIGHT CONTROLS */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-[18px]">
            <button
              type="button"
              aria-label="Search"
              className="hidden items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10 lg:flex"
            >
              <Search size={22} strokeWidth={1.8} />
            </button>

            <Link
              to="/contact"
              className="hidden h-[46px] items-center gap-2 whitespace-nowrap rounded-full px-[26px] text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110 lg:inline-flex"
              style={{ background: 'var(--color-brand-blue-cta)' }}
            >
              Join IEEE
              <ArrowRight size={16} />
            </Link>

            {/* Corner tagline: left-aligned */}
            <span className="hidden text-left text-[8.5px] font-medium leading-5 tracking-[0.36em] text-white/55 min-[1400px]:ml-[35px] min-[1400px]:block">
              IDEAS
              <br />
              PEOPLE
              <br />
              OPPORTUNITIES
            </span>

            {/* Hamburger (mobile & tablet) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="flex items-center justify-center rounded-lg p-2 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue lg:hidden"
            >
              {mobileMenuOpen ? (
                <X size={27} strokeWidth={2} />
              ) : (
                <Menu size={27} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE & TABLET SLIDE-OVER DRAWER
          Rendered via Portal into document.body to prevent
          backdrop-filter stacking context containment traps.
          ===================================================== */}
      {isMounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
              mobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
            }`}
            aria-hidden={!mobileMenuOpen}
          >
            {/* Backdrop overlay */}
            <div
              className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Slide-over Drawer (From Right) */}
            <div
              className={`fixed inset-y-0 right-0 flex w-full max-w-sm sm:max-w-md flex-col border-l border-white/10 bg-[#080b0f] shadow-2xl transition-transform duration-300 ease-in-out ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              {/* Drawer Header with Branding & Close Button */}
              <div className="flex h-16 sm:h-20 shrink-0 items-center justify-between border-b border-white/10 px-5 sm:px-6">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2.5 focus:outline-none"
                >
                  <img
                    src="/images/IeeeLogo.webp"
                    alt="IEEE Logo"
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                    style={{ filter: 'hue-rotate(-15deg)' }}
                  />
                  <div className="text-base font-bold tracking-tight sm:text-lg">
                    <span className="text-brand-blue-dark">IEEE</span>
                    <span className="ml-1 text-white">GBPIET</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav
                className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-1"
                aria-label="Mobile Navigation"
              >
                {navLinks.map((link) => {
                  const dropdownItems = link.dropdown;
                  const isCurrentActive = dropdownItems
                    ? isDropdownActive(location.pathname, dropdownItems)
                    : isRouteActive(location.pathname, link.href);

                  return (
                    <MobileNavItem
                      key={link.name}
                      link={link}
                      pathname={location.pathname}
                      isOpen={mobileDropdownOpen === link.name}
                      isActive={isCurrentActive}
                      onToggle={() =>
                        setMobileDropdownOpen((prev) => (prev === link.name ? null : link.name))
                      }
                      onNavigate={closeMobileMenu}
                    />
                  );
                })}
              </nav>

              {/* Drawer Footer with Login CTA */}
              <div className="shrink-0 border-t border-white/10 p-5 sm:p-6 bg-[#080b0f]/80">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#00629b] px-5 py-3 text-base font-semibold text-white shadow-lg shadow-[#00629b]/25 transition-all hover:bg-[#007bbd] active:scale-[0.98]"
                >
                  <User size={18} />
                  <span>Login to Portal</span>
                </Link>

                <p className="mt-3 text-center text-xs text-white/40">
                  IEEE Student Branch • GBPIET
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
