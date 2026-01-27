import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const Failed = () => {
  const inspections = [
    {
      id: 1,
      vehicle: "Ford EcoSport",
      reason: "Inspection denied by seller",
      reportedOn: "15 Aug 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Failed / Disputed Inspections
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Inspections that failed or require admin intervention
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {inspections.map((i) => (
          <motion.div
            key={i.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
            border border-white/10 p-6 flex items-center justify-between"
          >
            {/* LEFT */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20
                flex items-center justify-center">
                <AlertTriangle size={22} className="text-red-400" />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {i.vehicle}
                </h2>
                <p className="text-sm text-red-400 mt-1">
                  Reason: {i.reason}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Reported on {i.reportedOn}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl
              text-sm font-semibold bg-emerald-600/20 text-emerald-300
              hover:bg-emerald-600/40 transition"
            >
              <RotateCcw size={16} />
              Allow Re-Inspection
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Failed;
