import { useEffect, useState } from "react";
import {
  ChevronDown,
  Trash2,
  Edit3,
  X,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import {
  getVehicleImageKeys,
  getVehicleTypes,
  createVehicleImageKey,
  updateVehicleImageKey,
  deleteVehicleImageKey,
} from "../../../api/vehicleImageKey.api";

/* ================= HELPERS ================= */
const formatLabel = (text = "") =>
  text
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ================= COMPONENT ================= */
const VehicleImages = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);

  const [currentEdit, setCurrentEdit] = useState({
    id: null,
    vehicleType: "",
    imageKey: "",
    required: true,
    displayOrder: 1,
    status: "ACTIVE",
  });

  /* ================= API ================= */
  const loadVehicleTypes = async () => {
    const res = await getVehicleTypes();
    setCategories(
      res.data.data.map((type) => ({
        name: type,
        open: false,
        images: [],
      }))
    );
  };

  const loadImageKeys = async () => {
    const res = await getVehicleImageKeys(1);
    const list = res.data.data || [];
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        images: list.filter((i) => i.vehicleType === cat.name),
      }))
    );
  };

  useEffect(() => {
    loadVehicleTypes();
  }, []);

  useEffect(() => {
    if (categories.length) loadImageKeys();
  }, [categories.length]);

  /* ================= ACTIONS ================= */
  const toggleCategory = (name) =>
    setCategories((prev) =>
      prev.map((c) =>
        c.name === name ? { ...c, open: !c.open } : c
      )
    );

  const openAddModal = (vehicleType) => {
    setIsAddMode(true);
    setCurrentEdit({
      id: null,
      vehicleType,
      imageKey: "",
      required: true,
      displayOrder: 1,
      status: "ACTIVE",
    });
    setModalOpen(true);
  };

  const openEditModal = (vehicleType, img) => {
    setIsAddMode(false);
    setCurrentEdit({
      ...img,
      vehicleType,
      displayOrder: Number(img.displayOrder),
    });
    setModalOpen(true);
  };

  const saveImageKey = async () => {
    const payload = {
      vehicleType: currentEdit.vehicleType,
      imageKey: currentEdit.imageKey.trim(),
      required: currentEdit.required,
      displayOrder: Number(currentEdit.displayOrder),
      status: currentEdit.status,
    };

    isAddMode
      ? await createVehicleImageKey(payload)
      : await updateVehicleImageKey(currentEdit.id, payload);

    setModalOpen(false);
    loadImageKeys();
  };

  const removeImageKey = async (id) => {
    await deleteVehicleImageKey(id);
    loadImageKeys();
  };

  const toggleRowStatus = async (img) => {
    await updateVehicleImageKey(img.id, {
      vehicleType: img.vehicleType,
      imageKey: img.imageKey,
      required: img.required,
      displayOrder: img.displayOrder,
      status: img.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
    loadImageKeys();
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen px-8 py-6 text-gray-200
    bg-gradient-to-br from-[#0B0F1A] via-[#0E1628] to-[#05070D]">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 ring-1 ring-blue-400/50">
          <ImageIcon className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-wide">
            Vehicle Image Configuration
          </h1>
          <p className="text-sm text-gray-400">
            Manage mandatory and optional images for each vehicle type
          </p>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="space-y-5">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md"
          >
            {/* CATEGORY HEADER */}
            <div className="flex justify-between items-center px-6 py-4">
              <button
                onClick={() => toggleCategory(cat.name)}
                className="flex items-center gap-3 font-medium text-white"
              >
                <ChevronDown
                  className={`transition-transform duration-300 ${cat.open ? "rotate-180" : ""}`}
                />
                {formatLabel(cat.name)}
                <span className="text-xs px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                  {cat.images.length} Keys
                </span>
              </button>

              <button
                onClick={() => openAddModal(cat.name)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 ring-1 ring-blue-400/30"
              >
                <Plus size={16} /> Add Image
              </button>
            </div>

            {/* TABLE */}
            {cat.open && (
              <div className="px-6 pb-6 overflow-x-auto">
                <table className="w-full text-sm rounded-xl border border-white/10 overflow-hidden">
                  <thead className="bg-white/5 text-gray-400">
                    <tr>
                      <th className="p-3 text-left">Image Key</th>
                      <th className="p-3 text-center">Required</th>
                      <th className="p-3 text-center">Order</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.images.map((img) => (
                      <tr key={img.id} className="border-t border-white/10 hover:bg-white/5 transition">
                        <td className="p-3 text-white">{formatLabel(img.imageKey)}</td>
                        <td className="p-3 text-center">{img.required ? "Required" : "Optional"}</td>
                        <td className="p-3 text-center">{img.displayOrder}</td>

                        {/* STATUS TOGGLE */}
                        <td className="p-3 text-center">
                          <div
                            onClick={() => toggleRowStatus(img)}
                            className={`mx-auto w-12 h-7 flex items-center p-1 rounded-full cursor-pointer transition-colors duration-300
                              ${img.status === "ACTIVE" ? "bg-green-500" : "bg-gray-600"}`}
                          >
                            <div
                              className={`bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300
                                ${img.status === "ACTIVE" ? "translate-x-5" : ""}`}
                            />
                          </div>
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="p-3 flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cat.name, img)}
                            className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => removeImageKey(img.id)}
                            className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[480px] bg-gradient-to-b from-[#0B0F1A] to-[#05070D] border border-white/20 rounded-2xl shadow-2xl p-6">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {isAddMode ? "Add Vehicle Image" : "Edit Vehicle Image"}
                </h3>
                <p className="text-sm text-gray-400 mt-1">Easily manage image keys and settings</p>
              </div>
              <X className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setModalOpen(false)} />
            </div>

            {/* FORM */}
            <div className="space-y-5 text-sm">
              {/* Vehicle Type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Vehicle Type</label>
                <input
                  disabled
                  value={formatLabel(currentEdit.vehicleType)}
                  className="w-full p-3 bg-[#1A1F2A] border border-white/20 rounded-xl text-white cursor-not-allowed"
                />
              </div>

              {/* Image Key */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Image Key</label>
                <input
                  placeholder="front_image"
                  value={currentEdit.imageKey}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, imageKey: e.target.value })}
                  className="w-full p-3 bg-[#1A1F2A] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Required + Display Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Required</label>
                  <select
                    value={currentEdit.required}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, required: e.target.value === "true" })}
                    className="w-full p-3 bg-[#1A1F2A] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="true">Required</option>
                    <option value="false">Optional</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={currentEdit.displayOrder}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, displayOrder: e.target.value })}
                    className="w-full p-3 bg-[#1A1F2A] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              {/* STATUS TOGGLE */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Status</label>
                <div
                  onClick={() => setCurrentEdit({ ...currentEdit, status: currentEdit.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
                  className={`w-16 h-8 flex items-center p-1 rounded-full cursor-pointer transition-colors duration-300
                    ${currentEdit.status === "ACTIVE" ? "bg-green-500" : "bg-gray-600"}`}
                >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300
                    ${currentEdit.status === "ACTIVE" ? "translate-x-7" : ""}`}
                  />
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={saveImageKey}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all"
              >
                {isAddMode ? "Create Vehicle Image" : "Update Vehicle Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleImages;
