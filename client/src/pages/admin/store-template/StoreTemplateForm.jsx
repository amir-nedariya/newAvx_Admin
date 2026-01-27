import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createStoreTemplate } from "../../../api/storeTemplate.api";
import { getTierPlans } from "../../../api/storeTheme.api"; // assuming same API for tiers
import { ImagePlus } from "lucide-react";

const StoreTemplateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tiers, setTiers] = useState([]);
  const [form, setForm] = useState({
    imageType: "HEADER",
    status: "ACTIVE",
    isDefault: false,
    allowedTierIds: [],
  });
  const [image, setImage] = useState(null);

  /* ================= FETCH TIERS ================= */
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const data = await getTierPlans(); // should return array [{id,title}]
        setTiers(data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch tiers");
      }
    };
    fetchTiers();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f) setImage({ file: f, preview: URL.createObjectURL(f) });
  };

  const toggleTier = (id) => {
    setForm(prev => ({
      ...prev,
      allowedTierIds: prev.allowedTierIds.includes(id)
        ? prev.allowedTierIds.filter(t => t !== id)
        : [...prev.allowedTierIds, id]
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.allowedTierIds.length) {
      alert("Please select at least one tier");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("imageType", form.imageType);
      formData.append("status", form.status);
      formData.append("isDefault", form.isDefault);
      form.allowedTierIds.forEach(id => formData.append("allowedTierIds", id));
      if (image?.file) formData.append("image", image.file);

      const res = await createStoreTemplate(formData);
      alert("Template created successfully!");
      navigate(`/admin/store-template/view/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-center min-h-screen bg-gradient-to-br from-[#05070D] to-[#0A0F1F]">
      <form onSubmit={handleSubmit} className="bg-[#0B0F1A]/80 border border-white/10 p-8 rounded-3xl w-full max-w-2xl space-y-6">
        <h1 className="text-2xl text-white font-semibold">Create Store Template</h1>

        {/* IMAGE TYPE */}
        <div>
          <label className="text-sm text-gray-400">Image Type</label>
          <select name="imageType" value={form.imageType} onChange={handleChange} className="mt-2 w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-gray-200">
            <option value="HEADER">HEADER</option>
            <option value="MISSION">MISSION</option>
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="text-sm text-gray-400">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-gray-200">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* DEFAULT FLAG */}
        <label className="flex items-center gap-3">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="accent-blue-500"/>
          <span className="text-gray-200">Set as Default Template</span>
        </label>

        {/* IMAGE UPLOAD */}
        <label className="block border border-dashed border-white/20 rounded-2xl p-4 text-center cursor-pointer">
          <p className="text-sm text-gray-400 mb-2">Upload Template Image</p>
          {image ? (
            <img src={image.preview} alt="preview" className="h-32 mx-auto object-contain"/>
          ) : (
            <ImagePlus className="mx-auto text-gray-400" />
          )}
          <input type="file" hidden accept="image/*" onChange={handleImage} />
        </label>

        {/* ALLOWED TIERS */}
        <div>
          <label className="text-sm text-gray-400 block mb-2">Allowed Tiers</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tiers.map(tier => (
              <label key={tier.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                ${form.allowedTierIds.includes(tier.id) ? "bg-blue-500/10 border-blue-500" : "bg-black/30 border-white/20"}`}>
                <input type="checkbox" checked={form.allowedTierIds.includes(tier.id)} onChange={() => toggleTier(tier.id)} className="accent-blue-500"/>
                <span className="text-gray-200">{tier.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/admin/store-template")} className="text-gray-400">Cancel</button>
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-6 py-2 rounded-xl">{loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
};

export default StoreTemplateForm;
