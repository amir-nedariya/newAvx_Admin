import api from "./axios";

/* =======================================================
   ✅ CONSULTATION: FILTER (POST)
======================================================= */
export const filterConsultations = async (payload = {}) => {
  const res = await api.post("/consultation/filter", payload);
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

  const res = await api.get(`/consultation/${consultId}`);
  return res.data;
};

/* =======================================================
   ✅ CONSULTATION: UNSUSPEND (PATCH)
   BODY:
   {
     consultId,
     reason
   }
======================================================= */
export const unsuspendConsultation = async ({ consultId, reason }) => {
  if (!consultId) {
    throw new Error("consultId is required");
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
   ✅ CONSULTATION: SUSPEND (PATCH)
   BODY:
   {
     consultId,
     reason,
     suspendType,
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
    throw new Error("consultId is required");
  }

  if (!reason || !String(reason).trim()) {
    throw new Error("reason is required");
  }

  if (!suspendType) {
    throw new Error("suspendType is required");
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
   BODY: { consultId, flagCategory, severity, internalNotes }
======================================================= */
export const flagConsultationReview = async (payload) => {
  const res = await api.patch("/consultation/flag-review", payload);
  return res.data;
};

/* =======================================================
   ✅ FORCE AUDIT (PATCH)
   BODY: { consultId, auditType, reason }
======================================================= */
export const forceAuditConsultation = async (payload) => {
  const res = await api.patch("/consultation/force-audit", payload);
  return res.data;
};

/* =======================================================
   ✅ INTERNAL NOTE (POST)
   BODY: { consultId, note, visibility, attachmentUrl }
======================================================= */
export const addInternalNote = async (payload) => {
  const res = await api.post("/consultation/internal-note", payload);
  return res.data;
};

/* =======================================================
   ✅ APPLY PENALTY (PATCH)
   BODY: { consultId, deductionCount, reason }
======================================================= */
export const addPenalty = async (payload) => {
  const res = await api.patch("/consultation/addPenalty", payload);
  return res.data;
};