import React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  BarChart3,
  Megaphone,
  Car,
  Mail,
} from "lucide-react";

const Tiers = () => {
  const tiers = [
    {
      id: 1,
      name: "BASIC",
      vehicles: 8,
      inquiries: "20 / day",
      analytics: "Basic",
      ppc: false,
    },
    {
      id: 2,
      name: "PRO",
      vehicles: 25,
      inquiries: "Unlimited",
      analytics: "Advanced",
      ppc: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Tier Configuration
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          System-level subscription tier controls & permissions
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
            border border-white/10 p-6 space-y-6"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-wide">
                {tier.name} Tier
              </h2>

              <div className="w-10 h-10 rounded-xl bg-indigo-500/20
                flex items-center justify-center">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
            </div>

            {/* CONFIG LIST */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">
                  Max Active Vehicles:
                </span>
                <span className="font-semibold">
                  {tier.vehicles}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-400">
                  Inquiry Limit:
                </span>
                <span className="font-semibold">
                  {tier.inquiries}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">
                  Analytics Access:
                </span>
                <span className="font-semibold">
                  {tier.analytics}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-pink-400" />
                <span className="text-gray-400">
                  Storefront PPC:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    tier.ppc
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {tier.ppc ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {/* ACTION */}
            <button
              className="w-full mt-2 px-4 py-2 rounded-xl
              text-sm font-medium
              bg-blue-600/20 text-blue-300
              hover:bg-blue-600/40 transition"
            >
              Edit Tier Settings
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tiers;
