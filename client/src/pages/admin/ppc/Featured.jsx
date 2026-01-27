import React from "react";
import { Star, Shuffle, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

const Featured = () => {
  const slots = [
    {
      id: 1,
      city: "Ahmedabad",
      category: "SUV",
      slots: 3,
      assigned: ["Adarsh Auto", "Metro Motors"],
    },
    {
      id: 2,
      city: "Mumbai",
      category: "Sedan",
      slots: 5,
      assigned: ["Royal Motors", "City Cars"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] px-6 py-10 text-white">
      {/* HEADER */}
      <div className="mb-14 flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Featured Slots
        </h1>
        <p className="text-gray-400 max-w-xl">
          Assign, rotate and manage premium slots for consultants across cities
        </p>
      </div>

      {/* CARDS */}
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {slots.map((s) => (
          <motion.div
            key={s.id}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
          >
            {/* HEADER ROW */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-medium">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  {s.city}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{s.category}</p>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
                <Star className="h-4 w-4" />
                {s.slots}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-5 h-px bg-white/10" />

            {/* CONSULTANTS */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-300">
                <Users className="h-4 w-4" />
                Assigned Consultants
              </div>

              <div className="flex flex-wrap gap-2">
                {s.assigned.map((name, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-[#1F2937] px-3 py-1.5 text-sm text-gray-200 hover:bg-blue-500/20 transition"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-6 flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium hover:bg-blue-700 transition"
              >
                Assign Slot
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 hover:bg-white/5 transition"
              >
                <Shuffle className="h-5 w-5 text-gray-300" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
