import React, { useEffect, useState, useMemo } from "react";
import {
    X,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Eye,
    Video,
    Car
} from "lucide-react";
import { getVehicleInspectionReport, approveInspection, rejectInspection, requestChangesInspection } from "../../../../api/vehicleInspection.api";
import toast from "react-hot-toast";

// Import schemas
import schema2W from "../../../../utils/reecomm_inspection_2W.json";
import schema4W from "../../../../utils/reecomm_inspection_4W.json";

const cls = (...a) => a.filter(Boolean).join(" ");

const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);

/* ── UI Components ── */
function ImagePreviewModal({ imageUrl, title, onClose }) {
    if (!imageUrl) return null;
    return (
        <>
            <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 z-[201] w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4 bg-slate-900">
                    <h3 className="text-sm font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex min-h-[300px] max-h-[80vh] items-center justify-center bg-black p-2">
                    {imageUrl.endsWith(".mp4") ? (
                        <video src={imageUrl} controls autoPlay className="max-h-[75vh] w-auto max-w-full rounded-lg" />
                    ) : (
                        <img src={imageUrl} alt={title} className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain" />
                    )}
                </div>
            </div>
        </>
    );
}

function StatusBadge({ value }) {
    const v = String(value || "").toUpperCase();
    if (v === "PASS" || v === "GOOD" || v === "NONE") return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">{v}</span>;
    if (v === "FAIL" || v === "MAJOR" || v === "REPLACE") return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">{v}</span>;
    if (v === "MINOR" || v === "MODERATE" || v === "WORN") return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">{v}</span>;
    if (v === "N/A" || v === "MISSING") return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wider">{v}</span>;
    if (v === "TRUE") return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">YES</span>;
    if (v === "FALSE") return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">NO</span>;
    
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">{v}</span>;
}

function MediaThumbnail({ url, label, onPreview }) {
    if (!url) return null;
    const isVideo = url.endsWith(".mp4");
    return (
        <div className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer h-24 w-full" onClick={() => onPreview(url, label)}>
            {isVideo ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Video className="text-white/50 h-8 w-8" />
                </div>
            ) : (
                <img src={url} alt={label} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="text-white h-6 w-6" />
            </div>
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-center">
                <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded truncate max-w-full font-medium">
                    {label}
                </span>
            </div>
        </div>
    );
}

function FieldRow({ label, value, type, unit, onPreview }) {
    if (value === null || value === undefined) return null;

    let displayValue = null;
    if (type === "media_url") {
        return (
            <div className="flex flex-col gap-2 py-3 border-b border-slate-100 last:border-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <div className="w-32">
                    <MediaThumbnail url={value} label={label} onPreview={onPreview} />
                </div>
            </div>
        );
    } else if (type === "array" && Array.isArray(value)) {
        return (
            <div className="flex flex-col gap-2 py-3 border-b border-slate-100 last:border-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label} ({value.length})</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {value.map((v, i) => (
                        <MediaThumbnail key={i} url={v} label={`${label} ${i + 1}`} onPreview={onPreview} />
                    ))}
                </div>
            </div>
        );
    } else if (type === "boolean") {
        displayValue = <StatusBadge value={value ? "TRUE" : "FALSE"} />;
    } else if (type === "number" || type === "integer") {
        displayValue = <span className="text-[13px] font-bold text-slate-900">{value} {unit}</span>;
    } else {
        displayValue = <StatusBadge value={value} />;
    }

    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
            <span className="text-[12px] font-bold text-slate-600">{label}</span>
            <div>{displayValue}</div>
        </div>
    );
}


