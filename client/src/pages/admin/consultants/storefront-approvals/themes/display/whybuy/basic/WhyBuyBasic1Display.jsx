import React from "react";
import "../../../themeStyles.css";
import {
  Search,
  MessageCircle,
  ShieldCheck,
  Handshake,
  CheckCircle2,
  Star,
} from "lucide-react";

const ICON_MAP = {
  Search,
  MessageCircle,
  ShieldCheck,
  Handshake,
};

const WhyBuyBasic1Display = ({ data }) => {
  if (!data) return null;

  console.log("Buy basic data ", data);

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
      <section className="container py-16">
        <p className="text-sm tracking-[0.4em] uppercase text-third font-[Poppins]">
          Trusted Auto Consultants
        </p>

        <h2 className="text-4xl font-semibold font-[Montserrat] text-primary mt-4">
          {heroTitle}
        </h2> 

        <div
          className="text-third mt-4 max-w-full font-[Poppins]"
          dangerouslySetInnerHTML={{ __html: heroDescription }}
        />
      </section>

      {/* STORY */}
      <section className="bg-primary border-y border-third/20 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <p className="uppercase text-secondary text-sm tracking-[0.4em]">
            Consultant Story
          </p>

          <h2 className="text-4xl font-semibold font-[Montserrat] text-secondary">
            {storyTitle}
          </h2>

          <div
            className="text-secondary"
            dangerouslySetInnerHTML={{ __html: storyDescription }}
          />
        </div>
      </section>

      {/* VEHICLE SELECTION */}
      <section className="container py-16">
        <p className="uppercase text-third text-sm tracking-[0.4em] font-[Poppins]">
          Our Standards
        </p>

        <h2 className="text-4xl font-semibold font-[Montserrat] text-primary mt-4">
          {vehicleTitle}
        </h2>

        <div
          className="border-l-2 border-primary/40 pl-5 mt-6 space-y-4 text-third font-[Poppins]"
          dangerouslySetInnerHTML={{ __html: vehicleDescription }}
        />
      </section>

      {/* PROCESS */}
      <section className="container py-16">
        <div className="space-y-6 max-w-full">
          <p className="uppercase text-third text-sm tracking-[0.4em] font-[Poppins]">
            Simple Process
          </p>

          <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
            {processTitle}
          </h2>

          <div
            className="text-third font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: processDescription }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {processSteps?.map((step, i) => {
            const Icon = ICON_MAP[step.icon];

            return (
              <div
                key={i}
                className="p-6 border border-primary/20 rounded-xl hover:border-fourth transition"
              >
                <div className="mb-4">
                  {typeof step.icon === "string" &&
                    step.icon.startsWith("<svg") ? (
                    <div
                      className="text-primary"
                      dangerouslySetInnerHTML={{ __html: step.icon }}
                    />
                  ) : Icon ? (
                    <Icon className="text-primary" />
                  ) : null}
                </div>

                <h3 className="font-semibold font-[Montserrat] text-primary">
                  {step.title}
                </h3>

                <p className="text-third mt-2 font-[Poppins]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* INSPECTION */}
      <section className="container py-16 grid md:grid-cols-2 gap-12">
        <div>
          <p className="uppercase text-third text-sm tracking-[0.4em] font-[Poppins]">
            Independent Verification
          </p>

          <h2 className="text-4xl font-semibold font-[Montserrat] text-primary mt-4">
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
              className="flex items-start gap-3 p-4 border border-third/20 rounded-lg"
            >
              <CheckCircle2 className="text-primary mt-1" />
              <p className="text-third font-[Poppins]">{pt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="container py-16 text-center">
        <p className="uppercase text-third text-sm tracking-[0.4em] font-[Poppins]">
          Our Promise
        </p>

        <h2 className="text-4xl font-semibold font-[Montserrat] text-primary mt-4">
          {commitmentTitle}
        </h2>

        <div className="w-12 h-px bg-primary/40 mx-auto my-4" />

        <div
          className="text-third max-w-4xl mx-auto font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: commitmentDescription,
          }}
        />
      </section>

      {/* TESTIMONIALS */}
      {featuredReviews && (
        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-10">

            <div>
              <p className="uppercase text-primary/70 text-sm tracking-[0.4em]">
                Real Buyers
              </p>

              <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
                {testimonialTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredReviews.map((review, i) => (
                <div
                  key={i}
                  className="p-6 border border-primary/20 rounded-xl"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                          key={idx}
                          size={14}
                          className={
                            idx < review.rating
                              ? "text-fourth fill-fourth"
                              : "text-third"
                          }
                        />
                    ))}
                  </div>

                  {review.reviewTitle && (
                    <h4 className="font-semibold font-[Montserrat] text-primary">
                      {review.reviewTitle}
                    </h4>
                  )}

                  <p className="text-third mt-2 font-[Poppins]">
                    {review.reviewText}
                  </p>

                  <p className="text-primary/70 mt-4 text-sm">
                    — {review.reviewerName}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default WhyBuyBasic1Display;

