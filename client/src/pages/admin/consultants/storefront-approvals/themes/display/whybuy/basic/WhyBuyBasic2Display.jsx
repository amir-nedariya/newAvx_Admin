import React from "react";
import "../../../themeStyles.css";
import { Star, Quote } from "lucide-react";

const WhyBuyBasic2Display = ({ data }) => {
  if (!data) return null;

  console.log("Dataaaaa", data);

  const hero = data.whyBuyHeroSection || {};
  const story = data.storySection || {};
  const vehicle = data.vehicleSelectionSection || {};
  const process = data.processSection || {};
  const inspection = data.inspectionSection || {};
  const commitment = data.customerCommitmentSection || {};
  const testimonial = data.testimonialSection || {};

  // Hero Section
  const heroTitle = hero.title || data.whyBuyHeroTitle || "";
  const heroDescription = hero.description || data.whyBuyHeroDescription || "";

  // Story Section
  const storyTitle = story.title || data.storyTitle || "";
  const storyDescription = story.description || data.storyDescription || "";

  // Vehicle Selection Section
  const vehicleTitle = vehicle.title || data.vehicleSelectionTitle || "";
  const vehicleDescription = vehicle.description || data.vehicleSelectionDescription || "";

  // Process Section
  const processTitle = process.title || data.processTitle || "";
  const processDescription = process.description || data.processDescription || "";
  const rawProcesses = process.processes || data.processes || [];
  const processSteps = Array.isArray(rawProcesses)
    ? rawProcesses.map((p) => ({
        title: p.title || "",
        description: p.desc || p.description || "",
        icon: p.icon || "",
      }))
    : [];

  // Inspection Section
  const inspectionTitle = inspection.title || data.inspectionTitle || "";
  const inspectionDescription = inspection.description || data.inspectionText || "";
  const inspectionPoints = inspection.inspectionPoints || data.inspectionPoints || [];

  // Commitment Section
  const commitmentTitle = commitment.title || data.customerCommitmentTitle || "";
  const commitmentDescription = commitment.description || data.customerCommitmentDescription || "";

  // Testimonial Section
  const testimonialTitle = testimonial.title || data.testimonialTitle || "";
  const featuredReviews = testimonial.featuredReviews || data.featuredReviews || null;

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-full">
          <p className="text-sm tracking-[0.4em] uppercase text-third font-[Poppins]">
            Why Choose Us
          </p>

          <h1 className="text-5xl font-bold font-[Montserrat] text-primary mt-4">
            {heroTitle}
          </h1>

          <div
            className="text-third mt-6 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: heroDescription }}
          />
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 bg-fourth">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">
          <div>
            <p className="uppercase text-third text-sm font-[Poppins]">
              Our Story
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {storyTitle}
            </h2>
          </div>

          <div
            className="text-primary/90"
            dangerouslySetInnerHTML={{ __html: storyDescription }}
          />
        </div>
      </section>

      {/* SELECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">
          <div>
            <p className="uppercase text-third text-sm font-[Poppins]">
              Selection
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {vehicleTitle || "Vehicle Selection"}
            </h2>
          </div>

          <div
            className="text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: vehicleDescription,
            }}
          />
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-10">

          <div>
            <p className="uppercase text-third text-sm font-[Poppins]">
              Process
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {processTitle}
            </h2>

            <div
              className="text-third mt-3 font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: processDescription }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps?.map((step, i) => (
              <div
                key={i}
                className="p-6 border border-third/20 rounded-xl"
              >
                <div
                  className="mb-4 text-fourth"
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />

                <h3 className="text-primary font-semibold font-[Montserrat]">
                  {step.title}
                </h3>

                <p className="text-third mt-2 font-[Poppins]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INSPECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">

          <div>
            <p className="uppercase text-third text-sm font-[Poppins]">
              Inspection
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {inspectionTitle}
            </h2>

            <div
              className="text-third mt-4 font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: inspectionDescription }}
            />
          </div>

          <div className="space-y-4">
            {inspectionPoints?.map((pt, i) => (
              <div
                key={i}
                className="p-4 border border-third/20 rounded-lg"
              >
                <p className="text-third font-[Poppins]">{pt}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-16 bg-fourth">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">

          <div>
            <p className="uppercase text-third text-sm font-[Poppins]">
              Commitment
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {commitmentTitle}
            </h2>
          </div>

          <div
            className="text-primary/90"
            dangerouslySetInnerHTML={{
              __html: commitmentDescription,
            }}
          />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-10">

          <div>
            <p className="uppercase text-third text-sm font-[Poppins]">
              Reviews
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {testimonialTitle}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {(featuredReviews || []).map((r, i) => (
              <div
                key={i}
                className="p-6 border border-third/20 rounded-xl"
              >
                {r.rating ? (
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={
                          idx < r.rating
                            ? "text-fourth fill-fourth"
                            : "text-third"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Quote className="text-fourth mb-3" />
                )}

                <p className="text-third italic font-[Poppins]">
                  {r.reviewText || r.review}
                </p>

                <p className="mt-4 text-primary font-semibold text-sm">
                  — {r.reviewerName || r.name}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default WhyBuyBasic2Display;

