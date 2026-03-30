// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import { Menu } from "lucide-react";

const W_OPEN = 280;
const W_CLOSE = 80;
const LG_BREAKPOINT = 1024;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= LG_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= LG_BREAKPOINT;
      setIsDesktop(desktop);

      if (desktop) {
        setMobileOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const sidebarWidth = collapsed ? W_CLOSE : W_OPEN;

  return (
    <div className="h-screen overflow-hidden bg-[#05070A] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 z-40">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#0A0D14] border-b border-white/5 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-lg border border-white/5 hover:bg-white/5 flex items-center justify-center transition-colors"
        >
          <Menu size={20} className="text-white" />
        </button>

        <p className="text-sm font-bold text-white tracking-tight">
          AVX <span className="text-blue-400">ADMIN</span>
        </p>

        <div className="w-10 h-10" />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] shadow-2xl">
            <Sidebar
              mobile
              collapsed={false}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className="flex-1 h-screen overflow-y-auto pt-16 lg:pt-0 bg-white transition-[margin-left] duration-300 ease-in-out relative z-0"
        style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
      >
        <div className="min-h-full bg-white p-4 sm:p-5 md:p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;