import React from "react";
import { motion } from "framer-motion";
import {
  PauseCircle,
  PlayCircle,
  ShieldOff,
  TrendingUp,
} from "lucide-react";

const Campaigns = () => {
  const campaigns = [
    {
      id: 1,
      consultant: "Adarsh Auto Consultants",
      type: "Search Boost",
      spend: "₹12,500",
      status: "Active",
    },
    {
      id: 2,
      consultant: "Royal Motors",
      type: "Featured Listing",
      spend: "₹4,200",
      status: "Paused",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          PPC Campaign Management
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Monitor, pause or restrict paid promotions across consultants
        </p>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl
        border border-white/10 overflow-hidden">

        {/* ✅ GLOBAL HIGHLIGHTED TABLE HEAD */}
        <div
          className="
            grid grid-cols-12 px-8 py-4
            text-[11px] uppercase tracking-widest font-semibold
            text-white
            bg-gradient-to-r
            from-blue-500/10 via-cyan-500/5 to-blue-500/10
            border-b border-blue-400/20
            shadow-[inset_0_-1px_0_rgba(59,130,246,0.25)]
          "
        >
          <div className="col-span-4">Consultant</div>
          <div className="col-span-3">Campaign Type</div>
          <div className="col-span-2">Spend</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* ROWS */}
        {campaigns.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            className="grid grid-cols-12 px-8 py-1 items-center
            border-b border-white/5 transition"
          >
            {/* CONSULTANT */}
            <div className="col-span-4">
              <p className="font-semibold">{c.consultant}</p>
              <p className="text-xs text-gray-500">
                Campaign ID #{c.id}
              </p>
            </div>

            {/* TYPE */}
            <div className="col-span-3 text-gray-400">
              {c.type}
            </div>

            {/* SPEND */}
            <div className="col-span-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">{c.spend}</span>
            </div>

            {/* STATUS */}
            <div className="col-span-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  c.status === "Active"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {c.status}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="col-span-1 flex justify-end gap-2">
              {c.status === "Active" ? (
                <button
                  className="p-2 rounded-xl bg-yellow-600/20
                  text-yellow-300 hover:bg-yellow-600/40 transition"
                  title="Pause Campaign"
                >
                  <PauseCircle size={16} />
                </button>
              ) : (
                <button
                  className="p-2 rounded-xl bg-emerald-600/20
                  text-emerald-300 hover:bg-emerald-600/40 transition"
                  title="Resume Campaign"
                >
                  <PlayCircle size={16} />
                </button>
              )}

              <button
                className="p-2 rounded-xl bg-red-600/20
                text-red-300 hover:bg-red-600/40 transition"
                title="Disable PPC"
              >
                <ShieldOff size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* NOTE */}
      <p className="text-sm text-gray-500 mt-6">
        ⚠️ PPC campaigns may be automatically disabled for consultants
        with repeated trust or compliance violations.
      </p>
    </div>
  );
};

export default Campaigns;
