import React, { useState } from "react";
import "../../../themeStyles.css";

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

  const heroImages = getAllImageUrls(data.whyBuyHeroSection);
  const storyImages = getAllImageUrls(data.storySection);
  const selectionImages = getAllImageUrls(data.vehicleSelectionSection);
  const processImages = getAllImageUrls(data.processSection);
  const inspectionImages = getAllImageUrls(data.inspectionSection);
  const commitmentImages = getAllImageUrls(data.customerCommitmentSection);
  const galleryImages = getAllImageUrls(data.gallerySection);

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-5xl font-bold  font-[Montserrat] text-secondary mb-4 font-[Montserrat]">
              {data.whyBuyHeroSection?.title}
            </h1>

            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: data.whyBuyHeroSection?.description }}
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
      <section className="py-16 bg-fourth px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

          <div>
            <p className="uppercase text-sm text-secondary/70">
              Our Story
            </p>

            <h2 className="text-4xl text-secondary mt-2">
              {data.storySection?.title}
            </h2>

            <div
              className="text-secondary/80 mt-3"
              dangerouslySetInnerHTML={{ __html: data.storySection?.description }}
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
          <p className="uppercase text-sm text-third font-[Poppins]">
            Selection
          </p>

          <h2 className="text-4xl text-secondary mt-2">
            Our Approach to Vehicle Selection
          </h2>

          <div
            className="text-third mt-4 font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionSection?.description,
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {selectionImages[0] && <img src={selectionImages[0]} className="col-span-2 h-48 object-cover rounded-xl" />}
          {selectionImages.slice(1, 3).map((img, i) => (
            <img key={i} src={img} className="h-24 object-cover rounded-xl" />
          ))}
        </div>

      </section>

      {/* PROCESS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Process
          </p>

          <h2 className="text-4xl text-secondary">
            {data.processSection?.title}
          </h2>

          <div
            className="text-third mt-2 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.processSection?.description }}
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {data.processSteps?.map((step, i) => (
            <div key={i}>
              <img
                src={processImages[i % processImages.length]}
                className="h-32 w-full object-cover rounded-xl mb-3"
              />

              <h3 className="text-secondary font-semibold">
                {step.title}
              </h3>

              <div
                className="text-third text-sm font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          ))}
        </div>

      </section>

      {/* INSPECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Inspection
          </p>

          <h2 className="text-4xl text-secondary">
            {data.inspectionTitle}
          </h2>

          <div
            className="text-third mt-3 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.inspectionSection?.description }}
          />

          <div className="mt-4 space-y-3">
            {data.inspectionSection?.inspectionPoints?.map((pt, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`cursor-pointer p-3 rounded ${i === activeIndex
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
          src={inspectionImages[activeIndex]}
          className="rounded-xl object-cover h-80 w-full"
        />

      </section>

      {/* COMMITMENT */}
      <section className="py-16 bg-fourth text-center px-6">

        <h2 className="text-4xl text-secondary">
          {data.customerCommitmentSection?.title}
        </h2>

        <div
          className="text-secondary mt-4"
          dangerouslySetInnerHTML={{
            __html: data.customerCommitmentSection?.description,
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

        <h2 className="text-4xl text-secondary mb-6">
          {data.gallerySection?.title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, i) => (
            <img key={i} src={img} className="rounded-xl object-cover h-40 w-full" />
          ))}
        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 max-w-7xl mx-auto">

        <h2 className="text-4xl text-secondary mb-6">
          {data.testimonialSection?.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {(data.testimonialSection?.featuredReviews || []).map((t, i) => (
            <div key={i} className="border p-6 rounded-xl border-third/20">
              <div
                className="text-third italic font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: t.reviewText || t.review }}
              />
              <p className="mt-3 font-semibold  font-[Montserrat] text-secondary">
                {t.reviewerName || t.name}
              </p>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

export default WhyBuyPro2Display;

