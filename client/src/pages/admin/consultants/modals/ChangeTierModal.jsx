import { X, AlertTriangle, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

/* -------------------- DUMMY DATA -------------------- */
const tierLimits = {
  Basic: 10,
  Pro: 25,
  Premium: 100,
};

const tierPrices = {
  Basic: 999,
  Pro: 2499,
  Premium: 4999,
};

const CONSULTANT = {
  id: "123",
  name: "Adarsh Auto Consultants",
  currentTier: "Pro",
  tierExpiry: "31 Mar 2026",
  totalVehicles: 32,
};

const ChangeTierModal = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const consultant = CONSULTANT;

  const [newTier, setNewTier] = useState(consultant.currentTier);
  const [applyTiming, setApplyTiming] = useState("immediate");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [manualPrice, setManualPrice] = useState(0);
  const [reason, setReason] = useState("");
  const [downgradeAction, setDowngradeAction] = useState("auto_unpublish");

  const isDowngrade =
    tierLimits[newTier] < tierLimits[consultant.currentTier];

  const vehicleOverflow =
    isDowngrade && consultant.totalVehicles > tierLimits[newTier];

  const excessVehicles = vehicleOverflow
    ? consultant.totalVehicles - tierLimits[newTier]
    : 0;

  const basePrice = tierPrices[newTier];
  const discountedPrice =
    discountPercent > 0
      ? basePrice - (basePrice * discountPercent) / 100
      : basePrice;

  const finalPrice = manualPrice > 0 ? manualPrice : discountedPrice;

  const isFormValid = newTier && reason.trim();

  const handleConfirm = () => {
    console.log({
      consultantId: id,
      newTier,
      applyTiming,
      discountPercent,
      manualPrice,
      reason,
      downgradeAction,
    });

    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Change Tier</h2>
              <p className="text-sm text-gray-500">{consultant.name}</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* CURRENT INFO */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Current Tier</p>
              <p className="font-semibold">{consultant.currentTier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry</p>
              <p className="font-semibold">{consultant.tierExpiry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicles</p>
              <p className="font-semibold">{consultant.totalVehicles}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Limit</p>
              <p className="font-semibold">
                {tierLimits[consultant.currentTier]}
              </p>
            </div>
          </div>

          {/* SELECT TIER */}
          <div>
            <p className="font-medium mb-3">Select New Tier</p>
            {["Basic", "Pro", "Premium"].map((tier) => (
              <label
                key={tier}
                className={`flex justify-between items-center p-4 mb-2 border rounded-lg cursor-pointer ${
                  newTier === tier
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={newTier === tier}
                    onChange={() => setNewTier(tier)}
                  />
                  <div>
                    <p className="font-semibold">{tier}</p>
                    <p className="text-sm text-gray-500">
                      Up to {tierLimits[tier]} vehicles
                    </p>
                  </div>
                </div>
                <p className="font-semibold">₹{tierPrices[tier]}</p>
              </label>
            ))}
          </div>

          {/* DOWNGRADE WARNING */}
          {vehicleOverflow && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">
                    Vehicle limit exceeded
                  </p>
                  <p className="text-sm text-red-700 mb-3">
                    {excessVehicles} vehicles will be affected
                  </p>

                  <label className="flex gap-2 mb-2">
                    <input
                      type="radio"
                      checked={downgradeAction === "auto_unpublish"}
                      onChange={() => setDowngradeAction("auto_unpublish")}
                    />
                    Auto-unpublish extra vehicles
                  </label>

                  <label className="flex gap-2">
                    <input
                      type="radio"
                      checked={downgradeAction === "block_downgrade"}
                      onChange={() => setDowngradeAction("block_downgrade")}
                    />
                    Block downgrade
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* PRICING */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Discount %"
              value={discountPercent}
              onChange={(e) => {
                setDiscountPercent(Number(e.target.value));
                setManualPrice(0);
              }}
              className="border p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Manual Price"
              value={manualPrice}
              onChange={(e) => {
                setManualPrice(Number(e.target.value));
                setDiscountPercent(0);
              }}
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            Final Price: <strong>₹{finalPrice}/mo</strong>
          </div>

          {/* REASON */}
          <textarea
            placeholder="Reason for tier change"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeTierModal;