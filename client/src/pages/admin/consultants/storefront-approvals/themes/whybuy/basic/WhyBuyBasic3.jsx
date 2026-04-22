import React from "react";
import {
  Search,
  MessageCircle,
  ShieldCheck,
  Handshake
} from "lucide-react";

const iconMap = {
  Search,
  MessageCircle,
  ShieldCheck,
  Handshake,
};

const WhyBuyBasic3 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-20">

      {/* ===== HERO ===== */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
          {data.whyBuyHeroTitle}
        </h1>

        <p className="text-slate-600 text-lg leading-relaxed">
          {data.whyBuyHeroDescription}
        </p>
      </section>

      {/* ===== STORY ===== */}
      {data.storyTitle && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.storyTitle}
          </h2>

          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {data.storyDescription}
          </p>
        </section>
      )}

      {/* ===== VEHICLE SELECTION ===== */}
      {data.vehicleSelectionTitle && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.vehicleSelectionTitle}
          </h2>

          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {data.vehicleSelectionDescription}
          </p>
        </section>
      )}

      {/* ===== PROCESS ===== */}
      {data.processSteps && (
        <section className="space-y-12">

          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.processTitle}
            </h2>

            <p className="text-slate-600">
              {data.processDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.processSteps.map((step, index) => {
              const Icon = iconMap[step.icon];

              return (
                <div
                  key={index}
                  className="p-6 border rounded-2xl flex gap-4 hover:shadow-md transition"
                >
                  {Icon && (
                    <Icon className="w-8 h-8 text-sky-500 mt-1" />
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="text-slate-600 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* ===== INSPECTION ===== */}
      {data.inspectionTitle && (
        <section className="bg-slate-50 rounded-3xl p-8 space-y-6">

          <h2 className="text-3xl font-bold text-slate-900">
            {data.inspectionTitle}
          </h2>

          <p className="text-slate-600 whitespace-pre-line">
            {data.inspectionText}
          </p>

          <ul className="grid md:grid-cols-2 gap-4">
            {data.inspectionPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-slate-700"
              >
                <span className="w-2 h-2 bg-sky-500 rounded-full" />
                {point}
              </li>
            ))}
          </ul>

        </section>
      )}

      {/* ===== CUSTOMER COMMITMENT ===== */}
      {data.customerCommitmentTitle && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.customerCommitmentTitle}
          </h2>

          <p className="text-slate-600 whitespace-pre-line">
            {data.customerCommitmentDescription}
          </p>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      {data.testimonials && (
        <section className="space-y-12">

          <h2 className="text-3xl font-bold text-slate-900 text-center">
            {data.testimonialTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {data.testimonials.map((item, index) => (
              <div
                key={index}
                className="p-6 border rounded-2xl bg-white shadow-sm"
              >
                <p className="text-slate-600 mb-4">
                  "{item.review}"
                </p>

                <h4 className="font-semibold text-slate-900">
                  {item.name}
                </h4>
              </div>
            ))}
          </div>

        </section>
      )}

    </div>
  );
};

export default WhyBuyBasic3;