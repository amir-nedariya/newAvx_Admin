import { useEffect, useState } from "react";
import {
  getInspectionBadges,
  getInspectionStatusList,
  createInspectionBadge,
  updateInspectionBadge,
} from "../../../api/inspectionBadge.api";
import {
  UploadCloud,
  ImageIcon,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion } from "framer-motion";

/* ================= FORMAT LABEL ================= */
const formatLabel = (text = "") =>
  text
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const Badge = () => {
  const [statuses, setStatuses] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState({});
  const [viewMode, setViewMode] = useState("list"); 

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const statusRes = await getInspectionStatusList();
      const badgeRes = await getInspectionBadges();

      setStatuses(statusRes?.data?.data || []);
      setBadges(badgeRes?.data?.data || []);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e, status) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const existing = badges.find(
      (b) => b.inspectionStatus === status
    );

    const formData = new FormData();
    setLoadingStatus((p) => ({ ...p, [status]: true }));

    try {
      let res;

      if (existing?.id) {
        formData.append("image", file);
        res = await updateInspectionBadge(existing.id, formData);
      } else {
        formData.append("inspectionStatus", status);
        formData.append("badge", file);
        res = await createInspectionBadge(formData);
      }

      const updated = res?.data?.data;

      setBadges((prev) => {
        const idx = prev.findIndex(
          (b) => b.inspectionStatus === updated.inspectionStatus
        );
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        }
        return [...prev, updated];
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setLoadingStatus((p) => ({ ...p, [status]: false }));
    }
  };

  const getImage = (status) =>
    badges.find((b) => b.inspectionStatus === status)?.badgeUrl;

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-[#0B0F1A] text-white">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-wide">
            Inspection Badges
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Manage inspection status badges used across the platform
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex items-center bg-[#0E1424] border border-white/10 rounded-xl p-1">
        <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm
              ${
                viewMode === "list"
                  ? "bg-[#50A2FF] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            <List size={16} />
            {/* List */}
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm
              ${
                viewMode === "grid"
                  ? "bg-[#50A2FF] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            <LayoutGrid size={16} />
            {/* Grid */}
          </button>
        </div>
      </div>

      {/* ================= GRID VIEW ================= */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((status) => {
            const image = getImage(status);
            const loading = loadingStatus[status];

            return (
              <motion.div
                key={status}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="bg-gradient-to-b from-[#11162A] to-[#0A0E1C]
                  border border-white/10 rounded-2xl p-6
                  shadow-[0_10px_30px_rgba(0,0,0,0.6)]
                  flex flex-col items-center"
              >
                <h2 className="mb-4 font-semibold text-lg">
                  {formatLabel(status)}
                </h2>

                <div className="w-28 h-28 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center overflow-hidden mb-4">
                  {image ? (
                    <img src={image} alt={status} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={28} />
                      <span className="text-xs mt-1">No Badge</span>
                    </div>
                  )}
                </div>

                <label
                  className={`mt-auto w-full flex items-center justify-center gap-2
                    px-4 py-2 rounded-xl text-sm font-medium cursor-pointer
                    ${
                      loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-[#50A2FF] hover:opacity-90"
                    }`}
                >
                  <UploadCloud size={16} />
                  {loading ? "Uploading..." : image ? "Update Badge" : "Upload Badge"}
                  <input
                    type="file"
                    hidden
                    disabled={loading}
                    onChange={(e) => handleUpload(e, status)}
                  />
                </label>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ================= LIST VIEW ================= */}
      {viewMode === "list" && (
        <div className="overflow-x-auto border border-white/10 rounded-xl">
          <table className="w-full">
            <thead className="bg-[#0E1424] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Badge</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {statuses.map((status) => {
                const image = getImage(status);
                const loading = loadingStatus[status];

                return (
                  <tr
                    key={status}
                    className="border-t border-white/10 hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-medium">
                      {formatLabel(status)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {image ? (
                        <img
                          src={image}
                          alt={status}
                          className="w-12 h-12 mx-auto rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No Badge
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <label
                        className={`inline-flex items-center gap-2 px-4 py-2
                          rounded-lg text-sm cursor-pointer
                          ${
                            loading
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-[#50A2FF] hover:opacity-90"
                          }`}
                      >
                        <UploadCloud size={14} />
                        {loading ? "Uploading..." : image ? "Update" : "Upload"}
                        <input
                          type="file"
                          hidden
                          disabled={loading}
                          onChange={(e) => handleUpload(e, status)}
                        />
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Badge;
