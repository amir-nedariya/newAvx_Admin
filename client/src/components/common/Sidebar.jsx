import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  Car,
  ClipboardList,
  MessageSquare,
  CreditCard,
  Megaphone,
  BarChart3,
  Settings,
  ChevronDown,
  FileText,
  Image, // ✅ Lucide Image icon
} from "lucide-react";

/* =======================
   ACTIVE LINK STYLES
======================= */
const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium 
   transition-all duration-300 ${
     isActive
       ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg ring-1 ring-blue-400/30"
       : "text-gray-400 hover:bg-white/5 hover:text-white"
   }`;

const subLinkClass = ({ isActive }) =>
  `flex items-center gap-2 pl-10 pr-4 py-2 rounded-lg text-sm 
   transition-all duration-300 ${
     isActive
       ? "bg-blue-500/10 text-blue-300 border-l-2 border-blue-400"
       : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
   }`;

/* =======================
   TREE ITEM COMPONENT
======================= */
const TreeItem = ({ title, icon, to, children }) => {
  const [open, setOpen] = useState(false);

  if (children) {
    return (
      <div className="mt-1">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full justify-between items-center px-4 py-2 
          rounded-xl text-sm font-medium 
          text-gray-400 hover:text-white 
          hover:bg-white/5 transition-all duration-300 
          border border-white/5"
        >
          <span className="flex items-center gap-3">
            <span className="text-blue-400">{icon}</span>
            {title}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col mt-1">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink to={to} className={linkClass}>
      <span className="text-blue-400">{icon}</span>
      {title}
    </NavLink>
  );
};

/* =======================
   SIDEBAR COMPONENT
======================= */
const Sidebar = () => {
  return (
    <aside
      className="w-64 min-h-screen 
      bg-gradient-to-b from-[#0B0F1A] to-[#05070D]
      text-gray-300 flex flex-col p-4
      border-r border-white/10
      shadow-[0_0_40px_rgba(0,0,0,0.8)]
      backdrop-blur-xl"
    >
      {/* LOGO */}
      <h1
        className="text-2xl font-bold text-center mb-8 
        bg-gradient-to-r from-blue-400 to-cyan-400 
        bg-clip-text text-transparent tracking-wide"
      >
        AVX Admin
      </h1>

      {/* MAIN NAVIGATION */}
      <TreeItem title="Overview" icon={<LayoutDashboard size={18} />} to="/admin/overview" />

      <TreeItem title="Consultants" icon={<Users size={18} />}>
       <NavLink to="/admin/consultants/all" className={subLinkClass}>
          <Users size={14} /> All Consultants
        </NavLink>
        <NavLink to="/admin/consultants/pending" className={subLinkClass}>
          <Users size={14} /> Pending Approval
        </NavLink>
        <NavLink to="/admin/consultants/requestchange" className={subLinkClass}>
          <Users size={14} /> Request Changes
        </NavLink>
        <NavLink to="/admin/consultants/active" className={subLinkClass}>
          <UserCheck size={14} /> Active Consultants
        </NavLink>
        <NavLink to="/admin/consultants/suspended" className={subLinkClass}>
          <UserX size={14} />Rejected
        </NavLink>
      </TreeItem>

      <TreeItem title="Vehicles" icon={<Car size={18} />}>
      <NavLink to="/admin/vehicles/all" className={subLinkClass}>Allvehicles</NavLink>
        <NavLink to="/admin/vehicles/live" className={subLinkClass}>Verified</NavLink>
        <NavLink to="/admin/vehicles/drafts" className={subLinkClass}>Pending</NavLink>
        <NavLink to="/admin/vehicles/sold" className={subLinkClass}>Sold</NavLink>
        <NavLink to="/admin/vehicles/flagged" className={subLinkClass}>Rejected</NavLink>
      </TreeItem>

      <TreeItem title="Inspections" icon={<ClipboardList size={18} />}>
        <NavLink to="/admin/inspections/requests" className={subLinkClass}>Requests</NavLink>
        <NavLink to="/admin/inspections/in-progress" className={subLinkClass}>In Progress</NavLink>
        <NavLink to="/admin/inspections/completed" className={subLinkClass}>Completed</NavLink>
        <NavLink to="/admin/inspections/failed" className={subLinkClass}>Failed / Disputed</NavLink>
      </TreeItem>

      <TreeItem title="Inquiries & Chats" icon={<MessageSquare size={18} />}>
        <NavLink to="/admin/inquiries/logs" className={subLinkClass}>Inquiry Logs</NavLink>
        <NavLink to="/admin/inquiries/abuse" className={subLinkClass}>Abuse Flags</NavLink>
      </TreeItem>

      <TreeItem title="Subscriptions & Tiers" icon={<CreditCard size={18} />}>
        <NavLink to="/admin/subscriptions/tiers" className={subLinkClass}>Tier Plans</NavLink>
         {/* <NavLink to="/admin/subscriptions/tiers/create" className={subLinkClass} >Create Tier</NavLink> */}
        <NavLink to="/admin/subscriptions/consultants" className={subLinkClass}>Consultant Subscriptions</NavLink>
        <NavLink to="/admin/store-theme" className={subLinkClass}>Store-theme</NavLink>
        <NavLink to="/admin/store-template" className={subLinkClass}>Store-template</NavLink>
      </TreeItem>
      
  

      <TreeItem title="PPC Management" icon={<Megaphone size={18} />}>
        <NavLink to="/admin/ppc/campaigns" className={subLinkClass}>Campaigns</NavLink>
        <NavLink to="/admin/ppc/featured" className={subLinkClass}>Featured Slots</NavLink>
      </TreeItem>

      {/* ===================== OTHER SECTION ===================== */}
      <TreeItem title="Other" icon={<Settings size={18} />}>
        {/* Badge / Notifications */}
        <NavLink to="/admin/other/badge" className={subLinkClass}>
          <span className="flex items-center gap-2">
            <Megaphone size={14} /> Badge
          </span>
        </NavLink>

        {/* Vehicle Images */}
        <NavLink to="/admin/other/vehicleimages" className={subLinkClass}>
          <span className="flex items-center gap-2">
            <Image size={14} /> Vehicle Images
          </span>
        </NavLink>
      </TreeItem>

      <TreeItem title="Users" icon={<Users size={18} />} to="/admin/users" />

      {/* Reviews & Reports */}
      <TreeItem title="Reviews & Reports" icon={<FileText size={18} />} to="/admin/reviews" />

      <TreeItem title="Analytics" icon={<BarChart3 size={18} />} to="/admin/analytics" />
      <TreeItem title="CMS & Content" to="/admin/cms" />

      {/* Admin Settings at bottom */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <TreeItem title="Admin Settings" icon={<Settings size={18} />} to="/admin/settings" />
      </div>
    </aside>
  );
};

export default Sidebar;
