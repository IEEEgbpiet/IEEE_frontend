import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/dashboard") return "Dynamic Area";
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

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0 flex flex-col bg-black">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div>
            <h2 className="text-sm font-semibold text-white">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 hover:border-white/30"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-black">
          <Outlet />
        </div>
      </main>
    </div>
  );
}