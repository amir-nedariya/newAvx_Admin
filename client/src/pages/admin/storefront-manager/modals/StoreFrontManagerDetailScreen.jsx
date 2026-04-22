import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Store,
  Calendar,
  Users,
  Eye,
  Image as ImageIcon,
  Edit,
  Trash2,
  Upload,
  X,
  Plus,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getStoreThemeById, deleteStoreTheme, updateStoreTheme } from "../../../../api/storeTheme.api";
import { getAllTierPlans } from "../../../../api/tierPlan.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const safeText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const StoreFrontManagerDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [originalEditData, setOriginalEditData] = useState(null);
  const [editFormData, setEditFormData] = useState({
    themeId: "",
    type: "",
    name: "",
    thumbnail: null,
    preview: null,
    schema: "",
    allowedTierIds: [],
    status: "ACTIVE",
  });
  const [editThumbnailPreview, setEditThumbnailPreview] = useState(null);
  const [editPreviewImagePreview, setEditPreviewImagePreview] = useState(null);
  const [tierPlans, setTierPlans] = useState([]);

  useEffect(() => {
    const fetchThemeDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getStoreThemeById(id);
        const responseData = res?.data || res;
        setTheme(responseData);
      } catch (err) {
        console.error("Failed to fetch theme details:", err);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load theme details"
        );
        toast.error("Failed to load theme details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchThemeDetails();
    }
  }, [id]);

  // Fetch tier plans
  useEffect(() => {
    const fetchTierPlans = async () => {
      try {
        const res = await getAllTierPlans();
        if (res.status === "OK") {
          setTierPlans(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch tier plans:", error);
      }
    };
    fetchTierPlans();
  }, []);

  const handleImagePreview = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setShowImagePreview(true);
  };

  const handleUpdateTheme = () => {
    if (!theme) return;

    const initialData = {
      themeId: theme.themeId || "",
      type: theme.type || "",
      name: theme.name || "",
      thumbnail: null,
      preview: null,
      schema: typeof theme.schema === "string" ? theme.schema : JSON.stringify(theme.schema, null, 2),
      allowedTierIds: theme.allowedTiers?.map(tier => tier.id) || [],
      status: theme.status || "ACTIVE",
    };

    setEditFormData(initialData);
    setOriginalEditData(initialData);
    setEditThumbnailPreview(theme.thumbnailUrl || null);
    setEditPreviewImagePreview(theme.previewUrl || null);
    setEditModalOpen(true);
  };

  // Check if edit form has changes
  const hasEditChanges = () => {
    if (!originalEditData) return false;

    if (editFormData.themeId !== originalEditData.themeId) return true;
    if (editFormData.type !== originalEditData.type) return true;
    if (editFormData.name !== originalEditData.name) return true;
    if (editFormData.schema !== originalEditData.schema) return true;
    if (editFormData.status !== originalEditData.status) return true;
    if (editFormData.thumbnail !== null) return true;
    if (editFormData.preview !== null) return true;

    const originalTiers = [...originalEditData.allowedTierIds].sort();
    const currentTiers = [...editFormData.allowedTierIds].sort();
    if (originalTiers.length !== currentTiers.length) return true;
    if (!originalTiers.every((id, index) => id === currentTiers[index])) return true;

    return false;
  };

  // Handle edit tier selection
  const handleEditTierToggle = (tierId) => {
    setEditFormData((prev) => {
      const newTierIds = prev.allowedTierIds.includes(tierId)
        ? prev.allowedTierIds.filter((id) => id !== tierId)
        : [...prev.allowedTierIds, tierId];
      return { ...prev, allowedTierIds: newTierIds };
    });
  };

  // Handle edit file input change
  const handleEditFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({ ...editFormData, [fieldName]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === "thumbnail") {
          setEditThumbnailPreview(reader.result);
        } else if (fieldName === "preview") {
          setEditPreviewImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle update theme submit
  const handleUpdateThemeSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.themeId.trim()) {
      toast.error("Theme ID is required");
      return;
    }
    if (!editFormData.type.trim()) {
      toast.error("Type is required");
      return;
    }
    if (!editFormData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!editFormData.schema.trim()) {
      toast.error("Schema is required");
      return;
    }
    if (editFormData.allowedTierIds.length === 0) {
      toast.error("Please select at least one tier plan");
      return;
    }

    try {
      setEditLoading(true);

      const data = new FormData();
      data.append("themeId", editFormData.themeId);
      data.append("type", editFormData.type);
      data.append("name", editFormData.name);

      if (editFormData.thumbnail) {
        data.append("thumbnail", editFormData.thumbnail);
      }
      if (editFormData.preview) {
        data.append("preview", editFormData.preview);
      }

      data.append("schema", editFormData.schema);
      data.append("status", editFormData.status);

      editFormData.allowedTierIds.forEach((id) => {
        data.append("allowedTierIds", id);
      });

      await updateStoreTheme(id, data);
      toast.success("Theme updated successfully!");

      setEditModalOpen(false);

      // Refresh theme data
      const res = await getStoreThemeById(id);
      const responseData = res?.data || res;
      setTheme(responseData);
    } catch (error) {
      console.error("Failed to update theme:", error);
      toast.error(error?.response?.data?.message || "Failed to update theme");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTheme = async () => {
    setIsDeleting(true);
    try {
      await deleteStoreTheme(id);
      toast.success("Theme deleted successfully");
      setTimeout(() => {
        navigate("/admin/storefront-manager/themes");
      }, 1000);
    } catch (err) {
      console.error("Failed to delete theme:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete theme"
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          <p className="text-sm font-semibold text-slate-600">
            Loading theme details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Theme Not Found</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          {error || "The theme you are looking for does not exist."}
        </p>
        <button
          onClick={() => navigate("/admin/storefront-manager/themes")}
          className="mt-6 flex items-center gap-2 text-sky-600 font-bold hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Storefront Manager
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#0f172a",
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            fontSize: "13px",
            fontWeight: 600,
          },
        }}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/storefront-manager/themes")}
                className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Theme Details
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  View theme information and preview
                </p>
              </div>
            </div>

            {/* Admin Action Buttons - Hide when status is DELETED */}
            {theme?.status !== "DELETED" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpdateTheme}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md active:scale-95"
                >
                  <Edit className="h-4 w-4" />
                  Update Theme
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-700 hover:shadow-md active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Theme
                </button>
              </div>
            )}
          </div>

          {/* Theme Info Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Thumbnail */}
              <div className="shrink-0">
                <button
                  onClick={() => theme.thumbnailUrl && handleImagePreview(theme.thumbnailUrl)}
                  disabled={!theme.thumbnailUrl}
                  className={cls(
                    "relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-lg transition-all",
                    theme.thumbnailUrl && "cursor-pointer hover:shadow-xl hover:scale-105 active:scale-100"
                  )}
                >
                  {theme.thumbnailUrl ? (
                    <img
                      src={theme.thumbnailUrl}
                      alt={theme.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400">
                      <Store className="h-12 w-12" />
                    </div>
                  )}
                  {theme.thumbnailUrl && (
                    <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                  )}
                </button>
              </div>

              {/* Info Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">
                    Theme Name
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Store className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-base font-bold text-slate-900 leading-tight">
                      {safeText(theme.name)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">
                    Theme ID
                  </div>
                  <div className="text-[15px] font-mono font-semibold text-slate-700 leading-tight">
                    {safeText(theme.themeId)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">
                    Type
                  </div>
                  <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                    {safeText(theme.type)}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">
                    Status
                  </div>
                  <span
                    className={cls(
                      "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-extrabold border",
                      theme.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-rose-100 text-rose-700 border-rose-200"
                    )}
                  >
                    {safeText(theme.status)}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">
                    Usage Count
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-base font-bold text-slate-900 leading-tight">
                      {theme.usageCount || 0}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">
                    Created At
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-[15px] font-semibold text-slate-700 leading-tight">
                      {theme.createdAt
                        ? new Date(theme.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allowed Tiers Section */}
            {theme.allowedTiers && theme.allowedTiers.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
                  Allowed Tier Plans
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {theme.allowedTiers.map((tier) => (
                    <span
                      key={tier.id}
                      className="inline-flex items-center rounded-lg border-2 border-sky-200 bg-sky-50 px-4 py-2 text-sm font-extrabold text-sky-700"
                    >
                      {tier.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Image Section */}
          {theme.previewUrl && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Theme Thumbnail</h2>
                  <p className="text-sm text-slate-500">Full preview of the theme thumbnail</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                <img
                  src={theme.thumbnailUrl}
                  alt={`${theme.name} preview`}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* Schema Section */}
          {theme.schema && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Theme Schema</h2>
                  <p className="text-sm text-slate-500">Configuration and structure</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <pre className="text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap break-words">
                  {typeof theme.schema === "string"
                    ? theme.schema
                    : JSON.stringify(theme.schema, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                  <Trash2 className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Delete Theme</h3>
                  <p className="mt-1 text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this theme? All data associated with this theme will be permanently removed.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTheme}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Theme
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <>
          <div
            className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowImagePreview(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[121] w-[95vw] max-w-5xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Image Preview</h3>
              <button
                onClick={() => setShowImagePreview(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-slate-50">
              <div className="flex items-center justify-center min-h-full">
                <img
                  src={previewImageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= EDIT THEME MODAL ================= */}
      {editModalOpen && theme && (
        <>
          <div
            className="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !editLoading && setEditModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[131] w-[95%] max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                  <Edit className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Edit Theme</h3>
                  <p className="mt-1 text-sm text-slate-500">Update theme information</p>
                </div>
              </div>

              <button
                onClick={() => !editLoading && setEditModalOpen(false)}
                disabled={editLoading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateThemeSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Theme ID and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Theme ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.themeId}
                      onChange={(e) => setEditFormData({ ...editFormData, themeId: e.target.value })}
                      placeholder="e.g., theme-001"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Type <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.type}
                      onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                      placeholder="e.g., Modern, Classic"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Theme Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Enter theme name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                {/* Thumbnail and Preview Images */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Thumbnail (optional - leave empty to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditFileChange(e, "thumbnail")}
                        className="hidden"
                        id="detail-edit-thumbnail-upload"
                      />
                      <label
                        htmlFor="detail-edit-thumbnail-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 transition-colors bg-slate-50"
                      >
                        {editThumbnailPreview ? (
                          <img src={editThumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-600">Upload Thumbnail</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Preview Image (optional - leave empty to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditFileChange(e, "preview")}
                        className="hidden"
                        id="detail-edit-preview-upload"
                      />
                      <label
                        htmlFor="detail-edit-preview-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 transition-colors bg-slate-50"
                      >
                        {editPreviewImagePreview ? (
                          <img src={editPreviewImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-600">Upload Preview</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Schema */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Schema (JSON) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={editFormData.schema}
                    onChange={(e) => setEditFormData({ ...editFormData, schema: e.target.value })}
                    rows={4}
                    placeholder='{"layout": "grid", "columns": 3}'
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                {/* Allowed Tier Plans */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Allowed Tier Plans <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-3 border border-slate-200 rounded-xl bg-slate-50">
                    {tierPlans.map((tier) => (
                      <label
                        key={tier.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editFormData.allowedTierIds.includes(tier.id)}
                          onChange={() => handleEditTierToggle(tier.id)}
                          className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                        />
                        <span className="text-sm text-slate-700">{tier.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  disabled={editLoading}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading || !hasEditChanges()}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Update Theme
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreFrontManagerDetailScreen;
