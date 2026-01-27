// src/pages/admin/vehicle/Sold.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Eye } from "lucide-react";
import { getVehicles } from "../../../api/vehicle.api";

const Sold = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SOLD VEHICLES ================= */
  const loadSoldVehicles = async () => {
    setLoading(true);
    try {
      // Backend returns VERIFIED vehicles
      const res = await getVehicles(1, "VERIFIED");

      // Filter frontend-side for only sold vehicles
      const soldOnly = (res.data?.data || []).filter(
        (v) => v.isVehicleSold === true
      );

      setVehicles(soldOnly);
    } catch (error) {
      console.error("Sold vehicle fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoldVehicles();
  }, []);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B14] text-gray-400">
        Loading sold vehicles...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] px-10 py-10 text-gray-200">
      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-12">
        Sold Vehicles
      </h1>

      {/* EMPTY STATE */}
      {vehicles.length === 0 ? (
        <p className="text-center text-gray-400">
          No sold vehicles found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <motion.div
              key={v.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between"
            >
              {/* VEHICLE INFO */}
              <div className="flex items-start gap-4">
                <img
                  src={v.thumbnailUrl}
                  alt={`${v.makerName} ${v.modelName}`}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">
                    {v.makerName} {v.modelName} ({v.variantName})
                  </h2>
                  <p className="text-sm text-gray-400">
                    Consultant: {v.userMaster?.firstname || "-"}{" "}
                    {v.userMaster?.lastname || ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Vehicle ID: {v.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Type: {v.vehicleType} / {v.vehicleSubType} | Year: {v.yearOfMfg}
                  </p>
                  <p className="text-xs text-gray-400">
                    Price: ₹{v.price?.toLocaleString()} | KM Driven: {v.kmDriven?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Fuel: {v.fuelType} | Transmission: {v.transmissionType}
                  </p>
                  <p className="text-xs text-gray-400">
                    Spare Key: {v.spareKey ? "Yes" : "No"} | Spare Wheel: {v.spareWheel ? "Yes" : "No"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Test Drive Available: {v.testDriveAvl ? "Yes" : "No"} | Last Service: {new Date(v.lastServiceDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* STATUS & ACTION */}
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 bg-emerald-400 text-black px-4 py-2 rounded-full text-xs font-semibold">
                  <CheckCircle2 size={14} />
                  SOLD
                </span>

                <button
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  onClick={() => console.log("View vehicle", v.id)}
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sold;
