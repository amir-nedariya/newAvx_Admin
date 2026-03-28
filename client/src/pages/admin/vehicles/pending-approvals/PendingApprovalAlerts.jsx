import React from "react";
import { AlertCircle, ShieldAlert, Copy, Zap } from "lucide-react";

/**
 * Priority Alerts Strip (Top)
 * Shows high-priority cases that need immediate attention.
 * Clicking an alert should narrow the queue.
 */
const PendingApprovalAlerts = ({
  highRiskCount = 0,
  priceDeviationCount = 0,
  duplicateCount = 0,
  expeditedCount = 0,
  onFilterChange,
  activeFilter = "",
}) => {
  const alerts = [
    {
      id: "risk-high",
      label: "High Risk Listings",
      count: highRiskCount,
      icon: ShieldAlert,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      dot: "bg-rose-500",
    },
    {
      id: "price-deviation",
      label: "Suspicious Price Deviation",
      count: priceDeviationCount,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      dot: "bg-amber-500",
    },
    {
      id: "duplicates",
      label: "Duplicate Vehicle Detection",
      count: duplicateCount,
      icon: Copy,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      dot: "bg-rose-500",
    },
    {
      id: "expedited",
      label: "Expedited Premium Listings",
      count: expeditedCount,
      icon: Zap,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      dot: "bg-blue-500",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {alerts.map((alert) => (
        <button
          key={alert.id}
          onClick={() => onFilterChange?.(alert.id)}
          className={`flex items-center gap-2.5 rounded-full border px-4 py-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
            activeFilter === alert.id
              ? alert.color + " ring-2 ring-offset-2 ring-current ring-opacity-10"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <div className={`h-2 w-2 rounded-full ${alert.dot} animate-pulse`} />
          <alert.icon className={`h-4 w-4 ${activeFilter === alert.id ? "" : "text-slate-400"}`} />
          <span className="text-sm font-semibold whitespace-nowrap">
            {alert.label}
          </span>
          <span
            className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
              activeFilter === alert.id
                ? "bg-white/50"
                : "bg-slate-100 text-slate-900"
            }`}
          >
            {alert.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PendingApprovalAlerts;
