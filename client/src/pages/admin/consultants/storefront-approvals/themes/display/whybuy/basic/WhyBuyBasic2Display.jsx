import React from "react";
import "../../../themeStyles.css";
import { Star, Quote } from "lucide-react";

const WhyBuyBasic2Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  return (
    <div className="space-y-20">

      {/* HERO */}
      <section className="flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-3xl">
          <p className="text-sm tracking-[0.4em] uppercase text-third font-[Poppins]">
            Why Choose Us
          </p>

          <h1 className="text-5xl font-bold  font-[Montserrat] text-secondary mt-4 font-[Montserrat]">
            {data.whyBuyHeroTitle}
          </h1>

          <div
            className="text-third mt-6 font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.storyTitle}
            </h2>
          </div>

          <div
            className="text-primary/90"
            dangerouslySetInnerHTML={{ __html: data.storyDescription }}
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              Vehicle Selection
            </h2>
          </div>

          <div
            className="text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionDescription,
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.processTitle}
            </h2>

            <p className="text-third mt-3 font-[Poppins]">
              {data.processDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.processSteps?.map((step, i) => (
              <div
                key={i}
                className="p-6 border border-third/20 rounded-xl"
              >
                <div
                  className="mb-4 text-fourth"
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />

                <h3 className="text-secondary font-semibold">
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.inspectionTitle}
            </h2>

            <p className="text-third mt-4 font-[Poppins]">
              {data.inspectionText}
            </p>
          </div>

          <div className="space-y-4">
            {data.inspectionPoints?.map((pt, i) => (
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.customerCommitmentTitle}
            </h2>
          </div>

          <div
            className="text-primary/90"
            dangerouslySetInnerHTML={{
              __html: data.customerCommitmentDescription,
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

            <h2 className="text-4xl font-semibold  font-[Montserrat] text-secondary font-[Montserrat]">
              {data.testimonialTitle}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {(data.featuredReviews || []).map((r, i) => (
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
                  {r.reviewText}
                </p>

                <p className="mt-4 text-secondary text-sm">
                  — {r.reviewerName}
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

