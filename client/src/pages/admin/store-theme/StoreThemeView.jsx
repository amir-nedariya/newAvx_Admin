import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStoreThemeById,
  getSoftDeletedStoreThemeById,
} from "../../../api/storeTheme.api";
import { ArrowLeft, ShieldCheck, ShieldX } from "lucide-react";

/* ---------- SAFE JSON PARSE ---------- */
const safeJsonParse = (value) => {
  try {
    if (!value) return {};
    if (typeof value === "object") return value;
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const StoreThemeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await getStoreThemeById(id);
        setTheme(res.data);
      } catch {
        const res = await getSoftDeletedStoreThemeById(id);
        setTheme(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-gray-400 animate-pulse">
        Loading theme details...
      </div>
    );
  }

  if (!theme) {
    return <div className="p-6 text-red-400">Theme not found</div>;
  }

  const parsedSchema = safeJsonParse(theme.schema);

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-[#05070D] to-[#0A0F1F] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft className="text-gray-300" />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              {theme.name}
            </h1>
            <p className="text-sm text-gray-400">
              {theme.themeId}
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        {theme.status === "ACTIVE" && (
          <button
            onClick={() =>
              navigate(`/admin/store-theme/edit/${theme.id}`)
            }
            className="px-5 py-2 rounded-xl text-sm font-medium
            text-black bg-yellow-400 hover:bg-yellow-300 transition"
          >
            Edit Theme
          </button>
        )}
      </div>

      {/* BASIC INFO */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Info label="Theme ID" value={theme.themeId} />
        <Info label="Type" value={theme.type} />
        <Info label="Status" value={theme.status} badge />
        <Info
          label="Allowed Tiers"
          value={
            theme.allowedTiers?.length
              ? theme.allowedTiers.map(t => t.title).join(", ")
              : "All Tiers"
          }
        />
      </div>

      {/* IMAGES */}
      <div className="grid sm:grid-cols-2 gap-6">
        <ImageBox title="Thumbnail Image" src={theme.thumbnailUrl} />
        <ImageBox title="Preview Image" src={theme.previewUrl} />
      </div>

      {/* SCHEMA */}
      <div>
        <h2 className="text-lg font-medium text-white mb-3">
          Theme Schema
        </h2>
        <pre className="bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-gray-200 overflow-auto">
          {typeof parsedSchema === "string"
            ? parsedSchema
            : JSON.stringify(parsedSchema, null, 2)}
        </pre>
      </div>
    </div>
  );
};

/* ---------- SMALL COMPONENTS ---------- */

const Info = ({ label, value, badge }) => (
  <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    {badge ? (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs
        ${
          value === "ACTIVE"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {value === "ACTIVE" ? (
          <ShieldCheck size={14} />
        ) : (
          <ShieldX size={14} />
        )}
        {value}
      </span>
    ) : (
      <p className="text-sm text-gray-200 break-all">{value}</p>
    )}
  </div>
);

const ImageBox = ({ title, src }) => (
  <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
    <p className="text-xs text-gray-400 mb-3">{title}</p>
    {src ? (
      <img
        src={src}
        alt={title}
        className="rounded-xl max-h-72 object-contain bg-black/30"
      />
    ) : (
      <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
        No image
      </div>
    )}
  </div>
);

export default StoreThemeView;
