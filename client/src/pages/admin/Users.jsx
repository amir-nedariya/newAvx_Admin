import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Eye,
  X,
  Mail,
  Phone,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getUsers,
  getUserById,
  updateUserStatus,
  getUserMetaData,
} from "../../api/user.api";

/* ================= ANIMATIONS ================= */
const tableAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

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

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  /* ================= VIEW USER ================= */
  const handleViewUser = async (id) => {
    try {
      setModalLoading(true);
      const resUser = await getUserById(id);
      const resMeta = await getUserMetaData(id);

      if (resUser.status === "OK") {
        setSelectedUser({
          ...resUser.data,
          meta: resMeta.error ? null : resMeta.data,
        });
      }
    } catch {
      toast.error("Failed to load user details");
    } finally {
      setModalLoading(false);
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (user) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setUpdatingId(user.id);

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );

    try {
      await updateUserStatus(user.id, newStatus);
      toast.success(`User ${newStatus}`);
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u))
      );
      toast.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-gray-200 p-8">
      <ToastContainer position="top-right" theme="dark" />

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm">
            Manage platform users and access
          </p>
        </div>

        <span className="self-start sm:self-center px-4 py-2 rounded-full text-sm bg-[#50A2FF]/20 text-[#50A2FF]">
          Total {totalUsers}
        </span>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <motion.table
          variants={tableAnim}
          initial="hidden"
          animate="show"
          className="w-full min-w-[900px]"
        >
          <thead className="bg-[#0E1424] text-xs text-gray-400 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <motion.tr
                key={u.id}
                variants={rowAnim}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#50A2FF]/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#50A2FF]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {u.firstname} {u.lastname}
                    </p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </td>

                <td className="px-4 py-4 text-gray-300">{u.userRole}</td>

                <td className="px-4 py-4 text-center">
                  <button
                    disabled={updatingId === u.id}
                    onClick={() => toggleStatus(u)}
                    className={`relative w-12 h-6 rounded-full transition ${
                      u.status === "ACTIVE"
                        ? "bg-emerald-600"
                        : "bg-gray-600"
                    } ${updatingId === u.id && "opacity-50"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                        u.status === "ACTIVE" ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleViewUser(u.id)}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg
                      bg-[#50A2FF]/20 text-[#50A2FF] hover:bg-[#50A2FF]/30"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg disabled:opacity-40 hover:bg-white/10"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0E1424] max-w-lg w-full rounded-2xl p-6 relative border border-white/10">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {modalLoading ? (
              <div className="text-center py-10 text-gray-400">
                Loading...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-14 h-14 rounded-full bg-[#50A2FF]/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-[#50A2FF]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {selectedUser.userRole}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#50A2FF]" />
                    {selectedUser.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-emerald-400" />
                    {selectedUser.countryCode} {selectedUser.phoneNumber}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-400" />
                    {selectedUser.status}
                  </div>
                </div>

                {selectedUser.meta && (
                  <div className="bg-[#11162A] border border-white/10 rounded-xl p-4 space-y-2">
                    <h3 className="font-semibold text-white">
                      Additional Info
                    </h3>
                    <p className="text-sm text-gray-400">
                      {selectedUser.meta.profession} • {selectedUser.meta.gender}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedUser.meta.address}, {selectedUser.meta.city},{" "}
                      {selectedUser.meta.state}, {selectedUser.meta.country}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
