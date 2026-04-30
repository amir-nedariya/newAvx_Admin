"use client";
import React from "react";
import "../../../themeStyles.css";

const getImageUrl = (section, index = 0) => {
  if (!section?.images?.length) return null;
  return section.images[index]?.customUrl || section.images[index]?.templateUrl;
};

const AboutPremium2Display = ({ data }) => {
  if (!data) return null;

  const heroBg = getImageUrl(data.heroSection, 0);
  const heroSide = getImageUrl(data.heroSection, 1);

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <section className="relative h-screen">
        {heroBg && (
          <div className="absolute inset-0">
            <img src={heroBg} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 w-full">

            <div>
              <h1 className="text-5xl font-bold text-white">
                {data.heroSection?.title}
              </h1>

              <div
                className="text-white/80 mt-4"
                dangerouslySetInnerHTML={{
                  __html: data.heroSection?.description || "",
                }}
              />
            </div>

            {heroSide && (
              <img
                src={heroSide}
                className="hidden lg:block rounded-xl h-[400px]"
              />
            )}

          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div>
            <img src={getImageUrl(data.missionSection, 0)} />
            <h3>{data.missionSection?.title}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: data.missionSection?.description || "",
              }}
            />
          </div>

          <div>
            <img src={getImageUrl(data.visionSection, 0)} />
            <h3>{data.visionSection?.title}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: data.visionSection?.description || "",
              }}
            />
          </div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      {data.aboutUsSection?.stats && (
        <section className="py-16 bg-fourth">
          <div className="max-w-7xl mx-auto px-6">

            <div
              dangerouslySetInnerHTML={{
                __html: data.aboutUsSection?.description || "",
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {data.aboutUsSection.stats.map((s, i) => (
                <div key={i}>
                  <h3>{s.number}</h3>
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

            <h2>{data.servicesSection?.title}</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: data.servicesSection?.description || "",
              }}
            />

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {data.servicesSection.services.map((s, i) => (
                <div key={i} className="border p-4 rounded">
                  <h3>{s.title}</h3>
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

export default AboutPremium2Display;