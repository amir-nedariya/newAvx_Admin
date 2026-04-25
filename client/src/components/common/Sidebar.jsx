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
  // Special handling: "All Consultants" should stay active when viewing consultant profile or ranking
  // OR when viewing vehicle details from consultant inventory
  const isConsultantProfileOrRanking =
    to === "/admin/consultants/all" &&
    (location.pathname.startsWith("/admin/consultants/profile/") ||
      location.pathname.startsWith("/admin/consultants/ranking/") ||
      (location.pathname.startsWith("/admin/vehicles/") && location.state?.fromConsultantInventory));

  // Special handling: "Users / Seller" should stay active when viewing user details or vehicle details from user inventory
  const isUserDetailsOrVehicle =
    to === "/admin/users" &&
    (location.pathname.startsWith("/admin/users/") ||
      (location.pathname.startsWith("/admin/vehicles/") && location.state?.fromUserInventory));

  const isActive =
    location.pathname === to ||
    location.pathname.startsWith(to + '/') ||
    location.state?.from === to ||
    isConsultantProfileOrRanking ||
    isUserDetailsOrVehicle;

  if (collapsed) return null;

  return (
    <div className="relative flex items-center group w-full py-1">
      {/* The Connector dot */}
      <div
        className={cls(
          "absolute z-10 rounded-full transition-all duration-200",
          isActive
            ? "left-[21px] w-2 h-2 bg-sky-500"
            : "left-[21.5px] w-1.5 h-1.5 bg-slate-300 group-hover:bg-slate-400"
        )}
      />

      {/* The background box and link text */}
      <NavLink
        to={to}
        onClick={onNavigate}
        className={cls(
          "ml-[46px] mr-3 flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isActive
            ? "bg-sky-50 text-sky-700"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
  openMenu,
  setOpenMenu,
}) => {
  const location = useLocation();
  const menuId = title.toLowerCase().replace(/\s+/g, '-');
  const isOpen = openMenu === menuId;

  const isDirectActive = to && location.pathname === to;
  const hasChildren = !!children;

  // Special handling for Users/Seller route - should stay active for /admin/users/* paths
  // OR when navigating to vehicle details from user inventory (check navigation state)
  const isUsersRoute = to === "/admin/users" && (
    location.pathname.startsWith("/admin/users") ||
    (location.pathname.startsWith("/admin/vehicles/") && location.state?.fromUserInventory)
  );

  // Special handling for Consultants - check if we're on consultant profile or ranking pages
  // OR when viewing vehicle details from consultant inventory
  const isConsultantsRoute = !to && title === "Consultants" && (
    location.pathname.startsWith("/admin/consultants/profile/") ||
    location.pathname.startsWith("/admin/consultants/ranking/") ||
    (location.pathname.startsWith("/admin/vehicles/") && location.state?.fromConsultantInventory)
  );

  const shouldAutoOpen = useMemo(() => {
    if (!hasChildren) return false;
    const arr = React.Children.toArray(children);
    const paths = arr
      .filter((x) => React.isValidElement(x))
      .map((x) => x.props?.to)
      .filter(Boolean);

    // Check if any child path matches current location
    const hasMatchingChild = paths.some((p) => location.pathname.startsWith(p));

    // Special case: Consultants menu should open when on consultant profile/ranking
    // OR when viewing vehicle details from consultant inventory
    if (title === "Consultants") {
      return hasMatchingChild ||
        location.pathname.startsWith("/admin/consultants/profile/") ||
        location.pathname.startsWith("/admin/consultants/ranking/") ||
        (location.pathname.startsWith("/admin/vehicles/") && location.state?.fromConsultantInventory);
    }

    return hasMatchingChild;
  }, [children, hasChildren, location.pathname, location.state, title]);

  useEffect(() => {
    if (shouldAutoOpen && !collapsed) {
      setOpenMenu(menuId);
    }
  }, [shouldAutoOpen, collapsed, menuId, setOpenMenu]);

  useEffect(() => {
    if (collapsed) {
      setOpenMenu(null);
    }
  }, [collapsed, setOpenMenu]);

  const isChildActive = shouldAutoOpen;
  const isActive = isDirectActive || isUsersRoute || isConsultantsRoute || (hasChildren && isChildActive && collapsed);

  const baseBtnClass = cls(
    "relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
    collapsed ? "justify-center" : "justify-start"
  );

  const content = (
    <div className={cls("relative z-10 flex items-center w-full", collapsed ? "justify-center" : "gap-3")}>
      <div
        className={cls(
          "flex items-center justify-center transition-all duration-200",
          isActive
            ? "text-sky-600"
            : "text-slate-500 group-hover:text-slate-700"
        )}
      >
        <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
      </div>

      {!collapsed && (
        <span
          className={cls(
            "font-semibold truncate whitespace-nowrap transition-colors duration-200 text-sm",
            isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
          )}
        >
          {title}
        </span>
      )}

      {!collapsed && hasChildren && (
        <div className={cls(
          "ml-auto flex items-center justify-center w-5 h-5 transition-all duration-200",
          isActive ? "text-slate-700" : "text-slate-400 group-hover:text-slate-600"
        )}>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} strokeWidth={2} />
          </motion.div>
        </div>
      )}
    </div>
  );

  const dynamicRoleClass = cls(
    baseBtnClass,
    isActive ? "bg-slate-100" : "hover:bg-slate-50"
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
    <div className="w-full flex flex-col mb-1">
      <button
        type="button"
        title={collapsed ? title : undefined}
        onClick={() => {
          if (collapsed) {
            onToggleCollapsed?.();
            setTimeout(() => setOpenMenu(menuId), 150);
            return;
          }
          setOpenMenu(isOpen ? null : menuId);
        }}
        className={dynamicRoleClass}
      >
        {content}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="relative flex flex-col pt-1 pb-1">
              {/* Continuous vertical tree line */}
              <div
                className="absolute w-[1px] bg-slate-200"
                style={{
                  left: '25.5px',
                  top: '0px',
                  bottom: '4px'
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
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (mobile) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <style>{`
        .premium-scroll::-webkit-scrollbar { width: 6px; }
        .premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .premium-scroll::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 4px; }
        .premium-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.5); }
      `}</style>

      <aside
        className={cls(
          "h-screen flex flex-col bg-white border-r border-slate-200 shadow-sm relative z-50",
          "transition-[width] duration-300 ease-in-out",
          collapsed ? "w-[80px]" : "w-[280px]"
        )}
      >
        {/* Header */}
        <div className="h-20 shrink-0 flex items-center justify-between px-4 relative z-10 border-b border-slate-200">
          <div className={cls("flex items-center gap-3 overflow-hidden", collapsed && "justify-center w-full")}>
            <div className="w-10 h-10 shrink-0 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-white" size={22} strokeWidth={2} />
            </div>

            <div className={cls("flex-col transition-all duration-300", collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto flex")}>
              <span className="text-base font-bold text-slate-900 leading-none tracking-tight whitespace-nowrap">
                AVX Admin
              </span>
              <span className="text-xs text-sky-600 font-semibold mt-1 tracking-wide whitespace-nowrap">Control Panel</span>
            </div>
          </div>

          {!mobile && !collapsed && (
            <button
              onClick={onToggle}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all flex-shrink-0"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
          )}

          {mobile && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}

          {!mobile && collapsed && (
            <button
              onClick={onToggle}
              className="absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all z-50 shadow-sm cursor-pointer"
            >
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden premium-scroll px-3 py-4 flex flex-col relative z-10">

          <TreeItem
            title="Overview"
            icon={LayoutDashboard}
            to="/admin/overview"
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />

           <TreeItem
            title="Leads"
            icon={Users}
            to="/admin/leads"
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />

          <TreeItem
            title="Users / Seller"
            icon={Users}
            to="/admin/users"
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />

          <TreeItem
            title="Consultants"
            icon={Users}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <SubItem to="/admin/consultants/all" label="All Consultants" />
            <SubItem to="/admin/consultants/pendingapprovals" label="Pending Approvals" />
            <SubItem to="/admin/consultants/request-changes" label="Request Changes" />
            <SubItem to="/admin/consultants/tier-management" label="Tier Management" />
            <SubItem to="/admin/consultants/ranking-control" label="Ranking Control" />
            <SubItem to="/admin/consultants/suspended" label="Suspended Consultants" />
            <SubItem to="/admin/consultants/flagged-consultations" label="Flagged Consultations" />
          </TreeItem>

          <TreeItem
            title="Marketplace"
            icon={Car}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <SubItem to="/admin/vehicles/all" label="All Vehicles" />
            <SubItem to="/admin/vehicles/pending-approvals" label="Pending Approvals" />
            <SubItem to="/admin/vehicles/request-changes" label="Request Changes" />
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
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <SubItem to="/admin/buyers/all" label="All Buyers" />
            <SubItem to="/admin/buyers/suspended-users" label="Suspended Users" />
            <SubItem to="/admin/buyers/saved-lists" label="Saved Lists" />
            <SubItem to="/admin/buyers/inquiry-monitoring" label="Inquiry Monitoring" />
          </TreeItem>

          <TreeItem
            title="Storefront Manager"
            icon={ShoppingCart}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <SubItem to="/admin/storefront-manager/themes" label="Theme Manager" />
            <SubItem to="/admin/storefront-manager/template" label="Template Manager" />
            <SubItem to="/admin/storefront-manager/icon" label="Icon Manager" />
            <SubItem to="/admin/storefront-manager/approvals" label="Storefront Approvals" />
          </TreeItem>

          <TreeItem
            title="Inspections"
            icon={ClipboardList}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          >
            <SubItem to="/admin/inspections/requests" label="Inspection Requests" />
            <SubItem to="/admin/inspections/assign" label="Assign Inspector" />
            <SubItem to="/admin/inspections/reports-review" label="Reports Review" />
            <SubItem to="/admin/inspections/disputes" label="Disputes" />
          </TreeItem>

          <TreeItem
            title="Operations"
            icon={Shield}
            collapsed={collapsed}
            onToggleCollapsed={onToggle}
            onNavigate={mobile ? onClose : undefined}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
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
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
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
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
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
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
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
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
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
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;