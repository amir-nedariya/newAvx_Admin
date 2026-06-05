import React, { useState } from "react";
import "../../../themeStyles.css";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const getIcon = (iconStr) => {
  if (typeof iconStr === "string" && iconStr.startsWith("<svg")) {
    return (
      <div
        className="text-primary flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6"
        dangerouslySetInnerHTML={{ __html: iconStr }}
      />
    );
  }
  return null;
};

const WhyBuyBasic3Display = ({ data }) => {
  if (!data) return null;

  console.log("doootoooo", data);

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
  const testimonials =
    featuredReviews?.length > 0
      ? featuredReviews
      : testimonial.testimonials || data.testimonials || [];

  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActive((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );

  const item = testimonials[active];

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center text-center px-6">
        <div className="max-w-5xl space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-third font-[Poppins]">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
            {heroTitle}
          </h2>

          <div
            className="text-third font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: heroDescription }}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-third font-[Poppins]">
            About Us
          </p>

          <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
            {storyTitle}
          </h2>
        </div>

        <div
          className="text-third font-[Poppins]"
          dangerouslySetInnerHTML={{ __html: storyDescription }}
        />
      </section>

      {/* VEHICLE */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center border border-third/20 rounded-3xl">
        <p className="uppercase text-sm text-third font-[Poppins]">
          Vehicle Approach
        </p>

        <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
          {vehicleTitle}
        </h2>

        <div
          className="text-third mt-4 font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: vehicleDescription,
          }}
        />
      </section>

      {/* PROCESS */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-15">
          <div className="flex flex-col sm:justify-between gap-8 pb-12 border-b border-third/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold">
                  Buying Process
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                <span className="text-primary">{processTitle}</span>
              </h2>
              <div
                className="text-third/55 text-base font-[Poppins] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processDescription }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {processSteps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`group flex flex-col sm:flex-row items-stretch gap-0 border border-third/10 rounded-2xl overflow-hidden hover:border-third/25 transition-all duration-300 ${isEven ? "" : "sm:flex-row-reverse"}`}
                >
                  <div
                    className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 px-8 py-6 sm:py-10 sm:w-48 border-b sm:border-b-0 border-third/10 sm:border-r group-hover:bg-primary/4 transition-colors duration-300"
                    style={
                      isEven
                        ? {}
                        : {
                          borderRight: "none",
                          borderLeft: "1px solid rgba(190,190,190,0.1)",
                        }
                    }
                  >
                    <span className="text-[13px] font-bold tracking-[3px] text-third/25 font-[Montserrat]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-10 h-10 rounded-xl border border-third/15 flex items-center justify-center group-hover:border-primary/30 transition-colors duration-300">
                      {getIcon(step.icon)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-2 px-8 py-8 flex-1">
                    <h3 className="text-lg font-semibold text-primary font-[Montserrat]">
                      {step.title}
                    </h3>
                    <p className="text-third/55 text-sm font-[Poppins] leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSPECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
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
              className="flex justify-between items-center border-b border-third/20 py-3"
            >
              <span className="text-third">{pt}</span>
              <span className="text-fourth">✔</span>
            </div>
          ))}
        </div>

      </section>

      {/* COMMITMENT */}
      <section className="py-16 px-6 max-w-7xl mx-auto border border-third/20 rounded-2xl grid lg:grid-cols-2 gap-12">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Our Promise
          </p>

          <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
            {commitmentTitle}
          </h2>
        </div>

        <div
          className="text-third font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: commitmentDescription,
          }}
        />
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 px-6 text-center space-y-8">

          <div>
            <p className="uppercase text-sm text-third font-[Poppins]">
              Feedback
            </p>

            <h2 className="text-4xl font-semibold font-[Montserrat] text-primary">
              {testimonialTitle}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto border border-third/20 rounded-2xl p-10 relative">
            <Quote className="absolute top-4 right-4 text-third/30" />

            <p className="text-xl italic text-third font-[Poppins]">
              {item.reviewText || item.review}
            </p>

            <p className="mt-4 text-primary font-semibold">
              — {item.reviewerName || item.name}
            </p>
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={prev}
                className="w-10 h-10 border border-third/30 rounded-full flex items-center justify-center text-primary"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={next}
                className="w-10 h-10 border border-third/30 rounded-full flex items-center justify-center text-primary"
              >
                <ChevronRight />
              </button>
            </div>
          )}

        </section>
      )}

    </div>
  );
};

export default WhyBuyBasic3Display;

