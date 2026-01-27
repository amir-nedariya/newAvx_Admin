import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { getConsultantsByStatus } from "../../../api/consultationApi";

/* ================= ANIMATION ================= */
const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

/* ================= STYLES ================= */
const verificationStyles = {
  VERIFIED: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30",
};

/* ================= MAPPER ================= */
const mapConsultant = (c) => ({
  id: c.id,
  name: c.consultationName || c.ownerName || "-",
  city: c.city || "-",
  state: c.state || "-",
  joined: c.verifiedAt
    ? new Date(c.verifiedAt).toDateString()
    : new Date(c.createdAt).toDateString(),
});

/* ================= COMPONENT ================= */
const ActiveConsultants = ({ statusFilter = "VERIFIED" }) => {
  const [consultants, setConsultants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchConsultants = async (pageNo = 1, search = "") => {
    setLoading(true);
    try {
      const res = await getConsultantsByStatus(
        statusFilter,
        pageNo,
        search
      );

      const data = res.data?.data || [];
      const pageInfo = res.data?.pageResponse || {};

      setConsultants(data.map(mapConsultant));
      setTotalPages(pageInfo.totalPages || 1);
    } catch (err) {
      console.error(err);
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 API BASED SEARCH + PAGINATION */
  useEffect(() => {
    fetchConsultants(page, searchText);
  }, [statusFilter, page, searchText]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Verified Consultants
          </h1>
          <p className="text-gray-400">
            Only verified consultants are listed here
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#0E1424] border border-white/10 rounded-2xl px-4 py-3">
          <input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1); // ✅ reset page on search
            }}
            placeholder="Search consultant..."
            className="w-64 pl-4 pr-4 py-2 rounded-xl bg-[#0B0F1A] border border-white/10 text-sm text-gray-200"
          />
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
              <th className="px-6 py-3 text-center">Verification</th>
              <th className="px-6 py-3 text-center">Joined</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : consultants.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  No verified consultants found
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

                  {/* Verification */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${verificationStyles.VERIFIED}`}
                    >
                      VERIFIED
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center text-gray-400 text-sm">
                    {c.joined}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    <NavLink
                      to={`/admin/consultants/review/${c.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
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
        <div className="flex justify-end mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
          >
            &lt;
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveConsultants;
