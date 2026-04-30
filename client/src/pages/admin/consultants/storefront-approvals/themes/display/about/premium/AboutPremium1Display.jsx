"use client";
import React from "react";
import "../../../themeStyles.css";

const getImageUrl = (section, index = 0) => {
  if (!section?.images?.length) return null;
  return section.images[index]?.customUrl || section.images[index]?.templateUrl;
};

const AboutPremium1Display = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      {(data.heroSection?.title || data.heroSection?.description) && (
        <section className="w-full min-h-screen flex items-center justify-center py-12 pt-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-third mb-4">
                Hero
              </p>

              <h1 className="text-5xl font-bold text-primary">
                {data.heroSection?.title}
              </h1>

              <div
                className="mt-6 text-third/70"
                dangerouslySetInnerHTML={{
                  __html: data.heroSection?.description || "",
                }}
              />
            </div>

            {getImageUrl(data.heroSection, 0) && (
              <img
                src={getImageUrl(data.heroSection, 0)}
                className="rounded-2xl h-[400px] w-full object-cover"
              />
            )}
          </div>
        </section>
      )}

      {/* ================= MISSION & VISION ================= */}
      {(data.missionSection?.title || data.visionSection?.title) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 space-y-16">

            <h2 className="text-4xl font-bold text-center">
              {data.missionSection?.title} & {data.visionSection?.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-12">

              {/* Mission */}
              <div>
                <img
                  src={getImageUrl(data.missionSection, 0)}
                  className="rounded-xl mb-4"
                />
                <h3 className="text-2xl font-semibold">
                  {data.missionSection?.title}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.missionSection?.description || "",
                  }}
                />
              </div>

              {/* Vision */}
              <div>
                <img
                  src={getImageUrl(data.visionSection, 0)}
                  className="rounded-xl mb-4"
                />
                <h3 className="text-2xl font-semibold">
                  {data.visionSection?.title}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.visionSection?.description || "",
                  }}
                />
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ================= STATS ================= */}
      {data.aboutUsSection?.stats && (
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-3xl font-bold mb-6">Our Numbers</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: data.aboutUsSection?.description || "",
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {data.aboutUsSection.stats.map((s, i) => (
                <div key={i}>
                  <h3 className="text-3xl font-bold">{s.number}</h3>
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVICES ================= */}
      {data.servicesSection?.services && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-3xl font-bold mb-6">
              {data.servicesSection?.title}
            </h2>

            <div
              className="mb-8"
              dangerouslySetInnerHTML={{
                __html: data.servicesSection?.description || "",
              }}
            />

            <div className="grid md:grid-cols-2 gap-6">
              {data.servicesSection.services.map((s, i) => (
                <div key={i} className="border p-6 rounded-xl">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default AboutPremium1Display;