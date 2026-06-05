import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  IndianRupee,
  SlidersHorizontal,
  Megaphone,
  ShieldCheck,
  Ban,
  Wallet,
} from "lucide-react";

import PPCDashboard from "./components/PPCDashboard";
import PPCPricing from "./components/PPCPricing";
import PPCRules from "./components/PPCRules";
import PPCCampaigns from "./components/PPCCampaigns";
import PPCModeration from "./components/PPCModeration";
import PPCOverrides from "./components/PPCOverrides";
import PPCWallets from "./components/PPCWallets";

/* ─── TAB CONFIG ────────────────────────────────────────────────── */
const TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
    component: PPCDashboard,
    section: "Overview",
  },
  {
    id: "pricing",
    label: "Placement pricing",
    icon: IndianRupee,
    badge: null,
    component: PPCPricing,
    section: "Configuration",
  },
  {
    id: "rules",
    label: "Platform rules",
    icon: SlidersHorizontal,
    badge: null,
    component: PPCRules,
    section: "Configuration",
  },
  {
    id: "campaigns",
    label: "All campaigns",
    icon: Megaphone,
    badge: 48,
    component: PPCCampaigns,
    section: "Operations",
  },
  {
    id: "moderation",
    label: "Ad moderation",
    icon: ShieldCheck,
    badge: 5,
    badgeStyle: "bg-red-500",
    component: PPCModeration,
    section: "Operations",
  },
  {
    id: "overrides",
    label: "Overrides",
    icon: Ban,
    badge: 2,
    badgeStyle: "bg-amber-400",
    component: PPCOverrides,
    section: "Operations",
  },
  {
    id: "wallets",
    label: "PPC billing",
    icon: Wallet,
    badge: null,
    component: PPCWallets,
    section: "Finance",
  },
];

/* ─── GROUP TABS BY SECTION ─────────────────────────────────────── */
const SECTIONS = ["Overview", "Configuration", "Operations", "Finance"];

/* ─── PAGE VARIANTS ─────────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const PPCHub = ({ initialTab = "dashboard" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const active = TABS.find((t) => t.id === activeTab) || TABS[0];
  const ActiveComponent = active.component;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-slate-200 px-6 md:px-8 pt-6 pb-0">
        {/* Title Row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-blue-600 p-1.5 rounded-lg flex items-center justify-center">
                <Megaphone size={16} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Marketing</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">PPC Control Hub</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Manage campaigns, pricing, moderation, and billing for paid promotions.
            </p>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">48 Live campaigns</span>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="flex items-end gap-0 overflow-x-auto hide-scrollbar">
          {SECTIONS.map((section) => {
            const sectionTabs = TABS.filter((t) => t.section === section);
            return (
              <React.Fragment key={section}>
                {/* Section label (subtle) */}
                <div className="flex items-center gap-0 border-r border-slate-200 last:border-r-0">
                  {sectionTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                          isActive
                            ? "text-blue-600 border-blue-600"
                            : "text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={15} strokeWidth={isActive ? 2.2 : 1.75} />
                        {tab.label}
                        {tab.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                              tab.badgeStyle || "bg-slate-400"
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="px-6 md:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hide scrollbar utility */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PPCHub;
