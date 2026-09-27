import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Award,
  Calendar,
  Layers,
  Headset,
  FileText,
  ScrollText,
  Menu,
  X,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

const defaultItems: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Emails & Certificates",
    path: "/admin/certificates",
    icon: Award,
  },
  {
    label: "Upcoming Events",
    path: "/admin/upcoming-posts",
    icon: Calendar,
  },
  {
    label: "Posts",
    path: "/admin/department-posts",
    icon: Layers,
  },
  {
    label: "Support",
    path: "/admin/support",
    icon: Headset,
  },
  {
    label: "Reports & Minutes of Meeting",
    path: "/admin/reports",
    icon: FileText,
  },
  {
    label: "Logs & Setting",
    path: "/admin/logs",
    icon: ScrollText,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-black px-4 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src="/images/IeeeLogo.webp"
            alt="IEEE Logo"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
          <span className="font-semibold text-sm">IEEE Portal</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-200 hover:bg-white/10"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-black text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* IEEE Logo & Profile Section */}
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-zinc-900 p-1">
                <img
                  src="/images/IeeeLogo.webp"
                  alt="IEEE"
                  className="h-7 w-auto object-contain brightness-0 invert"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">IEEE Admin</p>
                <p className="truncate text-xs text-slate-400">GBPIET Branch</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
              className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {defaultItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}