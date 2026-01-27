// src/pages/admin/vehicle/Live.jsx
import React, { useEffect, useState } from "react";
import {
  Eye,
  MapPin,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVehicles, getVehicleAddress } from "../../../api/vehicle.api";

const Live = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  /* ================= FETCH LIVE VEHICLES ================= */
  const fetchLiveVehicles = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await getVehicles(pageNo, "VERIFIED");
      const list = res?.data?.data || [];
      const pageInfo = res?.data?.pageResponse || {};

      const enriched = await Promise.all(
        list.map(async (v) => {
          try {
            const addr = await getVehicleAddress(v.id);
            return { ...v, vehicleAddress: addr?.data?.data || {} };
          } catch {
            return { ...v, vehicleAddress: {} };
          }
        })
      );

      setVehicles(enriched);
      setFilteredVehicles(enriched);
      setPage(pageInfo.currentPage || 1);
      setTotalPages(pageInfo.totalPages || 1);
      setTotalElements(pageInfo.totalElements || enriched.length);
    } catch (err) {
      console.error(err);
      setVehicles([]);
      setFilteredVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveVehicles(page);
  }, [page]);

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVehicles(vehicles);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredVehicles(
        vehicles.filter(
          (v) =>
            `${v.makerName} ${v.modelName}`.toLowerCase().includes(q) ||
            v.userMaster?.firstname?.toLowerCase().includes(q) ||
            v.vehicleAddress?.cityName?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchTerm, vehicles]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Vehicles</h1>
          <p className="text-gray-400">
            Vehicles currently active & verified
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-64">
          <Search size={18} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicle, owner, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0E1424] border border-white/20 rounded-xl text-sm outline-none hover:border-blue-400 transition"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-lg">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-[#0E1424] text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Vehicle</th>
              <th className="px-6 py-3 text-left">Owner</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Inspection</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-gray-400">
                  Loading live vehicles...
                </td>
              </tr>
            ) : filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-gray-400">
                  No live vehicles found
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/10 hover:bg-white/[0.04] transition"
                >
                  {/* VEHICLE */}
                  <td className="px-6 py-4 align-middle">
                    <div className="font-semibold text-white">
                      {v.makerName} {v.modelName}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {v.vehicleType?.replace("_", " ")}
                    </div>
                  </td>

                  {/* OWNER */}
                  <td className="px-6 py-4 align-middle">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-500" />
                      {v.userMaster?.firstname || "-"}
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td className="px-6 py-4 align-middle">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-500" />
                      {v.vehicleAddress?.cityName || "-"}
                    </div>
                  </td>

                  {/* INSPECTION */}
                  <td className="px-6 py-4 align-middle">
                    <div className="inline-flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle size={14} />
                      COMPLETED
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-center align-middle">
                    <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-400/20">
                      VERIFIED
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-center align-middle">
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <div className="flex items-center gap-3 bg-[#0E1424] border border-white/10 rounded-xl px-4 py-2">
            <span className="text-sm text-gray-400">
              Total: {totalElements}
            </span>

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Live;
