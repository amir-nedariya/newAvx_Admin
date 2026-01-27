import React, { useState } from "react";
import {
  FileText,
  Image,
  HelpCircle,
  Megaphone,
  Plus,
  Edit,
  Eye,
} from "lucide-react";

const CMS = () => {
  const [active, setActive] = useState("Pages");

  const data = {
    Pages: ["About Us", "Terms & Conditions", "Privacy Policy"],
    "Homepage Banners": ["Hero Banner", "Festival Offer"],
    FAQs: ["Buying Process", "Inspection Rules"],
    Announcements: ["Holiday Notice", "Policy Update"],
  };

  const menu = [
    { name: "Pages", icon: FileText },
    { name: "Homepage Banners", icon: Image },
    { name: "FAQs", icon: HelpCircle },
    { name: "Announcements", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Content Management</h1>
        <p className="text-gray-400 text-sm">
          Manage platform content in a structured way
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <aside className="col-span-3 bg-[#0F172A] border border-white/10 rounded-2xl p-3 space-y-1">
          {menu.map(({ name, icon: Icon }) => {
            const isActive = active === name;

            return (
              <button
                key={name}
                onClick={() => setActive(name)}
                className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r" />
                )}

                <Icon
                  size={18}
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />

                {name}
              </button>
            );
          })}
        </aside>

        {/* CONTENT */}
        <main className="col-span-9 bg-[#0F172A] border border-white/10 rounded-2xl p-6">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{active}</h2>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-green-600 hover:bg-green-700 text-sm font-medium">
              <Plus size={16} />
              Add New
            </button>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 px-5 py-3 text-sm font-semibold
            text-gray-400 border-b border-white/10">
            <div className="col-span-8">Title</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>

          {/* TABLE ROWS */}
          <div className="divide-y divide-white/5">
            {data[active].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center px-5 py-4
                  hover:bg-white/5 transition"
              >
                <div className="col-span-8 font-medium text-gray-200">
                  {item}
                </div>

                <div className="col-span-4 flex justify-end gap-2">
                  <button className="p-2 rounded-lg bg-blue-500/10
                    text-blue-400 hover:bg-blue-600 hover:text-white transition">
                    <Edit size={16} />
                  </button>

                  <button className="p-2 rounded-lg bg-gray-500/10
                    text-gray-300 hover:bg-gray-700 hover:text-white transition">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CMS;
