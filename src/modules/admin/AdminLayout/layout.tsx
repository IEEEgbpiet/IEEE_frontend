import { useState } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { LogOut, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/dashboard") return "Dynamic Area";
    if (path.includes("/admin/change-password")) return "Change Password & Security";
    if (path.includes("/admin/certificates/issued")) return "History of Issued Certificates";
    if (path.includes("/admin/certificates/requests")) return "Requested Certificates";
    if (path.includes("/admin/certificates/templates")) return "Enter Details";
    if (path.startsWith("/admin/certificates")) return "Certificates";
    if (path.includes("/admin/upcoming-posts/add")) return "Add New Upcoming Event";
    if (path.includes("/admin/upcoming-posts/manage")) return "Edit posts Directory";
    if (path.includes("/admin/upcoming-posts/edit")) return "Edit Post Panel";
    if (path.startsWith("/admin/upcoming-posts")) return "Upcoming Events sections";
    if (path.includes("/admin/department-posts") && path.includes("/add")) return "Create a New post";
    if (path.includes("/admin/department-posts") && path.includes("/manage")) return "Department posts Directory";
    if (path.includes("/admin/department-posts") && path.includes("/edit")) return "Edit Post Panel";
    if (path.startsWith("/admin/department-posts")) return "Posts Panel for Department";
    if (path.startsWith("/admin/support")) return "Full View of Ticket";
    if (path.startsWith("/admin/reports")) return "Reports & Minutes of Meeting";
    if (path.startsWith("/admin/logs")) return "Logs & Setting";
    return "Admin Panel";
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg text-white">
      <Sidebar />

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0 flex flex-col bg-admin-bg">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-admin-surface/85 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div>
            <h2 className="text-sm font-semibold text-white">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <NavLink
              to="/admin/change-password"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "border-brand-blue/40 bg-brand-blue/20 text-brand-blue-light"
                    : "border-white/15 bg-admin-subtle text-slate-300 hover:bg-admin-card-hover hover:text-white hover:border-white/30"
                }`
              }
            >
              <KeyRound size={13} />
              <span>Password & Security</span>
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-admin-subtle px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={14} />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-admin-bg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}