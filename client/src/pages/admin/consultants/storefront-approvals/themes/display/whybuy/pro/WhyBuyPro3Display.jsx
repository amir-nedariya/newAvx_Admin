import React, { useState, useEffect, useRef } from "react";
import "../../../themeStyles.css";

const INTERVAL = 5000;

// Helper function to extract image URL from images array
const getImageUrl = (section, index = 0) => {
  if (!section?.images || !Array.isArray(section.images) || section.images.length === 0) {
    return null;
  }
  const image = section.images[index];
  return image?.customUrl || image?.templateUrl || null;
};

// Helper function to get all image URLs from a section
const getAllImageUrls = (section) => {
  if (!section?.images || !Array.isArray(section.images)) {
    return [];
  }
  return section.images.map(img => img?.customUrl || img?.templateUrl).filter(Boolean);
};

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

  const heroImages = getAllImageUrls(data.whyBuyHeroSection);
  const storyImages = getAllImageUrls(data.storySection);
  const vehicleImages = getAllImageUrls(data.vehicleSelectionSection);
  const processImages = getAllImageUrls(data.processSection);
  const inspectionImages = getAllImageUrls(data.inspectionSection);
  const galleryImages = getAllImageUrls(data.gallerySection);

  // Hero auto slider
  useEffect(() => {
    if (!heroImages.length) return;
    const id = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroImages.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const testimonial = data.testimonialSection?.featuredReviews?.[activeTestimonial] || {};

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
          <h1 className="text-5xl text-white font-bold mb-4 font-[Montserrat]">
            {data.whyBuyHeroSection?.title}
          </h1>

          <div
            className="text-white/80"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroSection?.description }}
          />
        </div>

      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-6">

        <div>
          <h2 className="text-4xl text-secondary">
            {data.storySection?.title}
          </h2>

          <div
            className="mt-4 text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.storySection?.description,
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

        <h2 className="text-4xl text-secondary mb-4">
          {data.vehicleSelectionSection?.title}
        </h2>

        <div
          className="text-third mb-6 font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: data.vehicleSelectionSection?.description,
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

        <h2 className="text-4xl text-secondary mb-6">
          {data.processSection?.title}
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {data.processSteps?.map((step, i) => (
            <div key={i} className="text-center">

              <img
                src={processImages[i % processImages.length]}
                className="h-32 w-full object-cover rounded-xl mb-3"
              />

              <h3 className="font-semibold  font-[Montserrat] text-secondary">
                {step.title}
              </h3>

              <div
                className="text-sm text-third font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />

            </div>
          ))}

        </div>

      </section>

      {/* INSPECTION */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">

        <div>
          <h2 className="text-4xl text-secondary">
            {data.inspectionSection?.title}
          </h2>

          <div
            className="mt-4 text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.inspectionSection?.description,
            }}
          />

          <div className="mt-6 space-y-3">
            {data.inspectionSection?.inspectionPoints?.map((pt, i) => (
              <div
                key={i}
                onMouseEnter={() => setInspectionHover(i)}
                className={`p-3 rounded cursor-pointer ${i === inspectionHover
                  ? "bg-fourth/20"
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

        <h2 className="text-4xl text-secondary">
          {data.customerCommitmentSection?.title}
        </h2>

        <div
          className="mt-4 text-third font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: data.customerCommitmentSection?.description,
          }}
        />

      </section>

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl text-secondary mb-6">
          {data.gallerySection?.title}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <img key={i} src={img} className="h-48 w-full object-cover rounded-xl" />
          ))}
        </div>

      </section>

      {/* TESTIMONIAL */}
      <section className="text-center max-w-4xl mx-auto px-6">

        <h2 className="text-4xl text-secondary mb-6">
          {data.testimonialSection?.title}
        </h2>

        <div className="border p-8 rounded-xl">

          <div
            className="italic text-lg text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: testimonial.reviewText || testimonial.review,
            }}
          />

          <p className="mt-4 font-semibold  font-[Montserrat] text-secondary">
            {testimonial.reviewerName || testimonial.name}
          </p>

        </div>

        <div className="flex justify-center gap-3 mt-4">
          {data.testimonialSection?.featuredReviews?.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-3 h-3 rounded-full ${i === activeTestimonial
                ? "bg-primary"
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

