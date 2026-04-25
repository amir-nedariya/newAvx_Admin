import React from "react";
import "../../../themeStyles.css";
import { CheckCircle2, Star } from "lucide-react";

const WhyBuyPro1Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const testimonials = data.featuredReviews || data.testimonials || [];

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <div className="space-y-4">
            <p className="uppercase text-sm tracking-[0.4em] text-[var(--color-third)]">
              Trusted Auto Consultants
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.whyBuyHeroTitle}
            </h2>

            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[data.whyBuyHeroTemplate1, data.whyBuyHeroTemplate2].map(
              (img, i) => (
                <img
                  key={i}
                  src={img?.imageUrl}
                  className="rounded-xl object-cover h-40 w-full"
                  alt=""
                />
              )
            )}
          </div>

        </div>
      </section>

      {/* STORY */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        <div className="space-y-4">
          <p className="uppercase text-sm text-[var(--color-third)]">
            Consultant Story
          </p>

          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.storyTitle}
          </h2>

          <div
            className="text-[var(--color-third)]"
            dangerouslySetInnerHTML={{ __html: data.storyDescription }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img src={data.storyTemplate1?.imageUrl} className="col-span-2 h-48 object-cover rounded-xl" />
          <img src={data.storyTemplate2?.imageUrl} className="h-40 object-cover rounded-xl" />
          <img src={data.storyTemplate3?.imageUrl} className="h-40 object-cover rounded-xl" />
        </div>

      </section>

      {/* VEHICLE */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">

        <p className="uppercase text-sm text-[var(--color-third)]">
          Our Standards
        </p>

        <h2 className="text-4xl text-[var(--color-secondary)]">
          {data.vehicleSelectionTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div
            className="text-[var(--color-third)] border-l-2 pl-4 border-[var(--color-fourth)]"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionDescription,
            }}
          />

          <div className="flex gap-4 overflow-x-auto">
            {[data.vehicleSelectionTemplate1, data.vehicleSelectionTemplate2].map(
              (img, i) => (
                <img
                  key={i}
                  src={img?.imageUrl}
                  className="h-48 w-60 object-cover rounded-xl"
                />
              )
            )}
          </div>

        </div>

      </section>

      {/* PROCESS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">

        <div>
          <p className="uppercase text-sm text-[var(--color-third)]">
            Process
          </p>

          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.processTitle}
          </h2>

          <div
            className="text-[var(--color-third)] mt-2"
            dangerouslySetInnerHTML={{ __html: data.processDescription }}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {data.processSteps?.map((step, i) => (
            <div
              key={i}
              className="border rounded-xl p-6 border-[var(--color-third)]/20"
            >
              <h3 className="text-[var(--color-secondary)] font-semibold">
                {step.title}
              </h3>

              <div
                className="text-[var(--color-third)] text-sm mt-2"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          ))}
        </div>

      </section>

      {/* INSPECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        <div>
          <p className="uppercase text-sm text-[var(--color-third)]">
            Inspection
          </p>

          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.inspectionTitle}
          </h2>

          <div
            className="text-[var(--color-third)] mt-3"
            dangerouslySetInnerHTML={{ __html: data.inspectionText }}
          />

          <div className="mt-4 space-y-3">
            {data.inspectionPoints?.map((pt, i) => (
              <div key={i} className="flex gap-2 items-start">
                <CheckCircle2 className="text-[var(--color-fourth)] mt-1" size={16} />
                <span className="text-[var(--color-third)]">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        <img
          src={data.inspectionTemplate1?.imageUrl}
          className="rounded-xl object-cover h-80 w-full"
        />

      </section>

      {/* COMMITMENT */}
      <section className="py-16 text-center text-white relative">

        <img
          src={data.customerCommitmentTemplate1?.imageUrl}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 px-6">
          <p className="uppercase text-sm text-[var(--color-third)]">
            Commitment
          </p>

          <h2 className="text-4xl">
            {data.customerCommitmentTitle}
          </h2>

          <div
            dangerouslySetInnerHTML={{
              __html: data.customerCommitmentDescription,
            }}
          />
        </div>

      </section>

      {/* GALLERY */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          data.galleryTemplate1,
          data.galleryTemplate2,
          data.galleryTemplate3,
          data.galleryTemplate4
        ].map((img, i) => (
          <img
            key={i}
            src={img?.imageUrl}
            className="rounded-xl object-cover h-48 w-full"
          />
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">

        <div>
          <p className="uppercase text-sm text-[var(--color-third)]">
            Reviews
          </p>

          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.testimonialTitle}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border rounded-xl p-6 border-[var(--color-third)]/20"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={
                      idx < (t.rating || 5)
                        ? "text-[var(--color-fourth)]"
                        : "text-[var(--color-third)]"
                    }
                  />
                ))}
              </div>

              <div
                className="text-[var(--color-third)] text-sm"
                dangerouslySetInnerHTML={{
                  __html: t.reviewText || t.review,
                }}
              />

              <p className="mt-3 text-[var(--color-secondary)] font-semibold text-sm">
                {t.reviewerName || t.name}
              </p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

export default WhyBuyPro1Display;