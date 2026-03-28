import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getConsultationById, addInternalNote } from "../../../../api/consultationApi";

const cls = (...a) => a.filter(Boolean).join(" ");

const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPTED_EXT = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];

/* ---------- small toast ---------- */
const Toast = ({ open, type = "success", message }) => {
  if (!open) return null;
  const meta =
    type === "success"
      ? {
          box: "bg-emerald-50 border-emerald-200",
          icon: "text-emerald-700",
          Icon: CheckCircle2,
          title: "Saved",
        }
      : {
          box: "bg-rose-50 border-rose-200",
          icon: "text-rose-700",
          Icon: AlertTriangle,
          title: "Error",
        };

  return (
    <div className="fixed top-4 right-4 z-[99999]">
      <div className={cls("w-[360px] rounded-2xl border bg-white shadow-lg p-3", meta.box)}>
        <div className="flex items-start gap-3">
          <div className={cls("w-10 h-10 rounded-xl border flex items-center justify-center", meta.box)}>
            <meta.Icon size={18} className={meta.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900">{meta.title}</p>
            <p className="text-[13px] text-slate-600 mt-0.5 leading-snug">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RadioCard = ({ checked, title, desc, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cls(
      "w-full text-left rounded-xl border p-4 transition flex items-start gap-3",
      checked ? "border-blue-500 bg-blue-50/60" : "border-slate-200 bg-white hover:bg-slate-50"
    )}
  >
    <span
      className={cls(
        "mt-1 w-4 h-4 rounded-full border flex items-center justify-center",
        checked ? "border-blue-600" : "border-slate-300"
      )}
    >
      {checked ? <span className="w-2 h-2 rounded-full bg-blue-600" /> : null}
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-extrabold text-slate-900">{title}</span>
      <span className="block text-[12px] text-slate-500 mt-0.5">{desc}</span>
    </span>
  </button>
);

const getExt = (name = "") => (name.split(".").pop() || "").toLowerCase();
const isAllowedFile = (file) => ACCEPTED_EXT.includes(getExt(file?.name || ""));
const formatBytes = (b) => {
  const mb = b / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
};

const InternalNoteModal = ({ uploadAttachment }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const close = () => navigate(-1);

  const fileInputRef = useRef(null);

  const [consultant, setConsultant] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const safeName = useMemo(() => {
    const c = consultant;
    return c?.consultName || c?.consultationName || c?.name || "Consultant";
  }, [consultant]);

  /* form */
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState("INTERNAL_ONLY");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  /* ui */
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    window.setTimeout(() => setToast({ open: false, type: "success", message: "" }), 2200);
  };

  const chars = note.length;
  const isValid = note.trim().length >= 3;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingProfile(true);
        const data = await getConsultationById(id);
        if (!mounted) return;
        const obj = data?.data ? data.data : data;
        setConsultant(obj || null);
      } catch {
        if (!mounted) return;
        setConsultant({ consultName: "Consultant" });
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickFile = () => fileInputRef.current?.click();

  const setPickedFile = (f) => {
    if (!f) return;

    if (!isAllowedFile(f)) {
      showToast("error", "Only PDF, DOC, JPG, PNG allowed.");
      return;
    }
    if (f.size > MAX_BYTES) {
      showToast("error", `File too large. Max ${MAX_MB}MB allowed.`);
      return;
    }
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setPickedFile(f);
  };

  const handleSave = async () => {
    if (saving) return;

    if (!isValid) {
      showToast("error", "Please write a note (min 3 characters).");
      return;
    }

    try {
      setSaving(true);

      let attachmentUrl = null;

      if (file) {
        if (typeof uploadAttachment === "function") {
          attachmentUrl = await uploadAttachment(file);
        } else {
          attachmentUrl = null;
        }
      }

      await addInternalNote({
        consultId: id,
        note: note.trim(),
        visibility,
        attachmentUrl,
      });

      showToast("success", "Internal note saved successfully.");
      window.setTimeout(() => close(), 650);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to save note";
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toast open={toast.open} type={toast.type} message={toast.message} />

      {/* overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {/* ✅ MODAL with internal scroll */}
        <div className="w-full max-w-[520px] max-h-[90vh] rounded-2xl bg-white border border-slate-200 shadow-[0_30px_90px_-50px_rgba(2,6,23,0.55)] overflow-hidden flex flex-col">
          {/* ✅ header fixed */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FileText size={18} className="text-blue-700" />
              </div>

              <div className="min-w-0">
                <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight">
                  Add Internal Note
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5 truncate">
                  {loadingProfile ? "Loading..." : safeName}
                </p>
              </div>
            </div>

            <button
              onClick={close}
              disabled={saving}
              className="w-9 h-9 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-center disabled:opacity-60"
              aria-label="Close"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          {/* ✅ body scroll only */}
          <div className="px-5 py-4 space-y-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {/* Note */}
            <div>
              <label className="block text-[13px] font-bold text-slate-800">
                Note <span className="text-rose-600">*</span>
              </label>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your internal note here..."
                className="mt-2 w-full min-h-[160px] resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13.5px] outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300"
              />

              <div className="mt-2 text-[12px] text-slate-500">{chars} characters</div>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-slate-800">Visibility</p>

              <div className="space-y-2">
                <RadioCard
                  checked={visibility === "INTERNAL_ONLY"}
                  title="Internal Only"
                  desc="Only visible to admins"
                  onClick={() => setVisibility("INTERNAL_ONLY")}
                />
                <RadioCard
                  checked={visibility === "COMPLIANCE_TEAM"}
                  title="Visible to Compliance Team"
                  desc="Shared with compliance reviewers"
                  onClick={() => setVisibility("COMPLIANCE_TEAM")}
                />
              </div>
            </div>

            {/* Attach */}
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-slate-800">Attach File (Optional)</p>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setPickedFile(e.target.files?.[0])}
              />

              <div
                onClick={pickFile}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cls(
                  "rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition",
                  dragOver ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <UploadCloud size={18} className="text-slate-500" />
                  </div>

                  <p className="mt-2 text-[13px] font-semibold text-slate-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    PDF, DOC, JPG, PNG (max {MAX_MB}MB)
                  </p>
                </div>
              </div>

              {file ? (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[12px] text-slate-500">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-[12px] font-extrabold text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>

            {/* Info box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
              <p className="text-[12.5px] font-extrabold text-slate-900">Note will be saved to:</p>
              <ul className="mt-2 text-[12.5px] text-blue-800 space-y-1 list-disc ml-5">
                <li>Activity Logs section</li>
                <li>Timestamped with your admin ID</li>
                <li>Cannot be edited after saving</li>
              </ul>
            </div>
          </div>

          {/* ✅ footer fixed */}
          <div className="px-5 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={close}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={!isValid || saving}
              className={cls(
                "px-4 py-2 rounded-xl font-extrabold text-white inline-flex items-center gap-2",
                !isValid || saving ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Note"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalNoteModal;