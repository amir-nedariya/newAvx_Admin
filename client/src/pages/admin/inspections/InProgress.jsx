import React from "react";
import { Wrench, UserCheck, Car } from "lucide-react";
import { motion } from "framer-motion";

const InProgress = () => {
  const inspections = [
    {
      id: 1,
      vehicle: "Hyundai Verna",
      inspector: "Rohit Sharma",
      status: "In Progress",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Inspections In Progress
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Vehicles currently under inspection
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-5">
        {inspections.map((i) => (
          <motion.div
            key={i.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
            border border-white/10 p-6 flex flex-col md:flex-row
            md:items-center md:justify-between gap-6"
          >
            {/* LEFT INFO */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20
                flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">{i.vehicle}</h2>

                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  Inspector: {i.inspector}
                </div>
              </div>
            </div>

            {/* STATUS */}
            <span
              className="inline-flex items-center gap-2 px-5 py-2
              rounded-full text-sm font-semibold
              bg-blue-500/20 text-blue-300"
            >
              <Wrench className="w-4 h-4" />
              {i.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InProgress;
