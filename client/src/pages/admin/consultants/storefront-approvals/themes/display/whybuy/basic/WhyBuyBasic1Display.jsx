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
      <section className="container py-16">
        <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)]">
          Trusted Auto Consultants
        </p>

        <h2 className="text-4xl font-semibold text-[var(--color-secondary)] mt-4">
          {data.whyBuyHeroTitle}
        </h2>

        <div
          className="text-[var(--color-third)] mt-4 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
        />
      </section>

      {/* STORY */}
      <section className="bg-[var(--color-primary)] border-y border-[var(--color-third)]/20 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <p className="uppercase text-[var(--color-secondary)]/70 text-sm tracking-[0.4em]">
            Consultant Story
          </p>

          <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
            {data.storyTitle}
          </h2>

          <div
            className="text-[var(--color-secondary)]/80"
            dangerouslySetInnerHTML={{ __html: data.storyDescription }}
          />
        </div>
      </section>

      {/* VEHICLE SELECTION */}
      <section className="container py-16">
        <p className="uppercase text-[var(--color-third)] text-sm tracking-[0.4em]">
          Our Standards
        </p>

        <h2 className="text-4xl font-semibold text-[var(--color-secondary)] mt-4">
          {data.vehicleSelectionTitle}
        </h2>

        <div className="border-l-2 border-[var(--color-secondary)]/40 pl-5 mt-6 space-y-4">
          {data.vehicleSelectionDescription
            ?.split("\n\n")
            .map((para, i) => (
              <p key={i} className="text-[var(--color-third)]">
                {para}
              </p>
            ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="container py-16">
        <div className="space-y-6 max-w-2xl">
          <p className="uppercase text-[var(--color-third)] text-sm tracking-[0.4em]">
            Simple Process
          </p>

          <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
            {data.processTitle}
          </h2>

          <div
            className="text-[var(--color-third)]"
            dangerouslySetInnerHTML={{ __html: data.processDescription }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {data.processSteps?.map((step, i) => {
            const Icon = ICON_MAP[step.icon];

            return (
              <div
                key={i}
                className="p-6 border border-[var(--color-secondary)]/20 rounded-xl hover:border-[var(--color-fourth)] transition"
              >
                <div className="mb-4">
                  {typeof step.icon === "string" &&
                    step.icon.startsWith("<svg") ? (
                    <div
                      className="text-[var(--color-secondary)]"
                      dangerouslySetInnerHTML={{ __html: step.icon }}
                    />
                  ) : Icon ? (
                    <Icon className="text-[var(--color-secondary)]" />
                  ) : null}
                </div>

                <h3 className="font-semibold text-[var(--color-secondary)]">
                  {step.title}
                </h3>

                <p className="text-[var(--color-third)] mt-2">
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
          <p className="uppercase text-[var(--color-third)] text-sm tracking-[0.4em]">
            Independent Verification
          </p>

          <h2 className="text-4xl font-semibold text-[var(--color-secondary)] mt-4">
            {data.inspectionTitle}
          </h2>

          <div
            className="text-[var(--color-third)] mt-4"
            dangerouslySetInnerHTML={{ __html: data.inspectionText }}
          />
        </div>

        <div className="space-y-4">
          {data.inspectionPoints?.map((pt, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 border border-[var(--color-third)]/20 rounded-lg"
            >
              <CheckCircle2 className="text-[var(--color-secondary)] mt-1" />
              <p className="text-[var(--color-third)]">{pt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="container py-16 text-center">
        <p className="uppercase text-[var(--color-third)] text-sm tracking-[0.4em]">
          Our Promise
        </p>

        <h2 className="text-4xl font-semibold text-[var(--color-secondary)] mt-4">
          {data.customerCommitmentTitle}
        </h2>

        <div className="w-12 h-px bg-[var(--color-secondary)]/40 mx-auto my-4" />

        <div
          className="text-[var(--color-third)] max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{
            __html: data.customerCommitmentDescription,
          }}
        />
      </section>

      {/* TESTIMONIALS */}
      {data.featuredReviews && (
        <section className="bg-[var(--color-primary)] py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-10">

            <div>
              <p className="uppercase text-[var(--color-secondary)]/70 text-sm tracking-[0.4em]">
                Real Buyers
              </p>

              <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
                {data.testimonialTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.featuredReviews.map((review, i) => (
                <div
                  key={i}
                  className="p-6 border border-[var(--color-secondary)]/20 rounded-xl"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        className={
                          idx < review.rating
                            ? "text-[var(--color-fourth)] fill-[var(--color-fourth)]"
                            : "text-[var(--color-third)]"
                        }
                      />
                    ))}
                  </div>

                  {review.reviewTitle && (
                    <h4 className="font-semibold text-[var(--color-secondary)]">
                      {review.reviewTitle}
                    </h4>
                  )}

                  <p className="text-[var(--color-third)] mt-2">
                    {review.reviewText}
                  </p>

                  <p className="text-[var(--color-secondary)]/70 mt-4 text-sm">
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