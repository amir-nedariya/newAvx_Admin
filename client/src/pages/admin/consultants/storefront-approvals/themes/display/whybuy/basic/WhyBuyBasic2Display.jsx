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
          <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)]">
            Why Choose Us
          </p>

          <h1 className="text-5xl font-bold text-[var(--color-secondary)] mt-4">
            {data.whyBuyHeroTitle}
          </h1>

          <div
            className="text-[var(--color-third)] mt-6"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
          />
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 bg-[var(--color-fourth)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">
          <div>
            <p className="uppercase text-[var(--color-third)] text-sm">
              Our Story
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.storyTitle}
            </h2>
          </div>

          <div
            className="text-[var(--color-primary)]/90"
            dangerouslySetInnerHTML={{ __html: data.storyDescription }}
          />
        </div>
      </section>

      {/* SELECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">
          <div>
            <p className="uppercase text-[var(--color-third)] text-sm">
              Selection
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              Vehicle Selection
            </h2>
          </div>

          <div
            className="text-[var(--color-third)]"
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
            <p className="uppercase text-[var(--color-third)] text-sm">
              Process
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.processTitle}
            </h2>

            <p className="text-[var(--color-third)] mt-3">
              {data.processDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.processSteps?.map((step, i) => (
              <div
                key={i}
                className="p-6 border border-[var(--color-third)]/20 rounded-xl"
              >
                <div
                  className="mb-4 text-[var(--color-fourth)]"
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />

                <h3 className="text-[var(--color-secondary)] font-semibold">
                  {step.title}
                </h3>

                <p className="text-[var(--color-third)] mt-2">
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
            <p className="uppercase text-[var(--color-third)] text-sm">
              Inspection
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.inspectionTitle}
            </h2>

            <p className="text-[var(--color-third)] mt-4">
              {data.inspectionText}
            </p>
          </div>

          <div className="space-y-4">
            {data.inspectionPoints?.map((pt, i) => (
              <div
                key={i}
                className="p-4 border border-[var(--color-third)]/20 rounded-lg"
              >
                <p className="text-[var(--color-third)]">{pt}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-16 bg-[var(--color-fourth)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-6">

          <div>
            <p className="uppercase text-[var(--color-third)] text-sm">
              Commitment
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.customerCommitmentTitle}
            </h2>
          </div>

          <div
            className="text-[var(--color-primary)]/90"
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
            <p className="uppercase text-[var(--color-third)] text-sm">
              Reviews
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.testimonialTitle}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {(data.featuredReviews || []).map((r, i) => (
              <div
                key={i}
                className="p-6 border border-[var(--color-third)]/20 rounded-xl"
              >
                {r.rating ? (
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={
                          idx < r.rating
                            ? "text-[var(--color-fourth)] fill-[var(--color-fourth)]"
                            : "text-[var(--color-third)]"
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <Quote className="text-[var(--color-fourth)] mb-3" />
                )}

                <p className="text-[var(--color-third)] italic">
                  {r.reviewText}
                </p>

                <p className="mt-4 text-[var(--color-secondary)] text-sm">
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