import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import Loader from "@/components/common/Loader";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      

      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {loading ? ( <Loader onComplete={() => setLoading(false)} />) : (<Outlet />)}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}