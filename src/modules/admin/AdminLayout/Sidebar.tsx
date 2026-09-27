
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  UserRound,
  Award,
  Newspaper,
  Headset,
  ScrollText,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

type SidebarProps = {
  name?: string;
  role?: string;
  avatarUrl?: string;
  items?: SidebarItem[];
};

const defaultItems: SidebarItem[] = [ //Added new items to the sidebar here
  {
    label: "Certificates",
    path: "/admin/certificates",
    icon: Award,
  },
  {
    label: "Posts",
    path: "/admin/posts",
    icon: Newspaper,
  },
  {
    label: "Support",
    path: "/admin/support",
    icon: Headset,
  },
  {
    label: "Logs",
    path: "/admin/logs",
    icon: ScrollText,
  },
];

export default function Sidebar({
  name = "Your Name",
  role = "IEEE Student Branch",
  avatarUrl,
  items = defaultItems,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16
        items-center justify-between border-b border-white/10
        bg-[#0b1532] px-4 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center
            rounded-lg bg-blue-600">
            <UserRound size={20} />
          </div>
          <span className="font-semibold">Profile</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-slate-200
            hover:bg-white/10"
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
          className="fixed inset-0 z-40 bg-black/60
            backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64
          flex-col border-r border-white/10 bg-[#0b1532]
          text-white transition-transform duration-300
          ease-in-out lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Profile */}
        <div className="flex items-center justify-between
          border-b border-white/10 p-5">
          <div className="flex min-w-0 items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${name}'s profile`}
                className="h-11 w-11 rounded-full object-cover
                  ring-2 ring-blue-500"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0
                items-center justify-center rounded-full
                bg-blue-600 text-lg font-semibold
                ring-2 ring-blue-400/50">
                {name.trim().charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
            className="rounded-md p-1 text-slate-400
              hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="mb-3 px-3 pt-2 text-xs font-semibold
            uppercase tracking-[0.18em] text-slate-500">
            Menu
          </p>

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3
                  rounded-lg px-3 py-3 text-sm font-medium
                  transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute inset-y-2
                        left-0 w-1 rounded-r-full bg-blue-500" />
                    )}
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <p className="text-center text-xs text-slate-500">
            IEEE GBPIET
          </p>
        </div>
      </aside>
    </>
  );
}