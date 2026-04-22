import React from "react";
import {
  Search,
  MessageCircle,
  ShieldCheck,
  Handshake,
} from "lucide-react";

const iconMap = {
  Search,
  MessageCircle,
  ShieldCheck,
  Handshake,
};

const WhyBuyPro3 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-24">

      {/* ===== HERO ===== */}
      <section className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            {data.whyBuyHeroTitle}
          </h1>

          <p className="text-slate-600 whitespace-pre-line">
            {data.whyBuyHeroDescription}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[data.whyBuyHeroTemplate1, data.whyBuyHeroTemplate2, data.whyBuyHeroTemplate3, data.whyBuyHeroTemplate4, data.whyBuyHeroTemplate5]
            .filter(Boolean)
            .map((img, i) => (
              <img
                key={i}
                src={img.imageUrl}
                className="rounded-2xl h-40 w-full object-cover"
                alt=""
              />
            ))}
        </div>
      </section>

      {/* ===== STORY ===== */}
      {data.whyBuyStoryTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.whyBuyStoryTitle}
            </h2>

            <p className="text-slate-600 whitespace-pre-line">
              {data.whyBuyStoryDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[data.whyBuyStoryTemplate1, data.whyBuyStoryTemplate2, data.whyBuyStoryTemplate3, data.whyBuyStoryTemplate4, data.whyBuyStoryTemplate5]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  className="rounded-2xl h-40 w-full object-cover"
                  alt=""
                />
              ))}
          </div>

        </section>
      )}

      {/* ===== VEHICLE SELECTION ===== */}
      {data.whyBuyVehicleSelectionTitle && (
        <section className="space-y-10">

          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.whyBuyVehicleSelectionTitle}
            </h2>

            <p className="text-slate-600 whitespace-pre-line">
              {data.whyBuyVehicleSelectionDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[data.whyBuyVehicleSelectionTemplate1, data.whyBuyVehicleSelectionTemplate2, data.whyBuyVehicleSelectionTemplate3, data.whyBuyVehicleSelectionTemplate4, data.whyBuyVehicleSelectionTemplate5]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  className="rounded-2xl h-40 w-full object-cover"
                  alt=""
                />
              ))}
          </div>

        </section>
      )}

      {/* ===== PROCESS ===== */}
      {data.processSteps && (
        <section className="space-y-12">

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.whyBuyProcessTitle}
            </h2>

            <p className="text-slate-600 mt-3">
              {data.whyBuyProcessDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.processSteps.map((step, i) => {
              const Icon = iconMap[step.icon];

              return (
                <div
                  key={i}
                  className="flex gap-4 p-6 border rounded-2xl hover:shadow-lg transition"
                >
                  {Icon && (
                    <Icon className="w-8 h-8 text-sky-500 mt-1" />
                  )}

                  <div>
                    <h3 className="font-semibold text-slate-900">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[data.whyBuyProcessTemplate1, data.whyBuyProcessTemplate2, data.whyBuyProcessTemplate3, data.whyBuyProcessTemplate4]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  className="rounded-xl h-40 w-full object-cover"
                  alt=""
                />
              ))}
          </div>

        </section>
      )}

      {/* ===== INSPECTION ===== */}
      {data.whyBuyInspectionTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-50 p-8 rounded-3xl">

          <div className="grid grid-cols-2 gap-4">
            {[data.whyBuyInspectionTemplate1, data.whyBuyInspectionTemplate2, data.whyBuyInspectionTemplate3, data.whyBuyInspectionTemplate4]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  className="rounded-xl h-40 w-full object-cover"
                  alt=""
                />
              ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.whyBuyInspectionTitle}
            </h2>

            <p className="text-slate-600 whitespace-pre-line">
              {data.whyBuyInspectionDescription}
            </p>

            <ul className="space-y-2">
              {data.inspectionPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-slate-700">
                  <span className="w-2 h-2 bg-sky-500 rounded-full mt-2" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </section>
      )}

      {/* ===== CUSTOMER COMMITMENT ===== */}
      {data.whyBuyCustomerCommitmentTitle && (
        <section className="max-w-4xl mx-auto space-y-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.whyBuyCustomerCommitmentTitle}
          </h2>

          <p className="text-slate-600 whitespace-pre-line">
            {data.whyBuyCustomerCommitmentDescription}
          </p>
        </section>
      )}

      {/* ===== GALLERY ===== */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-slate-900">
          {data.whyBuyGalleryTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[data.whyBuyGalleryTemplate1, data.whyBuyGalleryTemplate2, data.whyBuyGalleryTemplate3, data.whyBuyGalleryTemplate4]
            .filter(Boolean)
            .map((img, i) => (
              <img
                key={i}
                src={img.imageUrl}
                className="rounded-xl h-40 w-full object-cover"
                alt=""
              />
            ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {data.testimonials && (
        <section className="space-y-12">

          <h2 className="text-3xl font-bold text-center text-slate-900">
            {data.whyBuyTestimonialTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {data.testimonials.map((item, i) => (
              <div
                key={i}
                className="p-6 border rounded-2xl shadow-sm"
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

export default WhyBuyPro3;