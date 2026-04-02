import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  MessageSquare,
  CreditCard,
  Megaphone,
  BarChart3,
  Settings,
  ChevronDown,
  ShieldCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
} from "lucide-react";

const cls = (...classes) => classes.filter(Boolean).join(" ");

/* ================= SUB ITEM ================= */
const SubItem = ({ to, label, collapsed, onNavigate }) => {
  const location = useLocation();

  // Check exact match OR if current path starts with the base path (for nested routes like /admin/vehicles/123)
  // Also check if we came from this section via navigation state
  const isActive =
    location.pathname === to ||
    location.pathname.startsWith(to + '/') ||
    location.state?.from === to;

  if (collapsed) return null;

  return (
    <div className="relative flex items-center group w-full py-[3px]">
      {/* The Connector dot */}
      <div
        className={cls(
          "absolute z-10 rounded-full transition-all duration-300",
          isActive
            ? "left-[21px] w-[9px] h-[9px] bg-sky-600 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
            : "left-[21.5px] w-[8px] h-[8px] border-[1.5px] border-gray-600 bg-[#0A0D14] group-hover:border-gray-400"
        )}
      />

      {/* The background box and link text */}
      <NavLink
        to={to}
        onClick={onNavigate}
        className={cls(
          "ml-[46px] mr-3 flex-1 flex items-center px-4 py-[10px] text-[14px] font-medium rounded-xl transition-all duration-200",
          isActive
            ? "bg-sky-600 bg-[#212631]" // Dark blue-grey highlight matching your image
            : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
        )}
      >
        <span className="truncate">{label}</span>
      </NavLink>
    </div>
  );
};

