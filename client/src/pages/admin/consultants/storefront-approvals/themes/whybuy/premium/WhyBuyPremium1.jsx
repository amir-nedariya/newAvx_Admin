import React from "react";

const WhyBuyPremium1 = ({ data }) => {
  if (!data) return null;

  const isVideo = (url) => url?.endsWith(".mp4");

  return (
    <div className="space-y-28">

      {/* ───────── HERO (VIDEO + OVERLAY) ───────── */}
      <section className="relative h-[600px] rounded-3xl overflow-hidden">

        {/* Media */}
        {data.whyBuyHeroTemplate1?.imageUrl && (
          isVideo(data.whyBuyHeroTemplate1.imageUrl) ? (
            <video
              src={data.whyBuyHeroTemplate1.imageUrl}
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={data.whyBuyHeroTemplate1.imageUrl}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
          )
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-6">
          <div className="max-w-3xl text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              {data.whyBuyHeroTitle}
            </h1>

            <p className="text-lg text-slate-200">
              {data.whyBuyHeroDescription}
            </p>
          </div>
        </div>

        {/* Floating Images */}
        <div className="hidden md:flex absolute bottom-[-40px] right-10 gap-4">
          {[data.whyBuyHeroTemplate2, data.whyBuyHeroTemplate3]
            .filter(Boolean)
            .map((img, i) => (
              <img
                key={i}
                src={img.imageUrl}
                className="w-40 h-28 object-cover rounded-xl shadow-xl border-4 border-white"
                alt=""
              />
            ))}
        </div>
      </section>

      {/* ───────── STORY ───────── */}
      {data.storyTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-900">
              {data.storyTitle}
            </h2>

            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
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
                  className="rounded-2xl h-48 w-full object-cover"
                  alt=""
                />
              ))}
          </div>
        </section>
      )}

      {/* ───────── VEHICLE SELECTION ───────── */}
      {data.vehicleSelectionTitle && (
        <section className="space-y-10">

          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {data.vehicleSelectionTitle}
            </h2>

            <p className="text-slate-600 leading-relaxed">
              {data.vehicleSelectionDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[data.vehicleSelectionTemplate1, data.vehicleSelectionTemplate2]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img.imageUrl}
                  className="rounded-3xl h-72 w-full object-cover shadow-lg"
                  alt=""
                />
              ))}
          </div>
        </section>
      )}

      {/* ───────── PROCESS ───────── */}
      {data.processSteps && (
        <section className="space-y-12">

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900">
              {data.processTitle}
            </h2>

            <p className="text-slate-600 mt-4">
              {data.processDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.processSteps.map((step, i) => (
              <div
                key={i}
                className="p-8 border rounded-3xl hover:shadow-xl transition flex gap-4"
              >
                <div
                  className="text-sky-500 [&>svg]:w-8 [&>svg]:h-8"
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[data.processTemplate1, data.processTemplate2, data.processTemplate3, data.processTemplate4]
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

      {/* ───────── INSPECTION ───────── */}
      {data.inspectionTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center bg-slate-50 p-10 rounded-3xl">

          <div className="grid grid-cols-2 gap-4">
            {[data.inspectionTemplate1, data.inspectionTemplate2, data.inspectionTemplate3, data.inspectionTemplate4]
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
        </section>
      )}

      {/* ───────── GALLERY ───────── */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[data.galleryTemplate1, data.galleryTemplate2, data.galleryTemplate3, data.galleryTemplate4, data.galleryTemplate5]
          .filter(Boolean)
          .map((img, i) => (
            <img
              key={i}
              src={img.imageUrl}
              className="rounded-xl h-36 w-full object-cover"
              alt=""
            />
          ))}
      </section>

      {/* ───────── CUSTOMER COMMITMENT ───────── */}
      {data.customerCommitmentTitle && (
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">
            {data.customerCommitmentTitle}
          </h2>

          <p className="text-slate-600">
            {data.customerCommitmentDescription}
          </p>
        </section>
      )}

      {/* ───────── TESTIMONIALS ───────── */}
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

export default WhyBuyPremium1;