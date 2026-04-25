import React, { useState, useEffect, useRef } from "react";
import "../../../themeStyles.css";

const INTERVAL = 5000;

const WhyBuyPro3Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const [activeHero, setActiveHero] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [inspectionHover, setInspectionHover] = useState(0);

  const heroImages = [
    data.whyBuyHeroTemplate1?.imageUrl,
    data.whyBuyHeroTemplate2?.imageUrl,
    data.whyBuyHeroTemplate3?.imageUrl,
    data.whyBuyHeroTemplate4?.imageUrl,
    data.whyBuyHeroTemplate5?.imageUrl,
  ].filter(Boolean);

  const storyImages = [
    data.whyBuyStoryTemplate1?.imageUrl,
    data.whyBuyStoryTemplate2?.imageUrl,
    data.whyBuyStoryTemplate3?.imageUrl,
  ].filter(Boolean);

  const vehicleImages = [
    data.whyBuyVehicleSelectionTemplate1?.imageUrl,
    data.whyBuyVehicleSelectionTemplate2?.imageUrl,
    data.whyBuyVehicleSelectionTemplate3?.imageUrl,
    data.whyBuyVehicleSelectionTemplate4?.imageUrl,
  ].filter(Boolean);

  const processImages = [
    data.whyBuyProcessTemplate1?.imageUrl,
    data.whyBuyProcessTemplate2?.imageUrl,
    data.whyBuyProcessTemplate3?.imageUrl,
    data.whyBuyProcessTemplate4?.imageUrl,
  ].filter(Boolean);

  const inspectionImages = [
    data.whyBuyInspectionTemplate1?.imageUrl,
    data.whyBuyInspectionTemplate2?.imageUrl,
    data.whyBuyInspectionTemplate3?.imageUrl,
    data.whyBuyInspectionTemplate4?.imageUrl,
  ].filter(Boolean);

  const galleryImages = [
    data.whyBuyGalleryTemplate1?.imageUrl,
    data.whyBuyGalleryTemplate2?.imageUrl,
    data.whyBuyGalleryTemplate3?.imageUrl,
    data.whyBuyGalleryTemplate4?.imageUrl,
  ].filter(Boolean);

  // Hero auto slider
  useEffect(() => {
    if (!heroImages.length) return;
    const id = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroImages.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const testimonial = data.featuredReviews?.[activeTestimonial] || {};

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center">

        <img
          src={heroImages[activeHero]}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl text-white font-bold mb-4">
            {data.whyBuyHeroTitle}
          </h1>

          <div
            className="text-white/80"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
          />
        </div>

      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6">

        <div>
          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.whyBuyStoryTitle}
          </h2>

          <div
            className="mt-4 text-[var(--color-third)]"
            dangerouslySetInnerHTML={{
              __html: data.whyBuyStoryDescription,
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {storyImages.map((img, i) => (
            <img key={i} src={img} className="h-48 w-full object-cover rounded-xl" />
          ))}
        </div>

      </section>

      {/* VEHICLE */}
      <section className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl text-[var(--color-secondary)] mb-4">
          {data.whyBuyVehicleSelectionTitle}
        </h2>

        <div
          className="text-[var(--color-third)] mb-6"
          dangerouslySetInnerHTML={{
            __html: data.whyBuyVehicleSelectionDescription,
          }}
        />

        <div className="grid grid-cols-3 gap-4">
          {vehicleImages.map((img, i) => (
            <img key={i} src={img} className="h-40 w-full object-cover rounded-xl" />
          ))}
        </div>

      </section>

      {/* PROCESS */}
      <section className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl text-[var(--color-secondary)] mb-6">
          {data.whyBuyProcessTitle}
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {data.processSteps?.map((step, i) => (
            <div key={i} className="text-center">

              <img
                src={processImages[i % processImages.length]}
                className="h-32 w-full object-cover rounded-xl mb-3"
              />

              <h3 className="font-semibold text-[var(--color-secondary)]">
                {step.title}
              </h3>

              <div
                className="text-sm text-[var(--color-third)]"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />

            </div>
          ))}

        </div>

      </section>

      {/* INSPECTION */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

        <div>
          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.whyBuyInspectionTitle}
          </h2>

          <div
            className="mt-4 text-[var(--color-third)]"
            dangerouslySetInnerHTML={{
              __html: data.whyBuyInspectionDescription,
            }}
          />

          <div className="mt-6 space-y-3">
            {data.inspectionPoints?.map((pt, i) => (
              <div
                key={i}
                onMouseEnter={() => setInspectionHover(i)}
                className={`p-3 rounded cursor-pointer ${i === inspectionHover
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
          src={inspectionImages[inspectionHover]}
          className="h-80 w-full object-cover rounded-xl"
        />

      </section>

      {/* COMMITMENT */}
      <section className="text-center px-6 max-w-4xl mx-auto">

        <h2 className="text-4xl text-[var(--color-secondary)]">
          {data.whyBuyCustomerCommitmentTitle}
        </h2>

        <div
          className="mt-4 text-[var(--color-third)]"
          dangerouslySetInnerHTML={{
            __html: data.whyBuyCustomerCommitmentDescription,
          }}
        />

      </section>

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl text-[var(--color-secondary)] mb-6">
          {data.whyBuyGalleryTitle}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <img key={i} src={img} className="h-48 w-full object-cover rounded-xl" />
          ))}
        </div>

      </section>

      {/* TESTIMONIAL */}
      <section className="text-center max-w-4xl mx-auto px-6">

        <h2 className="text-4xl text-[var(--color-secondary)] mb-6">
          {data.whyBuyTestimonialTitle}
        </h2>

        <div className="border p-8 rounded-xl">

          <div
            className="italic text-lg text-[var(--color-third)]"
            dangerouslySetInnerHTML={{
              __html: testimonial.reviewText || testimonial.review,
            }}
          />

          <p className="mt-4 font-semibold text-[var(--color-secondary)]">
            {testimonial.reviewerName || testimonial.name}
          </p>

        </div>

        <div className="flex justify-center gap-3 mt-4">
          {data.featuredReviews?.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-3 h-3 rounded-full ${i === activeTestimonial
                  ? "bg-[var(--color-primary)]"
                  : "bg-gray-300"
                }`}
            />
          ))}
        </div>

      </section>

    </div>
  );
};

export default WhyBuyPro3Display;