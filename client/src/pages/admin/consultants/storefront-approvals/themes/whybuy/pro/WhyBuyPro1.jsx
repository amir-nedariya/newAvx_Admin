import React from "react";
import "../../themeStyles.css";

const WhyBuyPro1 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-24">

      {/* ===== HERO ===== */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">

        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
            {data.whyBuyHeroTitle}
          </h1>

          <p className="text-slate-600 text-lg">
            {data.whyBuyHeroDescription}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[data.whyBuyHeroTemplate1, data.whyBuyHeroTemplate2, data.whyBuyHeroTemplate3]
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
      {data.storyTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.storyTitle}
            </h2>

            <p className="text-slate-600 whitespace-pre-line">
              {data.storyDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[data.storyTemplate1, data.storyTemplate2, data.storyTemplate3, data.storyTemplate4]
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
      {data.vehicleSelectionTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="grid grid-cols-2 gap-4">
            {[data.vehicleSelectionTemplate1, data.vehicleSelectionTemplate2]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  className="rounded-2xl h-48 w-full object-cover"
                  alt=""
                />
              ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.vehicleSelectionTitle}
            </h2>

            <p className="text-slate-600">
              {data.vehicleSelectionDescription}
            </p>
          </div>
        </section>
      )}

      {/* ===== PROCESS ===== */}
      {data.processSteps && (
        <section className="space-y-12">

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.processTitle}
            </h2>
            <p className="text-slate-600 mt-3">
              {data.processDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.processSteps.map((step, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 border rounded-2xl hover:shadow-lg transition"
              >
                <div
                  className="text-sky-500 [&>svg]:w-8 [&>svg]:h-8"
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* ===== INSPECTION ===== */}
      {data.inspectionTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-50 p-8 rounded-3xl">

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.inspectionTitle}
            </h2>

            <p className="text-slate-600">
              {data.inspectionText}
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

          <div className="grid grid-cols-2 gap-4">
            {[data.inspectionTemplate1, data.inspectionTemplate2, data.inspectionTemplate3, data.inspectionTemplate4]
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

      {/* ===== CUSTOMER COMMITMENT ===== */}
      {data.customerCommitmentTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="grid grid-cols-3 gap-4">
            {[data.customerCommitmentTemplate1, data.customerCommitmentTemplate2, data.customerCommitmentTemplate3]
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

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {data.customerCommitmentTitle}
            </h2>

            <p className="text-slate-600">
              {data.customerCommitmentDescription}
            </p>
          </div>
        </section>
      )}

      {/* ===== GALLERY ===== */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[data.galleryTemplate1, data.galleryTemplate2, data.galleryTemplate3, data.galleryTemplate4, data.galleryTemplate5]
          .filter(Boolean)
          .map((img, i) => (
            <img
              key={i}
              src={img.imageUrl}
              className="rounded-xl h-32 w-full object-cover"
              alt=""
            />
          ))}
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {data.testimonials && (
        <section className="space-y-12">

          <h2 className="text-3xl font-bold text-center text-slate-900">
            {data.testimonialTitle}
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

export default WhyBuyPro1;