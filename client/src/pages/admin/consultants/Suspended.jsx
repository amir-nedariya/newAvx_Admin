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

/* ================= STYLES ================= */
const verificationStyles = {
  REJECTED: "bg-red-500/10 text-red-500 border border-red-500/30",
};

const statusLabel = () => "REJECTED";

/* ================= MAPPER ================= */
const mapConsultant = (c) => ({
  id: c.id,
  name: c.consultationName || c.ownerName || "-",
  city: c.city || "-",
  state: c.state || "-",
  joined: c.createdAt ? new Date(c.createdAt).toDateString() : "-",
});

/* ================= COMPONENT ================= */
const Suspended = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= FETCH ================= */
  const fetchRejected = async (pageNo = 1, search = "") => {
    setLoading(true);
    try {
      const res = await getConsultantsByStatus(
        "REJECTED",
        pageNo,
        search
      );

      const data = res.data?.data || [];
      const pageInfo = res.data?.pageResponse || {};

      setConsultants(data.map(mapConsultant));
      setPage(pageInfo.currentPage || 1);
      setTotalPages(pageInfo.totalPages || 1);
    } catch (err) {
      console.error(err);
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchRejected(1, "");
  }, []);

  /* ================= SEARCH EFFECT ================= */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRejected(1, searchText);
    }, 400); // smooth typing experience

    return () => clearTimeout(delay);
  }, [searchText]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Rejected Consultants
          </h1>
          <p className="text-gray-400">
            Consultants rejected by admin
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0E1424] border border-white/10 rounded-2xl px-4 py-3">
          <div className="relative w-64">
            <Search
              size={16}
              className="absolute top-3 left-3 text-gray-500"
            />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name / city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F1A] border border-white/10 text-sm focus:outline-none focus:border-[#50A2FF]"
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
                  No rejected consultants found
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

                  <td className="px-6 py-4 text-sm text-gray-300">
                    {c.city}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-300">
                    {c.state}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${verificationStyles.REJECTED}`}
                    >
                      {statusLabel()}
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
              onClick={() => fetchRejected(page - 1, searchText)}
              className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => fetchRejected(page + 1, searchText)}
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

export default Suspended;
