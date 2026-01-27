import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStoreTheme, getTierPlans } from "../../../api/storeTheme.api";
import { Palette, ImagePlus } from "lucide-react";

const StoreThemeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    themeId: "",
    name: "",
    schema: "",
    allowedTierIds: [],
  });

  const [tiers, setTiers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch tier plans
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const data = await getTierPlans();
        setTiers(data);
      } catch (err) {
        console.error("Error fetching tiers:", err);
      }
    };
    fetchTiers();
  }, []);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      thumbnail?.preview && URL.revokeObjectURL(thumbnail.preview);
      preview?.preview && URL.revokeObjectURL(preview.preview);
    };
  }, [thumbnail, preview]);

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image uploader
  const handleImage = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter({ file, preview: URL.createObjectURL(file) });
    }
  };

  // Toggle tier selection
  const toggleTier = (id) => {
    setForm((prev) => ({
      ...prev,
      allowedTierIds: prev.allowedTierIds.includes(id)
        ? prev.allowedTierIds.filter((tid) => tid !== id)
        : [...prev.allowedTierIds, id],
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.allowedTierIds.length) {
      alert("Please select at least one tier");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("themeId", form.themeId);
      formData.append("name", form.name);
      formData.append("type", "CONSULTATION_STORE");
      formData.append("status", "ACTIVE");
      formData.append("schema", form.schema || "chacker");

      // Append allowedTierIds as multiple fields
      form.allowedTierIds.forEach((id) => formData.append("allowedTierIds", id));

      // Append files
      if (thumbnail?.file) formData.append("thumbnail", thumbnail.file);
      if (preview?.file) formData.append("preview", preview.file);

      // Axios call
      await createStoreTheme(formData);

      alert("Theme created successfully!");
      navigate("/admin/store-theme");
    } catch (err) {
      console.error("Error creating theme:", err);
      alert("Failed to create theme. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070D] to-[#0A0F1F] flex justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-[#0B0F1A]/80 backdrop-blur
        border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Palette className="text-blue-400" size={26} />
          <h1 className="text-2xl font-semibold text-white">Create Store Theme</h1>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-2 gap-6">
          <Input label="Theme ID" name="themeId" value={form.themeId} onChange={handleChange} placeholder="THEME_MODERN_002" />
          <Input label="Theme Name" name="name" value={form.name} onChange={handleChange} placeholder="Modern Theme" />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="grid grid-cols-2 gap-6">
          <ImageUploader label="Thumbnail Image" image={thumbnail} onChange={(e) => handleImage(e, setThumbnail)} />
          <ImageUploader label="Preview Image" image={preview} onChange={(e) => handleImage(e, setPreview)} />
        </div>

        {/* SCHEMA */}
        <div>
          <label className="text-sm text-gray-400">Schema (String)</label>
          <textarea
            name="schema"
            rows={4}
            value={form.schema}
            onChange={handleChange}
            placeholder='Enter schema or leave blank (default "chacker")'
            className="mt-2 w-full rounded-2xl bg-black/40 border border-white/10
            text-gray-200 p-4 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* ALLOWED TIERS */}
        <div>
          <label className="text-sm text-gray-400 block mb-2">Allowed Tiers</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tiers.map((tier) => (
              <label
                key={tier.id}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                ${form.allowedTierIds.includes(tier.id) ? "bg-blue-500/10 border-blue-500" : "bg-black/30 border-white/20"}`}
              >
                <input
                  type="checkbox"
                  checked={form.allowedTierIds.includes(tier.id)}
                  onChange={() => toggleTier(tier.id)}
                  className="accent-blue-500"
                />
                <div>
                  <p className="text-white text-sm font-medium">{tier.title}</p>
                  <p className="text-xs text-gray-400">₹{tier.monthlyPrice}/month</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/admin/store-theme")} className="px-5 py-2 rounded-xl text-gray-300 hover:bg-white/5">Cancel</button>
          <button type="submit" disabled={loading} className="px-8 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-cyan-500">
            {loading ? "Creating..." : "Create Theme"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      {...props}
      required
      className="mt-2 w-full rounded-2xl bg-black/40 border border-white/10
      text-gray-200 p-4 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
    />
  </div>
);

/* ================= IMAGE UPLOADER ================= */
const ImageUploader = ({ label, image, onChange }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <label
      className="mt-2 h-40 flex flex-col items-center justify-center gap-2
      border border-dashed border-white/20 rounded-2xl cursor-pointer
      bg-black/30 hover:bg-black/40 transition overflow-hidden"
    >
      {image ? (
        <img src={image.preview} alt="preview" className="h-full w-full object-cover" />
      ) : (
        <>
          <ImagePlus className="text-gray-400" />
          <span className="text-xs text-gray-500">Upload image</span>
        </>
      )}
      <input type="file" accept="image/*" hidden onChange={onChange} />
    </label>
  </div>
);

export default StoreThemeForm;
