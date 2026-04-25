import React, { useState, useEffect } from "react";
import {
  Store,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  CheckCircle,
  Plus,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllStoreIcons,
  softDeleteStoreIcon,
  createStoreIcon,
  updateStoreIcon,
} from "../../../api/storeIcon.api";

const StoreIconManager = () => {
  // State management
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Three-dot menu state
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState("bottom");

  // Active tab state
  const [activeTab, setActiveTab] = useState("ACTIVE");

  // Stats state
  const [stats, setStats] = useState({ totalActive: 0, totalIcons: 0 });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingIconId, setDeletingIconId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({ title: "", svgIcon: "" });

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingIcon, setEditingIcon] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", svgIcon: "" });
  const [originalEditFormData, setOriginalEditFormData] = useState(null);

  // ── Derived filtered list ──────────────────────────────────────────────────
  const filteredIcons = icons.filter((icon) => {
    const matchesTab =
      activeTab === "ALL" ? true : icon.status === activeTab;
    const matchesSearch =
      searchQuery.trim() === "" ||
      icon.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // ── Fetch all icons ────────────────────────────────────────────────────────
  const fetchIcons = async () => {
    try {
      setLoading(true);
      const response = await getAllStoreIcons();
      const data = response?.data?.data || response?.data || [];
      const list = Array.isArray(data) ? data : [];
      setIcons(list);
      setStats({
        totalActive: list.filter((i) => i.status === "ACTIVE").length,
        totalIcons: list.length,
      });
    } catch (error) {
      console.error("Failed to fetch store icons:", error);
      toast.error("Failed to fetch store icons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  // ── Check if edit form changed ─────────────────────────────────────────────
  const hasEditFormChanged = () => {
    if (!originalEditFormData) return false;
    return (
      editFormData.title !== originalEditFormData.title ||
      editFormData.svgIcon !== originalEditFormData.svgIcon
    );
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleOpenEdit = (icon) => {
    setOpenMenuId(null);
    setEditingIcon(icon);
    const initial = { title: icon.title || "", svgIcon: icon.svgIcon || "" };
    setEditFormData(initial);
    setOriginalEditFormData(initial);
    setEditModalOpen(true);
  };

  const handleDeleteIcon = (iconId) => {
    setOpenMenuId(null);
    setDeletingIconId(iconId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteIcon = async () => {
    if (!deletingIconId) return;
    setIsDeleting(true);
    try {
      await softDeleteStoreIcon(deletingIconId);
      toast.success("Icon deleted successfully");
      setDeleteModalOpen(false);
      setDeletingIconId(null);
      fetchIcons();
    } catch (error) {
      console.error("Failed to delete icon:", error);
      toast.error(error?.response?.data?.message || "Failed to delete icon");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createFormData.title.trim()) { toast.error("Title is required"); return; }
    if (!createFormData.svgIcon.trim()) { toast.error("SVG icon is required"); return; }
    try {
      setCreateLoading(true);
      await createStoreIcon({ title: createFormData.title, svgIcon: createFormData.svgIcon });
      toast.success("Icon created successfully!");
      setCreateFormData({ title: "", svgIcon: "" });
      setCreateModalOpen(false);
      fetchIcons();
    } catch (error) {
      console.error("Failed to create icon:", error);
      toast.error(error?.response?.data?.message || "Failed to create icon");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) { toast.error("Title is required"); return; }
    if (!editFormData.svgIcon.trim()) { toast.error("SVG icon is required"); return; }
    try {
      setEditLoading(true);
      await updateStoreIcon(editingIcon.id, { title: editFormData.title, svgIcon: editFormData.svgIcon });
      toast.success("Icon updated successfully!");
      setEditModalOpen(false);
      setEditingIcon(null);
      setOriginalEditFormData(null);
      fetchIcons();
    } catch (error) {
      console.error("Failed to update icon:", error);
      toast.error(error?.response?.data?.message || "Failed to update icon");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingIcon(null);
    setEditFormData({ title: "", svgIcon: "" });
    setOriginalEditFormData(null);
  };

  if (loading && icons.length === 0) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          <span className="text-lg font-medium">Loading icons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="mx-auto w-full px-4 flex-1 flex flex-col min-h-0">

          {/* ================= HEADER ================= */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Store Icon Manager</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage SVG icons available for consultant storefronts
                </p>
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 hover:shadow-md active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Add Icon
              </button>
            </div>
          </div>

          {/* ================= STATS CARDS ================= */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 flex-shrink-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Icons</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalActive}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Icons</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalIcons}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
                  <Store className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= STATUS TABS ================= */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex gap-3">
              {[
                { key: "ALL", label: "All", active: "border-slate-500 text-slate-700 bg-slate-100", inactive: "border-slate-300 text-slate-500 bg-white hover:bg-slate-50" },
                { key: "ACTIVE", label: "Active", active: "border-emerald-500 text-emerald-700 bg-emerald-50", inactive: "border-emerald-300 text-emerald-500 bg-white hover:bg-emerald-50" },
                { key: "INACTIVE", label: "Inactive", active: "border-amber-500 text-amber-700 bg-amber-50", inactive: "border-amber-300 text-amber-500 bg-white hover:bg-amber-50" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${activeTab === tab.key ? tab.active : tab.inactive}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= SEARCH BAR ================= */}
          <div className="mb-4 flex-shrink-0 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by icon title..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <button
              onClick={() => { setSearchQuery(""); setActiveTab("ACTIVE"); fetchIcons(); }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
              title="Reset filters"
            >
              <RefreshCw className={`h-5 w-5 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* ================= TABLE CARD ================= */}
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-6 py-4">Icon</th>
                    <th className="px-4 py-4">Title</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Updated</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredIcons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-sm font-medium">
                        No icons found
                      </td>
                    </tr>
                  ) : (
                    filteredIcons.map((icon) => (
                      <tr key={icon.id} className="hover:bg-slate-50 transition-colors">
                        {/* Icon preview */}
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
                            {icon.svgIcon ? (
                              <span
                                className="w-6 h-6 text-slate-700"
                                dangerouslySetInnerHTML={{ __html: icon.svgIcon }}
                              />
                            ) : (
                              <Code className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">{icon.title || "-"}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${icon.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-rose-100 text-rose-700 border border-rose-200"
                              }`}
                          >
                            {icon.status}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {icon.createdAt
                              ? new Date(icon.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </td>

                        {/* Updated */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {icon.updatedAt
                              ? new Date(icon.updatedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                const buttonRect = e.currentTarget.getBoundingClientRect();
                                const spaceBelow = window.innerHeight - buttonRect.bottom;
                                const spaceAbove = buttonRect.top;

                                if (spaceBelow < 200 && spaceAbove > spaceBelow) {
                                  setMenuPosition("top");
                                } else {
                                  setMenuPosition("bottom");
                                }

                                setOpenMenuId(openMenuId === icon.id ? null : icon.id);
                              }}
                              className="inline-flex cursor-pointer items-center justify-center w-9 h-9 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                              title="Actions"
                            >
                              <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === icon.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                <div
                                  className={`absolute right-0 z-20 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden ${menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
                                >
                                  <button
                                    onClick={() => handleOpenEdit(icon)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <Edit size={16} className="text-amber-600" />
                                    Edit Icon
                                  </button>
                                  <button
                                    onClick={() => handleDeleteIcon(icon.id)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    Delete Icon
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {deleteModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                <Trash2 className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Icon</h3>
                <p className="mt-1 text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this icon? It will be soft-deleted and can be recovered later.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteIcon}
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

      {/* ================= CREATE ICON MODAL ================= */}
      {createModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !createLoading && setCreateModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
                  <Plus className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add Store Icon</h3>
                  <p className="mt-1 text-sm text-slate-500">Create a new SVG icon</p>
                </div>
              </div>
              <button
                onClick={() => !createLoading && setCreateModalOpen(false)}
                disabled={createLoading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createFormData.title}
                    onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                    placeholder="e.g. Home Icon"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    SVG Icon <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={createFormData.svgIcon}
                    onChange={(e) => setCreateFormData({ ...createFormData, svgIcon: e.target.value })}
                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none"
                  />
                  {createFormData.svgIcon && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">Preview:</span>
                      <span className="w-8 h-8 text-slate-700" dangerouslySetInnerHTML={{ __html: createFormData.svgIcon }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setCreateFormData({ title: "", svgIcon: "" }); }}
                  disabled={createLoading}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Creating...</>
                  ) : (
                    <><Plus className="h-4 w-4" />Add Icon</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ================= EDIT ICON MODAL ================= */}
      {editModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !editLoading && closeEditModal()}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                  <Edit className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Edit Store Icon</h3>
                  <p className="mt-1 text-sm text-slate-500">Update icon details</p>
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
              <div className="p-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    placeholder="e.g. Home Icon"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    SVG Icon <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={editFormData.svgIcon}
                    onChange={(e) => setEditFormData({ ...editFormData, svgIcon: e.target.value })}
                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
                  />
                  {editFormData.svgIcon && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">Preview:</span>
                      <span className="w-8 h-8 text-slate-700" dangerouslySetInnerHTML={{ __html: editFormData.svgIcon }} />
                    </div>
                  )}
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
                  disabled={editLoading || !hasEditFormChanged()}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Updating...</>
                  ) : (
                    <><Edit className="h-4 w-4" />Update Icon</>
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

export default StoreIconManager;