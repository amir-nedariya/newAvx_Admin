import React from "react";
import { Clock, Eye, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Logs = () => {
  const inquiries = [
    {
      id: 1,
      vehicle: "BMW X1",
      consultant: "Adarsh Auto",
      buyer: "Rahul Sharma",
      status: "Responded",
      responseTime: "5 min",
    },
    {
      id: 2,
      vehicle: "Honda City",
      consultant: "Royal Motors",
      buyer: "Amit Verma",
      status: "Pending",
      responseTime: "—",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060A14] via-[#070B14] to-black p-10 text-gray-200">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Inquiry Logs
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Complete history of buyer inquiries & responses
        </p>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl
        border border-white/10 overflow-hidden">

        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.06] text-gray-400">
            <tr>
              <th className="px-6 py-4 text-left font-medium">Vehicle</th>
              <th className="px-6 py-4 text-left font-medium">Consultant</th>
              <th className="px-6 py-4 text-left font-medium">Buyer</th>
              <th className="px-6 py-4 text-left font-medium">Status</th>
              <th className="px-6 py-4 text-left font-medium">Response Time</th>
              <th className="px-6 py-4 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((i) => (
              <motion.tr
                key={i.id}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                className="border-t border-white/10"
              >
                <td className="px-6 py-4 font-medium">
                  {i.vehicle}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {i.consultant}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {i.buyer}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      i.status === "Responded"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {i.status}
                  </span>
                </td>

                <td className="px-6 py-4 flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {i.responseTime}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    className="inline-flex items-center gap-2 px-4 py-2
                    rounded-xl text-xs font-semibold
                    bg-blue-600/20 text-blue-300
                    hover:bg-blue-600/40 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View Chat
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
