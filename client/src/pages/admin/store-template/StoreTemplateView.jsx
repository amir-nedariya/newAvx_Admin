import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { getStoreTemplateById, softDeleteStoreTemplate } from "../../../api/storeTemplate.api";

const StoreTemplateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH TEMPLATE =================
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await getStoreTemplateById(id);
        setTemplate(res.data.data); // <-- FIXED: use .data.data
      } catch (err) {
        console.error(err);
        alert("Failed to fetch template");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate]);

  // ================= SOFT DELETE =================
  const handleSoftDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await softDeleteStoreTemplate(id);
      alert("Template deleted successfully");
      navigate("/admin/store-template");
    } catch (err) {
      console.error(err);
      alert("Failed to delete template");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-400 animate-pulse">Loading template details...</div>;
  if (!template)
    return <div className="p-6 text-red-400">Template not found</div>;

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-[#05070D] to-[#0A0F1F] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <ArrowLeft className="text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">{template.imageType}</h1>
            <p className="text-sm text-gray-400">ID: {template.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/admin/store-template/edit/${template.id}`)}
            disabled={template.status !== "ACTIVE"}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              template.status === "ACTIVE"
                ? "text-black bg-yellow-400 hover:bg-yellow-300"
                : "text-gray-400 bg-gray-700 cursor-not-allowed"
            }`}
          >
            Edit
          </button>

          <button
            onClick={handleSoftDelete}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-400 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* TEMPLATE INFO */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Info label="Type" value={template.imageType} />
        <Info label="Status" value={template.status} badge />
        <Info label="Default Template" value={template.isDefault ? "Yes" : "No"} />
        <Info
          label="Allowed Tiers"
          value={template.allowedTiers?.length
            ? template.allowedTiers.map(t => t.title).join(", ")
            : "All Tiers"}
        />
      </div>

      {/* IMAGE */}
      <div>
        <h2 className="text-lg font-medium text-white mb-3">Template Image</h2>
        {template.imageUrl ? (
          <img
            src={template.imageUrl}
            alt={template.imageType}
            className="rounded-2xl w-full max-h-96 object-contain bg-black/30"
          />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            No image
          </div>
        )}
      </div>
    </div>
  );
};

// ================= INFO COMPONENT =================
const Info = ({ label, value, badge }) => (
  <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    {badge ? (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
          value === "ACTIVE"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {value === "ACTIVE" ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
        {value}
      </span>
    ) : (
      <p className="text-sm text-gray-200 break-all">{value}</p>
    )}
  </div>
);

export default StoreTemplateView;
