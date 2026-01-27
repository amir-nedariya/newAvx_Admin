import React from "react";
import {
  Shield,
  Bell,
  Sliders,
  Key,
  Wrench,
  Save,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          ⚙️ Admin Settings
        </h1>
        <p className="text-sm text-gray-400">
          Platform-wide configuration & security controls
        </p>
      </div>

      {/* SETTINGS SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PLATFORM RULES */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Sliders className="w-6 h-6 text-blue-400" />
            <h2 className="font-semibold text-lg">
              Platform Rules & Limits
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                Max vehicles per user
              </span>
              <input
                type="number"
                defaultValue={2}
                className="w-20 rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-white"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                Inquiry SLA (minutes)
              </span>
              <input
                type="number"
                defaultValue={30}
                className="w-20 rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-white"
              />
            </div>

            <label className="flex justify-between items-center">
              <span className="text-gray-300">
                Auto suspend on fraud
              </span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        {/* SECURITY */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-400" />
            <h2 className="font-semibold text-lg">
              Security & Access
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <label className="flex justify-between items-center">
              <span className="text-gray-300">
                Two-Factor Authentication
              </span>
              <input type="checkbox" defaultChecked />
            </label>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">
                Admin session timeout (mins)
              </span>
              <input
                type="number"
                defaultValue={15}
                className="w-20 rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-white"
              />
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-800 text-sm">
              <Key className="w-4 h-4" />
              Rotate API Keys
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-yellow-400" />
            <h2 className="font-semibold text-lg">
              Notifications
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <label className="flex justify-between items-center">
              <span className="text-gray-300">
                Fraud alerts
              </span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex justify-between items-center">
              <span className="text-gray-300">
                SLA breach alerts
              </span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex justify-between items-center">
              <span className="text-gray-300">
                Revenue summary emails
              </span>
              <input type="checkbox" />
            </label>
          </div>
        </div>

        {/* MAINTENANCE */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6 text-purple-400" />
            <h2 className="font-semibold text-lg">
              Maintenance Mode
            </h2>
          </div>

          <p className="text-sm text-gray-400">
            Temporarily disable platform access for maintenance.
          </p>

          <label className="flex justify-between items-center text-sm">
            <span className="text-gray-300">
              Enable Maintenance Mode
            </span>
            <input type="checkbox" />
          </label>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
