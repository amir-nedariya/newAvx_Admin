import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getConsultantsByStatus, changeConsultantStatus } from "../../../api/consultationApi";

/* ================= CONSTANTS ================= */
const ALLOWED_STATUSES = ["REQUESTED", "REQUEST_CHANGES", "VERIFIED", "REJECTED"];

const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const verificationStyles = {
  VERIFIED: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
  REJECTED: "bg-red-500/10 text-red-500 border border-red-500/30",
  REQUESTED: "bg-blue-500/10 text-blue-500 border border-blue-500/30",
  REQUEST_CHANGES: "bg-amber-500/10 text-amber-500 border border-amber-500/30",
};

const statusLabel = (s) => (s ? s.replace("_", " ") : "REQUESTED");

/* ================= MAPPER ================= */
const mapConsultant = (c) => ({
  id: c.id,
  name: c.consultationName || c.ownerName || "-",
  city: c.city || "-",
  state: c.state || "-",
  active: c.status === "ACTIVE",
  verificationStatus: c.verificationStatus || "REQUESTED",
  adminRemark: c.adminRemark || "", // 🔴 IMPORTANT for red dot
  joined: c.verifiedAt
    ? new Date(c.verifiedAt).toDateString()
    : new Date(c.createdAt).toDateString(),
});

/* ================= COMPONENT ================= */
const AllConsultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  /* ================= FETCH ================= */
  const fetchConsultants = async (status, pageNo, search) => {
    setLoading(true);
    try {
      const res = await getConsultantsByStatus(status, pageNo, search);
      const data = res.data?.data || [];
      const pageInfo = res.data?.pageResponse || {};

      setConsultants(data.map(mapConsultant));
      setTotalPages(pageInfo.totalPages || 1);
      setTotalElements(pageInfo.totalElements || data.length);
    } catch (err) {
      console.error(err);
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchConsultants(activeStatusFilter, page, searchText);
  }, [activeStatusFilter, page, searchText]);

  /* ================= STATUS TOGGLE ================= */
  const handleStatusToggle = async (consultant) => {
    try {
      await changeConsultantStatus(consultant.id, consultant.active);
      setConsultants((prev) =>
        prev.map((c) => (c.id === consultant.id ? { ...c, active: !c.active } : c))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Consultants</h1>
          <p className="text-gray-400">Search or filter by status</p>
        </div>

        <div className="flex items-center gap-4 bg-[#0E1424] border border-white/10 rounded-2xl px-4 py-3">
          <div className="relative w-64">
            <Search size={16} className="absolute top-3 left-3 text-gray-500" />
            <input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              placeholder="Search consultant..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F1A] border border-white/10 text-sm text-gray-200"
            />
          </div>

          <select
            value={activeStatusFilter}
            onChange={(e) => {
              setActiveStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-[#0B0F14] border border-white/10 text-sm"
          >
            <option value="ALL">All Statuses</option>
            {ALLOWED_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#0E1424] text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Consultant</th>
              <th className="px-6 py-3 text-left">City</th>
              <th className="px-6 py-3 text-left">State</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Verification</th>
              <th className="px-6 py-3 text-center">Joined</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : consultants.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">
                  No consultants found
                </td>
              </tr>
            ) : (
              consultants.map((c) => (
                <motion.tr
                  key={c.id}
                  variants={rowAnim}
                  initial="hidden"
                  animate="show"
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{c.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{c.state}</td>

                  {/* STATUS TOGGLE */}
                  <td className="px-6 py-4 text-center">
                    <div
                      onClick={() => handleStatusToggle(c)}
                      className={`relative w-11 h-6 rounded-full cursor-pointer ${
                        c.active ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      <span
                        className={`absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white transition-transform ${
                          c.active ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </td>

                  {/* VERIFICATION WITH RED DOT */}
                  <td className="px-6 py-4 text-center">
                 <span
                  className={`relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                 c.verificationStatus === "REQUEST_CHANGES"
                    ? "bg-[#1C1C1C] text-amber-500 border border-amber-500/30"
                      : verificationStyles[c.verificationStatus]
                      }`}
                      title={c.adminRemark || ""}
                          >
                    {statusLabel(c.verificationStatus)}

                    {c.verificationStatus === "REQUESTED" && c.adminRemark.trim() !== "" && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0B0F1A]" />
                   )}
                   </span>
                   </td>


                  <td className="px-6 py-4 text-center text-gray-400 text-sm">{c.joined}</td>

                  <td className="px-6 py-4 text-center">
                    <NavLink
                      to={`/admin/consultants/review/${c.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      <Eye size={18} />
                    </NavLink>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <div className="flex items-center gap-3 bg-[#0E1424] border border-white/10 rounded-xl px-4 py-2">
            <span className="text-sm text-gray-400">Total {totalElements}</span>

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllConsultants;
