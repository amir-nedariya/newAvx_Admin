import React, { useState, useEffect } from "react";
import {
  Store,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  filterConsultationStoreThemes,
  createConsultationStoreTheme,
  normalizeStoreThemeResponse,
  updateStoreTheme,
  deleteStoreTheme,
  getStoreThemeById,
  getStoreThemeStats,
} from "../../../api/storeTheme.api";
import { getAllTierPlans } from "../../../api/tierPlan.api";

const StorefrontManager = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [themes, setThemes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalThemes, setTotalThemes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalActiveThemes: 0,
    totalConsultationUsage: 0,
    basicTierActiveThemes: 0,
    proTierActiveThemes: 0,
    premiumTierActiveThemes: 0,
  });

  // Create Theme Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [tierPlans, setTierPlans] = useState([]);
  const [formData, setFormData] = useState({
    themeId: "",
    type: "",
    name: "",
    thumbnail: null,
    preview: null,
    schema: "",
    allowedTierIds: [],
    status: "ACTIVE",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [previewImagePreview, setPreviewImagePreview] = useState(null);

  // Three-dot menu state
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState("bottom"); // "bottom" or "top"

  // Edit Theme Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [originalEditData, setOriginalEditData] = useState(null); // Store original data for comparison
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

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingThemeId, setDeletingThemeId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    tierIds: [],
    dateFrom: "",
    dateTo: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    status: "",
    tierIds: [],
    dateFrom: "",
    dateTo: "",
  });

  // Fetch themes
  const fetchThemes = async (pageNo) => {
    try {
      setLoading(true);

      // Build filter request
      const filterRequest = {
        searchText: searchQuery.trim() || "",
        status: appliedFilters.status || "",
        fromDate: appliedFilters.dateFrom ? new Date(appliedFilters.dateFrom).toISOString() : null,
        toDate: appliedFilters.dateTo ? new Date(appliedFilters.dateTo + "T23:59:59").toISOString() : null,
        tiers: appliedFilters.tierIds.length > 0
          ? tierPlans
            .filter(tier => appliedFilters.tierIds.includes(tier.id))
            .map(tier => tier.title)
          : [],
        pageNo: pageNo,
        pageSize: 10
      };

      const res = await filterConsultationStoreThemes(filterRequest);
      const normalized = normalizeStoreThemeResponse(res);

      setThemes(normalized.list);
      setPage(normalized.currentPage);
      setTotalPages(normalized.totalPages);
      setTotalThemes(normalized.totalElements);
    } catch (error) {
      console.error("Failed to fetch themes:", error);
      toast.error("Failed to fetch themes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tier plans
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

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await getStoreThemeStats();
      const statsData = res?.data || res;
      setStats({
        totalActiveThemes: statsData.totalActiveThemes || 0,
        totalConsultationUsage: statsData.totalConsultationUsage || 0,
        basicTierActiveThemes: statsData.basicTierActiveThemes || 0,
        proTierActiveThemes: statsData.proTierActiveThemes || 0,
        premiumTierActiveThemes: statsData.premiumTierActiveThemes || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchThemes(page);
  }, [page, appliedFilters, searchQuery]); // Re-fetch when filters or search changes

  useEffect(() => {
    fetchTierPlans();
    fetchStats();
  }, []);

  // Handle edit from navigation state
  useEffect(() => {
    if (location.state?.editThemeId) {
      handleUpdateTheme(location.state.editThemeId);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const formatEnumLabel = (value) => {
    if (!value) return "-";
    return String(value).replace(/_/g, " ");
  };

  const handleViewTheme = (themeId) => {
    navigate(`/admin/storefront-manager/themes/${themeId}`);
    setOpenMenuId(null);
  };

  const handleUpdateTheme = async (themeId) => {
    setOpenMenuId(null);
    try {
      const res = await getStoreThemeById(themeId);
      const themeData = res?.data || res;
      setEditingTheme(themeData);

      const initialData = {
        themeId: themeData.themeId || "",
        type: themeData.type || "",
        name: themeData.name || "",
        thumbnail: null,
        preview: null,
        schema: typeof themeData.schema === "string" ? themeData.schema : JSON.stringify(themeData.schema, null, 2),
        allowedTierIds: themeData.allowedTiers?.map(tier => tier.id) || [],
        status: themeData.status || "ACTIVE",
      };

      setEditFormData(initialData);
      setOriginalEditData(initialData); // Store original data
      setEditThumbnailPreview(themeData.thumbnailUrl || null);
      setEditPreviewImagePreview(themeData.previewUrl || null);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch theme details:", error);
      toast.error("Failed to load theme details");
    }
  };

  const handleDeleteTheme = (themeId) => {
    setOpenMenuId(null);
    setDeletingThemeId(themeId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTheme = async () => {
    if (!deletingThemeId) return;

    setIsDeleting(true);
    try {
      await deleteStoreTheme(deletingThemeId);
      toast.success("Theme deleted successfully");
      setDeleteModalOpen(false);
      setDeletingThemeId(null);
      fetchThemes(page);
    } catch (error) {
      console.error("Failed to delete theme:", error);
      toast.error(error?.response?.data?.message || "Failed to delete theme");
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if edit form has changes
  const hasEditChanges = () => {
    if (!originalEditData) return false;

    // Check text fields
    if (editFormData.themeId !== originalEditData.themeId) return true;
    if (editFormData.type !== originalEditData.type) return true;
    if (editFormData.name !== originalEditData.name) return true;
    if (editFormData.schema !== originalEditData.schema) return true;
    if (editFormData.status !== originalEditData.status) return true;

    // Check if new files were uploaded
    if (editFormData.thumbnail !== null) return true;
    if (editFormData.preview !== null) return true;

    // Check tier IDs (compare arrays)
    const originalTiers = [...originalEditData.allowedTierIds].sort();
    const currentTiers = [...editFormData.allowedTierIds].sort();
    if (originalTiers.length !== currentTiers.length) return true;
    if (!originalTiers.every((id, index) => id === currentTiers[index])) return true;

    return false;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handleFilterTierToggle = (tierId) => {
    setFilters(prev => ({
      ...prev,
      tierIds: prev.tierIds.includes(tierId)
        ? prev.tierIds.filter(id => id !== tierId)
        : [...prev.tierIds, tierId]
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
    setPage(1); // Reset to first page
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      status: "",
      tierIds: [],
      dateFrom: "",
      dateTo: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setShowFilters(false);
    setPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedFilters.status) count++;
    if (appliedFilters.tierIds.length > 0) count++;
    if (appliedFilters.dateFrom || appliedFilters.dateTo) count++;
    return count;
  };

  // Handle file input change
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [fieldName]: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === "thumbnail") {
          setThumbnailPreview(reader.result);
        } else if (fieldName === "preview") {
          setPreviewImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tier selection
  const handleTierToggle = (tierId) => {
    setFormData((prev) => {
      const newTierIds = prev.allowedTierIds.includes(tierId)
        ? prev.allowedTierIds.filter((id) => id !== tierId)
        : [...prev.allowedTierIds, tierId];
      return { ...prev, allowedTierIds: newTierIds };
    });
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

      // Create preview
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

  // Handle create theme submit
  const handleCreateTheme = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.themeId.trim()) {
      toast.error("Theme ID is required");
      return;
    }
    if (!formData.type.trim()) {
      toast.error("Type is required");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }
    if (!formData.preview) {
      toast.error("Preview image is required");
      return;
    }
    if (!formData.schema.trim()) {
      toast.error("Schema is required");
      return;
    }
    if (formData.allowedTierIds.length === 0) {
      toast.error("Please select at least one tier plan");
      return;
    }

    try {
      setCreateLoading(true);

      // Create FormData
      const data = new FormData();
      data.append("themeId", formData.themeId);
      data.append("type", formData.type);
      data.append("name", formData.name);
      data.append("thumbnail", formData.thumbnail);
      data.append("preview", formData.preview);
      data.append("schema", formData.schema);
      data.append("status", formData.status);

      // Append tier IDs as array
      formData.allowedTierIds.forEach((id) => {
        data.append("allowedTierIds", id);
      });

      await createConsultationStoreTheme(data);
      toast.success("Theme created successfully!");

      // Reset form and close modal
      setFormData({
        themeId: "",
        type: "",
        name: "",
        thumbnail: null,
        preview: null,
        schema: "",
        allowedTierIds: [],
        status: "ACTIVE",
      });
      setThumbnailPreview(null);
      setPreviewImagePreview(null);
      setCreateModalOpen(false);

      // Refresh themes list
      fetchThemes(1);
      setPage(1);
    } catch (error) {
      console.error("Failed to create theme:", error);
      toast.error(error?.response?.data?.message || "Failed to create theme");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle update theme submit
  const handleUpdateThemeSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

      // Create FormData
      const data = new FormData();
      data.append("themeId", editFormData.themeId);
      data.append("type", editFormData.type);
      data.append("name", editFormData.name);

      // Only append files if they were changed
      if (editFormData.thumbnail) {
        data.append("thumbnail", editFormData.thumbnail);
      }
      if (editFormData.preview) {
        data.append("preview", editFormData.preview);
      }

      data.append("schema", editFormData.schema);
      data.append("status", editFormData.status);

      // Append tier IDs as array
      editFormData.allowedTierIds.forEach((id) => {
        data.append("allowedTierIds", id);
      });

      await updateStoreTheme(editingTheme.id, data);
      toast.success("Theme updated successfully!");

      // Reset form and close modal
      setEditFormData({
        themeId: "",
        type: "",
        name: "",
        thumbnail: null,
        preview: null,
        schema: "",
        allowedTierIds: [],
        status: "ACTIVE",
      });
      setEditThumbnailPreview(null);
      setEditPreviewImagePreview(null);
      setEditModalOpen(false);
      setEditingTheme(null);

      // Refresh themes list
      fetchThemes(page);
    } catch (error) {
      console.error("Failed to update theme:", error);
      toast.error(error?.response?.data?.message || "Failed to update theme");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading && themes.length === 0) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          <span className="text-lg font-medium">Loading themes...</span>
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
                <h1 className="text-3xl font-bold text-slate-900">Storefront Manager</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage consultant storefronts and customizations
                </p>
              </div>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 hover:shadow-md active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Create Theme
              </button>
            </div>
          </div>

          {/* ================= STATS CARDS ================= */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 flex-shrink-0">
            {/* Total Active Themes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Active Themes
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.totalActiveThemes}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Total Consultation Usage */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Usage
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.totalConsultationUsage}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
                  <Store className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </div>

            {/* Basic Tier Active Themes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Basic Tier
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.basicTierActiveThemes}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pro Tier Active Themes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Pro Tier
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.proTierActiveThemes}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                  <XCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Premium Tier Active Themes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Premium Tier
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.premiumTierActiveThemes}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= SEARCH BAR ================= */}
          <div className="mb-4 flex-shrink-0 flex gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by theme name, type, or ID..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </form>

            <button
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 relative"
            >
              <Filter className="h-5 w-5" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSearchQuery("");
                handleClearFilters();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
              title="Reset all filters"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* ================= TABLE CARD ================= */}
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-6 py-4">Theme</th>
                    <th className="px-6 py-4">Theme ID</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Allowed Tiers</th>
                    <th className="px-4 py-4">Consult Usage</th>
                    <th className="px-4 py-4">Created At</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {themes.map((theme) => (
                    <tr
                      key={theme.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                            {theme.thumbnailUrl ? (
                              <img
                                src={theme.thumbnailUrl}
                                alt={theme.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <Store className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">
                              {theme.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-700">
                          {theme.themeId}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {theme.type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${theme.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                        >
                          {theme.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {theme.allowedTiers?.length || 0} tiers
                          </span>
                          {theme.allowedTiers && theme.allowedTiers.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {theme.allowedTiers.map((tier) => (
                                <span
                                  key={tier.id}
                                  className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700"
                                >
                                  {tier.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {theme.usageCount || 0}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-700">
                          {theme.createdAt
                            ? new Date(theme.createdAt).toLocaleDateString("en-IN", {
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

                              // If less than 200px space below and more space above, open upward
                              if (spaceBelow < 200 && spaceAbove > spaceBelow) {
                                setMenuPosition("top");
                              } else {
                                setMenuPosition("bottom");
                              }

                              setOpenMenuId(openMenuId === theme.id ? null : theme.id);
                            }}
                            className="inline-flex cursor-pointer items-center justify-center w-9 h-9 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Actions"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === theme.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div
                                className={`absolute right-0 z-20 w-48 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden ${menuPosition === "top"
                                  ? "bottom-full mb-2"
                                  : "top-full mt-2"
                                  }`}
                              >
                                <button
                                  onClick={() => handleViewTheme(theme.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Eye size={16} className="text-sky-600" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleUpdateTheme(theme.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Edit size={16} className="text-amber-600" />
                                  Update Theme
                                </button>
                                <button
                                  onClick={() => handleDeleteTheme(theme.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Delete Theme
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
                <p className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="inline-flex items-center gap-1 px-3 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Prev
                  </button>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="inline-flex items-center gap-1 px-3 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CREATE THEME MODAL ================= */}
      {createModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !createLoading && setCreateModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
                  <Plus className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Create New Theme</h3>
                  <p className="mt-1 text-sm text-slate-500">Add a new storefront theme</p>
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

            <form onSubmit={handleCreateTheme} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Theme ID and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Theme ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.themeId}
                      onChange={(e) => setFormData({ ...formData, themeId: e.target.value })}
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
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter theme name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                {/* Thumbnail and Preview Images */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Thumbnail <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 transition-colors bg-slate-50"
                      >
                        {thumbnailPreview ? (
                          <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover rounded-xl" />
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
                      Preview Image <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "preview")}
                        className="hidden"
                        id="preview-upload"
                      />
                      <label
                        htmlFor="preview-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 transition-colors bg-slate-50"
                      >
                        {previewImagePreview ? (
                          <img src={previewImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
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
                    value={formData.schema}
                    onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
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
                          checked={formData.allowedTierIds.includes(tier.id)}
                          onChange={() => handleTierToggle(tier.id)}
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
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  onClick={() => setCreateModalOpen(false)}
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
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Theme
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ================= EDIT THEME MODAL ================= */}
      {editModalOpen && editingTheme && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !editLoading && setEditModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
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
                      Thumbnail Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditFileChange(e, "thumbnail")}
                        className="hidden"
                        id="edit-thumbnail-upload"
                      />
                      <label
                        htmlFor="edit-thumbnail-upload"
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
                      Preview Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditFileChange(e, "preview")}
                        className="hidden"
                        id="edit-preview-upload"
                      />
                      <label
                        htmlFor="edit-preview-upload"
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

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModalOpen(false)}
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
                Are you sure you want to delete this theme? This will soft delete the theme and it can be recovered later if needed.
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
                onClick={confirmDeleteTheme}
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
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= FILTER SIDEBAR ================= */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed right-0 top-0 z-[101] h-full w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                  <Filter className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                  <p className="text-sm text-slate-500">Refine your theme search results</p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Filter */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-slate-400" />
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-600">
                    Status
                  </label>
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>

              {/* Tier Filter */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="h-4 w-4 text-slate-400" />
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-600">
                    Tier Plan
                  </label>
                </div>
                <div className="space-y-2">
                  {tierPlans.map((tier) => (
                    <label
                      key={tier.id}
                      className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={filters.tierIds.includes(tier.id)}
                        onChange={() => handleFilterTierToggle(tier.id)}
                        className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">{tier.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <label className="text-sm font-bold uppercase tracking-wider text-slate-600">
                    Date Range
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-500">From Date</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-500">To Date</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
              <button
                onClick={handleClearFilters}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorefrontManager;