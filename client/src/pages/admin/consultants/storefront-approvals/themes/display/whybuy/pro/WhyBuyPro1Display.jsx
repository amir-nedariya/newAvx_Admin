import React from "react";
import "../../../themeStyles.css";
import { CheckCircle2, Star } from "lucide-react";

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

const WhyBuyPro1Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const testimonials = data.testimonialSection?.featuredReviews || data.featuredReviews || data.testimonials || [];
  const heroImages = getAllImageUrls(data.whyBuyHeroSection);
  const storyImages = getAllImageUrls(data.storySection);
  const vehicleImages = getAllImageUrls(data.vehicleSelectionSection);
  const galleryImages = getAllImageUrls(data.gallerySection);

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <div className="space-y-4">
            <p className="uppercase text-sm tracking-[0.4em] text-third font-[Poppins]">
              Trusted Auto Consultants
            </p>

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.whyBuyHeroSection?.title}
            </h2>

            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: data.whyBuyHeroSection?.description }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {heroImages.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                className="rounded-xl object-cover h-40 w-full"
                alt=""
              />
            ))}
          </div>

        </div>
      </section>

      {/* STORY */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        <div className="space-y-4">
          <p className="uppercase text-sm text-third font-[Poppins]">
            Consultant Story
          </p>

          <h2 className="text-4xl text-secondary">
            {data.storySection?.title}
          </h2>

          <div
            className="text-third font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.storySection?.description }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {storyImages[0] && <img src={storyImages[0]} className="col-span-2 h-48 object-cover rounded-xl" />}
          {storyImages[1] && <img src={storyImages[1]} className="h-40 object-cover rounded-xl" />}
          {storyImages[2] && <img src={storyImages[2]} className="h-40 object-cover rounded-xl" />}
        </div>

      </section>

      {/* VEHICLE */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-6">

        <p className="uppercase text-sm text-third font-[Poppins]">
          Our Standards
        </p>

        <h2 className="text-4xl text-secondary">
          {data.vehicleSelectionSection?.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div
            className="text-third border-l-2 pl-4 border-fourth font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionSection?.description,
            }}
          />

          <div className="flex gap-4 overflow-x-auto">
            {vehicleImages.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-48 w-60 object-cover rounded-xl"
              />
            ))}
          </div>

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

        <div className="grid md:grid-cols-4 gap-6">
          {data.processSteps?.map((step, i) => (
            <div
              key={i}
              className="border rounded-xl p-6 border-third/20"
            >
              <h3 className="text-secondary font-semibold">
                {step.title}
              </h3>

              <div
                className="text-third text-sm mt-2 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: step.description }}
              />
            </div>
          ))}
        </div>

      </section>

      {/* INSPECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Inspection
          </p>

          <h2 className="text-4xl text-secondary">
            {data.inspectionSection?.title}
          </h2>

          <div
            className="text-third mt-3 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.inspectionSection?.description }}
          />

          <div className="mt-4 space-y-3">
            {data.inspectionSection?.inspectionPoints?.map((pt, i) => (
              <div key={i} className="flex gap-2 items-start">
                <CheckCircle2 className="text-fourth mt-1" size={16} />
                <span className="text-third">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        <img
          src={getImageUrl(data.inspectionSection, 0)}
          className="rounded-xl object-cover h-80 w-full"
        />

      </section>

      {/* COMMITMENT */}
      <section className="py-16 text-center text-white relative">

        <img
          src={getImageUrl(data.customerCommitmentSection, 0)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 px-6">
          <p className="uppercase text-sm text-third font-[Poppins]">
            Commitment
          </p>

          <h2 className="text-4xl">
            {data.customerCommitmentSection?.title}
          </h2>

          <div
            dangerouslySetInnerHTML={{
              __html: data.customerCommitmentSection?.description,
            }}
          />
        </div>

      </section>

      {/* GALLERY */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((img, i) => (
          <img
            key={i}
            src={img}
            className="rounded-xl object-cover h-48 w-full"
          />
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Reviews
          </p>

          <h2 className="text-4xl text-secondary">
            {data.testimonialSection?.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border rounded-xl p-6 border-third/20"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={
                      idx < (t.rating || 5)
                        ? "text-fourth"
                        : "text-third"
                    }
                  />
                ))}
              </div>

              <div
                className="text-third text-sm font-[Poppins]"
                dangerouslySetInnerHTML={{
                  __html: t.reviewText || t.review,
                }}
              />

              <p className="mt-3 text-secondary font-semibold text-sm">
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