/* ── Main Modal ── */
export default function InspectionReportReviewModal({ request, assignmentId, onClose, onUpdate }) {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [preview, setPreview] = useState({ open: false, url: "", title: "" });
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [requestChangesModalOpen, setRequestChangesModalOpen] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const aId = assignmentId || request?.assignmentId || request?.id;

    useEffect(() => {
        const fetchReport = async () => {
            if (!aId) return;
            setLoading(true);
            try {
                const res = await getVehicleInspectionReport(aId);
                if (res.status === "OK" || res.data) {
                    setReportData(res.data || res);
                }
            } catch (error) {
                console.error("Error fetching report:", error);
                toast.error("Failed to load inspection report details.");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [aId]);

    const schema = useMemo(() => {
        if (!reportData) return null;
        if (reportData.vehicleType === "TWO_WHEELER" || reportData.vehicleType === "2W") return schema2W;
        return schema4W;
    }, [reportData]);

    const sections = useMemo(() => {
        if (!schema || !reportData) return [];
        const fuelType = reportData.fuelType === "EV" ? "EV (Electric)" : reportData.fuelType;
        const availableSections = [];

        Object.entries(schema.sections).forEach(([key, section]) => {
            // Check applicability
            let applicable = true;
            if (section.applicable_fuel_types) {
                // simple mapping for fuel types if needed
                const mapping = {
                    "PETROL": "Petrol", "DIESEL": "Diesel", "CNG": "CNG", "LPG": "LPG", "HYBRID": "Hybrid", "EV": "EV (Electric)"
                };
                const formattedFuel = mapping[reportData.fuelType] || reportData.fuelType;
                if (!section.applicable_fuel_types.includes(formattedFuel)) {
                    applicable = false;
                }
            }
            if (applicable) {
                availableSections.push({ key, ...section });
            }
        });
        return availableSections;
    }, [schema, reportData]);

    useEffect(() => {
        if (sections.length > 0 && !activeSection) {
            setActiveSection(sections[0].key);
        }
    }, [sections]);

    const openPreview = (url, title) => setPreview({ open: true, url, title });
    const closePreview = () => setPreview({ open: false, url: "", title: "" });

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            await approveInspection({ assignmentId: aId });
            toast.success("Report approved successfully");
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to approve report");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!remarks.trim()) {
            toast.error("Please provide rejection remarks");
            return;
        }
        setSubmitting(true);
        try {
            await rejectInspection({ assignmentId: aId, remarks });
            toast.success("Report rejected successfully");
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reject report");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestChanges = async () => {
        if (!remarks.trim()) {
            toast.error("Please provide remarks for requested changes");
            return;
        }
        setSubmitting(true);
        try {
            await requestChangesInspection({ assignmentId: aId, remarks });
            toast.success("Changes requested successfully");
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to request changes");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to format camelCase to Title Case
    const formatLabel = (str) => {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-xl">
                    <Loader2 className="h-10 w-10 text-sky-600 animate-spin" />
                    <p className="text-sm font-semibold text-slate-700">Loading Report...</p>
                </div>
            </div>
        );
    }

    if (!reportData || !schema) return null;

    const currentSectionData = sections.find(s => s.key === activeSection);
    
    // Map section key to API data key
    const sectionDataKeyMap = {
        "section_1_engine_powertrain": "engineAndPowertrain",
        "section_1_ev_battery": "evBattery",
        "section_2_mechanical": "mechanical",
        "section_3_exterior_panels": "exteriorPanels",
        "section_4_glass_exterior_electronics": "glassAndExteriorElectronics",
        "section_5_comfort_electronics": "comfortElectronics",
        "section_5_interior_cabin": "interiorAndCabin",
        "section_6_structural_history": "structuralHistory",
        "section_7_tyres": "tyres",
        "section_8_obd_diagnostics": "obdDiagnostics",
        "section_9_modifications": "modifications",
        "section_10_media": "media"
    };

    const activeDataKey = sectionDataKeyMap[activeSection];
    const activeData = reportData[activeDataKey] || {};

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 overflow-hidden">
            {/* ── HEADER ── */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4 shadow-sm flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            {reportData.makerName} {reportData.modelName} {reportData.variantName} ({reportData.yearOfMfg})
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[12px] font-semibold text-slate-500">ID: {reportData.assignmentId}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[12px] font-semibold text-slate-500">Inspector: {reportData.inspectorName}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 border border-emerald-200">
                                Score: {reportData.inspectionScore}/5.0
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* ── SIDEBAR ── */}
                <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 p-4 space-y-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-4 px-2">Inspection Sections</div>
                    {sections.map((section) => (
                        <button
                            key={section.key}
                            onClick={() => setActiveSection(section.key)}
                            className={cls(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                                activeSection === section.key
                                    ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100 font-bold"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold border border-transparent"
                            )}
                        >
                            <span className="text-[13px] leading-tight flex-1">{section.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── CONTENT AREA ── */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 relative">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentSectionData?.label}</h2>
                            {currentSectionData?.note && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                                    <AlertTriangle size={14} />
                                    {currentSectionData.note}
                                </span>
                            )}
                        </div>

                        <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                            {/* Special rendering for Panels */}
                            {currentSectionData?.key === "section_3_exterior_panels" && activeData.panels ? (
                                <div className="p-5 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/50">
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Panel</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Paint</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Dents</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Scratches</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Rust</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Photo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {activeData.panels.map((panel, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3 text-[13px] font-bold text-slate-900">{panel.panelName}</td>
                                                    <td className="px-4 py-3">
                                                        {panel.repainted ? <StatusBadge value="REPAINTED" /> : panel.originalPaint ? <StatusBadge value="ORIGINAL" /> : "—"}
                                                    </td>
                                                    <td className="px-4 py-3"><StatusBadge value={panel.dentSeverity} /></td>
                                                    <td className="px-4 py-3"><StatusBadge value={panel.scratchSeverity} /></td>
                                                    <td className="px-4 py-3"><StatusBadge value={panel.rustPresent ? "TRUE" : "FALSE"} /></td>
                                                    <td className="px-4 py-3">
                                                        {panel.panelPhoto ? (
                                                            <button onClick={() => openPreview(panel.panelPhoto, panel.panelName)} className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sky-600 hover:bg-sky-100 transition-colors">
                                                                <Eye size={14} />
                                                            </button>
                                                        ) : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : currentSectionData?.key === "section_9_modifications" && activeData.modificationsDetected ? (
                                <div className="p-5">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Detected</p>
                                            <p className="mt-1 font-bold text-slate-900"><StatusBadge value="TRUE" /></p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Count</p>
                                            <p className="mt-1 font-bold text-slate-900">{activeData.modificationCount}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Level</p>
                                            <p className="mt-1 font-bold text-slate-900"><StatusBadge value={activeData.modificationRiskLevel} /></p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seller Match</p>
                                            <p className="mt-1 font-bold text-slate-900"><StatusBadge value={activeData.sellerDeclarationMatch ? "TRUE" : "FALSE"} /></p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {activeData.modificationItems?.map((mod, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                                                <div className="w-24 h-24 shrink-0">
                                                    <MediaThumbnail url={mod.photo} label="Mod Photo" onPreview={openPreview} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[14px] font-bold text-slate-900">{mod.modificationCategory}</h4>
                                                    <div className="mt-2 grid grid-cols-2 gap-y-2 text-[12px]">
                                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Type:</span> <span className="font-semibold text-slate-800">{mod.modificationType}</span></div>
                                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Warranty Impact:</span> <StatusBadge value={mod.impactOnWarranty} /></div>
                                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Safety Impact:</span> <StatusBadge value={mod.impactOnSafety} /></div>
                                                        <div className="flex gap-2"><span className="text-slate-500 font-medium">Doc Available:</span> <StatusBadge value={mod.documentationAvailable ? "TRUE" : "FALSE"} /></div>
                                                    </div>
                                                    {mod.remarks && <p className="mt-2 text-[12px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100"><span className="font-bold">Remarks:</span> {mod.remarks}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Normal Fields Rendering */
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-10">
                                    {Object.entries(activeData).map(([key, val]) => {
                                        // Ignore array objects if they were rendered specially
                                        if (key === "panels" || key === "modificationItems") return null;
                                        
                                        // Get field schema definition if available
                                        let fieldDef = null;
                                        let label = formatLabel(key);
                                        let type = "string";
                                        let unit = "";

                                        if (currentSectionData?.fields) {
                                            // camelCase to snake_case for schema lookup
                                            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                                            fieldDef = currentSectionData.fields[snakeKey];
                                            if (fieldDef) {
                                                type = fieldDef.type;
                                                unit = fieldDef.unit || "";
                                            }
                                        } else if (currentSectionData?.key === "section_7_tyres") {
                                            // Special logic for flattened tyres
                                            if (key.includes("Photo")) type = "media_url";
                                            else if (key.includes("Age")) { type = "number"; unit = "years"; }
                                            else if (key.includes("Depth")) { type = "number"; unit = "mm"; }
                                        } else if (currentSectionData?.key === "section_10_media") {
                                            if (Array.isArray(val)) type = "array";
                                            else type = "media_url";
                                        }

                                        return <FieldRow key={key} label={label} value={val} type={type} unit={unit} onPreview={openPreview} />;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ACTIONS ── */}
            <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => {
                        setRemarks("");
                        setRequestChangesModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-[14px] font-bold text-amber-700 hover:bg-amber-100 transition-all active:scale-95 shadow-sm"
                >
                    <AlertTriangle size={16} />
                    Request Changes
                </button>
                <button
                    onClick={() => setRejectModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-[14px] font-bold text-rose-700 hover:bg-rose-100 transition-all active:scale-95 shadow-sm"
                >
                    <XCircle size={16} />
                    Reject Report
                </button>
                <button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-[14px] font-bold text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-sm shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Approve Report
                </button>
            </div>

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4" onClick={() => !submitting && setRejectModalOpen(false)}>
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Reject Inspection Report</h3>
                                <p className="text-[13px] text-slate-500">Provide remarks for rejection</p>
                            </div>
                        </div>
                        <div className="p-5">
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="E.g., Images are blurry, data mismatch..."
                                rows={4}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[14px] text-slate-900 outline-none focus:border-sky-400 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                disabled={submitting}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-rose-700 transition-all shadow-sm shadow-rose-600/20 disabled:opacity-70"
                            >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Changes Modal */}
            {requestChangesModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4" onClick={() => !submitting && setRequestChangesModalOpen(false)}>
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Request Changes</h3>
                                <p className="text-[13px] text-slate-500">Provide remarks for the requested changes</p>
                            </div>
                        </div>
                        <div className="p-5">
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Describe what needs to be changed..."
                                rows={4}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[14px] text-slate-900 outline-none focus:border-sky-400 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setRequestChangesModalOpen(false)}
                                disabled={submitting}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestChanges}
                                disabled={submitting || !remarks.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-amber-700 transition-all shadow-sm shadow-amber-600/20 disabled:opacity-70"
                            >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                Request Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Preview Modal */}
            {preview.open && (
                <ImagePreviewModal imageUrl={preview.url} title={preview.title} onClose={closePreview} />
            )}
        </div>
    );
}
