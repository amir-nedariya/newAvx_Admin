import React from "react";
import { Lock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const Completed = () => {
  const inspections = [
    {
      id: 1,
      vehicle: "Toyota Innova",
      reportLocked: true,
      completedOn: "12 Aug 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Completed Inspections
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Finalized inspections with locked reports
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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20
                flex items-center justify-center">
                <CheckCircle size={22} className="text-emerald-400" />
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {i.vehicle}
                </h2>
                <p className="text-sm text-gray-400">
                  Completed on {i.completedOn}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <span
              className={`flex items-center gap-2 px-4 py-2 rounded-full
              text-xs font-semibold ${
                i.reportLocked
                  ? "bg-gray-500/20 text-gray-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              <Lock size={14} />
              {i.reportLocked ? "Report Locked" : "Unlocked"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Completed;
