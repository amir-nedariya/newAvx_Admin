import React, { useEffect, useState } from "react";
import {
  User,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ban,
  ShieldAlert,
  Clock,
  CheckCircle,
  Car,
  Flag,
  UserX,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import {
  getUsers,
  getPendingUserSellers,
  getSuspendedUserSellers,
  getFlaggedUserSellers,
  getUserSellerStats,
} from "../../api/user.api";

const Users = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "suspended", "flagged"
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVerifiedUserSellers: 0,
    totalListedVehicles: 0,
    totalActiveFlaggedUserSellers: 0,
    totalSuspendedUserSellers: 0,
  });

  /* ================= FETCH USERS ================= */
  const fetchUsers = async (pageNo) => {
    try {
      setLoading(true);
      const res = await getUsers(pageNo);
      if (res.status === "OK") {
        setUsers(res.data);
        setPage(res.pageResponse.currentPage);
        setTotalPages(res.pageResponse.totalPages);
        setTotalUsers(res.pageResponse.totalElements);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH PENDING USERS ================= */
  const fetchPendingUsers = async (pageNo) => {
    try {
      setLoading(true);
      const res = await getPendingUserSellers(pageNo);
      if (res.status === "OK") {
        setPendingUsers(res.data);
        setPage(res.pageResponse.currentPage);
        setTotalPages(res.pageResponse.totalPages);
        setTotalUsers(res.pageResponse.totalElements);
      }
    } catch {
      toast.error("Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH SUSPENDED USERS ================= */
  const fetchSuspendedUsers = async () => {
    try {
      setLoading(true);
      const res = await getSuspendedUserSellers();
      if (res.status === "OK") {
        setSuspendedUsers(res.data);
      }
    } catch {
      toast.error("Failed to fetch suspended users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH FLAGGED USERS ================= */
  const fetchFlaggedUsers = async () => {
    try {
      setLoading(true);
      const res = await getFlaggedUserSellers();
      if (res.status === "OK") {
        setFlaggedUsers(res.data);
      }
    } catch {
      toast.error("Failed to fetch flagged users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await getUserSellerStats();
      if (res.status === "OK") {
        setStats(res.data);
      }
    } catch {
      // Silently fail for stats
      console.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      fetchUsers(page);
    } else if (activeTab === "pending") {
      fetchPendingUsers(page);
    } else if (activeTab === "suspended") {
      fetchSuspendedUsers();
    } else if (activeTab === "flagged") {
      fetchFlaggedUsers();
    }
  }, [activeTab, page]);

  const formatEnumLabel = (value) => {
    if (!value) return "-";
    return String(value).replace(/_/g, " ");
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REQUESTED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "REQUEST_CHANGES":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  /* ================= VIEW USER ================= */
  const handleViewUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          <span className="text-lg font-medium">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <ToastContainer position="top-right" theme="light" />

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <div className="mx-auto w-full px-4 flex-1 flex flex-col min-h-0">
          {/* ================= HEADER ================= */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
                <p className="text-slate-600 text-sm mt-1">
                  Manage platform users and access control
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-200 px-4 py-2">
                <User className="h-4 w-4 text-sky-600" />
                <span className="text-sm font-semibold text-sky-700">
                  Total: {activeTab === "all" ? totalUsers : activeTab === "pending" ? totalUsers : activeTab === "suspended" ? suspendedUsers.length : flaggedUsers.length}
                </span>
              </div>
            </div>
          </div>

          {/* ================= STATS CARDS ================= */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
            {/* Verified Users */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Verified Users
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.totalVerifiedUserSellers}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Listed Vehicles */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Listed Vehicles
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.totalListedVehicles}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
                  <Car className="h-6 w-6 text-sky-600" />
                </div>
              </div>
            </div>

            {/* Flagged Users */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Flagged Users
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.totalActiveFlaggedUserSellers}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                  <Flag className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Suspended Users */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Suspended Users
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stats.totalSuspendedUserSellers}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                  <UserX className="h-6 w-6 text-rose-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= TABS ================= */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "all"
                  ? "bg-sky-100 text-sky-700 border border-sky-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  All Sellers
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("pending");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "pending"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("suspended");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "suspended"
                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Suspended
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("flagged");
                  setPage(1);
                }}
                className={`px-6 py-3 text-sm font-semibold transition-all rounded-lg ${activeTab === "flagged"
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Flagged
                </div>
              </button>
            </div>
          </div>

          {/* ================= TABLE CARD ================= */}
          <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-0">
            <div className="flex-1 overflow-auto">
              {activeTab === "all" && (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-4 py-4">Phone</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Verification Status</th>
                      <th className="px-4 py-4">Register At</th>
                      {/* <th className="px-4 py-4">Updated At</th> */}
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-sky-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            <p className="truncate">{(u?.email) ? u.email : "-"}</p>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {u.countryCode} {u.phoneNumber}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatEnumLabel(u.userRole)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getVerificationStatusColor(u.verificationStatus)}`}>
                            {formatEnumLabel(u.verificationStatus) || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        {/* <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.updatedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td> */}

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "pending" && (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-4 py-4">Phone</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Role</th>
                      <th className="px-4 py-4">Verification Status</th>
                      <th className="px-4 py-4">Created At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {pendingUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            <p className="truncate">{(u?.email) ? u.email : "-"}</p>
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {u.countryCode} {u.phoneNumber}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                            }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatEnumLabel(u.userRole)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getVerificationStatusColor(u.verificationStatus)}`}>
                            {formatEnumLabel(u.verificationStatus) || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "suspended" && (
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-4 py-4">City</th>
                      <th className="px-4 py-4">Reason</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Suspend Until</th>
                      <th className="px-4 py-4">Suspended At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {suspendedUsers.map((u) => (
                      <tr
                        key={u.suspensionId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-rose-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{u.city || "-"}</span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 line-clamp-2 max-w-xs">
                            {u.reason}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${u.suspenseType === "PERMANENT"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}>
                            {formatEnumLabel(u.suspenseType)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {u.suspendUntil
                              ? new Date(u.suspendUntil).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.suspendedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.userId)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "flagged" && (
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                      <th className="px-6 py-4">User</th>
                      <th className="px-4 py-4">City</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Severity</th>
                      <th className="px-4 py-4">Notes</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4">Flagged At</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {flaggedUsers.map((u) => (
                      <tr
                        key={u.flagReviewId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => handleViewUser(u.id)}
                                title="View user details"
                                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600"
                              >
                                {u.firstname} {u.lastname}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{u.city || "-"}</span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {formatEnumLabel(u.flagCategory)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${u.severity === "HIGH"
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : u.severity === "MODERATE"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}>
                            {u.severity}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700 line-clamp-2 max-w-xs">
                            {u.internalNotes}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${u.isResolved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                            }`}>
                            {u.isResolved ? "Resolved" : "Pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">
                            {new Date(u.flaggedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewUser(u.userId)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                              bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ================= PAGINATION ================= */}
            {(activeTab === "all" || activeTab === "pending") && totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
                <p className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
