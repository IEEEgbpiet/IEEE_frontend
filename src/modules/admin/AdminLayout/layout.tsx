
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#080f24] text-white">
      <Sidebar                //Also replace this with API call(make something generic.)
        name="Divyansh Nautiyal"
        role="IEEE Student Branch"
      />

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}