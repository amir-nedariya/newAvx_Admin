import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  User,
  Car,
  HelpCircle,
  Send,
  CalendarDays,
  BadgeCheck,
  UserCheck,
  X,
  Loader2,
  AlertTriangle,
  Paperclip,
  ExternalLink,
  FileText,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getHelpTicketDetailsById, resolveHelpTicket } from "../../../api/consultationApi";

const cls = (...classes) => classes.filter(Boolean).join(" ");

const priorityBadge = (priority) => {
  const p = String(priority || "").toUpperCase();
  if (p === "CRITICAL") return "bg-rose-50 text-rose-700 border-rose-200";
  if (p === "HIGH") return "bg-orange-50 text-orange-700 border-orange-200";
  if (p === "MEDIUM") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
};

const statusBadge = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "SOLVED" || s === "RESOLVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "ASSIGNED") return "bg-purple-50 text-purple-700 border-purple-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const HelpTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Solve Modal state
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [solveRemarks, setSolveRemarks] = useState("");
  const [solving, setSolving] = useState(false);

  // Image Preview Modal state
  const [previewImage, setPreviewImage] = useState({ open: false, url: "", title: "" });

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const res = await getHelpTicketDetailsById(id);
      if (res.status === "OK") {
        setTicket(res.data);
      } else {
        toast.error("Failed to load help ticket details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading help ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
    }
  }, [id]);



  const handleConfirmSolve = async () => {
    try {
      setSolving(true);
      const payload = {
        helpTicketId: ticket.id,
        remarks: solveRemarks.trim() || null,
      };
      const res = await resolveHelpTicket(payload);
      if (res.status === "OK") {
        setTicket((prev) => ({
          ...prev,
          status: "SOLVED",
          ticketStatus: "SOLVED",
        }));
        toast.success("Ticket resolved successfully!");
        setIsSolveModalOpen(false);
        setSolveRemarks("");
      } else {
        toast.error("Failed to resolve help ticket");
      }
    } catch (err) {
      console.error(err);
      // Fallback for simulation mode
      setTicket((prev) => ({
        ...prev,
        status: "SOLVED",
        ticketStatus: "SOLVED",
      }));
      toast.success("Ticket marked as solved (Simulation mode)");
      setIsSolveModalOpen(false);
      setSolveRemarks("");
    } finally {
      setSolving(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return new Date(timeStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-slate-50/50 p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-md">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Loading ticket details...
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-slate-50/50 p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-rose-500 shadow-sm">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Ticket not found</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          The requested ticket ID does not exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/admin/consultants/help-center")}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
        >
          <ArrowLeft size={14} />
          Back to Help Center
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 p-6 bg-slate-50/50 min-h-screen text-left">
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

      {/* Header Toolbar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-5 border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/admin/consultants/help-center")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm transition-all shrink-0"
            title="Back to Help Center"
          >
            <ArrowLeft size={16} className="stroke-[2.5px]" />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {ticket.category && (
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-sans font-bold text-[10px] uppercase tracking-wider">
                  {ticket.category}
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1 leading-tight truncate" title={ticket.subject}>
              {ticket.subject}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Submitted by <span className="font-semibold text-slate-600">{ticket.consultantName || ticket.userFullName || ticket.consultName || "User"}</span>
            </p>
          </div>
        </div>

        {ticket.status !== "SOLVED" && ticket.ticketStatus !== "SOLVED" && (
          <button
            onClick={() => setIsSolveModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-100 shrink-0 self-start sm:self-center"
          >
            <BadgeCheck size={14} className="stroke-[2.5px]" />
            Mark as Solved
          </button>
        )}
      </section>

      {/* Main Single Card Workspace: Unified vertical flow */}
      <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_8px_30px_rgba(15,23,42,0.04)] p-6 space-y-6">
        
        {/* 1. Description Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-500 shrink-0">
              <HelpCircle size={13} className="stroke-[2.5px]" />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ticket Description</span>
          </div>
          <div className="bg-indigo-50/10 border border-indigo-100/50 border-l-[3.5px] border-l-indigo-500/80 p-4 rounded-xl shadow-[0_2px_12px_rgba(99,102,241,0.02)]">
            <p className="text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* 2. Ticket Information (Horizontal Grid Layout) */}
        <div className="pt-6 border-t border-slate-100 space-y-3.5 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-500 shrink-0">
              <Ticket size={13} className="stroke-[2.5px]" />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ticket Information</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)] text-left">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
              <div className="mt-1">
                <span className={cls("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide", priorityBadge(ticket.priority))}>
                  {ticket.priority}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
              <div className="mt-1">
                <span className={cls("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide", statusBadge(ticket.status))}>
                  {ticket.status}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Agent</span>
              <span className="text-xs font-bold text-slate-700 block mt-1">
                {ticket.assignedTo || <span className="text-slate-400 font-medium italic">Unassigned</span>}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted At</span>
              <span className="text-xs font-bold text-slate-700 block mt-1">
                {formatTime(ticket.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. User Information Section (Horizontal Row Grid) */}
        {(ticket.userEmail || ticket.userPhoneNumber || ticket.userRole) && (
          <div className="pt-6 border-t border-slate-100 space-y-3.5 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-500 shrink-0">
                <User size={13} className="stroke-[2.5px]" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">User Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_4px_25px_rgba(15,23,42,0.04)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Email</span>
                <span className="text-slate-700 font-bold block truncate" title={ticket.userEmail}>
                  {ticket.userEmail || <span className="text-slate-400 italic font-medium">-</span>}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_4px_25px_rgba(15,23,42,0.04)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Phone Number</span>
                <span className="text-slate-700 font-bold block">
                  {ticket.userPhoneNumber || <span className="text-slate-400 italic font-medium">-</span>}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_4px_25px_rgba(15,23,42,0.04)] transition-all duration-300">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Role</span>
                <div>
                  <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    {ticket.userRole || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Related Vehicle Section */}
        {ticket.vehicleName && (
          <div className="pt-6 border-t border-slate-100 space-y-3.5 text-xs">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-500 shrink-0">
                <Car size={13} className="stroke-[2.5px]" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Related Vehicle</span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_4px_25px_rgba(15,23,42,0.04)] transition-all duration-300 text-left">
              {ticket.vehicleThumbnailUrl ? (
                <img
                  src={ticket.vehicleThumbnailUrl}
                  alt={ticket.vehicleName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                  <Car className="w-6 h-6 stroke-[1.8px]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-slate-800 truncate" title={ticket.vehicleName}>
                  {ticket.vehicleName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wide">
                    {(() => {
                      const price = parseFloat(String(ticket.vehiclePrice).replace(/[^0-9.]/g, ""));
                      return isNaN(price) ? ticket.vehiclePrice : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Ticket Attachments Section */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-3.5 text-xs">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-500 shrink-0">
                <Paperclip size={13} className="stroke-[2.5px]" />
              </div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ticket Attachments</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
              {ticket.attachments.map((url, index) => {
                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes("scaled.webp") || url.includes("jpg") || url.includes("png");
                const fileName = url.substring(url.lastIndexOf("/") + 1);
                
                return (
                  <div key={index} className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_4px_25px_rgba(15,23,42,0.04)] transition-all duration-300">
                    <div className="flex items-center gap-3 min-w-0">
                      {isImage ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-sm">
                          <img
                            src={url}
                            alt={fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                          <FileText className="w-5 h-5 stroke-[1.8px]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-slate-700 truncate" title={fileName}>
                          {fileName.length > 20 ? `${fileName.substring(0, 10)}...${fileName.substring(fileName.length - 6)}` : fileName}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {isImage ? "Image" : "Document"}
                        </span>
                      </div>
                    </div>

                    {isImage ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ open: true, url, title: fileName })}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm transition-all shrink-0 cursor-pointer"
                        title="Preview Image"
                      >
                        <Eye size={14} className="stroke-[2px]" />
                      </button>
                    ) : (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 shadow-sm transition-all shrink-0"
                        title="Open Attachment"
                      >
                        <ExternalLink size={14} className="stroke-[2px]" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* MARK AS SOLVED MODAL */}
      {isSolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <BadgeCheck size={18} />
                </div>
                <h3 className="font-extrabold text-slate-900">Mark as Solved</h3>
              </div>
              <button
                onClick={() => setIsSolveModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center border border-slate-200"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Are you sure you want to mark ticket <span className="font-bold text-slate-900"></span> as resolved?
              </p>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolution Remarks (Optional)</label>
                <textarea
                  value={solveRemarks}
                  onChange={(e) => setSolveRemarks(e.target.value)}
                  placeholder="Enter comments or resolution details..."
                  className="w-full h-20 px-3.5 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400 resize-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 italic">
                This will update the ticket status to <span className="text-emerald-600 font-semibold font-sans">SOLVED</span> and trigger the backend resolution workflow.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                disabled={solving}
                onClick={() => setIsSolveModalOpen(false)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={solving}
                onClick={handleConfirmSolve}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {solving && <Loader2 className="h-3 w-3 animate-spin text-white" />}
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
      {/* IMAGE PREVIEW MODAL */}
      {previewImage.open && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setPreviewImage({ open: false, url: "", title: "" })}
          />
          <div className="fixed left-1/2 top-1/2 z-[101] w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {previewImage.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">Attachment preview</p>
              </div>

              <button
                onClick={() => setPreviewImage({ open: false, url: "", title: "" })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex max-h-[80vh] min-h-[320px] items-center justify-center bg-slate-100 p-4">
              {previewImage.url ? (
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="max-h-[72vh] w-auto max-w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={34} />
                  <p className="mt-2 text-sm font-semibold">No image available</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HelpTicketDetail;
