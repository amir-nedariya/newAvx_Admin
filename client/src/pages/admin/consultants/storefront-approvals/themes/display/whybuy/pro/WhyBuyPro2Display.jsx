import React, { useState } from "react";
import "../../../themeStyles.css";

const WhyBuyPro2Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const [activeIndex, setActiveIndex] = useState(0);

  const heroImages = [
    data.whyBuyHeroTemplate1?.imageUrl,
    data.whyBuyHeroTemplate2?.imageUrl,
    data.whyBuyHeroTemplate3?.imageUrl,
    data.whyBuyHeroTemplate4?.imageUrl,
    data.whyBuyHeroTemplate5?.imageUrl,
  ].filter(Boolean);

  const storyImages = [
    data.storyTemplate1?.imageUrl,
    data.storyTemplate2?.imageUrl,
    data.storyTemplate3?.imageUrl,
    data.storyTemplate4?.imageUrl,
  ].filter(Boolean);

  const selectionImages = [
    data.vehicleSelectionTemplate1?.imageUrl,
    data.vehicleSelectionTemplate2?.imageUrl,
    data.vehicleSelectionTemplate3?.imageUrl,
  ].filter(Boolean);

  const processImages = [
    data.processTemplate1?.imageUrl,
    data.processTemplate2?.imageUrl,
    data.processTemplate3?.imageUrl,
    data.processTemplate4?.imageUrl,
  ].filter(Boolean);

  const inspectionImages = [
    data.inspectionTemplate1?.imageUrl,
    data.inspectionTemplate2?.imageUrl,
    data.inspectionTemplate3?.imageUrl,
    data.inspectionTemplate4?.imageUrl,
  ].filter(Boolean);

  const commitmentImages = [
    data.customerCommitmentTemplate1?.imageUrl,
    data.customerCommitmentTemplate2?.imageUrl,
    data.customerCommitmentTemplate3?.imageUrl,
  ].filter(Boolean);

  const galleryImages = [
    data.galleryTemplate1?.imageUrl,
    data.galleryTemplate2?.imageUrl,
    data.galleryTemplate3?.imageUrl,
    data.galleryTemplate4?.imageUrl,
    data.galleryTemplate5?.imageUrl,
  ].filter(Boolean);

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-5xl font-bold text-[var(--color-secondary)] mb-4">
              {data.whyBuyHeroTitle}
            </h1>

            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroImages.map((img, i) => (
              <img
                key={i}
                src={img}
                className="rounded-xl object-cover h-40 w-full"
              />
            ))}
          </div>

        </div>
      </section>

      {/* STORY */}
      <section className="py-16 bg-[var(--color-fourth)] px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

          <div>
            <p className="uppercase text-sm text-[var(--color-secondary)]/70">
              Our Story
            </p>

            <h2 className="text-4xl text-[var(--color-secondary)] mt-2">
              {data.storyTitle}
            </h2>

            <div
              className="text-[var(--color-secondary)]/80 mt-3"
              dangerouslySetInnerHTML={{ __html: data.storyDescription }}
            />
          </div>

          <div className="space-y-4">
            {storyImages.slice(0, 2).map((img, i) => (
              <img key={i} src={img} className="h-40 w-full object-cover rounded-xl" />
            ))}
          </div>

        </div>
      </section>

      {/* SELECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

        <div>
          <p className="uppercase text-sm text-[var(--color-third)]">
            Selection
          </p>

          <h2 className="text-4xl text-[var(--color-secondary)] mt-2">
            Our Approach to Vehicle Selection
          </h2>

          <div
            className="text-[var(--color-third)] mt-4"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionDescription,
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <img src={selectionImages[0]} className="col-span-2 h-48 object-cover rounded-xl" />
          {selectionImages.slice(1, 3).map((img, i) => (
            <img key={i} src={img} className="h-24 object-cover rounded-xl" />
          ))}
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

        <div className="grid lg:grid-cols-4 gap-6">
          {data.processSteps?.map((step, i) => (
            <div key={i}>
              <img
                src={processImages[i % processImages.length]}
                className="h-32 w-full object-cover rounded-xl mb-3"
              />

              <h3 className="text-[var(--color-secondary)] font-semibold">
                {step.title}
              </h3>

              <div
                className="text-[var(--color-third)] text-sm"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          ))}
        </div>

      </section>

      {/* INSPECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

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
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`cursor-pointer p-3 rounded ${i === activeIndex
                    ? "bg-[var(--color-fourth)]/20"
                    : ""
                  }`}
              >
                {pt}
              </div>
            ))}
          </div>
        </div>

        <img
          src={inspectionImages[activeIndex]}
          className="rounded-xl object-cover h-80 w-full"
        />

      </section>

      {/* COMMITMENT */}
      <section className="py-16 bg-[var(--color-fourth)] text-center px-6">

        <h2 className="text-4xl text-[var(--color-secondary)]">
          {data.customerCommitmentTitle}
        </h2>

        <div
          className="text-[var(--color-secondary)] mt-4"
          dangerouslySetInnerHTML={{
            __html: data.customerCommitmentDescription,
          }}
        />

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {commitmentImages.map((img, i) => (
            <img key={i} src={img} className="rounded-xl object-cover h-40 w-full" />
          ))}
        </div>

      </section>

      {/* GALLERY */}
      <section className="py-16 px-6 max-w-7xl mx-auto">

        <h2 className="text-4xl text-[var(--color-secondary)] mb-6">
          {data.galleryTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, i) => (
            <img key={i} src={img} className="rounded-xl object-cover h-40 w-full" />
          ))}
        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 max-w-7xl mx-auto">

        <h2 className="text-4xl text-[var(--color-secondary)] mb-6">
          {data.testimonialTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {(data.testimonials || []).map((t, i) => (
            <div key={i} className="border p-6 rounded-xl border-[var(--color-third)]/20">
              <div
                className="text-[var(--color-third)] italic"
                dangerouslySetInnerHTML={{ __html: t.review }}
              />
              <p className="mt-3 font-semibold text-[var(--color-secondary)]">
                {t.name}
              </p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

export default WhyBuyPro2Display;