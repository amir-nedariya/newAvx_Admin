import { X, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ViewRankingModal = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* DUMMY DATA (Later API se replace hoga) */
  const rankingData = {
    consultantName: "Adarsh Auto Consultants",
    score: 82,
    responseTime: "2.1 hrs",
    conversionRate: "18%",
    boostUsage: "High",
    reviews: 4.6,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ranking Breakdown</h2>
              <p className="text-sm text-gray-500">
                {rankingData.consultantName}
              </p>
            </div>
          </div>
          <button onClick={() => navigate(-1)}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          <Stat label="Ranking Score" value={`${rankingData.score}/100`} />
          <Stat label="Response Time" value={rankingData.responseTime} />
          <Stat label="Conversion Rate" value={rankingData.conversionRate} />
          <Stat label="Boost Usage" value={rankingData.boostUsage} />
          <Stat label="Average Rating" value={rankingData.reviews} />

          <div className="bg-indigo-50 p-4 rounded-lg flex gap-3">
            <BarChart3 className="text-indigo-600 mt-1" />
            <p className="text-sm text-indigo-700">
              Ranking score is calculated based on response time, conversions,
              boost activity, reviews, and compliance history.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="flex justify-between items-center border p-3 rounded-lg">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default ViewRankingModal;