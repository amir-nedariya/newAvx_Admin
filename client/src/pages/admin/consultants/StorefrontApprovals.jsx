import React, { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Clock3,
  Building2,
  SlidersHorizontal,
  BadgeCheck,
} from "lucide-react";

// Components
import { cls, tabBtn, TopCard } from "./storefront-approvals/components/SharedComponents";
import FilterDrawer from "./storefront-approvals/components/FilterDrawer";
import DecisionModal from "./storefront-approvals/components/DecisionModal";

// Tabs
import PendingChanges from "./storefront-approvals/PendingChanges";
import ApprovedApprovals from "./storefront-approvals/ApprovedApprovals";
import PendingApprovals from "./storefront-approvals/PendingApprovals";
import RejectedApprovals from "./storefront-approvals/RejectedApprovals";
import RiskFlaggedApprovals from "./storefront-approvals/RiskFlaggedApprovals";

/* =========================================================
   DUMMY DATA
========================================================= */
const DUMMY_PENDING = [
  {
    id: "SF-1001",
    consultantId: "CONS-001",
    consultantName: "Adarsh Auto Consultants",
    city: "Ahmedabad",
    tier: "Premium",
    verified: true,
    changeType: "About",
    submittedOn: "2026-03-16T08:30:00Z",
    risk: "High",
    previewLabel: "About Section Update",
    oldValue: "We deal in used cars",
    newValue:
      "India’s #1 Certified Dealer\nEngine Warranty Guaranteed\nAVX Verified Partner",
    supportingMedia: [
      { name: "Banner.jpg", type: "image" },
      { name: "Award.png", type: "image" },
    ],
    reasonSubmitted: "Updated branding and trust statement",
    detections: [
      { label: "Use of AVX logo", severity: "warning" },
      { label: "Fake Certification claim", severity: "warning" },
      { label: "Phone number in banner", severity: "blocked" },
      { label: "Warranty claim", severity: "warning" },
    ],
    systemRisk: "High",
    systemReason: [
      "Unauthorized AVX usage",
      "Warranty claim detected",
      "Possible contact info in uploaded banner",
    ],
  },
  {
    id: "SF-1002",
    consultantId: "CONS-002",
    consultantName: "Metro Wheels",
    city: "Surat",
    tier: "Pro",
    verified: true,
    changeType: "Banner",
    submittedOn: "2026-03-15T11:15:00Z",
    risk: "Moderate",
    previewLabel: "Banner Upload",
    oldValue: "Old storefront banner",
    newValue: "New premium banner with dealership branding",
    supportingMedia: [{ name: "storefront-banner.jpg", type: "image" }],
    reasonSubmitted: "Seasonal branding refresh",
    detections: [
      { label: "Promotional statement", severity: "warning" },
      { label: "No blocked contact content found", severity: "safe" },
    ],
    systemRisk: "Moderate",
    systemReason: ["Promotional language requires manual review"],
  },
];

const DUMMY_APPROVED = [
  {
    id: "AP-2001",
    consultant: "Prime Motors",
    change: "About Update",
    approvedOn: "2026-03-12T10:00:00Z",
    approvedBy: "Admin Rahul",
  },
];

const DUMMY_PENDING_APPROVALS = [
  {
    id: "PA-5001",
    consultant: "Urban Cars",
    consultantId: "CONS-501",
    city: "Palanpur",
    change: "Badge Request",
    submittedOn: "2026-03-17T09:10:00Z",
    risk: "Moderate",
    tier: "Pro",
  },
  {
    id: "PA-5002",
    consultant: "Drive Hub",
    consultantId: "CONS-502",
    city: "Ahmedabad",
    change: "Banner Update",
    submittedOn: "2026-03-17T08:00:00Z",
    risk: "High",
    tier: "Premium",
  },
];

const DUMMY_REJECTED = [
  {
    id: "RJ-3001",
    consultant: "Autoflex",
    change: "Badge Claim",
    rejectedOn: "2026-03-10T12:00:00Z",
    reason: "Unauthorized Badge",
  },
];

