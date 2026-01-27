import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getConsultantsByStatus } from "../../../api/consultationApi";

/* ================= ANIMATION ================= */
const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/* ================= STATUS UI ================= */
const verificationStyles = {
  REQUESTED: "bg-blue-500/10 text-blue-500 border border-blue-500/30",
};

const statusLabel = (s) => (s ? s.replace("_", " ") : "REQUESTED");

/* ================= MAPPER ================= */
const mapConsultant = (c) => ({
  id: c.id,
  name: c.consultationName || c.ownerName || "-",
  city: c.city || "-",
  state: c.state || "-",
  verificationStatus: c.verificationStatus || "REQUESTED",
  adminRemark: c.adminRemark || "", // ✅ IMPORTANT
  joined: c.createdAt ? new Date(c.createdAt).toDateString() : "-",
});

/* ================= COMPONENT ================= */
const Pending = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequested = async (pageNo = 1, search = "") => {
    setLoading(true);
    try {
      const res = await getConsultantsByStatus("REQUESTED", pageNo, search);

      const data = res.data?.data || [];
      const pageInfo = res.data?.pageResponse || {};

      setConsultants(data.map(mapConsultant));
      setPage(pageInfo.currentPage || 1);
      setTotalPages(pageInfo.totalPages || 1);
    } catch (e) {
      console.error(e);
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 API BASED SEARCH + PAGINATION */
  useEffect(() => {
    fetchRequested(page, searchText);
  }, [page, searchText]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Requested Consultants
          </h1>
          <p className="text-gray-400">
            Consultants waiting for verification
          </p>
        </div>

        <div className="bg-[#0E1424] border border-white/10 rounded-2xl px-5 py-4">
          <div className="relative w-64">
            <Search
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
            />
            <input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              placeholder="Search consultant..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F1A] border border-white/10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#0E1424] text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Consultant</th>
              <th className="px-6 py-3 text-left">City</th>
              <th className="px-6 py-3 text-left">State</th>
              <th className="px-6 py-3 text-center">Verification</th>
              <th className="px-6 py-3 text-center">Joined</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : consultants.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-400">
                  No requested consultants found
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
                  <td className="px-6 py-4 font-medium text-white">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{c.city}</td>
                  <td className="px-6 py-4 text-gray-300">{c.state}</td>

                  {/* ✅ VERIFICATION WITH RED NOTIFICATION */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`relative inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        verificationStyles[c.verificationStatus]
                      }`}
                      title={c.adminRemark || ""}
                    >
                      {statusLabel(c.verificationStatus)}

                      {c.verificationStatus === "REQUESTED" &&
                        c.adminRemark.trim() !== "" && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0B0F1A]" />
                        )}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center text-gray-400 text-sm">
                    {c.joined}
                  </td>

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

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <div className="flex items-center gap-3 bg-[#0E1424] border border-white/10 rounded-xl px-4 py-2">
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

export default Pending;
