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

const cls = (...a) => a.filter(Boolean).join(" ");

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button
      {...props}
      className={cls(
        "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed",
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
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (lockClose) return;
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-[720px] max-h-[90vh] bg-white border border-gray-200 rounded-2xl shadow-[0_30px_90px_-50px_rgba(2,6,23,0.55)] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between bg-white">
          <div>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
            ) : null}
          </div>

          <button
            onClick={() => !lockClose && onClose?.()}
            className={cls(
              "w-9 h-9 rounded-xl border transition flex items-center justify-center",
              lockClose
                ? "opacity-50 cursor-not-allowed border-transparent"
                : "hover:bg-gray-50 border-transparent hover:border-gray-200"
            )}
            type="button"
            disabled={lockClose}
            aria-label="Close"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>

        <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-white">
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
  // Accepts:
  // 1) direct map: { KEY: "LABEL" }
  // 2) full API response: { status, data: { KEY: "LABEL" } }
  // 3) array: ["KEY1","KEY2"] (fallback)
  const raw =
    limitNamesProp?.data?.data ??
    limitNamesProp?.data ??
    limitNamesProp ??
    {};

  if (Array.isArray(raw)) {
    return raw.map((k) => ({ value: String(k), label: String(k) }));
  }

  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([value, label]) => ({
      value: String(value), // send this to backend
      label: String(label), // show this in UI
    }));
  }

  return [];
};

const AddLimitsModal = ({
  open,
  tierPlanId,
  tierTitle,
  limitNames = {}, // pass namesRes?.data?.data ideally
  onClose,
  onCancel,
  onSave, // expects payload: { tierPlanId, limits: [{limitsName, limitsValue}] }
  saving,
}) => {
  const options = useMemo(() => normalizeLimitNames(limitNames), [limitNames]);

  const [rows, setRows] = useState([{ limitsName: "", limitsValue: "" }]);
  const lockClose = !!saving;

  // reset rows every time modal opens (clean UX)
  useEffect(() => {
    if (open) setRows([{ limitsName: "", limitsValue: "" }]);
  }, [open]);

  const valid = rows.every((r) => {
    const nameOk = String(r.limitsName || "").trim().length > 0;
    const val = String(r.limitsValue ?? "").trim();
    if (!nameOk) return false;

    const t = guessType(r.limitsName);
    if (t === "boolean") return ["true", "false"].includes(val.toLowerCase());
    return val.length > 0 && !Number.isNaN(Number(val));
  });

  const addRow = () =>
    setRows((p) => [...p, { limitsName: "", limitsValue: "" }]);

  const removeRow = (idx) =>
    setRows((p) => (p.length === 1 ? p : p.filter((_, i) => i !== idx)));

  const handleSave = () => {
    if (!tierPlanId) return;
    if (!valid || saving) return;

    onSave?.({
      tierPlanId,
      limits: rows.map((r) => ({
        limitsName: String(r.limitsName), // ✅ ENUM KEY
        limitsValue: String(r.limitsValue).trim(), // "100" or "true"
      })),
    });
  };

  return (
    <ModalShell
      open={open}
      title="Add Tier Limits"
      subtitle={
        tierTitle
          ? `Tier: ${tierTitle} (POST /api/tier-plan-limits)`
          : "POST /api/tier-plan-limits"
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
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-extrabold text-gray-900">
                  Limit #{idx + 1}
                </p>
                <button
                  type="button"
                  className="text-xs font-extrabold text-rose-600 hover:text-rose-700 disabled:opacity-60"
                  disabled={lockClose}
                  onClick={() => removeRow(idx)}
                >
                  Remove
                </button>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Limit Name *
                  </label>

                  <select
                    value={r.limitsName}
                    disabled={lockClose}
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
                    className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select limit name</option>

                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {options.length === 0 ? (
                    <p className="text-[11px] text-amber-600 mt-1">
                      No limit names found. Please check API response.
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
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
                    className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={t === "boolean" ? "true / false" : "100"}
                  />

                  <p className="text-[11px] text-gray-500 mt-1">{hint}</p>
                </div>
              </div>
            </div>
          );
        })}

        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={addRow}
          disabled={lockClose}
        >
          <span className="inline-flex items-center gap-2">
            <Plus size={16} /> Add another limit
          </span>
        </Button>
      </div>
    </ModalShell>
  );
};

export default AddLimitsModal;