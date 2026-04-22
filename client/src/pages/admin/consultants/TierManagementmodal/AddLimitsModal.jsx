/* =========================================================
   ✅ FILE: src/pages/admin/consultants/TierManagementmodal/AddLimitsModal.jsx
   ✅ FIXED for your API response:

   GET /api/tier-plan-limits/limit-names
   {
     status:"OK",
     data: {
       MAX_FREE_INSPECTION: "MAX FREE INSPECTION",
       STORE_IMAGE_UPLOAD: "STORE IMAGE UPLOAD",
       ...
     }
   }

   ✅ Dropdown shows LABEL (MAX FREE INSPECTION)
   ✅ Payload sends VALUE (MAX_FREE_INSPECTION)
========================================================= */

import React, { useMemo, useState, useEffect } from "react";
import { X, Loader2, Plus } from "lucide-react";
import { getTierLimitNames } from "../../../../api/tierPlanLimits.api";

const cls = (...a) => a.filter(Boolean).join(" ");

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-sm",
    secondary:
      "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      {...props}
      className={cls(
        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",
        styles[variant] || styles.primary,
        className
      )}
    >
      {children}
    </button>
  );
};

const ModalShell = ({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  lockClose = false,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (lockClose) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-[720px] max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            ) : null}
          </div>

          <button
            onClick={() => !lockClose && onClose?.()}
            className={cls(
              "w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center",
              lockClose
                ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50"
                : "hover:bg-slate-50 border-slate-200 hover:border-slate-300 active:scale-95"
            )}
            type="button"
            disabled={lockClose}
            aria-label="Close"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1 bg-slate-50/30">{children}</div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-white">
          {footer}
        </div>
      </div>
    </div>
  );
};

const guessType = (enumKey = "") => {
  const n = String(enumKey).toUpperCase();
  // Your boolean example: STORE_IMAGE_UPLOAD
  if (n.includes("UPLOAD") || n.includes("BOOLEAN")) return "boolean";
  return "number";
};

const normalizeLimitNames = (limitNamesProp) => {
  // Debug: Log what we receive
  console.log("🔍 AddLimitsModal - limitNamesProp received:", limitNamesProp);

  // Accepts:
  // 1) direct map: { KEY: "LABEL" }
  // 2) full API response: { status, data: { KEY: "LABEL" } }
  // 3) nested API response: { status, data: { data: { KEY: "LABEL" } } }
  // 4) array: ["KEY1","KEY2"] (fallback)

  const raw =
    limitNamesProp?.data?.data ??  // Try nested data first
    limitNamesProp?.data ??         // Then try direct data
    limitNamesProp ??               // Then try the prop itself
    {};

  console.log("🔍 AddLimitsModal - raw data extracted:", raw);

  if (Array.isArray(raw)) {
    const result = raw.map((k) => ({ value: String(k), label: String(k) }));
    console.log("🔍 AddLimitsModal - normalized (array):", result);
    return result;
  }

  if (raw && typeof raw === "object") {
    const result = Object.entries(raw).map(([value, label]) => ({
      value: String(value), // send this to backend (e.g., "MAX_FREE_INSPECTION")
      label: String(label), // show this in UI (e.g., "MAX FREE INSPECTION")
    }));
    console.log("🔍 AddLimitsModal - normalized (object):", result);
    return result;
  }

  console.log("⚠️ AddLimitsModal - no valid data found, returning empty array");
  return [];
};

