import React from "react";
import "../../../themeStyles.css";

const AboutPremium1Display = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-24">

      {/* HERO */}
      {(data.heroTitle || data.heroDescription) && (
        <section className="w-full min-h-screen flex items-center justify-center py-12 pt-20">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div>
              <p className="mb-4 text-xs tracking-[0.5em] uppercase text-[var(--color-third)] font-semibold">
                Hero
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-[var(--color-secondary)]">
                {data.heroTitle}
              </h1>

              <div
                className="mt-6 text-[var(--color-third)] text-lg leading-relaxed max-w-xl"
                dangerouslySetInnerHTML={{ __html: data.heroDescription }}
              />
            </div>

            {/* RIGHT IMAGE */}
            {(data.customHeroImage1 || data.heroTemplate1?.imageUrl) && (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--color-third)]">
                <img
                  src={data.customHeroImage1 || data.heroTemplate1?.imageUrl}
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}

          </div>
        </section>
      )}

      {/* MISSION & VISION */}
      {(data.missionTitle || data.visionTitle) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 space-y-16">

            <div className="text-center max-w-2xl mx-auto">
              <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                Purpose
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-secondary)]">
                {data.missionTitle} & {data.visionTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">

              {/* Mission */}
              {data.missionTitle && (
                <div className="space-y-6">
                  {(data.customMissionImage1 || data.missionTemplate1?.imageUrl) && (
                    <img
                      src={data.customMissionImage1 || data.missionTemplate1?.imageUrl}
                      className="rounded-2xl w-full h-72 object-cover"
                      alt=""
                    />
                  )}

                  <h3 className="text-3xl font-semibold text-[var(--color-secondary)]">
                    {data.missionTitle}
                  </h3>

                  <div
                    className="text-[var(--color-third)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.missionDesc }}
                  />
                </div>
              )}

              {/* Vision */}
              {data.visionTitle && (
                <div className="space-y-6">
                  {(data.customVisionImage1 || data.visionTemplate1?.imageUrl) && (
                    <img
                      src={data.customVisionImage1 || data.visionTemplate1?.imageUrl}
                      className="rounded-2xl w-full h-72 object-cover"
                      alt=""
                    />
                  )}

                  <h3 className="text-3xl font-semibold text-[var(--color-secondary)]">
                    {data.visionTitle}
                  </h3>

                  <div
                    className="text-[var(--color-third)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.visionDesc }}
                  />
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      {data.stats && (
        <section className="py-16 bg-[var(--color-secondary)] text-[var(--color-primary)]">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-sm uppercase text-[var(--color-third)] mb-4">
                Impact
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
                Our <span className="text-[var(--color-fourth)]">Numbers</span>
              </h2>

              <div
                className="text-[var(--color-third)]"
                dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {data.stats.map((item, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-3xl font-semibold text-[var(--color-fourth)]">
                    {item.number}
                  </h3>
                  <p className="text-[var(--color-third)]">{item.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* SERVICES */}
      {data.services && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-12">

            <div className="max-w-2xl">
              <p className="text-sm uppercase text-[var(--color-third)] mb-4">
                Services
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--color-secondary)]">
                {data.servicesTitle}
              </h2>

              <div
                className="mt-6 text-[var(--color-third)] border-l-2 border-[var(--color-third)] pl-6"
                dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.services.map((service, i) => (
                <div
                  key={i}
                  className="p-8 border border-[var(--color-third)] rounded-2xl hover:shadow-lg transition"
                >
                  {service.icon && (
                    <div
                      className="text-[var(--color-third)] mb-4 [&>svg]:w-10 [&>svg]:h-10"
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                    />
                  )}

                  <h3 className="text-xl font-semibold text-[var(--color-secondary)]">
                    {service.title}
                  </h3>

                  <p className="text-[var(--color-third)] mt-2">
                    {service.desc}
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

export default AboutPremium1Display;