import React from "react";
import { Eye, Calendar, UserCheck, Car } from "lucide-react";
import { motion } from "framer-motion";

const Requests = () => {
  const inspections = [
    {
      id: 1,
      vehicle: "Honda City",
      requestedBy: "Buyer",
      inspector: "Assigned",
      status: "Scheduled",
      date: "20 Aug 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Inspection Requests
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Review and manage upcoming inspection requests
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {inspections.map((i) => (
          <motion.div
            key={i.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
            border border-white/10 p-6
            flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            {/* LEFT INFO */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20
                flex items-center justify-center">
                <Car className="w-6 h-6 text-indigo-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  {i.vehicle}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Requested by{" "}
                  <span className="font-medium text-gray-200">
                    {i.requestedBy}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Inspector: {i.inspector}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    {i.status} • {i.date}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5
              rounded-xl text-sm font-semibold
              bg-blue-600/20 text-blue-300
              hover:bg-blue-600/40 transition"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
