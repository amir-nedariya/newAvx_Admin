import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStoreThemeById,
  updateStoreTheme,
  getTierPlans,
} from "../../../api/storeTheme.api";
import { Palette, ImagePlus } from "lucide-react";

const StoreThemeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    themeId: "",
    name: "",
    schema: "",
    status: "ACTIVE",
    allowedTierIds: [],
  });

  const [tiers, setTiers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [themeRes, tierRes] = await Promise.all([
          getStoreThemeById(id),
          getTierPlans(),
        ]);

        const theme = themeRes.data;

        setForm({
          themeId: theme.themeId,
          name: theme.name,
          schema: theme.schema || "",
          status: theme.status,
          allowedTierIds: theme.allowedTiers?.map(t => Number(t.id)) || [],
        });

        setTiers(tierRes);
      } catch (err) {
        console.error(err);
        alert("Failed to load theme");
        navigate(-1);
      }
    };

    loadData();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter({ file, preview: URL.createObjectURL(file) });
    }
  };

  const toggleTier = (id) => {
    setForm(prev => ({
      ...prev,
      allowedTierIds: prev.allowedTierIds.includes(id)
        ? prev.allowedTierIds.filter(t => t !== id)
        : [...prev.allowedTierIds, id],
    }));
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("themeId", form.themeId);
      formData.append("name", form.name);
      formData.append("schema", form.schema || "chacker");
      formData.append("status", form.status);
      formData.append("type", "CONSULTATION_STORE");

      form.allowedTierIds.forEach(id =>
        formData.append("allowedTierIds", id)
      );

      if (thumbnail?.file) formData.append("thumbnail", thumbnail.file);
      if (preview?.file) formData.append("preview", preview.file);

      await updateStoreTheme(id, formData);

      alert("Theme updated successfully");
      navigate("/admin/store-theme");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070D] to-[#0A0F1F] p-8 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-[#0B0F1A]/80 border border-white/10 rounded-3xl p-8 space-y-8"
      >
        <div className="flex items-center gap-3">
          <Palette className="text-blue-400" />
          <h1 className="text-2xl font-semibold text-white">
            Edit Store Theme
          </h1>
        </div>

        {/* BASIC */}
        <div className="grid grid-cols-2 gap-6">
          <Input label="Theme ID" name="themeId" value={form.themeId} onChange={handleChange} />
          <Input label="Theme Name" name="name" value={form.name} onChange={handleChange} />
        </div>

        {/* STATUS */}
        <div>
          <label className="text-sm text-gray-400">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-gray-200"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="DELETED">DELETED</option>
          </select>
        </div>

        {/* IMAGES */}
        <div className="grid grid-cols-2 gap-6">
          <ImageUploader label="Thumbnail" image={thumbnail} onChange={(e) => handleImage(e, setThumbnail)} />
          <ImageUploader label="Preview" image={preview} onChange={(e) => handleImage(e, setPreview)} />
        </div>

        {/* SCHEMA */}
        <textarea
          name="schema"
          value={form.schema}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-gray-200"
        />

        {/* TIERS */}
        <div className="grid grid-cols-2 gap-4">
          {tiers.map(tier => (
            <label key={tier.id} className="flex gap-2 text-gray-200">
              <input
                type="checkbox"
                checked={form.allowedTierIds.includes(tier.id)}
                onChange={() => toggleTier(tier.id)}
              />
              {tier.title}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate(-1)} className="text-gray-400">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
          >
            {loading ? "Updating..." : "Update Theme"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- SMALL ---------- */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input {...props} className="mt-2 w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-gray-200" />
  </div>
);

const ImageUploader = ({ label, image, onChange }) => (
  <label className="block border border-dashed border-white/20 rounded-2xl p-4 text-center cursor-pointer">
    <p className="text-sm text-gray-400 mb-2">{label}</p>
    {image ? <img src={image.preview} className="h-32 mx-auto" /> : <ImagePlus className="mx-auto text-gray-400" />}
    <input type="file" hidden accept="image/*" onChange={onChange} />
  </label>
);

export default StoreThemeEdit;
