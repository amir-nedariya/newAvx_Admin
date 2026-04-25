import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Store,
  Calendar,
  Image as ImageIcon,
  Edit,
  Trash2,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getStoreTemplateById,
  softDeleteStoreTemplate,
  updateStoreTemplate,
  getStoreImageTypes,
} from "../../../../api/storeTemplate.api";
import { getAllTierPlans } from "../../../../api/tierPlan.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const safeText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const StoreThemeTemplateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(null);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [originalEditData, setOriginalEditData] = useState(null);
  const [editFormData, setEditFormData] = useState({
    image: null,
    imageType: "",
    isDefault: false,
    allowedTierIds: [],
    status: "ACTIVE",
  });
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Supporting data
  const [tierPlans, setTierPlans] = useState([]);
  const [imageTypeOptions, setImageTypeOptions] = useState([]);

  // ─── Fetch template details ───────────────────────────────────────────────
  const fetchTemplateDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStoreTemplateById(id);
      const data = res?.data?.data || res?.data || res;
      setTemplate(data);
    } catch (err) {
      console.error("Failed to fetch template details:", err);
      const msg = err?.response?.data?.message || "Failed to load template details";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch tier plans ─────────────────────────────────────────────────────
  const fetchTierPlans = async () => {
    try {
      const res = await getAllTierPlans();
      if (res.status === "OK") setTierPlans(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tier plans:", err);
    }
  };

  // ─── Fetch image types ────────────────────────────────────────────────────
  const fetchImageTypes = async () => {
    try {
      const res = await getStoreImageTypes();
      const types = res?.data?.data || res?.data || [];
      setImageTypeOptions(
        types.map((t) => ({
          value: t,
          label: t
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch image types:", err);
    }
  };

  useEffect(() => {
    if (id) fetchTemplateDetails();
    fetchTierPlans();
    fetchImageTypes();
  }, [id]);

  // ─── Open edit modal ──────────────────────────────────────────────────────
  const handleUpdateTemplate = () => {
    if (!template) return;
    const initial = {
      image: null,
      imageType: template.imageType || "",
      isDefault: template.isDefault || false,
      allowedTierIds: template.allowedTiers?.map((t) => t.id) || [],
      status: template.status || "ACTIVE",
    };
    setEditFormData(initial);
    setOriginalEditData(initial);
    setEditImagePreview(template.imageUrl || null);
    setEditModalOpen(true);
  };

  // ─── Detect changes ───────────────────────────────────────────────────────
  const hasEditChanges = () => {
    if (!originalEditData) return false;
    if (editFormData.image !== null) return true;
    if (editFormData.imageType !== originalEditData.imageType) return true;
    if (editFormData.isDefault !== originalEditData.isDefault) return true;
    if (editFormData.status !== originalEditData.status) return true;
    const orig = [...originalEditData.allowedTierIds].sort();
    const curr = [...editFormData.allowedTierIds].sort();
    if (orig.length !== curr.length) return true;
    return !orig.every((v, i) => v === curr[i]);
  };

  // ─── Edit handlers ────────────────────────────────────────────────────────
  const handleEditTierToggle = (tierId) => {
    setEditFormData((prev) => ({
      ...prev,
      allowedTierIds: prev.allowedTierIds.includes(tierId)
        ? prev.allowedTierIds.filter((id) => id !== tierId)
        : [...prev.allowedTierIds, tierId],
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setEditImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditFormData({ image: null, imageType: "", isDefault: false, allowedTierIds: [], status: "ACTIVE" });
    setEditImagePreview(null);
    setOriginalEditData(null);
  };

  // ─── Submit update ────────────────────────────────────────────────────────
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.imageType) { toast.error("Image type is required"); return; }
    if (editFormData.allowedTierIds.length === 0) { toast.error("Select at least one tier plan"); return; }

    try {
      setEditLoading(true);
      const fd = new FormData();
      if (editFormData.image) fd.append("image", editFormData.image);
      fd.append("imageType", editFormData.imageType);
      fd.append("isDefault", editFormData.isDefault);
      fd.append("status", editFormData.status);
      editFormData.allowedTierIds.forEach((tid) => fd.append("allowedTierIds", tid));

      await updateStoreTemplate(id, fd);
      toast.success("Template updated successfully!");
      closeEditModal();
      fetchTemplateDetails();
    } catch (err) {
      console.error("Failed to update template:", err);
      toast.error(err?.response?.data?.message || "Failed to update template");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteTemplate = async () => {
    setIsDeleting(true);
    try {
      await softDeleteStoreTemplate(id);
      toast.success("Template deleted successfully");
      setTimeout(() => navigate("/admin/storefront-manager/template"), 1000);
    } catch (err) {
      console.error("Failed to delete template:", err);
      toast.error(err?.response?.data?.message || "Failed to delete template");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          <p className="text-sm font-semibold text-slate-600">Loading template details...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-6">
        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Template Not Found</h2>
        <p className="text-slate-500 mt-2 max-w-md">{error || "The template you are looking for does not exist."}</p>
        <button
          onClick={() => navigate("/admin/storefront-manager/template")}
          className="mt-6 flex items-center gap-2 text-sky-600 font-bold hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Templates
        </button>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 space-y-6">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/storefront-manager/template")}
                className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-900">Template Details</h1>
                <p className="text-sm text-slate-500 font-medium">View template information and preview</p>
              </div>
            </div>

            {template?.status !== "DELETED" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpdateTemplate}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md active:scale-95"
                >
                  <Edit className="h-4 w-4" />
                  Update Template
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-700 hover:shadow-md active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Template
                </button>
              </div>
            )}
          </div>

          {/* ── INFO CARD ── */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Thumbnail */}
              <div className="shrink-0">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-lg">
                  {template.imageUrl ? (
                    <img src={template.imageUrl} alt={template.imageType} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Store className="h-12 w-12 text-slate-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">Image Type</div>
                  <div className="flex items-center gap-2.5">
                    <Store className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-base font-bold text-slate-900">{safeText(template.imageType)}</span>
                  </div>
                </div>

                {/* <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">Template ID</div>
                  <span className="text-[13px] font-mono font-semibold text-slate-700 break-all">{safeText(template.id)}</span>
                </div> */}

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">Status</div>
                  <span
                    className={cls(
                      "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-extrabold border",
                      template.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : template.status === "DELETED"
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-rose-100 text-rose-700 border-rose-200"
                    )}
                  >
                    {safeText(template.status)}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">Default Template</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cls("h-4 w-4", template.isDefault ? "text-emerald-500" : "text-slate-300")} />
                    <span className={cls("text-sm font-bold", template.isDefault ? "text-emerald-600" : "text-slate-400")}>
                      {template.isDefault ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-2.5">Created At</div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-[15px] font-semibold text-slate-700">
                      {template.createdAt
                        ? new Date(template.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Allowed Tiers */}
            {template.allowedTiers && template.allowedTiers.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4">
                  Allowed Tier Plans
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {template.allowedTiers.map((tier) => (
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

          {/* ── TEMPLATE IMAGE PREVIEW ── */}
          {template.imageUrl && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Template Image</h2>
                  <p className="text-sm text-slate-500">Full preview of the template image</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                <img
                  src={template.imageUrl}
                  alt={template.imageType}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                <Trash2 className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Template</h3>
                <p className="mt-1 text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this template? It will be soft deleted and can be recovered later.
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
                onClick={handleDeleteTemplate}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Deleting...</>
                ) : (
                  <><Trash2 className="h-4 w-4" />Confirm Delete</>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── EDIT MODAL ── */}
      {editModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !editLoading && closeEditModal()}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                  <Edit className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Edit Store Template</h3>
                  <p className="mt-1 text-sm text-slate-500">Update template details</p>
                </div>
              </div>
              <button
                onClick={() => !editLoading && closeEditModal()}
                disabled={editLoading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">

                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Template Image <span className="text-slate-400 font-normal text-xs">(leave empty to keep current)</span>
                  </label>
                  <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" id="detail-edit-image" />
                  <label
                    htmlFor="detail-edit-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-amber-500 transition-colors bg-slate-50"
                  >
                    {editImagePreview ? (
                      <div className="relative w-full h-full">
                        <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">Click to change image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-slate-400 mb-3" />
                        <span className="text-sm font-semibold text-slate-600">Click to upload template image</span>
                        <span className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG up to 10MB</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Image Type */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Image Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editFormData.imageType}
                    onChange={(e) => setEditFormData({ ...editFormData, imageType: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="">Select image type</option>
                    {imageTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Is Default */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isDefault}
                      onChange={(e) => setEditFormData({ ...editFormData, isDefault: e.target.checked })}
                      className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-700">Set as Default Template</span>
                      <p className="text-xs text-slate-500">This template will be used as the default for this image type</p>
                    </div>
                  </label>
                </div>

                {/* Allowed Tier Plans */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Allowed Tier Plans <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50">
                    {tierPlans.map((tier) => (
                      <label key={tier.id} className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={editFormData.allowedTierIds.includes(tier.id)}
                          onChange={() => handleEditTierToggle(tier.id)}
                          className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm font-semibold text-slate-700">{tier.title}</span>
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={closeEditModal}
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
                    <><Loader2 className="h-4 w-4 animate-spin" />Updating...</>
                  ) : (
                    <><Edit className="h-4 w-4" />Update Template</>
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

export default StoreThemeTemplateDetails;
