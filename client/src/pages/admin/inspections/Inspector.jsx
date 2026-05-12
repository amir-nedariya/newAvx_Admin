import React, { useEffect, useRef, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    RefreshCw,
    Clock3,
    User,
    MoreHorizontal,
    Eye,
    EyeOff,
    Pencil,
    Trash2,
    Plus,
    X,
    Loader2,
    ChevronDown,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    getAllInspectors,
    createInspector,
    updateInspector,
    deleteInspector,
} from "../../../api/inspector.api";
import { getStates, getCities } from "../../../api/addressApi";
import InspectorDetail from "./modal/InspectorDetail";

const cls = (...a) => a.filter(Boolean).join(" ");

const formatDateTime = (timestamp) => {
    if (!timestamp) return "—";

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

const statusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    const map = {
        ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
        INACTIVE: "bg-slate-50 text-slate-700 border-slate-200",
    };
    return map[s] || "bg-slate-50 text-slate-700 border-slate-200";
};

/* =========================================================
   ROW ACTIONS
========================================================= */
function RowActions({ item, onView, onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="relative inline-flex justify-end" ref={ref}>
            <button
                onClick={() => setOpen((p) => !p)}
                className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    <button
                        onClick={() => { onView(item); setOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Eye className="h-4 w-4 text-slate-500" />
                        View Details
                    </button>
                    <button
                        onClick={() => { onEdit(item); setOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit Inspector
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                        onClick={() => { onDelete(item); setOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Inspector
                    </button>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   FILE UPLOAD FIELD
========================================================= */
function ImageUploadField({ label, value, onChange, disabled }) {
    const inputRef = useRef(null);

    // value = { file: File, preview: string } | null
    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        onChange({ file, preview });
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const preview = value?.preview || null;

    return (
        <div>
            <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</label>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={handleFile}
            />

            {preview ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={preview} alt={label} className="h-28 w-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button type="button" onClick={() => !disabled && inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-800 hover:bg-slate-100 transition-colors">
                            <Pencil className="h-3 w-3" />
                            Change
                        </button>
                        <button type="button" onClick={handleRemove} disabled={disabled} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-rose-700 transition-colors">
                            <Trash2 className="h-3 w-3" />
                            Remove
                        </button>
                    </div>
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                        {value?.file?.name || label}
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => !disabled && inputRef.current?.click()} disabled={disabled} className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-sky-400 hover:bg-sky-50 transition-all flex flex-col items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:border-sky-200 transition-colors shadow-sm">
                        <Plus className="h-4 w-4" />
                    </div>
                    <div className="text-center">
                        <p className="text-[12px] font-semibold text-slate-600 group-hover:text-sky-600 transition-colors">Click to upload</p>
                        <p className="text-[11px] text-slate-400">PNG, JPG up to 5MB</p>
                    </div>
                </button>
            )}
        </div>
    );
}
/* =========================================================
   ADD / EDIT MODAL
========================================================= */
function InspectorFormModal({ modal, onClose, onConfirm, submitting }) {
    const isEdit = modal?.type === "edit";

    const EMPTY = {
        inspectorUsername: "", inspectorPassword: "",
        inspectorType: "",
        firstname: "", lastname: "", email: "", contactNumber: "",
        age: "", upiId: "",
        address: "", cityId: "", stateId: "", countryId: "",
        aadharCardNumber: "", aadharCardFrontUrl: null, aadharCardBackUrl: null,
        drivingLicenseNumber: "", drivingLicenseFrontUrl: null, drivingLicenseBackUrl: null,
    };

    const [form, setForm] = useState(EMPTY);
    const [originalForm, setOriginalForm] = useState(EMPTY);
    const [showPassword, setShowPassword] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Load states for India (countryId = 101) when modal opens
    useEffect(() => {
        if (!modal) return;
        getStates(101).then((res) => setStates(res?.data || [])).catch(() => { });
    }, [modal?.type]);

    // Load cities when state changes
    useEffect(() => {
        if (!form.stateId) { setCities([]); return; }
        getCities(form.stateId).then((res) => setCities(res?.data || [])).catch(() => { });
        setForm((p) => ({ ...p, cityId: "" }));
    }, [form.stateId]);

    useEffect(() => {
        if (modal?.type === "add") {
            setForm(EMPTY);
            setOriginalForm(EMPTY);
        } else if (modal?.type === "edit" && modal.item) {
            const i = modal.item;
            const initial = {
                inspectorUsername: i.inspectorUsername || "",
                inspectorPassword: "",
                inspectorType: i.inspectorType || "",
                firstname: i.firstname || "",
                lastname: i.lastname || "",
                email: i.email || "",
                contactNumber: i.contactNumber || "",
                age: i.age || "",
                upiId: i.upiId || "",
                address: i.address || "",
                cityId: i.cityId || "",
                stateId: i.stateId || "",
                countryId: i.countryId || "",
                aadharCardNumber: i.aadharCardNumber || "",
                aadharCardFrontUrl: i.aadharCardFrontUrl ? { file: null, preview: i.aadharCardFrontUrl } : null,
                aadharCardBackUrl: i.aadharCardBackUrl ? { file: null, preview: i.aadharCardBackUrl } : null,
                drivingLicenseNumber: i.drivingLicenseNumber || "",
                drivingLicenseFrontUrl: i.drivingLicenseFrontUrl ? { file: null, preview: i.drivingLicenseFrontUrl } : null,
                drivingLicenseBackUrl: i.drivingLicenseBackUrl ? { file: null, preview: i.drivingLicenseBackUrl } : null,
            };
            setForm(initial);
            setOriginalForm(initial);
        }
    }, [modal]);

    if (!modal || (modal.type !== "add" && modal.type !== "edit")) return null;

    const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    // For edit mode: detect if anything changed vs original
    const hasChanges = !isEdit || (() => {
        const textFields = ["inspectorUsername", "inspectorPassword", "inspectorType",
            "firstname", "lastname", "email", "contactNumber", "age", "upiId",
            "address", "cityId", "stateId", "aadharCardNumber", "drivingLicenseNumber"];
        const textChanged = textFields.some((k) => String(form[k] || "") !== String(originalForm[k] || ""));
        const imgChanged = ["aadharCardFrontUrl", "aadharCardBackUrl", "drivingLicenseFrontUrl", "drivingLicenseBackUrl"]
            .some((k) => form[k]?.file !== null && form[k]?.file !== undefined && form[k]?.file !== originalForm[k]?.file);
        return textChanged || imgChanged;
    })();

    const valid = hasChanges
        && form.inspectorUsername.trim()
        && (isEdit || form.inspectorPassword.trim())
        && form.firstname.trim()
        && form.lastname.trim()
        && form.email.trim()
        && form.contactNumber.trim()
        && form.inspectorType
        && form.cityId
        && form.aadharCardNumber.trim()
        && form.drivingLicenseNumber.trim();

    const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-sky-400 text-slate-900 text-[13px] disabled:opacity-60 disabled:cursor-not-allowed";
    const labelCls = "mb-1.5 block text-[13px] font-medium text-slate-700";
    const sectionLabelCls = "text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3";

    const SelectField = ({ label, value, onChange, children, required }) => (
        <div>
            <label className={labelCls}>{label} {required && <span className="text-rose-500">*</span>}</label>
            <div className="relative">
                <select value={value} onChange={onChange} disabled={submitting} className={inputCls + " appearance-none pr-10"}>
                    {children}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={!submitting ? onClose : undefined} />
            <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{isEdit ? "Edit Inspector" : "Add New Inspector"}</h3>
                        <p className="mt-1 text-[13px] text-slate-500">{isEdit ? "Update inspector details and credentials" : "Fill in all details to add a new inspector"}</p>
                    </div>
                    <button onClick={onClose} disabled={submitting} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                    {/* ── ACCOUNT CREDENTIALS ── */}
                    <div>
                        <p className={sectionLabelCls}>Account Credentials</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Username <span className="text-rose-500">*</span></label>
                                <input value={form.inspectorUsername} onChange={(e) => set("inspectorUsername", e.target.value)} placeholder="Enter username" disabled={submitting} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>
                                    Password {!isEdit && <span className="text-rose-500">*</span>}
                                    {isEdit && <span className="text-slate-400 font-normal ml-1">(leave blank to keep)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.inspectorPassword}
                                        onChange={(e) => set("inspectorPassword", e.target.value)}
                                        placeholder={isEdit ? "Enter new password (optional)" : "Enter password"}
                                        disabled={submitting}
                                        className={inputCls + " pr-11"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <SelectField label="Inspector Type" value={form.inspectorType} onChange={(e) => set("inspectorType", e.target.value)} required>
                                <option value="">Select type...</option>
                                <option value="TWO_WHEELER">2 Wheeler</option>
                                <option value="FOUR_WHEELER">4 Wheeler</option>
                                <option value="BOTH">Both</option>
                            </SelectField>
                        </div>
                    </div>

                    {/* ── PERSONAL INFO ── */}
                    <div>
                        <p className={sectionLabelCls}>Personal Information</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>First Name <span className="text-rose-500">*</span></label>
                                <input value={form.firstname} onChange={(e) => set("firstname", e.target.value)} placeholder="First name" disabled={submitting} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Last Name <span className="text-rose-500">*</span></label>
                                <input value={form.lastname} onChange={(e) => set("lastname", e.target.value)} placeholder="Last name" disabled={submitting} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Email <span className="text-rose-500">*</span></label>
                                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" disabled={submitting} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Contact Number <span className="text-rose-500">*</span></label>
                                <input value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} placeholder="+91 XXXXXXXXXX" disabled={submitting} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Age <span className="text-rose-500">*</span></label>
                                <input type="number" min="18" max="70" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="Age (min 18)" disabled={submitting} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>UPI ID <span className="text-slate-400 font-normal">(optional)</span></label>
                                <input value={form.upiId} onChange={(e) => set("upiId", e.target.value)} placeholder="name@upi" disabled={submitting} className={inputCls} />
                            </div>
                        </div>
                    </div>

                    {/* ── ADDRESS ── */}
                    <div>
                        <p className={sectionLabelCls}>Address</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={labelCls}>Address <span className="text-rose-500">*</span></label>
                                <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" disabled={submitting} className={inputCls} />
                            </div>
                            <SelectField label="State" value={form.stateId} onChange={(e) => set("stateId", e.target.value)} required>
                                <option value="">Select state...</option>
                                {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </SelectField>
                            <SelectField label="City" value={form.cityId} onChange={(e) => set("cityId", e.target.value)} required>
                                <option value="">{form.stateId ? "Select city..." : "Select state first..."}</option>
                                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </SelectField>
                        </div>
                    </div>

                    {/* ── AADHAR CARD ── */}
                    <div>
                        <p className={sectionLabelCls}>Aadhar Card</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={labelCls}>Aadhar Number <span className="text-rose-500">*</span></label>
                                <input value={form.aadharCardNumber} onChange={(e) => set("aadharCardNumber", e.target.value)} placeholder="XXXX XXXX XXXX" disabled={submitting} className={inputCls} />
                            </div>
                            <ImageUploadField label="Front Photo" value={form.aadharCardFrontUrl} onChange={(v) => set("aadharCardFrontUrl", v)} disabled={submitting} />
                            <ImageUploadField label="Back Photo" value={form.aadharCardBackUrl} onChange={(v) => set("aadharCardBackUrl", v)} disabled={submitting} />
                        </div>
                    </div>

                    {/* ── DRIVING LICENSE ── */}
                    <div>
                        <p className={sectionLabelCls}>Driving License</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className={labelCls}>DL Number <span className="text-rose-500">*</span></label>
                                <input value={form.drivingLicenseNumber} onChange={(e) => set("drivingLicenseNumber", e.target.value)} placeholder="XX00-YYYYXXXXXXX" disabled={submitting} className={inputCls} />
                            </div>
                            <ImageUploadField label="Front Photo" value={form.drivingLicenseFrontUrl} onChange={(v) => set("drivingLicenseFrontUrl", v)} disabled={submitting} />
                            <ImageUploadField label="Back Photo" value={form.drivingLicenseBackUrl} onChange={(v) => set("drivingLicenseBackUrl", v)} disabled={submitting} />
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
                    <button onClick={onClose} disabled={submitting} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm({ ...modal.item, ...form })}
                        disabled={!valid || submitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {submitting ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add Inspector")}
                    </button>
                </div>
            </div>
        </>
    );
}

/* =========================================================
   DELETE MODAL
========================================================= */
function DeleteModal({ modal, onClose, onConfirm, submitting }) {
    if (!modal || modal.type !== "delete") return null;
    return (
        <>
            <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm" onClick={!submitting ? onClose : undefined} />
            <div className="fixed left-1/2 top-1/2 z-[61] w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Delete Inspector</h3>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-[13px] text-slate-600 mb-2">
                    Are you sure you want to delete <span className="font-bold text-slate-900">{modal.item?.inspectorUsername}</span>?
                </p>
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700 mb-6">
                    This action cannot be undone. All inspection records linked to this inspector will be affected.
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(modal.item)}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {submitting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </>
    );
}

const Inspector = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [modal, setModal] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalElements: 0 });
    const [selectedInspector, setSelectedInspector] = useState(null);

    // ── Fetch all inspectors ──────────────────────────────────────
    const fetchInspectors = async (pageNo = 1) => {
        setLoading(true);
        try {
            const res = await getAllInspectors(pageNo);
            const data = res?.data || [];
            setRows(Array.isArray(data) ? data : []);
            if (res?.pageResponse) {
                setPagination({
                    currentPage: res.pageResponse.currentPage ?? pageNo,
                    totalPages: res.pageResponse.totalPages ?? 1,
                    totalElements: res.pageResponse.totalElements ?? data.length,
                });
            }
        } catch (err) {
            console.error("Failed to fetch inspectors:", err);
            toast.error(err?.response?.data?.message || "Failed to load inspectors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInspectors(1);
    }, []);

    // ── Derived stats from current page data ─────────────────────
    const stats = {
        total: pagination.totalElements || rows.length,
        active: rows.filter((r) => r.status === "ACTIVE").length,
        inactive: rows.filter((r) => r.status === "INACTIVE").length,
        totalInspections: rows.reduce((sum, r) => sum + (r.inspections || 0), 0),
    };

    // ── Client-side search + status filter ───────────────────────
    const filtered = rows.filter((r) => {
        const q = search.toLowerCase();
        const fullName = [r.firstname, r.lastname].filter(Boolean).join(" ").toLowerCase();
        const matchSearch =
            !search ||
            fullName.includes(q) ||
            r.inspectorUsername?.toLowerCase().includes(q) ||
            r.email?.toLowerCase().includes(q) ||
            r.contactNumber?.includes(search) ||
            r.cityName?.toLowerCase().includes(q);
        const matchStatus = !statusFilter || r.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // ── Add ───────────────────────────────────────────────────────
    const handleAddConfirm = async (data) => {
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("inspectorUsername", data.inspectorUsername);
            fd.append("inspectorPassword", data.inspectorPassword);
            fd.append("inspectorType", data.inspectorType);
            fd.append("firstname", data.firstname);
            fd.append("lastname", data.lastname);
            fd.append("email", data.email);
            fd.append("contactNumber", data.contactNumber);
            fd.append("age", Number(data.age));
            if (data.upiId) fd.append("upiId", data.upiId);
            fd.append("address", data.address);
            fd.append("cityId", Number(data.cityId));
            fd.append("stateId", Number(data.stateId));
            fd.append("countryId", 101);
            fd.append("aadharCardNumber", data.aadharCardNumber);
            if (data.aadharCardFrontUrl?.file) fd.append("aadharCardFrontUrl", data.aadharCardFrontUrl.file);
            if (data.aadharCardBackUrl?.file) fd.append("aadharCardBackUrl", data.aadharCardBackUrl.file);
            fd.append("drivingLicenseNumber", data.drivingLicenseNumber);
            if (data.drivingLicenseFrontUrl?.file) fd.append("drivingLicenseFrontUrl", data.drivingLicenseFrontUrl.file);
            if (data.drivingLicenseBackUrl?.file) fd.append("drivingLicenseBackUrl", data.drivingLicenseBackUrl.file);

            await createInspector(fd);
            toast.success("Inspector added successfully");
            setModal(null);
            fetchInspectors(pagination.currentPage);
        } catch (err) {
            console.error("Failed to create inspector:", err);
            toast.error(err?.response?.data?.message || "Failed to add inspector");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Edit ──────────────────────────────────────────────────────
    const handleEditConfirm = async (data) => {
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("inspectorId", data.id);
            fd.append("inspectorUsername", data.inspectorUsername);
            if (data.inspectorPassword?.trim()) fd.append("inspectorPassword", data.inspectorPassword);
            if (data.inspectorType) fd.append("inspectorType", data.inspectorType);
            if (data.firstname) fd.append("firstname", data.firstname);
            if (data.lastname) fd.append("lastname", data.lastname);
            if (data.email) fd.append("email", data.email);
            if (data.contactNumber) fd.append("contactNumber", data.contactNumber);
            if (data.age) fd.append("age", Number(data.age));
            if (data.upiId) fd.append("upiId", data.upiId);
            if (data.address) fd.append("address", data.address);
            if (data.cityId) fd.append("cityId", Number(data.cityId));
            if (data.stateId) fd.append("stateId", Number(data.stateId));
            fd.append("countryId", 101);
            if (data.aadharCardNumber) fd.append("aadharCardNumber", data.aadharCardNumber);
            if (data.drivingLicenseNumber) fd.append("drivingLicenseNumber", data.drivingLicenseNumber);

            // Image fields:
            // - new file selected  → send binary
            // - removed (null)     → send empty Blob so backend clears it
            // - unchanged          → skip (backend keeps existing)
            const appendImage = (key, val) => {
                if (val?.file) {
                    fd.append(key, val.file);           // new upload
                } else if (val === null) {
                    fd.append(key, new Blob([]), "");   // explicitly removed → clear on backend
                }
                // val has preview but no file = unchanged → don't append
            };

            appendImage("aadharCardFrontUrl", data.aadharCardFrontUrl);
            appendImage("aadharCardBackUrl", data.aadharCardBackUrl);
            appendImage("drivingLicenseFrontUrl", data.drivingLicenseFrontUrl);
            appendImage("drivingLicenseBackUrl", data.drivingLicenseBackUrl);

            await updateInspector(fd);
            toast.success("Inspector updated successfully");
            // If opened from detail screen, refresh detail; otherwise go back to list
            if (modal?.fromDetail && data.id) {
                setSelectedInspector((prev) => ({ ...prev, ...data }));
            }
            setModal(null);
            fetchInspectors(pagination.currentPage);
        } catch (err) {
            console.error("Failed to update inspector:", err);
            toast.error(err?.response?.data?.message || "Failed to update inspector");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────────
    const handleDeleteConfirm = async (item) => {
        setSubmitting(true);
        try {
            await deleteInspector(item.id);
            toast.success("Inspector deleted successfully");
            // After delete, always go back to list
            setSelectedInspector(null);
            setModal(null);
            fetchInspectors(pagination.currentPage);
        } catch (err) {
            console.error("Failed to delete inspector:", err);
            toast.error(err?.response?.data?.message || "Failed to delete inspector");
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => { setSearch(""); setStatusFilter(""); setFiltersOpen(false); };
    const handlePageChange = (newPage) => fetchInspectors(newPage);

    return (
        <>
            {/* ── DETAIL VIEW ── */}
            {selectedInspector && (
                <InspectorDetail
                    inspector={selectedInspector}
                    onBack={() => setSelectedInspector(null)}
                    onEdit={(item) => {
                        setModal({ type: "edit", item, fromDetail: true });
                    }}
                    onDelete={(item) => {
                        setModal({ type: "delete", item, fromDetail: true });
                    }}
                />
            )}

            {/* ── LIST VIEW ── */}
            {!selectedInspector && (
                <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
                    <style>{`
          .table-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
          .table-scroll::-webkit-scrollbar-track { background: transparent; }
          .table-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
          .table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.45); }
        `}</style>

                    {/* HEADER */}
                    <div className="flex-shrink-0 p-6 pb-4">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">All Inspectors</h1>
                                <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
                                    Manage inspectors, assign inspection tasks, track performance, and maintain quality standards.
                                </p>
                            </div>
                            <button
                                onClick={() => setModal({ type: "add" })}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-600 px-5 text-[13px] font-semibold text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-sky-700 active:scale-95 shrink-0"
                            >
                                <Plus className="h-4 w-4" />
                                Add Inspector
                            </button>
                        </div>
                    </div>

                    {/* KPI CARDS */}
                    <div className="flex-shrink-0 px-6 pb-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <TopCard title="Total Inspectors" value={stats.total} />
                            <TopCard title="Active" value={stats.active} />
                            <TopCard title="Inactive" value={stats.inactive} />
                            <TopCard title="Total Inspections" value={stats.totalInspections} />
                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="flex-1 px-6 pb-6 overflow-hidden">
                        <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative flex flex-col">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 blur-[100px] pointer-events-none" />

                            {/* SEARCH + FILTER BAR */}
                            <div className="p-5 md:p-6 relative z-10 border-b border-slate-200 flex-shrink-0">
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                    <div className="relative flex-1 max-w-2xl">
                                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search by name, email, phone, city..."
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition-all focus:border-sky-400 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => setFiltersOpen((p) => !p)}
                                            className={cls(
                                                "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-colors",
                                                filtersOpen ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filters
                                        </button>
                                        <button
                                            onClick={() => fetchInspectors(pagination.currentPage)}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {filtersOpen && (
                                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 md:grid-cols-3">
                                        <div className="flex items-center justify-between col-span-full mb-2">
                                            <h4 className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Filters</h4>
                                            <button onClick={handleClear} className="text-[12px] text-sky-700 hover:text-sky-800 transition-colors">Clear All</button>
                                        </div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:border-sky-400 appearance-none"
                                        >
                                            <option value="">All Status</option>
                                            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* TABLE */}
                            <div className="flex-1 w-full overflow-auto table-scroll relative z-10">
                                <table className="min-w-[900px] w-full border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">Name</th>
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">Email</th>
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">Contact</th>
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">City</th>
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">Type</th>
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Age</th>
                                            {/* <th className="px-5 py-4 font-semibold whitespace-nowrap">Aadhar No.</th> */}
                                            {/* <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Aadhar Card</th> */}
                                            {/* <th className="px-5 py-4 font-semibold whitespace-nowrap">DL Number</th> */}
                                            {/* <th className="px-5 py-4 font-semibold whitespace-nowrap text-center">Driving License</th> */}
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">Status</th>
                                            <th className="px-5 py-4 font-semibold whitespace-nowrap">Created At</th>
                                            <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={12} className="px-6 py-28 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Loader2 className="h-12 w-12 text-sky-600 animate-spin mb-4" />
                                                        <div className="text-lg font-bold text-slate-900">Loading inspectors...</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filtered.length ? (
                                            filtered.map((row) => {
                                                return (
                                                    <tr key={row.id} className="transition-colors duration-200 hover:bg-slate-50 group">

                                                        {/* NAME */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 border border-slate-200 flex items-center justify-center shrink-0">
                                                                    <span className="text-[13px] font-bold text-sky-700">
                                                                        {row.firstname?.charAt(0)?.toUpperCase() || "?"}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-[13px] font-bold text-slate-900 group-hover:text-sky-700 transition-colors whitespace-nowrap">
                                                                        {[row.firstname, row.lastname].filter(Boolean).join(" ") || row.inspectorUsername || "—"}
                                                                    </div>
                                                                    <div className="mt-0.5 text-[11px] text-slate-400 truncate max-w-[140px]">
                                                                        @{row.inspectorUsername || "—"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* EMAIL */}
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{row.email || "—"}</div>
                                                        </td>

                                                        {/* CONTACT */}
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{row.contactNumber || "—"}</div>
                                                        </td>

                                                        {/* CITY */}
                                                        <td className="px-5 py-4">
                                                            <div className="text-[13px] font-medium text-slate-700 whitespace-nowrap">{row.cityName || "—"}</div>
                                                        </td>

                                                        {/* INSPECTOR TYPE */}
                                                        <td className="px-5 py-4">
                                                            <span className={cls(
                                                                "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap",
                                                                row.inspectorType === "FOUR_WHEELER"
                                                                    ? "bg-violet-50 text-violet-700 border-violet-200"
                                                                    : row.inspectorType === "TWO_WHEELER"
                                                                        ? "bg-sky-50 text-sky-700 border-sky-200"
                                                                        : row.inspectorType === "BOTH"
                                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                            : "bg-slate-50 text-slate-600 border-slate-200"
                                                            )}>
                                                                {row.inspectorType === "FOUR_WHEELER" ? "4 Wheeler"
                                                                    : row.inspectorType === "TWO_WHEELER" ? "2 Wheeler"
                                                                        : row.inspectorType === "BOTH" ? "Both"
                                                                            : row.inspectorType || "—"}
                                                            </span>
                                                        </td>

                                                        {/* AGE */}
                                                        <td className="px-5 py-4 text-center">
                                                            <div className="inline-flex items-center justify-center text-[13px] font-semibold text-slate-700">
                                                                {row.age || "—"}
                                                            </div>
                                                        </td>

                                                        {/* AADHAR NUMBER */}
                                                        {/* <td className="px-5 py-4">
                                                            <div className="text-[13px] font-mono text-slate-700 whitespace-nowrap">{row.aadharCardNumber || "—"}</div>
                                                        </td> */}

                                                        {/* AADHAR CARD PHOTOS */}
                                                        {/* <td className="px-5 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                {row.aadharCardFrontUrl ? (
                                                                    <img src={row.aadharCardFrontUrl} alt="Front" className="h-8 w-12 rounded-md object-cover border border-slate-200" />
                                                                ) : <span className="text-[11px] text-slate-400">—</span>}
                                                                {row.aadharCardBackUrl ? (
                                                                    <img src={row.aadharCardBackUrl} alt="Back" className="h-8 w-12 rounded-md object-cover border border-slate-200" />
                                                                ) : null}
                                                            </div>
                                                        </td> */}

                                                        {/* DL NUMBER */}
                                                        {/* <td className="px-5 py-4">
                                                            <div className="text-[13px] font-mono text-slate-700 whitespace-nowrap">{row.drivingLicenseNumber || "—"}</div>
                                                        </td> */}

                                                        {/* DL PHOTOS */}
                                                        {/* <td className="px-5 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                {row.drivingLicenseFrontUrl ? (
                                                                    <img src={row.drivingLicenseFrontUrl} alt="Front" className="h-8 w-12 rounded-md object-cover border border-slate-200" />
                                                                ) : <span className="text-[11px] text-slate-400">—</span>}
                                                                {row.drivingLicenseBackUrl ? (
                                                                    <img src={row.drivingLicenseBackUrl} alt="Back" className="h-8 w-12 rounded-md object-cover border border-slate-200" />
                                                                ) : null}
                                                            </div>
                                                        </td> */}

                                                        {/* STATUS */}
                                                        <td className="px-5 py-4">
                                                            <span className={cls("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border whitespace-nowrap", statusBadge(row.status))}>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                                                {row.status || "—"}
                                                            </span>
                                                        </td>

                                                        {/* CREATED AT */}
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                                                                <Clock3 size={12} className="text-slate-400" />
                                                                {formatDateTime(row.createdAt)}
                                                            </div>
                                                        </td>

                                                        {/* ACTIONS */}
                                                        <td className="px-6 py-4 text-right">
                                                            <RowActions
                                                                item={row}
                                                                onView={(item) => setSelectedInspector(item)}
                                                                onEdit={(item) => setModal({ type: "edit", item })}
                                                                onDelete={(item) => setModal({ type: "delete", item })}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={12} className="px-6 py-28 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                                                            <Search size={28} />
                                                        </div>
                                                        <div className="text-lg font-bold text-slate-900 tracking-tight">No inspectors found</div>
                                                        <div className="mt-1 text-[14px] text-slate-500 max-w-sm mx-auto">Try adjusting your search or clear active filters.</div>
                                                        {(search || statusFilter) && (
                                                            <button onClick={handleClear} className="mt-6 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 transition-colors">
                                                                Clear search & filters
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {!loading && filtered.length > 0 && (
                                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                                    <div className="text-[13px] text-slate-600">
                                        Page {pagination.currentPage}-{pagination.totalPages} • {pagination.totalElements} total records
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage >= pagination.totalPages}
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )} {/* end !selectedInspector */}

            <InspectorFormModal
                modal={modal}
                onClose={() => {
                    if (!submitting) setModal(null);
                    // If opened from detail screen, stay on detail (don't clear selectedInspector)
                }}
                onConfirm={modal?.type === "edit" ? handleEditConfirm : handleAddConfirm}
                submitting={submitting}
            />
            <DeleteModal
                modal={modal}
                onClose={() => {
                    if (!submitting) setModal(null);
                    // If opened from detail screen, stay on detail (don't clear selectedInspector)
                }}
                onConfirm={handleDeleteConfirm}
                submitting={submitting}
            />
        </>
    );
};

function TopCard({ title, value }) {
    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-end justify-between">
                <div>
                    <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">{title}</div>
                    <div className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <User size={18} />
                </div>
            </div>
        </div>
    );
}

export default Inspector;
