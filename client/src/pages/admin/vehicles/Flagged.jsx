import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  User,
  ShieldAlert,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../../api/vehicle.api";

const Flagged = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlagged();
  }, []);

  const fetchFlagged = async () => {
    setLoading(true);
    try {
      const res = await getVehicles(1, "REJECTED");
      setVehicles(res?.data?.data || []);
    } catch (err) {
      console.error("Flagged fetch failed", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] p-8 text-gray-200">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-400" size={26} />
            Flagged Vehicles
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Vehicles rejected due to policy or trust issues
          </p>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl">
        <table className="w-full min-w-[800px] border-collapse">
          <thead className="bg-[#0E1424] text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Owner</th>
              <th className="px-6 py-4 text-left">Rejection Reason</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400">
                  Loading flagged vehicles...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400">
                  No flagged vehicles found
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/10 hover:bg-red-500/[0.04] transition"
                >
                  {/* VEHICLE */}
                  <td className="px-6 py-5">
                    <p className="font-semibold text-white">
                      {v.makerName} {v.modelName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {v.vehicleType || "Vehicle"}
                    </p>
                  </td>

                  {/* OWNER */}
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-500" />
                      {v.userMaster?.firstname || "Unknown"}
                    </div>
                  </td>

                  {/* REASON */}
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-400/20">
                      <ShieldAlert size={12} />
                      {v.rejectionReason || "REJECTED"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => navigate(`/admin/vehicles/${v.id}`)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition"
                      title="View Vehicle"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Flagged;
