import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Loader2,
  CarFront,
  BadgeCheck,
  ShieldAlert,
  ShieldX,
  Clock3,
  User,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getSuspendedVehicles, unsuspendVehicle } from "../../../api/vehicle.api";
import SuspendedVehiclesRowActions from "./suspended-inventory/SuspendedVehiclesRowActions";
import SuspendedVehiclesConfirmModal from "./suspended-inventory/SuspendedVehiclesConfirmModal";

const cls = (...a) => a.filter(Boolean).join(" ");

const FALLBACK_VEHICLE_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=60";

const formatPrice = (value) => {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN")}`;
};

const safeText = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const suspensionTypeBadge = (type) => {
  if (type === "PERMANENT") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (type === "TEMPORARY") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const typeBadge = (type) => {
  if (type === "SELLER" || type === "USER_SELLER") return "border-rose-200 bg-rose-50 text-rose-700";
  if (type === "CONSULTATION") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
};

const formatEnumLabel = (value) => {
  if (!value) return "-";
  return value.replace(/_/g, " ");
};

const statusBadge = (isActive) => {
  if (isActive) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
};

function VehicleThumb({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_VEHICLE_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_VEHICLE_IMAGE);
  }, [src]);

  return (
    <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgSrc(FALLBACK_VEHICLE_IMAGE)}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
    </div>
  );
}

