import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  Ban,
  UserX,
} from "lucide-react";

const Abuse = () => {
  const reports = [
    {
      id: 1,
      type: "Buyer Spam",
      reportedUser: "Amit Verma",
      against: "Adarsh Auto",
      message: "Repeated spam messages",
    },
    {
      id: 2,
      type: "Consultant Harassment",
      reportedUser: "Royal Motors",
      against: "Buyer - Rahul",
      message: "Abusive language in chat",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Chat Abuse Reports
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Review and take action on reported abusive conversations
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-5">
        {reports.map((r) => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
            border border-white/10 p-6 space-y-5"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20
                  flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-lg">
                    {r.type}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Reported User: <span className="text-gray-300">{r.reportedUser}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Against: <span className="text-gray-300">{r.against}</span>
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-semibold
                bg-red-500/20 text-red-300">
                Under Review
              </span>
            </div>

            {/* MESSAGE */}
            <div className="border-l-4 border-red-500/60 pl-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {r.message}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                text-sm font-medium
                bg-yellow-500/20 text-yellow-300
                hover:bg-yellow-500/40 transition"
              >
                <ShieldAlert className="w-4 h-4" />
                Warn
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                text-sm font-medium
                bg-gray-500/20 text-gray-300
                hover:bg-gray-500/40 transition"
              >
                <UserX className="w-4 h-4" />
                Temp Block
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                text-sm font-medium
                bg-red-600/20 text-red-300
                hover:bg-red-600/40 transition"
              >
                <Ban className="w-4 h-4" />
                Permanent Ban
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Abuse;