/* ================= TREE ITEM ================= */
const TreeItem = ({
  title,
  icon: Icon,
  to,
  children,
  defaultOpen = false,
  collapsed,
  onToggleCollapsed,
  onNavigate,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(defaultOpen);

  const isDirectActive = to && location.pathname === to;
  const hasChildren = !!children;

  const shouldAutoOpen = useMemo(() => {
    if (!hasChildren) return false;
    const arr = React.Children.toArray(children);
    const paths = arr
      .filter((x) => React.isValidElement(x))
      .map((x) => x.props?.to)
      .filter(Boolean);

    return paths.some((p) => location.pathname.startsWith(p));
  }, [children, hasChildren, location.pathname]);

  useEffect(() => {
    if (shouldAutoOpen && !collapsed) setOpen(true);
  }, [shouldAutoOpen, collapsed]);

  useEffect(() => {
    if (collapsed) setOpen(false);
  }, [collapsed]);

  const isChildActive = shouldAutoOpen;
  const isActive = isDirectActive || (hasChildren && isChildActive && collapsed);

  // When expanding or active, color it sky
  const isMenuExpanded = hasChildren && open && !collapsed;
  const isHighlighted = isActive || isMenuExpanded;

  const baseBtnClass = cls(
    "relative flex items-center w-full px-4 py-3.5 rounded-2xl transition-all duration-300 group cursor-pointer",
    collapsed ? "justify-center" : "justify-start"
  );

  const content = (
    <div className={cls("relative z-10 flex items-center w-full", collapsed ? "justify-center" : "gap-3.5")}>
      <div
        className={cls(
          "flex items-center justify-center transition-all duration-300",
          isHighlighted
            ? "text-sky-400"
            : "text-gray-400 group-hover:text-gray-200 group-hover:scale-105"
        )}
      >
        <Icon size={20} className={isHighlighted ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : ""} strokeWidth={isHighlighted ? 2 : 1.75} />
      </div>

      {!collapsed && (
        <span
          className={cls(
            "font-semibold tracking-wide truncate whitespace-nowrap transition-colors duration-300 text-[14.5px]",
            isHighlighted ? "text-sky-400" : "text-gray-300 group-hover:text-gray-100"
          )}
        >
          {title}
        </span>
      )}

      {!collapsed && hasChildren && (
        <div className={cls(
          "ml-auto flex items-center justify-center w-5 h-5 transition-all duration-300",
          isHighlighted ? "text-sky-400" : "text-gray-500 group-hover:text-gray-300"
        )}>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} strokeWidth={2} />
          </motion.div>
        </div>
      )}
    </div>
  );

  const dynamicRoleClass = cls(
    baseBtnClass,
    isHighlighted ? "bg-[#181D29]" : "hover:bg-white/[0.04]"
  );

  if (!hasChildren) {
    return (
      <NavLink
        to={to}
        onClick={onNavigate}
        className={dynamicRoleClass}
        title={collapsed ? title : undefined}
      >
        {content}
      </NavLink>
    );
  }

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      collapsed,
      onNavigate
    });
  });

  return (
    <div className="w-full flex flex-col mb-1.5">
      <button
        type="button"
        title={collapsed ? title : undefined}
        onClick={() => {
          if (collapsed) {
            onToggleCollapsed?.();
            setTimeout(() => setOpen(true), 150);
            return;
          }
          setOpen((s) => !s);
        }}
        className={dynamicRoleClass}
      >
        {content}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="relative flex flex-col pt-2 pb-2">
              {/* Continuous vertical tree line */}
              <div
                className="absolute w-[1px] bg-gray-600/50"
                style={{
                  left: '25.5px', // Exact center aligned with the icon (px-4 = 16px padding + 10px half icon)
                  top: '0px',
                  bottom: '6px' // Trims the bottom so it stops cleanly at the last hollow circle
                }}
              />
              {enhancedChildren}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================= SIDEBAR ================= */
const Sidebar = ({ collapsed = false, onToggle, mobile = false, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    if (mobile) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <style>{`
        .premium-scroll::-webkit-scrollbar { width: 4px; }
        .premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .premium-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
        .premium-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>

      <aside
        className={cls(
          "h-screen flex flex-col bg-[#0A0D14] border-r border-[#1C202B] shadow-2xl relative z-50",
          "transition-[width] duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          collapsed ? "w-[80px]" : "w-[290px]"
        )}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="h-24 shrink-0 flex items-center justify-between px-5 relative z-10 transition-all duration-400">
          <div className={cls("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
            <div className="w-10 h-10 shrink-0 bg-[#0A0D14] border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-sky-400" size={22} strokeWidth={1.5} />
            </div>

            <div className={cls("flex-col transition-all duration-400", collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto flex")}>
              <span className="text-[19px] font-bold text-white leading-none tracking-tight whitespace-nowrap">
                AVX Admin
              </span>
              <span className="text-[12px] text-sky-500 font-semibold mt-1.5 tracking-wide whitespace-nowrap">Control Panel</span>
            </div>
          </div>

          {!mobile && !collapsed && (
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all flex-shrink-0"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
          )}

          {mobile && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}

          {!mobile && collapsed && (
            <button
              onClick={onToggle}
              className="absolute -right-3.5 top-8 w-7 h-7 bg-[#111622] border border-[#2A3441] rounded-full flex items-center justify-center text-sky-400 hover:text-white hover:bg-[#1A2234] transition-all z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden premium-scroll px-3 pb-6 flex flex-col relative z-10">

          <TreeItem
            title="Overview"
            icon={LayoutDashboard}
            to="/admin/overview"
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          />

          <TreeItem
            title="Users"
            icon={Users}
            to="/admin/users"
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          />

          <TreeItem
            title="Consultants"
            icon={Users}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/consultants/all" label="All Consultants" />
            <SubItem to="/admin/consultants/pendingapprovals" label="Pending Approvals" />
            <SubItem to="/admin/consultants/tier-management" label="Tier Management" />
            <SubItem to="/admin/consultants/ranking-control" label="Ranking Control" />
            <SubItem to="/admin/consultants/storefront-approvals" label="Storefront Approvals" />
            <SubItem to="/admin/consultants/suspended" label="Suspended Consultants" />
            <SubItem to="/admin/consultants/flagged-consultations" label="Flagged Consultations" />
          </TreeItem>

          <TreeItem
            title="Marketplace"
            icon={Car}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/vehicles/all" label="All Vehicles" />
            <SubItem to="/admin/vehicles/pending-approvals" label="Pending Approvals" />
            <SubItem to="/admin/vehicles/suspended" label="Suspended Vehicles" />
            <SubItem to="/admin/vehicles/flagged-listings" label="Flagged Listings" />
            <SubItem to="/admin/vehicles/sponsored-listings" label="Sponsored Listings" />
            <SubItem to="/admin/vehicles/categories-attributes" label="Categories / Attributes" />
          </TreeItem>

          <TreeItem
            title="Buyers"
            icon={ShoppingCart}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/buyers/all" label="All Buyers" />
            <SubItem to="/admin/buyers/suspended-users" label="Suspended Users" />
            <SubItem to="/admin/buyers/saved-lists" label="Saved Lists" />
            <SubItem to="/admin/buyers/inquiry-monitoring" label="Inquiry Monitoring" />
          </TreeItem>

          <TreeItem
            title="Inspections"
            icon={ClipboardList}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/inspections/requests" label="Inspection Requests" />
            <SubItem to="/admin/inspections/assign" label="Assign Inspector" />
            <SubItem to="/admin/inspections/reports-review" label="Reports Review" />
            <SubItem to="/admin/inspections/disputes" label="Disputes" />
          </TreeItem>


          {/* Operations */}
          <TreeItem
            title="Operations"
            icon={Shield}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/operations/inquiry-monitoring" label="Inquiry Monitoring" />
            <SubItem to="/admin/operations/chat-oversight" label="Chat Oversight" />
            <SubItem to="/admin/operations/dispute-center" label="Dispute Center" />
            <SubItem to="/admin/operations/fraud-alerts" label="Fraud Alerts" />
          </TreeItem>

          <TreeItem
            title="Inquiries"
            icon={MessageSquare}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/inquiries/logs" label="Logs" />
            <SubItem to="/admin/inquiries/abuse" label="Abuse" />
          </TreeItem>

          <TreeItem
            title="Subscriptions"
            icon={CreditCard}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/subscriptions/tiers" label="Tier Plans" />
            <SubItem to="/admin/store-theme" label="Store Theme" />
            <SubItem to="/admin/store-template" label="Store Template" />
          </TreeItem>

          <TreeItem
            title="Marketing"
            icon={Megaphone}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/ppc/campaigns" label="Campaigns" />
            <SubItem to="/admin/ppc/featured" label="Featured" />
          </TreeItem>

          <TreeItem
            title="Analytics"
            icon={BarChart3}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          >
            <SubItem to="/admin/analytics/marketplace" label="Marketplace Metrics" />
            <SubItem to="/admin/analytics/funnel" label="Conversion Funnel" />
            <SubItem to="/admin/analytics/ranking" label="Ranking Distribution" />
            <SubItem to="/admin/analytics/consultants" label="Top Performing Consultants" />
          </TreeItem>

          <TreeItem
            title="Admin Settings"
            icon={Settings}
            to="/admin/settings"
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;