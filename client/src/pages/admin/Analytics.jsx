import React from "react";
import {
  MapPin,
  TrendingUp,
  CheckCircle,
  CreditCard,
  Users,
} from "lucide-react";

const Analytics = () => {
  const stats = [
    {
      title: "Top Demand City",
      value: "Mumbai",
      sub: "1,420 inquiries",
      icon: <MapPin className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Conversion Rate",
      value: "18.6%",
      sub: "Inquiry → Sale",
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    },
    {
      title: "Inspection Success",
      value: "92%",
      sub: "Passed inspections",
      icon: <CheckCircle className="w-6 h-6 text-purple-400" />,
    },
    {
      title: "Tier-wise Revenue",
      value: "₹4.3L",
      sub: "This month",
      icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: "Consultant Churn",
      value: "4.1%",
      sub: "Last 30 days",
      icon: <Users className="w-6 h-6 text-red-400" />,
    },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Admin Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Business intelligence & marketplace health
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg flex items-center gap-4 hover:bg-white/10 transition"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              {item.icon}
            </div>

            <div>
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="text-xl font-semibold">
                {item.value}
              </p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* INSIGHTS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-gray-200">
          Key Business Insights
        </h2>

        <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
          <li>
            Mumbai & Delhi contribute <strong className="text-white">42%</strong> of total demand.
          </li>
          <li>
            PRO tier consultants generate <strong className="text-white">71%</strong> of revenue.
          </li>
          <li>
            Inspection failures are highest in vehicles older than 8 years.
          </li>
          <li>
            Consultant churn is mainly from BASIC tier inactivity.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
