import React, { useEffect, useState } from "react";
import { Eye, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../../api/vehicle.api";

const Drafts = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequested();
  }, []);

  const fetchRequested = async () => {
    setLoading(true);
    try {
      const res = await getVehicles(1, "REQUESTED");
      setVehicles(res?.data?.data || []);
    } catch (err) {
      console.error(err);
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
          <h1 className="text-3xl font-bold text-white">
            Requested Vehicles
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Vehicles waiting for admin verification
          </p>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl">
        <table className="w-full min-w-[700px] border-collapse">
          <thead className="bg-[#0E1424] text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4 text-left">Vehicle</th>
              <th className="px-6 py-4 text-left">Owner</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400">
                  Loading requested vehicles...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400">
                  No requested vehicles found
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/10 hover:bg-white/[0.04] transition"
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

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-400/20">
                      <Clock size={12} />
                      REQUESTED
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => navigate(`/admin/vehicles/${v.id}`)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/15 hover:text-blue-400 transition"
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

export default Drafts;
