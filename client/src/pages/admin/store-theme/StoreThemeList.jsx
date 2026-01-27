import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye, Plus, Palette } from "lucide-react";
import { getStoreThemes, softDeleteStoreTheme } from "../../../api/storeTheme.api";
import { useNavigate } from "react-router-dom";

const StoreThemeList = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch themes with pagination
  const fetchThemes = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getStoreThemes(page);
      setThemes(res.data || []);
      setPageNo(res.pageResponse?.currentPage || 1);
      setTotalPages(res.pageResponse?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching themes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes(pageNo);
  }, []);

  // Soft delete
  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this theme?")) return;
    await softDeleteStoreTheme(id);
    fetchThemes(pageNo);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pageNo > 1) fetchThemes(pageNo - 1);
  };
  const handleNextPage = () => {
    if (pageNo < totalPages) fetchThemes(pageNo + 1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-gray-400 animate-pulse">
          Loading store themes...
        </div>
      </div>
    );
  }

  // Empty state
  if (!themes.length) {
    return (
      <div className="p-12 flex flex-col items-center text-center gap-3 text-gray-400">
        <Palette size={36} />
        <p>No store themes created yet</p>
        <button
          onClick={() => navigate("/admin/store-theme/create")}
          className="mt-3 px-5 py-2 rounded-xl text-sm text-white
          bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition"
        >
          Create First Theme
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#05070D] to-[#0A0F1F]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-white">Store Themes</h1>

        <button
          onClick={() => navigate("/admin/store-theme/create")}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm text-white
          bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Create Theme
        </button>
      </div>

      {/* Themes grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.03 }}
            className="group bg-[#0B0F1A]/80 backdrop-blur border border-white/10
            rounded-3xl overflow-hidden shadow-xl transition"
          >
            {/* IMAGE CONTAINER */}
            <div className="relative w-full pb-[56.25%] overflow-hidden bg-black/10">
              <img
                src={theme.thumbnailUrl || "/placeholder.png"}
                alt={theme.name}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />

              {/* STATUS BADGE */}
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full
                  ${theme.status === "ACTIVE"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  }`}
              >
                {theme.status}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">
              <h2 className="text-white font-medium">{theme.name}</h2>

              {/* ACTIONS */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => navigate(`/admin/store-theme/view/${theme.id}`)}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  <Eye size={16} /> View
                </button>

                {theme.status === "ACTIVE" && (
                  <button
                    onClick={() => handleSoftDelete(theme.id)}
                    className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} /> Soft Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={pageNo === 1}
            className={`px-4 py-2 rounded-xl text-white bg-gray-700/30 hover:bg-gray-700/50 transition ${pageNo === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Prev
          </button>
          <span className="text-gray-400">
            Page {pageNo} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pageNo === totalPages}
            className={`px-4 py-2 rounded-xl text-white bg-gray-700/30 hover:bg-gray-700/50 transition ${pageNo === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreThemeList;
