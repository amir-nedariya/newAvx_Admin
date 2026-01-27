import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoreTemplates } from "../../../api/storeTemplate.api";

const StoreTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchTemplates = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getStoreTemplates(page);
      setTemplates(res.data.data || []);
      setPageNo(res.data.pageResponse?.currentPage || 1);
      setTotalPages(res.data.pageResponse?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(pageNo);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-gray-400 animate-pulse">
          Loading store templates...
        </div>
      </div>
    );
  }

  // Empty state
  if (!templates.length) {
    return (
      <div className="p-12 flex flex-col items-center text-center gap-3 text-gray-400">
        <p>No store templates created yet</p>
        <button
          onClick={() => navigate("/admin/store-template/create")}
          className="mt-3 px-5 py-2 rounded-xl text-sm text-white
          bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 transition"
        >
          Create First Template
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#05070D] to-[#0A0F1F]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-white">Store Templates</h1>

        <button
          onClick={() => navigate("/admin/store-template/create")}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm text-white
          bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg hover:opacity-90 transition"
        >
          <Plus size={16} /> Create Template
        </button>
      </div>

      {/* Templates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.03 }}
            className="group bg-[#0B0F1A]/80 backdrop-blur border border-white/10
            rounded-3xl overflow-hidden shadow-xl transition"
          >
            {/* IMAGE CONTAINER */}
            <div className="relative w-full pb-[56.25%] overflow-hidden bg-black/10">
              <img
                src={template.imageUrl || "/placeholder.png"}
                alt={template.imageType}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />

              {/* Optional STATUS BADGE */}
              {template.status && (
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full
                  ${template.status === "ACTIVE"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {template.status}
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">
              <h2 className="text-white font-medium">{template.imageType}</h2>

              {/* ACTIONS */}
              <div className="flex justify-end items-center pt-2">
                <button
                  onClick={() => navigate(`/admin/store-template/view/${template.id}`)}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  <Eye size={16} /> View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => pageNo > 1 && fetchTemplates(pageNo - 1)}
            disabled={pageNo === 1}
            className={`px-4 py-2 rounded-xl text-white bg-gray-700/30 hover:bg-gray-700/50 transition ${pageNo === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Prev
          </button>
          <span className="text-gray-400">
            Page {pageNo} of {totalPages}
          </span>
          <button
            onClick={() => pageNo < totalPages && fetchTemplates(pageNo + 1)}
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

export default StoreTemplateList;
