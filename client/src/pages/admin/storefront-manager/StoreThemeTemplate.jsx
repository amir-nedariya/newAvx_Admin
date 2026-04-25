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
  Filter,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllStoreTemplates,
  softDeleteStoreTemplate,
  createStoreTemplate,
  updateStoreTemplate,
  getStoreTemplateById,
  getStoreImageTypes,
} from "../../../api/storeTemplate.api";
import { getAllTierPlans } from "../../../api/tierPlan.api";

const StoreThemeTemplate = () => {
  const navigate = useNavigate();

  // State management
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierPlans, setTierPlans] = useState([]);

  // Three-dot menu state
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState("bottom");

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "ACTIVE",
    tierPlanId: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    status: "ACTIVE",
    tierPlanId: "",
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("ACTIVE");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    image: null,
    imageType: "",
    isDefault: false,
    allowedTierIds: [],
    status: "ACTIVE",
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editFormData, setEditFormData] = useState({
    image: null,
    imageType: "",
    isDefault: false,
    allowedTierIds: [],
    status: "ACTIVE",
  });
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [originalEditFormData, setOriginalEditFormData] = useState(null);

  // Image type options
  const [imageTypeOptions, setImageTypeOptions] = useState([]);

  // Stats state
  const [stats, setStats] = useState({
    totalActive: 0,
    totalUsage: 0,
    basicTier: 0,
    proTier: 0,
    premiumTier: 0,
  });

  // Fetch templates
  const fetchTemplates = async (pageNo = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNo,
        size: 10,
        orderBy: "updatedAt",
        orderDirection: "desc",
        ...appliedFilters,
      };

      const response = await getAllStoreTemplates(params);
      const data = response?.data || response;

      setTemplates(data.data || []);
      setPage(data.currentPage || pageNo);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);

      // Calculate stats from the data
      calculateStats(data.data || []);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast.error("Failed to fetch store templates");
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

  // Fetch image types
  const fetchImageTypes = async () => {
    try {
      const res = await getStoreImageTypes();
      const types = res?.data?.data || res?.data || [];
      const options = types.map((type) => ({
        value: type,
        label: type
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      }));
      setImageTypeOptions(options);
    } catch (error) {
      console.error("Failed to fetch image types:", error);
    }
  };

  // Calculate stats
  const calculateStats = (data) => {
    const activeTemplates = data.filter((t) => t.status === "ACTIVE");

    // Count by tier (assuming tierPlan has a title field)
    const basicCount = data.filter(
      (t) => t.status === "ACTIVE" && t.allowedTiers?.some(tier => tier.title?.toLowerCase().includes("basic"))
    ).length;
    const proCount = data.filter(
      (t) => t.status === "ACTIVE" && t.allowedTiers?.some(tier => tier.title?.toLowerCase().includes("pro"))
    ).length;
    const premiumCount = data.filter(
      (t) => t.status === "ACTIVE" && t.allowedTiers?.some(tier => tier.title?.toLowerCase().includes("premium"))
    ).length;

    setStats({
      totalActive: activeTemplates.length,
      totalUsage: data.length, // You can adjust this based on actual usage data
      basicTier: basicCount,
      proTier: proCount,
      premiumTier: premiumCount,
    });
  };

  // Check if edit form has changed
  const hasEditFormChanged = () => {
    if (!originalEditFormData) return false;

    // Check if new image was uploaded
    if (editFormData.image !== null) return true;

    // Check if imageType changed
    if (editFormData.imageType !== originalEditFormData.imageType) return true;

    // Check if isDefault changed
    if (editFormData.isDefault !== originalEditFormData.isDefault) return true;

    // Check if status changed
    if (editFormData.status !== originalEditFormData.status) return true;

    // Check if allowedTierIds changed (compare arrays)
    const currentTierIds = [...editFormData.allowedTierIds].sort();
    const originalTierIds = [...originalEditFormData.allowedTierIds].sort();

    if (currentTierIds.length !== originalTierIds.length) return true;

    for (let i = 0; i < currentTierIds.length; i++) {
      if (currentTierIds[i] !== originalTierIds[i]) return true;
    }

    return false;
  };

  useEffect(() => {
    fetchTemplates(page);
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchTierPlans();
    fetchImageTypes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTemplates(1);
  };

  const handleViewTemplate = (templateId) => {
    navigate(`/admin/storefront-manager/template/${templateId}`);
    setOpenMenuId(null);
  };

  const handleUpdateTemplate = async (templateId) => {
    setOpenMenuId(null);

    try {
      setEditLoading(true);
      const response = await getStoreTemplateById(templateId);

      // Extract data from ResponseModel structure
      const template = response?.data?.data || response?.data || response;

      console.log("Fetched template data:", template); // Debug log

      setEditingTemplate(template);

      const formData = {
        image: null, // Will be set if user uploads new image
        imageType: template.imageType || "",
        isDefault: template.isDefault || false,
        allowedTierIds: template.allowedTiers?.map(tier => tier.id) || [],
        status: template.status || "ACTIVE",
      };

      setEditFormData(formData);
      // Store original data for comparison
      setOriginalEditFormData({
        imageType: template.imageType || "",
        isDefault: template.isDefault || false,
        allowedTierIds: template.allowedTiers?.map(tier => tier.id) || [],
        status: template.status || "ACTIVE",
      });
      setEditImagePreview(template.imageUrl || null);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch template details:", error);
      toast.error(error?.response?.data?.message || "Failed to load template details");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    setOpenMenuId(null);
    setDeletingTemplateId(templateId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTemplate = async () => {
    if (!deletingTemplateId) return;

    setIsDeleting(true);
    try {
      await softDeleteStoreTemplate(deletingTemplateId);
      toast.success("Template deleted successfully");
      setDeleteModalOpen(false);
      setDeletingTemplateId(null);
      fetchTemplates(page);
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error(error?.response?.data?.message || "Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
    setPage(1);
  };

  const handleClearFilters = () => {
    const currentStatus = appliedFilters.status; // preserve current tab's status
    const emptyFilters = {
      status: currentStatus,
      tierPlanId: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearchQuery("");
    setShowFilters(false);
    setPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedFilters.status) count++;
    if (appliedFilters.tierPlanId) count++;
    return count;
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    let statusValue = "";

    switch (tab) {
      case "ACTIVE":
        statusValue = "ACTIVE";
        break;
      case "INACTIVE":
        statusValue = "INACTIVE";
        break;
      case "DELETED":
        statusValue = "DELETED";
        break;
      case "ALL":
      default:
        statusValue = "";
        break;
    }

    setAppliedFilters(prev => ({ ...prev, status: statusValue }));
    setFilters(prev => ({ ...prev, status: statusValue }));
    setPage(1);
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCreateFormData({ ...createFormData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tier toggle
  const handleTierToggle = (tierId) => {
    setCreateFormData((prev) => {
      const newTierIds = prev.allowedTierIds.includes(tierId)
        ? prev.allowedTierIds.filter((id) => id !== tierId)
        : [...prev.allowedTierIds, tierId];
      return { ...prev, allowedTierIds: newTierIds };
    });
  };

  // Handle create template submit
  const handleCreateTemplate = async (e) => {
    e.preventDefault();

    // Validation
    if (!createFormData.image) {
      toast.error("Image is required");
      return;
    }
    if (!createFormData.imageType) {
      toast.error("Image type is required");
      return;
    }
    if (createFormData.allowedTierIds.length === 0) {
      toast.error("Please select at least one tier plan");
      return;
    }

    try {
      setCreateLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("image", createFormData.image);
      formData.append("imageType", createFormData.imageType);
      formData.append("isDefault", createFormData.isDefault);
      formData.append("status", createFormData.status);

      // Append tier IDs
      createFormData.allowedTierIds.forEach((id) => {
        formData.append("allowedTierIds", id);
      });

      await createStoreTemplate(formData);
      toast.success("Template created successfully!");

      // Reset form and close modal
      setCreateFormData({
        image: null,
        imageType: "",
        isDefault: false,
        allowedTierIds: [],
        status: "ACTIVE",
      });
      setImagePreview(null);
      setCreateModalOpen(false);

      // Refresh templates list
      fetchTemplates(1);
      setPage(1);
    } catch (error) {
      console.error("Failed to create template:", error);
      toast.error(error?.response?.data?.message || "Failed to create template");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle edit image change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({ ...editFormData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit tier toggle
  const handleEditTierToggle = (tierId) => {
    setEditFormData((prev) => {
      const newTierIds = prev.allowedTierIds.includes(tierId)
        ? prev.allowedTierIds.filter((id) => id !== tierId)
        : [...prev.allowedTierIds, tierId];
      return { ...prev, allowedTierIds: newTierIds };
    });
  };

  // Close edit modal and reset state
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditFormData({
      image: null,
      imageType: "",
      isDefault: false,
      allowedTierIds: [],
      status: "ACTIVE",
    });
    setEditImagePreview(null);
    setEditingTemplate(null);
    setOriginalEditFormData(null);
  };

  // Handle update template submit
  const handleUpdateTemplateSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!editFormData.image && !editImagePreview) {
      toast.error("Image is required");
      return;
    }
    if (!editFormData.imageType) {
      toast.error("Image type is required");
      return;
    }
    if (editFormData.allowedTierIds.length === 0) {
      toast.error("Please select at least one tier plan");
      return;
    }

    try {
      setEditLoading(true);

      // Create FormData
      const formData = new FormData();

      // Only append image if a new one was selected
      if (editFormData.image) {
        formData.append("image", editFormData.image);
      }

      formData.append("imageType", editFormData.imageType);
      formData.append("isDefault", editFormData.isDefault);
      formData.append("status", editFormData.status);

      // Append tier IDs
      editFormData.allowedTierIds.forEach((id) => {
        formData.append("allowedTierIds", id);
      });

      await updateStoreTemplate(editingTemplate.id, formData);
      toast.success("Template updated successfully!");

      // Close modal and reset state
      closeEditModal();

      // Refresh templates list
      fetchTemplates(page);
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error(error?.response?.data?.message || "Failed to update template");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          <span className="text-lg font-medium">Loading templates...</span>
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
                <h1 className="text-3xl font-bold text-slate-900">Storefront Template</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage consultant storefronts and customizations
                </p>
              </div>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 hover:shadow-md active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Create Template
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
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalActive}</p>
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
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalUsage}</p>
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
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.basicTier}</p>
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
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.proTier}</p>
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
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stats.premiumTier}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= STATUS TABS ================= */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={() => handleTabChange("ALL")}
                className={`px-6 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${activeTab === "ALL"
                  ? "border-slate-500 text-slate-700 bg-slate-100"
                  : "border-slate-300 text-slate-500 bg-white hover:bg-slate-50"
                  }`}
              >
                All
              </button>

              <button
                onClick={() => handleTabChange("ACTIVE")}
                className={`px-6 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${activeTab === "ACTIVE"
                  ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                  : "border-emerald-300 text-emerald-500 bg-white hover:bg-emerald-50"
                  }`}
              >
                Active
              </button>

              <button
                onClick={() => handleTabChange("INACTIVE")}
                className={`px-6 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${activeTab === "INACTIVE"
                  ? "border-amber-500 text-amber-700 bg-amber-50"
                  : "border-amber-300 text-amber-500 bg-white hover:bg-amber-50"
                  }`}
              >
                Inactive
              </button>

              <button
                onClick={() => handleTabChange("DELETED")}
                className={`px-6 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${activeTab === "DELETED"
                  ? "border-rose-500 text-rose-700 bg-rose-50"
                  : "border-rose-300 text-rose-500 bg-white hover:bg-rose-50"
                  }`}
              >
                Deleted
              </button>
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

            {/* <button
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
            </button> */}

            <button
              onClick={() => {
                setSearchQuery("");
                handleClearFilters();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
              title="Reset all filters"
            >
              <RefreshCw className={`h-5 w-5 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* ================= TABLE CARD ================= */}
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-6 py-4">Theme</th>
                    {/* <th className="px-6 py-4">Theme ID</th> */}
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Tiers</th>
                    {/* <th className="px-4 py-4">Usage</th> */}
                    <th className="px-4 py-4">Created</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                            {template.imageUrl ? (
                              <img
                                src={template.imageUrl}
                                alt={template.imageType || "Template"}
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
                              {template.imageType || "Template"}
                            </p>
                            {template.isDefault && (
                              <span className="text-xs text-sky-600 font-semibold">Default</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-700">{template.id}</span>
                      </td> */}

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {template.imageType || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${template.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}
                        >
                          {template.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {template.allowedTiers?.length || 0} tiers
                          </span>
                          {template.allowedTiers && template.allowedTiers.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {template.allowedTiers.map((tier) => (
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

                      {/* <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-slate-900">-</span>
                      </td> */}

                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-700">
                          {template.createdAt
                            ? new Date(template.createdAt).toLocaleDateString("en-IN", {
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

                              setOpenMenuId(openMenuId === template.id ? null : template.id);
                            }}
                            className="inline-flex cursor-pointer items-center justify-center w-9 h-9 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Actions"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === template.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div
                                className={`absolute right-0 z-20 w-48 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden ${menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
                                  }`}
                              >
                                <button
                                  onClick={() => handleViewTemplate(template.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Eye size={16} className="text-sky-600" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleUpdateTemplate(template.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                  <Edit size={16} className="text-amber-600" />
                                  Update Template
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Delete Template
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
                  <h3 className="text-xl font-bold text-slate-900">Delete Template</h3>
                  <p className="mt-1 text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600">
                Are you sure you want to delete this template? This will soft delete the template and it can be recovered later if needed.
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
                onClick={confirmDeleteTemplate}
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

      {/* ================= CREATE TEMPLATE MODAL ================= */}
      {createModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !createLoading && setCreateModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[111] w-[95%] max-w-2xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
                  <Plus className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Create Store Template</h3>
                  <p className="mt-1 text-sm text-slate-500">Add a new store template</p>
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

            <form onSubmit={handleCreateTemplate} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Template Image <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="template-image-upload"
                    />
                    <label
                      htmlFor="template-image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 transition-colors bg-slate-50"
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Template preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-slate-400 mb-3" />
                          <span className="text-sm font-semibold text-slate-600">
                            Click to upload template image
                          </span>
                          <span className="text-xs text-slate-500 mt-1">
                            PNG, JPG, JPEG up to 10MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Image Type */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Image Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={createFormData.imageType}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, imageType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="">Select image type</option>
                    {imageTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Is Default */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createFormData.isDefault}
                      onChange={(e) =>
                        setCreateFormData({ ...createFormData, isDefault: e.target.checked })
                      }
                      className="w-5 h-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-700">Set as Default Template</span>
                      <p className="text-xs text-slate-500">
                        This template will be used as the default for this image type
                      </p>
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
                      <label
                        key={tier.id}
                        className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={createFormData.allowedTierIds.includes(tier.id)}
                          onChange={() => handleTierToggle(tier.id)}
                          className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
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
                    value={createFormData.status}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, status: e.target.value })
                    }
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
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ================= EDIT TEMPLATE MODAL ================= */}
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

            <form onSubmit={handleUpdateTemplateSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Template Image <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                      id="edit-template-image-upload"
                    />
                    <label
                      htmlFor="edit-template-image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-amber-500 transition-colors bg-slate-50"
                    >
                      {editImagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={editImagePreview}
                            alt="Template preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">Click to change image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-slate-400 mb-3" />
                          <span className="text-sm font-semibold text-slate-600">
                            Click to upload template image
                          </span>
                          <span className="text-xs text-slate-500 mt-1">
                            PNG, JPG, JPEG up to 10MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Image Type */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Image Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editFormData.imageType}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, imageType: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="">Select image type</option>
                    {imageTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Is Default */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isDefault}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, isDefault: e.target.checked })
                      }
                      className="w-5 h-5 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-700">Set as Default Template</span>
                      <p className="text-xs text-slate-500">
                        This template will be used as the default for this image type
                      </p>
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
                      <label
                        key={tier.id}
                        className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:bg-slate-50"
                      >
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
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value })
                    }
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
                  disabled={editLoading || !hasEditFormChanged()}
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
                      Update Template
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

export default StoreThemeTemplate;