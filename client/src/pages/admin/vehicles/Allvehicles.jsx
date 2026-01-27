import React, { useEffect, useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../../api/vehicle.api";

/* ================= CONSTANTS ================= */
const VERIFICATION_OPTIONS = [
  "ALL",
  "REQUESTED",
  "REQUEST_CHANGES",
  "VERIFIED",
  "REJECTED",
];

const getStatusBadge = (status) => {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-500/20 text-emerald-400";
    case "REJECTED":
      return "bg-red-500/20 text-red-400";
    case "REQUESTED":
      return "bg-yellow-500/20 text-yellow-400";
    case "REQUEST_CHANGES":
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

/* ================= COMPONENT ================= */
const AllVehicles = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  /* ================= FETCH VEHICLES ================= */
  const fetchVehicles = async (pageNo = 1, status = "ALL") => {
    setLoading(true);
    setError("");

    try {
      const statusParam = status === "ALL" ? undefined : status;
      const res = await getVehicles(pageNo, statusParam);

      const data = res?.data?.data || [];
      const pageInfo = res?.data?.pageResponse || {};

      setVehicles(data);
      setFilteredVehicles(data);
      setPage(pageInfo.currentPage || 1);
      setTotalPages(pageInfo.totalPages || 1);
      setTotalElements(pageInfo.totalElements || data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(page, verificationStatus);
  }, [verificationStatus, page]);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVehicles(vehicles);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = vehicles.filter(
        (v) =>
          v.makerName.toLowerCase().includes(term) ||
          v.modelName.toLowerCase().includes(term) ||
          v.userMaster?.firstname.toLowerCase().includes(term) ||
          v.userMaster?.lastname.toLowerCase().includes(term) ||
          v.vehicleType.toLowerCase().includes(term)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchTerm, vehicles]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* HEADER & FILTER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Vehicle Management</h1>
          <p className="text-gray-400">Search or filter by verification status</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <input
            type="text"
            placeholder="Search by Vehicle, Owner, Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0E1424] border border-white/20 rounded-xl px-4 py-2 text-sm outline-none w-full sm:w-64 hover:border-blue-400 transition"
          />

          <select
            value={verificationStatus}
            onChange={(e) => {
              setVerificationStatus(e.target.value);
              setPage(1);
            }}
            className="bg-[#0E1424] border border-white/20 rounded-xl px-4 py-2 text-sm outline-none hover:border-blue-400 transition"
          >
            {VERIFICATION_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-lg">
        <table className="w-full min-w-[900px] text-left border-collapse">
          {/* HEADER */}
          <thead className="bg-[#0E1424] text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Vehicle</th>
              <th className="px-6 py-3 text-left">Owner</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  Loading vehicles...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-red-400">
                  {error}
                </td>
              </tr>
            ) : filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No vehicles found
                </td>
              </tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium">{v.makerName} {v.modelName}</td>
                  <td className="px-6 py-4">{v.userMaster?.firstname} {v.userMaster?.lastname}</td>
                  <td className="px-6 py-4">{v.vehicleType.replace("_", " ")}</td>
                  <td className="px-6 py-4">{v.yearOfMfg}</td>
                  <td className="px-6 py-4">₹{v.price?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(v.verificationStatus)}`}>
                      {v.verificationStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/admin/vehicles/${v.id}`)}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
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
            <span className="text-sm text-gray-400">Total: {totalElements}</span>
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

export default AllVehicles;
