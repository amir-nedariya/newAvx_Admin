import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreTemplateById, updateStoreTemplate } from "../../../api/storeTemplate.api";
import { getTierPlans } from "../../../api/storeTheme.api"; // fetch tiers
import { ImagePlus } from "lucide-react";

const StoreTemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tiers, setTiers] = useState([]);
  const [form, setForm] = useState({
    imageType: "HEADER",
    status: "ACTIVE",
    isDefault: false,
    allowedTierIds: [],
  });
  const [image, setImage] = useState(null); // for preview

  /* ================= FETCH TEMPLATE & TIERS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tierData, templateRes] = await Promise.all([
          getTierPlans(),
          getStoreTemplateById(id),
        ]);

        setTiers(tierData || []);
        const temp = templateRes.data;

        setForm({
          imageType: temp.imageType,
          status: temp.status,
          isDefault: temp.isDefault,
          allowedTierIds: temp.allowedTiers?.map(t => t.id) || [],
        });

        setImage(temp.imageUrl ? { file: null, preview: temp.imageUrl } : null);
      } catch (err) {
        console.error(err);
        alert("Failed to load template data");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f) setImage({ file: f, preview: URL.createObjectURL(f) });
  };

  const toggleTier = (tierId) => {
    setForm(prev => ({
      ...prev,
      allowedTierIds: prev.allowedTierIds.includes(tierId)
        ? prev.allowedTierIds.filter(id => id !== tierId)
        : [...prev.allowedTierIds, tierId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.allowedTierIds.length) {
      alert("Please select at least one tier");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("imageType", form.imageType);
      formData.append("status", form.status);
      formData.append("isDefault", form.isDefault);
      form.allowedTierIds.forEach(id => formData.append("allowedTierIds", id));
      if (image?.file) formData.append("image", image.file);

      await updateStoreTemplate(id, formData);
      alert("Template updated successfully!");
      navigate(`/admin/store-template/view/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 animate-pulse">Loading template...</div>;

  /* ================= FORM UI ================= */
  return (
    <div className="p-8 flex justify-center min-h-screen bg-gradient-to-br from-[#05070D] to-[#0A0F1F]">
      <form onSubmit={handleSubmit} className="bg-[#0B0F1A]/80 border border-white/10 p-8 rounded-3xl w-full max-w-2xl space-y-6">
        <h1 className="text-2xl text-white font-semibold">Edit Store Template</h1>

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

        {/* DEFAULT */}
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

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/admin/store-template")} className="text-gray-400">Cancel</button>
          <button type="submit" disabled={saving} className="bg-blue-500 text-white px-6 py-2 rounded-xl">{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
};

export default StoreTemplateEdit;
