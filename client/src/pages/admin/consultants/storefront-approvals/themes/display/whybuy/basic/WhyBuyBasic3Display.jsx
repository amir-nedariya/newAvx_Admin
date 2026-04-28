import React, { useState } from "react";
import "../../../themeStyles.css";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const WhyBuyBasic3Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const testimonials =
    data.featuredReviews?.length > 0
      ? data.featuredReviews
      : data.testimonials || [];

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
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-third font-[Poppins]">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
            {data.whyBuyHeroTitle}
          </h2>

          <div
            className="text-third font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
          />
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-third font-[Poppins]">
            About Us
          </p>

          <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
            {data.storyTitle}
          </h2>
        </div>

        <div
          className="text-third font-[Poppins]"
          dangerouslySetInnerHTML={{ __html: data.storyDescription }}
        />
      </section>

      {/* VEHICLE */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center border border-third/20 rounded-3xl">
        <p className="uppercase text-sm text-third font-[Poppins]">
          Vehicle Approach
        </p>

        <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
          {data.vehicleSelectionTitle}
        </h2>

        <div
          className="text-third mt-4 font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: data.vehicleSelectionDescription,
          }}
        />
      </section>

      {/* PROCESS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Buying Process
          </p>

          <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
            {data.processTitle}
          </h2>

          <div
            className="text-third mt-3 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.processDescription }}
          />
        </div>

        <div className="space-y-4">
          {data.processSteps?.map((step, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row border border-third/20 rounded-xl overflow-hidden"
            >
              <div className="p-6 w-32 flex items-center justify-center border-r border-third/20">
                <span className="text-third font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="p-6 flex-1">
                <h3 className="text-secondary font-semibold">
                  {step.title}
                </h3>

                <p className="text-third mt-2 font-[Poppins]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* INSPECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

        <div>
          <p className="uppercase text-sm text-third font-[Poppins]">
            Inspection
          </p>

          <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
            {data.inspectionTitle}
          </h2>

          <div
            className="text-third mt-4 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.inspectionText }}
          />
        </div>

        <div className="space-y-4">
          {data.inspectionPoints?.map((pt, i) => (
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

          <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
            {data.customerCommitmentTitle}
          </h2>
        </div>

        <div
          className="text-third font-[Poppins]"
          dangerouslySetInnerHTML={{
            __html: data.customerCommitmentDescription,
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.testimonialTitle}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto border border-third/20 rounded-2xl p-10 relative">
            <Quote className="absolute top-4 right-4 text-third/30" />

            <p className="text-xl italic text-third font-[Poppins]">
              {item.reviewText || item.review}
            </p>

            <p className="mt-4 text-secondary font-semibold">
              — {item.reviewerName || item.name}
            </p>
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={prev}
                className="w-10 h-10 border border-third/30 rounded-full flex items-center justify-center"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={next}
                className="w-10 h-10 border border-third/30 rounded-full flex items-center justify-center"
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

