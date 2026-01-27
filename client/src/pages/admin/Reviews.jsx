import React from "react";
import {
  EyeOff,
  Flag,
  Lock,
  AlertTriangle,
} from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      target: "Adarsh Auto Consultants",
      content: "Very professional service",
      status: "Visible",
    },
    {
      id: 2,
      target: "Royal Motors",
      content: "Fake promises, bad experience",
      status: "Flagged",
    },
  ];

  const reports = [
    {
      id: 1,
      category: "Vehicle Report",
      target: "BMW X1",
      reason: "Misleading information",
    },
    {
      id: 2,
      category: "Inspection Dispute",
      target: "Honda City",
      reason: "Inspection report incorrect",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E1117] px-8 py-10 text-white space-y-12">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Reviews & Reports
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Moderate reviews, resolve disputes & maintain platform trust
        </p>
      </div>

      {/* ================= REVIEWS ================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Review Moderation
        </h2>

        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4
                         rounded-xl border border-white/10 bg-[#161B22] px-6 py-4"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium text-base">
                  {r.target}
                </p>
                <p className="text-sm text-gray-400 mt-1 max-w-2xl">
                  “{r.content}”
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium
                    ${
                      r.status === "Visible"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                >
                  {r.status}
                </span>

                <button className="icon-btn">
                  <EyeOff />
                </button>
                <button className="icon-btn text-red-400 hover:bg-red-500/10">
                  <Flag />
                </button>
                <button className="icon-btn text-purple-400 hover:bg-purple-500/10">
                  <Lock />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= REPORTS ================= */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Reports & Disputes
        </h2>

        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4
                         rounded-xl border border-white/10 bg-[#161B22] px-6 py-4"
            >
              {/* LEFT */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>

                <div>
                  <p className="font-medium">{r.category}</p>
                  <p className="text-sm text-gray-400">
                    Target: {r.target}
                  </p>
                  <p className="text-sm text-red-400 mt-1">
                    {r.reason}
                  </p>
                </div>
              </div>

              {/* ACTION */}
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium transition">
                Resolve
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
