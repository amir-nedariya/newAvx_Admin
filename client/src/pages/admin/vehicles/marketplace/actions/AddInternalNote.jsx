import React, { useState, useEffect } from "react";
import { 
  FileText, 
  AlertTriangle, 
  ChevronDown, 
  Loader2, 
  X,
  Eye,
  Link as LinkIcon,
  MessageSquarePlus
} from "lucide-react";
import { addVehicleInternalNote } from "../../../../../api/vehicle.api";
import toast from "react-hot-toast";

const cls = (...a) => a.filter(Boolean).join(" ");

const AddInternalNoteModal = ({ isOpen, onClose, vehicleId, vehicleTitle, onSuccess }) => {
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState("INTERNAL_ONLY");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setNote("");
      setVisibility("INTERNAL_ONLY");
      setAttachmentUrl("");
      setError("");
    }
  }, [isOpen]);

  const handleSaveNote = async () => {
    try {
      setError("");

      if (!vehicleId) {
        setError("Vehicle ID not found.");
        return;
      }

      if (!note.trim()) {
        setError("Please enter a note.");
        return;
      }

      setLoading(true);

      const payload = {
        vehicleId,
        note: note.trim(),
        visibility,
        attachmentUrl: attachmentUrl.trim() || null,
      };

      const response = await addVehicleInternalNote(payload);
      toast.success(response?.message || "Internal note added successfully");
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error("ADD INTERNAL NOTE ERROR:", e);
      const msg = e?.response?.data?.message || e?.message || "Failed to add internal note";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
      />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.12)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-rose-50 to-white px-5 py-5 md:px-6 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Add Internal Note
              </h1>
              {vehicleTitle && (
                <p className="mt-1 text-[14px] font-bold text-slate-900">
                  {vehicleTitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-6">
          {/* NOTE CONTENT */}
          <label className="block">
            <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-2">
              <MessageSquarePlus size={14} className="text-rose-500" />
              Note Description
            </div>

            <textarea
              rows="5"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter detailed observations, compliance checks, or maintenance logs..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100 placeholder:text-slate-400"
            />
          </label>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* VISIBILITY */}
            <label className="block">
              <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-2">
                <Eye size={14} />
                Visibility Scope
              </div>

              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                >
                  <option value="INTERNAL_ONLY">🔒 Internal Admin Only</option>
                  <option value="COMPLIANCE_TEAM">⚖️ Compliance & Audit</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            {/* ATTACHMENT */}
            <label className="block">
              <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 flex items-center gap-2">
                <LinkIcon size={14} />
                Reference Link (Optional)
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://docs.google.com/..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[13.5px] font-medium text-slate-900 outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100 placeholder:text-slate-400"
                />
              </div>
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveNote}
              disabled={loading}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-rose-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-rose-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Save Internal Note
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AddInternalNoteModal;