const DUMMY_FLAGGED = [
  {
    id: "RF-4001",
    consultant: "Adarsh Auto Consultants",
    claimType: "Warranty Claim",
    severity: "High",
    actionTaken: "Sent for Audit",
  },
];

const StorefrontApprovals = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter States
  const [tier, setTier] = useState("");
  const [changeType, setChangeType] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");

  // Data States
  const [pendingRows, setPendingRows] = useState(DUMMY_PENDING);
  const [approvedRows, setApprovedRows] = useState(DUMMY_APPROVED);
  const [pendingApprovalsRows, setPendingApprovalsRows] = useState(DUMMY_PENDING_APPROVALS);
  const [rejectedRows, setRejectedRows] = useState(DUMMY_REJECTED);
  const [flaggedRows, setFlaggedRows] = useState(DUMMY_FLAGGED);

  // Review & Drawer States
  const [selectedItem, setSelectedItem] = useState(null);
  const [decisionMode, setDecisionMode] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [decisionComment, setDecisionComment] = useState("");

  // Memoized Filters
  const filteredPending = useMemo(() => {
    return pendingRows.filter((row) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        row.consultantName.toLowerCase().includes(q) ||
        row.consultantId.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q);

      const matchesTier = !tier || row.tier === tier;
      const matchesChange = !changeType || row.changeType === changeType;
      const matchesRisk = !riskLevel || row.risk === riskLevel;

      let matchesDate = true;
      if (submissionDate === "today") {
        const today = new Date().toDateString();
        matchesDate = new Date(row.submittedOn).toDateString() === today;
      } else if (submissionDate === "7days") {
        const diff = Date.now() - new Date(row.submittedOn).getTime();
        matchesDate = diff <= 7 * 24 * 60 * 60 * 1000;
      }

      return matchesSearch && matchesTier && matchesChange && matchesRisk && matchesDate;
    });
  }, [pendingRows, search, tier, changeType, riskLevel, submissionDate]);

  const stats = {
    pending: pendingRows.length,
    approved: approvedRows.length,
    pendingApprovals: pendingApprovalsRows.length,
    rejected: rejectedRows.length,
    flagged: flaggedRows.length,
  };

  // Handlers
  const openDecision = (mode, item) => {
    setSelectedItem(item);
    setDecisionMode(mode);
    setDecisionReason("");
    setDecisionComment("");
  };

  const closeDecision = () => {
    setDecisionMode("");
    setDecisionReason("");
    setDecisionComment("");
  };

  const resetFilters = () => {
    setTier("");
    setChangeType("");
    setRiskLevel("");
    setSubmissionDate("");
    setSearch("");
  };

  const handleApprove = (item) => {
    setPendingRows((prev) => prev.filter((x) => x.id !== item.id));
    setApprovedRows((prev) => [
      {
        id: `AP-${Date.now()}`,
        consultant: item.consultantName,
        change: item.previewLabel || item.changeType,
        approvedOn: new Date().toISOString(),
        approvedBy: "Current Admin",
      },
      ...prev,
    ]);
    setPanelOpen(false);
    closeDecision();
  };

  const handleReject = (item) => {
    setPendingRows((prev) => prev.filter((x) => x.id !== item.id));
    setRejectedRows((prev) => [
      {
        id: `RJ-${Date.now()}`,
        consultant: item.consultantName,
        change: item.previewLabel || item.changeType,
        rejectedOn: new Date().toISOString(),
        reason: decisionReason || "Other",
      },
      ...prev,
    ]);
    setPanelOpen(false);
    closeDecision();
  };

  const handleAudit = (item) => {
    setFlaggedRows((prev) => [
      {
        id: `RF-${Date.now()}`,
        consultant: item.consultantName,
        claimType: item.changeType,
        severity: item.systemRisk || item.risk,
        actionTaken: "Sent for Audit",
      },
      ...prev,
    ]);
    setPanelOpen(false);
    closeDecision();
  };

  return (
    <div className="min-h-screen p-4 xl:p-8 bg-slate-50/30">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <section className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="animate-in slide-in-from-left duration-500">
            <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-900">
              Storefront <span className="text-sky-600">Approvals</span>
            </h1>
            
          </div>
          
          
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-in fade-in zoom-in-95 duration-700">
          <TopCard title="Pending Changes" value={stats.pending} icon={Clock3} active={activeTab === 'pending'} />
          <TopCard title="Approved" value={stats.approved} icon={CheckCircle2} active={activeTab === 'approved'} />
          <TopCard title="Pending Approvals" value={stats.pendingApprovals} icon={BadgeCheck} active={activeTab === 'pending-approvals'} />
          <TopCard title="Rejected" value={stats.rejected} icon={XCircle} active={activeTab === 'rejected'} />
          <TopCard title="Risk Flagged" value={stats.flagged} icon={ShieldAlert} active={activeTab === 'flagged'} />
        </section>

        {/* Tab Navigation */}
        <section className="sticky top-4 z-20 rounded-[28px] border border-slate-200 bg-white/80 p-2 shadow-sm backdrop-blur-xl animate-in slide-in-from-bottom duration-500 delay-200">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={tabBtn(activeTab === "pending")} onClick={() => setActiveTab("pending")}>
              Pending Changes
            </button>
            <button type="button" className={tabBtn(activeTab === "approved")} onClick={() => setActiveTab("approved")}>
              Approved
            </button>
            <button type="button" className={tabBtn(activeTab === "pending-approvals")} onClick={() => setActiveTab("pending-approvals")}>
              Pending Approvals
            </button>
            <button type="button" className={tabBtn(activeTab === "rejected")} onClick={() => setActiveTab("rejected")}>
              Rejected
            </button>
            <button type="button" className={tabBtn(activeTab === "flagged")} onClick={() => setActiveTab("flagged")}>
              Risk Flagged
            </button>
          </div>
        </section>

        {/* Search & Filter Bar */}
        {(activeTab === "pending" || activeTab === "pending-approvals") && (
          <section className="animate-in slide-in-from-bottom duration-500 delay-300">
            <div className="rounded-[32px] border border-sky-100 bg-sky-50 p-5 md:p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search consultant, ID or city..."
                    className="h-16 w-full rounded-[24px] border border-slate-200 bg-white pl-14 pr-6 text-[16px] font-medium text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/5 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex h-16 min-w-[160px] items-center justify-center gap-3 rounded-[24px] border border-slate-200 bg-white px-8 text-[16px] font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
                >
                  <SlidersHorizontal className="h-5 w-5 text-sky-500" />
                  Advanced Filters
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Content Rendering */}
        <div className="animate-in slide-in-from-bottom duration-500 delay-400">
          {activeTab === "pending" && (
            <PendingChanges 
              rows={filteredPending} 
              openDecision={openDecision} 
            />
          )}

          {activeTab === "approved" && (
            <ApprovedApprovals rows={approvedRows} />
          )}

          {activeTab === "pending-approvals" && (
            <PendingApprovals rows={pendingApprovalsRows} />
          )}

          {activeTab === "rejected" && (
            <RejectedApprovals rows={rejectedRows} />
          )}

          {activeTab === "flagged" && (
            <RiskFlaggedApprovals rows={flaggedRows} />
          )}
        </div>
      </div>

      {/* Overlays */}
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        tier={tier}
        setTier={setTier}
        changeType={changeType}
        setChangeType={setChangeType}
        riskLevel={riskLevel}
        setRiskLevel={setRiskLevel}
        submissionDate={submissionDate}
        setSubmissionDate={setSubmissionDate}
        onReset={resetFilters}
      />

      <DecisionModal
        open={!!decisionMode}
        mode={decisionMode}
        item={selectedItem}
        reason={decisionReason}
        comment={decisionComment}
        setReason={setDecisionReason}
        setComment={setDecisionComment}
        onClose={closeDecision}
        onConfirm={() => {
          if (decisionMode === "approve") handleApprove(selectedItem);
          if (decisionMode === "reject") handleReject(selectedItem);
          if (decisionMode === "revision") closeDecision();
          if (decisionMode === "audit") handleAudit(selectedItem);
        }}
      />
    </div>
  );
};

export default StorefrontApprovals;