function TopCard({ title, value, icon: Icon, iconWrapClass = "", valueClass = "" }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div
            className={cls(
              "text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900",
              valueClass
            )}
          >
            {value}
          </div>
        </div>

        <div
          className={cls(
            "flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm",
            iconWrapClass || "border-sky-100 bg-sky-50 text-sky-600"
          )}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

const SuspendedVehicles = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSuspendedList = useCallback(async (showToast = false) => {
    try {
      setError("");
      if (showToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await getSuspendedVehicles();

      const list =
        (Array.isArray(res?.data) && res.data) ||
        (Array.isArray(res) && res) ||
        [];

      setRows(list);

      if (showToast) {
        toast.success("Suspended vehicles refreshed");
      }
    } catch (err) {
      console.error("Suspended vehicles fetch failed:", err);
      setRows([]);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch suspended vehicles."
      );
      toast.error("Failed to fetch suspended vehicles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSuspendedList();
  }, [fetchSuspendedList]);

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return rows.filter((item) => {
      const matchesSearch =
        !q ||
        String(item?.vehicleTitle || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.ownerName || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.consultantName || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.cityName || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.suspensionReason || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.vehicleId || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.suspensionId || "")
          .toLowerCase()
          .includes(q);

      const matchesType = !typeFilter || item?.suspensionType === typeFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "ACTIVE" && item?.isActive === true) ||
        (statusFilter === "INACTIVE" && item?.isActive === false);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rows, searchText, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      permanent: rows.filter((item) => item?.suspensionType === "PERMANENT").length,
      temporary: rows.filter((item) => item?.suspensionType === "TEMPORARY").length,
      active: rows.filter((item) => item?.isActive).length,
    };
  }, [rows]);

  const handleClearFilters = () => {
    setSearchText("");
    setTypeFilter("");
    setStatusFilter("");
  };

  const handleActionConfirm = async (payload) => {
    if (!payload?.item?.vehicleId) return;

    try {
      setActionLoading(true);
      if (payload.type === "unsuspend") {
        await unsuspendVehicle({
          vehicleId: payload.item.vehicleId,
          reason: payload.reason,
        });

        toast.success("Vehicle unsuspended successfully");
        setModal(null);
        fetchSuspendedList();
      }
    } catch (err) {
      console.error("Action failed:", err);
      toast.error(err?.response?.data?.message || err?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden p-0">
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

      <style>{`
        .table-scroll::-webkit-scrollbar { height: 8px; width: 8px; }
        .table-scroll::-webkit-scrollbar-track { background: transparent; }
        .table-scroll::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.40);
          border-radius: 999px;
        }
        .table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.55);
        }
      `}</style>

      <div className="flex flex-1 flex-col space-y-4 overflow-hidden p-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-extrabold tracking-tight text-slate-900">
              Suspended Vehicles
            </h1>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TopCard
            title="Total Suspended"
            value={loading ? "..." : stats.total}
            icon={CarFront}
            iconWrapClass="border-sky-100 bg-sky-50 text-sky-600"
          />
          <TopCard
            title="Permanent"
            value={loading ? "..." : stats.permanent}
            icon={ShieldX}
            iconWrapClass="border-rose-100 bg-rose-50 text-rose-600"
            valueClass="text-rose-600"
          />
          <TopCard
            title="Temporary"
            value={loading ? "..." : stats.temporary}
            icon={Clock3}
            iconWrapClass="border-amber-100 bg-amber-50 text-amber-600"
            valueClass="text-amber-600"
          />
          <TopCard
            title="Active Suspensions"
            value={loading ? "..." : stats.active}
            icon={BadgeCheck}
            iconWrapClass="border-emerald-100 bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-600"
          />
        </section>

        <section className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative z-10 border-b border-slate-200 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                <div className="relative min-w-0 flex-1 max-w-2xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search title, owner, consultant, city, reason, vehicle ID..."
                    className="h-11 md:h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] md:text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                  />
                </div>

                <div className="relative min-w-[220px]">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-11 md:h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 cursor-pointer"
                  >
                    <option value="">All Suspension Types</option>
                    <option value="PERMANENT">Permanent</option>
                    <option value="TEMPORARY">Temporary</option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {/* <div className="relative min-w-[180px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 md:h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[13px] font-semibold text-slate-900 outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>

                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div> */}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearFilters}
                  className="inline-flex h-11 md:h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  Clear
                </button>

                <button
                  onClick={() => fetchSuspendedList(true)}
                  className="inline-flex h-11 md:h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                  type="button"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="border-b border-slate-200 bg-rose-50/70 px-6 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="relative z-10 flex-1 overflow-auto">
            <div className="table-scroll h-full w-full overflow-auto">
              <table className="min-w-[1750px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/80 backdrop-blur-sm">
                    <th className="border-b border-r border-slate-200/60 px-6 py-4.5 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Vehicle
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Consultant / Seller
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Type
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      City
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Price
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Type
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Reason
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Suspended At
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Suspend Until
                    </th>
                    <th className="border-b border-r border-slate-200/60 px-5 py-4.5 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Status
                    </th>
                    <th className="border-b border-slate-200 px-6 py-4.5 text-right text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500/90">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-24 text-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading suspended...
                        </div>
                      </td>
                    </tr>
                  ) : filteredRows.length > 0 ? (
                    filteredRows.map((item, index) => (
                      <tr
                        key={item?.suspensionId || item?.vehicleId || index}
                        className={cls(
                          "group transition-colors duration-200 hover:bg-sky-50/45",
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/35"
                        )}
                      >
                        <td className="border-b border-slate-100 px-6 py-4.5 align-middle">
                          <div className="flex min-w-[340px] items-center gap-4">
                            <VehicleThumb
                              src={item?.thumbnailUrl}
                              alt={item?.vehicleTitle || "Vehicle"}
                            />
                            <div className="min-w-0">
                              <div className="truncate text-[14px] cursor-pointer font-bold text-slate-900 transition-colors group-hover:text-sky-700"
                                title="View Vehicles Details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/vehicles/${item.vehicleId}`);
                                }}
                              >
                                {safeText(item?.vehicleTitle)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex min-w-[180px] items-center justify-center">
                            <div
                              className={cls(
                                "flex items-center gap-2 text-[13px] font-semibold",
                                ((item?.type === "CONSULTATION" && item?.consultantName) ||
                                  ((item?.type === "USER_SELLER" || item?.type === "SELLER") && item?.ownerName))
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              )}
                            >
                              {item?.type === "CONSULTATION" && item?.consultantName ? (
                                <>
                                  <BadgeCheck className="h-4 w-4 shrink-0 text-sky-600" />
                                  <span className="truncate">{item?.consultantName}</span>
                                </>
                              ) : (item?.type === "USER_SELLER" || item?.type === "SELLER") && item?.ownerName ? (
                                <>
                                  <User className="h-4 w-4 shrink-0 text-slate-600" />
                                  <span className="truncate">{item?.ownerName}</span>
                                </>
                              ) : (
                                <span className="opacity-50">-</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                              typeBadge(item?.type === "USER_SELLER" ? "SELLER" : item?.type)
                            )}
                          >
                            {formatEnumLabel(item?.type === "USER_SELLER" ? "SELLER" : item?.type)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div
                            className={cls(
                              "inline-flex items-center justify-center gap-2 text-[13px] font-medium",
                              item?.cityName ? "text-slate-600" : "text-slate-400"
                            )}
                          >
                            <span>{safeText(item?.cityName)}</span>
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="text-[13.5px] font-bold tracking-tight text-slate-900 whitespace-nowrap">
                            {formatPrice(item?.price)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] whitespace-nowrap",
                              suspensionTypeBadge(item?.suspensionType)
                            )}
                          >
                            {safeText(item?.suspensionType)}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="mx-auto max-w-[240px] truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12.5px] font-semibold text-slate-700">
                            {safeText(item?.suspensionReason)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-700 whitespace-nowrap">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {formatDateTime(item?.suspendedAt)}
                          </div>
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          {item?.suspensionType === "PERMANENT" ? (
                            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 whitespace-nowrap">
                              Permanent
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-slate-700 whitespace-nowrap">
                              <Clock3 className="h-4 w-4 text-slate-400" />
                              {formatDateTime(item?.suspendUntil)}
                            </div>
                          )}
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4.5 text-center align-middle">
                          <span
                            className={cls(
                              "inline-flex rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                              statusBadge(item?.isActive)
                            )}
                          >
                            {item?.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-6 py-4.5 text-right align-middle">
                          <SuspendedVehiclesRowActions
                            onViewDetails={() => {
                              navigate(`/admin/vehicles/${item.vehicleId}`, {
                                state: { from: '/admin/vehicles/suspended' }
                              });
                            }}
                            onUnsuspend={() =>
                              setModal({
                                type: "unsuspend",
                                item: item,
                                title: "Restore Merchant Listing",
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-6 py-28 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                            <ShieldAlert size={28} />
                          </div>
                          <div className="text-lg font-bold tracking-tight text-slate-900">
                            No suspended vehicles found
                          </div>
                          <div className="mx-auto mt-1 max-w-sm text-[14px] text-slate-500">
                            Try adjusting your search or filters to see more results.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-slate-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredRows.length}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{rows.length}</span>{" "}
              suspended vehicles
            </div>

            <div className="text-sm font-medium text-slate-400">
              Live suspended inventory list
            </div>
          </div>
        </section>
      </div>

      <SuspendedVehiclesConfirmModal
        modal={modal}
        loading={actionLoading}
        onClose={() => setModal(null)}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
};

export default SuspendedVehicles;