const AddLimitsModal = ({
  open,
  tierPlanId,
  tierTitle,
  onClose,
  onCancel,
  onSave, // expects payload: { tierPlanId, limits: [{limitsName, limitsValue}] }
  saving,
}) => {
  const [limitNames, setLimitNames] = useState({});
  const [loadingLimitNames, setLoadingLimitNames] = useState(false);

  const options = useMemo(() => {
    const result = normalizeLimitNames(limitNames);
    console.log("🔍 AddLimitsModal - final options:", result);
    return result;
  }, [limitNames]);

  const [rows, setRows] = useState([{ limitsName: "", limitsValue: "" }]);
  const lockClose = !!saving;

  // Fetch limit names when modal opens
  useEffect(() => {
    const fetchLimitNames = async () => {
      if (!open) return;

      try {
        setLoadingLimitNames(true);
        console.log("🔍 AddLimitsModal - Fetching limit names...");

        const response = await getTierLimitNames();

        console.log("🔍 AddLimitsModal - API response:", response);
        console.log("🔍 AddLimitsModal - response.data:", response?.data);

        // Set the limit names from the API response
        setLimitNames(response?.data || response?.data?.data || {});
      } catch (error) {
        console.error("❌ AddLimitsModal - Error fetching limit names:", error);
        setLimitNames({});
      } finally {
        setLoadingLimitNames(false);
      }
    };

    fetchLimitNames();
  }, [open]);

  // Debug: Log when options change
  useEffect(() => {
    console.log("🔍 AddLimitsModal - options updated:", options);
    console.log("🔍 AddLimitsModal - options.length:", options.length);
  }, [options]);

  // reset rows every time modal opens (clean UX)
  useEffect(() => {
    if (open) setRows([{ limitsName: "", limitsValue: "" }]);
  }, [open]);

  const valid = rows.every((r) => {
    const nameOk = String(r.limitsName || "").trim().length > 0;
    const val = String(r.limitsValue ?? "").trim();

    console.log("🔍 AddLimitsModal - Validating row:", r);
    console.log("🔍 AddLimitsModal - nameOk:", nameOk);
    console.log("🔍 AddLimitsModal - val:", val);

    if (!nameOk) {
      console.log("❌ AddLimitsModal - Name not valid");
      return false;
    }

    const t = guessType(r.limitsName);
    console.log("🔍 AddLimitsModal - guessed type:", t);

    if (t === "boolean") {
      const isValidBoolean = ["true", "false"].includes(val.toLowerCase());
      console.log("🔍 AddLimitsModal - boolean validation:", isValidBoolean);
      return isValidBoolean;
    }

    const isValidNumber = val.length > 0 && !Number.isNaN(Number(val));
    console.log("🔍 AddLimitsModal - number validation:", isValidNumber);
    return isValidNumber;
  });

  console.log("🔍 AddLimitsModal - Overall valid:", valid);

  const addRow = () =>
    setRows((p) => [...p, { limitsName: "", limitsValue: "" }]);

  const removeRow = (idx) =>
    setRows((p) => (p.length === 1 ? p : p.filter((_, i) => i !== idx)));

  const handleSave = () => {
    console.log("🔍 AddLimitsModal - handleSave called");
    console.log("🔍 AddLimitsModal - tierPlanId:", tierPlanId);
    console.log("🔍 AddLimitsModal - valid:", valid);
    console.log("🔍 AddLimitsModal - saving:", saving);
    console.log("🔍 AddLimitsModal - rows:", rows);

    if (!tierPlanId) {
      console.log("❌ AddLimitsModal - No tierPlanId, returning");
      return;
    }

    if (!valid) {
      console.log("❌ AddLimitsModal - Form not valid, returning");
      return;
    }

    if (saving) {
      console.log("❌ AddLimitsModal - Already saving, returning");
      return;
    }

    const payload = {
      tierPlanId,
      limits: rows.map((r) => ({
        limitsName: String(r.limitsName), // ✅ ENUM KEY
        limitsValue: String(r.limitsValue).trim(), // "100" or "true"
      })),
    };

    console.log("✅ AddLimitsModal - Calling onSave with payload:", payload);
    onSave?.(payload);
  };

  return (
    <ModalShell
      open={open}
      title="Add Tier Limits"
      subtitle={
        tierTitle
          ? `Tier: ${tierTitle} — Add new limits to this tier plan`
          : "Add new limits"
      }
      onClose={onClose}
      lockClose={lockClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={lockClose}
            type="button"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!valid || lockClose}
            type="button"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Saving...
              </span>
            ) : (
              "Save Limits"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {rows.map((r, idx) => {
          const t = guessType(r.limitsName);
          const hint =
            t === "boolean"
              ? 'Value must be "true" or "false"'
              : "Value must be a number";

          return (
            <div
              key={idx}
              className="rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <p className="text-base font-extrabold text-slate-900">
                  Limit #{idx + 1}
                </p>
                <button
                  type="button"
                  className="text-sm font-bold text-rose-600 hover:text-rose-700 disabled:opacity-60 transition-colors"
                  disabled={lockClose}
                  onClick={() => removeRow(idx)}
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Limit Name *
                  </label>

                  <select
                    value={r.limitsName}
                    disabled={lockClose || loadingLimitNames}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRows((p) =>
                        p.map((it, i) =>
                          i === idx
                            ? {
                              ...it,
                              limitsName: val,
                              limitsValue: "", // reset value when name changes
                            }
                            : it
                        )
                      );
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingLimitNames ? "Loading limit names..." : "Select limit name"}
                    </option>

                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {loadingLimitNames ? (
                    <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" />
                      Loading limit names...
                    </p>
                  ) : options.length === 0 ? (
                    <p className="text-xs text-amber-600 mt-2 font-medium">
                      No limit names found. Please check API response.
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">
                      {options.length} limit names available
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Limit Value *
                  </label>

                  <input
                    value={r.limitsValue}
                    disabled={lockClose}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRows((p) =>
                        p.map((it, i) =>
                          i === idx ? { ...it, limitsValue: val } : it
                        )
                      );
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-semibold text-slate-900 transition-all"
                    placeholder={t === "boolean" ? "true / false" : "100"}
                  />

                  <p className="text-xs text-slate-500 mt-2 font-medium">{hint}</p>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addRow}
          disabled={lockClose}
          className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60 active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-2">
            <Plus size={16} /> Add another limit
          </span>
        </button>
      </div>
    </ModalShell>
  );
};

export default AddLimitsModal;
