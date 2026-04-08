import api from "./axios";

/* =======================================================
   ✅ CONSULTATION: FILTER (POST)
======================================================= */
export const filterConsultations = async (payload = {}) => {
  const res = await api.post("/consultation/filter", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: GET SUSPENDED (GET)
======================================================= */
export const getSuspendedConsultations = async () => {
  const res = await api.get("/consultation/suspended");
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: FILTER FLAGGED (POST)
   BODY:
   {
     searchText,
     cityId,
     severity,
     flaggedAfter,
     flaggedBefore,
     pageNo,
     pageSize
   }
======================================================= */
export const filterFlaggedConsultations = async (payload = {}) => {
  const res = await api.post("/consultation/flagged/filter", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: GET KPI (GET)
======================================================= */
export const getConsultationKpi = async () => {
  const res = await api.get("/consultation/kpi");
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: GET SINGLE
======================================================= */
export const getConsultationById = async (consultId) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  const res = await api.get(`/consultation/${consultId}/enhanced`);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: UNSUSPEND (POST)
   BODY:
   {
     consultationId,
     reason
   }
======================================================= */
export const unsuspendConsultation = async ({ consultId, reason }) => {
  if (!consultId) {
    throw new Error("consultationId is required");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  const payload = {
    consultId,
    reason: String(reason).trim(),
  };

  const res = await api.patch("/consultation/unsuspend", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: APPROVE KYC (PATCH)
   BODY:
   {
     consultId,
     remark
   }
======================================================= */
export const approveKYCConsultation = async ({ consultId, remark }) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!remark || !String(remark).trim()) {
    throw new Error("remark is required");
  }

  const payload = {
    consultId,
    remark: String(remark).trim(),
  };

  const res = await api.patch("/consultation/approveKYC", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: REJECT KYC (PATCH)
   BODY:
   {
     consultId,
     remark
   }
======================================================= */
export const rejectKYCConsultation = async ({ consultId, remark }) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!remark || !String(remark).trim()) {
    throw new Error("remark is required");
  }

  const payload = {
    consultId,
    remark: String(remark).trim(),
  };

  const res = await api.patch("/consultation/rejectKYC", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: REQUEST UPLOAD KYC (PATCH)
   BODY:
   {
     consultId,
     remark
   }
======================================================= */
export const requestUploadKYCConsultation = async ({ consultId, remark }) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!remark || !String(remark).trim()) {
    throw new Error("remark is required");
  }

  const payload = {
    consultId,
    remark: String(remark).trim(),
  };

  const res = await api.patch("/consultation/requestUploadKYC", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: SUSPEND (POST)
   BODY:
   {
     consultationId,
     reason,
     suspenseType,
     suspendUntil
   }
======================================================= */
export const suspendConsultation = async ({
  consultId,
  reason,
  suspendType,
  suspendUntil = null,
}) => {
  if (!consultId) {
    throw new Error("consultationId is required");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  if (!suspendType) {
    throw new Error("suspenseType is required");
  }

  const payload = {
    consultId,
    reason: String(reason).trim(),
    suspendType,
    suspendUntil: suspendType === "TEMPORARY" ? suspendUntil : null,
  };

  const res = await api.patch("/consultation/suspend", payload);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: CHANGE TIER (PATCH)
   BODY:
   {
     consultId,
     newTierId,
     applyType,
     discountPercentage,
     manualPrice,
     reason
   }
======================================================= */
export const changeConsultantTier = async ({
  consultId,
  newTierId,
  applyType,
  discountPercentage = null,
  manualPrice = null,
  reason,
}) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!newTierId) {
    throw new Error("newTierId is required");
  }

  if (!applyType) {
    throw new Error("applyType is required");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  const payload = {
    consultId,
    newTierId,
    applyType,
    discountPercentage: discountPercentage
      ? parseFloat(discountPercentage)
      : null,
    manualPrice: manualPrice ? parseFloat(manualPrice) : null,
    reason: String(reason).trim(),
  };

  const res = await api.patch("/consultation/change-tier", payload);
  return res.data;
};

/* =======================================================
   ✅ MAPPER: API → TABLE ROW
======================================================= */
export const mapConsultationToRow = (item = {}) => ({
  id: item?.consultId || item?.id || "",
  name: item?.consultName || item?.consultationName || "-",
  username: item?.username || "",
  logoURL: item?.logoURL || item?.logoUrl || "",
  logoUrl: item?.logoUrl || item?.logoURL || "",

  mobile: item?.mobile || item?.phone || item?.phoneNumber || "",
  tierTitle: item?.tierTitle || "",
  tierId: item?.tierId ?? null,

  city: item?.cityName || "-",
  cityId: item?.cityId ?? null,
  stateName: item?.stateName || "",
  stateId: item?.stateId ?? null,

  vehicles: Number(item?.totalVehicles ?? 0),
  inquiries: Number(item?.totalInquiries ?? 0),
  responseTime: Number(item?.responseTime ?? 0),
  conversion: Number(item?.conversions ?? 0),
  rating: Number(item?.avgRating ?? 0),

  risk: item?.risk?.trim?.() ? item.risk : "Low",
  status: item?.status || "ACTIVE",
  verificationStatus: item?.verificationStatus || "REQUESTED",

  adminRemark: item?.adminRemark || "",
});

/* =======================================================
   ✅ FLAG FOR REVIEW (PATCH)
   BODY:
   {
     consultId,
     flagCategory,
     severity,
     internalNotes
   }
======================================================= */
export const flagConsultationReview = async ({
  consultId,
  flagCategory,
  severity,
  internalNotes,
}) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!flagCategory) {
    throw new Error("flagCategory is required");
  }

  if (!severity) {
    throw new Error("severity is required");
  }

  if (!internalNotes || !String(internalNotes).trim()) {
    throw new Error("internalNotes is required");
  }

  if (String(internalNotes).trim().length < 10) {
    throw new Error("internalNotes must be at least 10 characters");
  }

  const payload = {
    consultId,
    flagCategory,
    severity,
    internalNotes: String(internalNotes).trim(),
  };

  const res = await api.patch("/consultation/flag-review", payload);
  return res.data;
};

/* =======================================================
   ✅ FORCE AUDIT (PATCH)
   BODY:
   {
     consultId,
     auditType,
     reason
   }
======================================================= */
export const forceAuditConsultation = async ({
  consultId,
  auditType,
  reason,
}) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!auditType) {
    throw new Error("auditType is required");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  if (String(reason).trim().length < 10) {
    throw new Error("reason must be at least 10 characters");
  }

  const payload = {
    consultId,
    auditType,
    reason: String(reason).trim(),
  };

  const res = await api.patch("/consultation/force-audit", payload);
  return res.data;
};

/* =======================================================
   ✅ INTERNAL NOTE (POST)
   BODY:
   {
     consultId,
     note,
     visibility,
     attachmentUrl
   }
======================================================= */
export const addInternalNote = async ({
  consultId,
  note,
  visibility = "INTERNAL_ONLY",
  attachmentUrl = null,
}) => {
  if (!consultId) {
    throw new Error("consultId is required");
  }

  if (!note || !String(note).trim()) {
    throw new Error("note is required");
  }

  if (String(note).trim().length < 5) {
    throw new Error("note must be at least 5 characters");
  }

  if (!visibility) {
    throw new Error("visibility is required");
  }

  const payload = {
    consultId,
    note: String(note).trim(),
    visibility,
    attachmentUrl,
  };

  const res = await api.post("/consultation/internal-note", payload);
  return res.data;
};

/* =======================================================
   ✅ APPLY PENALTY (PATCH)
   BODY: { userId, deductionCount, reason }
======================================================= */
export const addPenalty = async ({ userId, deductionCount, reason }) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!deductionCount || deductionCount < 1) {
    throw new Error("deductionCount must be at least 1");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  const payload = {
    userId,
    deductionCount: Number(deductionCount),
    reason: String(reason).trim(),
  };

  const res = await api.patch("/consultation/addPenalty", payload);
  return res.data;
};

/* =======================================================
   ✅ CLEAR FLAGGED CONSULTATION (PATCH)
   BODY: { flagId, reason }
======================================================= */
export const clearFlaggedConsultation = async ({ flagId, reason }) => {
  if (!flagId) {
    throw new Error("flagId is required");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  const payload = {
    flagId,
    reason: String(reason).trim(),
  };

  const res = await api.patch("/consultation/clear-flag", payload);
  return res.data;
};

/* =======================================================
   ✅ GET GLOBAL RANKING CONFIG (GET)
======================================================= */
export const getGlobalRankingConfig = async () => {
  const res = await api.get("/consultation/ranking/config");
  return res.data;
};

/* =======================================================
   ✅ UPDATE GLOBAL RANKING CONFIG (PUT)
   BODY: GlobalRankingConfigUpdateRequest
======================================================= */
export const updateGlobalRankingConfig = async (payload) => {
  if (!payload) {
    throw new Error("Ranking config data is required");
  }

  const res = await api.put("/consultation/ranking/config", payload);
  return res.data;
};

/* =======================================================
   ✅ GET CONSULTANT OVERRIDES (GET)
======================================================= */
export const getConsultantOverrides = async () => {
  const res = await api.get("/consultation/ranking/overrides");
  return res.data;
};

/* =======================================================
   ✅ GET CONSULTANT PENALTIES (GET)
======================================================= */
export const getConsultantPenalties = async () => {
  const res = await api.get("/consultation/ranking/penalties");
  return res.data;
};

/* =======================================================
   ✅ GET ALL CONSULTANT NAMES (GET)
======================================================= */
export const getAllConsultantNames = async () => {
  const res = await api.get("/consultation/getAllConsultName");
  return res.data;
};

/* =======================================================
   ✅ APPLY OVERRIDE (POST)
   BODY: {
     userId,
     manualBoostScore,
     manualBoostScoreReason,
     manualBoostScoreType
   }
======================================================= */
export const applyOverride = async ({
  userId,
  manualBoostScore,
  manualBoostScoreReason,
  manualBoostScoreType,
}) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!manualBoostScore || parseFloat(manualBoostScore) <= 0) {
    throw new Error("manualBoostScore must be greater than 0");
  }

  if (!manualBoostScoreReason || !String(manualBoostScoreReason).trim()) {
    throw new Error("manualBoostScoreReason is required");
  }

  if (!manualBoostScoreType) {
    throw new Error("manualBoostScoreType is required");
  }

  const payload = {
    userId,
    manualBoostScore: parseFloat(manualBoostScore),
    manualBoostScoreReason: String(manualBoostScoreReason).trim(),
    manualBoostScoreType,
  };

  const res = await api.post("/consultation/ranking/override", payload);
  return res.data;
};

/* =======================================================
   ✅ APPLY PENALTIES (POST)
   BODY: {
     userId,
     manualDeductionScore,
     manualDeductionScoreReason,
     manualDeductionScoreType
   }
======================================================= */
export const applyPenalties = async ({
  userId,
  manualDeductionScore,
  manualDeductionScoreReason,
  manualDeductionScoreType,
}) => {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!manualDeductionScore || parseFloat(manualDeductionScore) <= 0) {
    throw new Error("manualDeductionScore must be greater than 0");
  }

  if (
    !manualDeductionScoreReason ||
    !String(manualDeductionScoreReason).trim()
  ) {
    throw new Error("manualDeductionScoreReason is required");
  }

  if (!manualDeductionScoreType) {
    throw new Error("manualDeductionScoreType is required");
  }

  const payload = {
    userId,
    manualDeductionScore: parseFloat(manualDeductionScore),
    manualDeductionScoreReason: String(manualDeductionScoreReason).trim(),
    manualDeductionScoreType,
  };

  const res = await api.post("/consultation/ranking/penalties", payload);
  return res.data;
};
