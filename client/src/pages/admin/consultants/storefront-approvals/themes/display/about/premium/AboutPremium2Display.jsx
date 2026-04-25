import React from "react";
import "../../../themeStyles.css";

const AboutPremium2Display = ({ data }) => {
  if (!data) return null;

  const isVideo = (url) => url?.includes(".mp4");

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden">

        {/* BACKGROUND */}
        {(data.customHeroImage1 || data.heroTemplate1?.imageUrl) && (
          <div className="absolute inset-0">
            {isVideo(data.customHeroImage1 || data.heroTemplate1?.imageUrl) ? (
              <video
                src={data.customHeroImage1 || data.heroTemplate1?.imageUrl}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={data.customHeroImage1 || data.heroTemplate1?.imageUrl}
                className="w-full h-full object-cover"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">

            {/* TEXT */}
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-third)]">
                About Us
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-primary)]">
                {data.heroTitle}
              </h1>

              <div
                className="text-[var(--color-third)]"
                dangerouslySetInnerHTML={{ __html: data.heroDescription }}
              />
            </div>

            {/* SIDE IMAGE */}
            {(data.customHeroImage2 || data.heroTemplate2?.imageUrl) && (
              <div className="hidden lg:block">
                <img
                  src={data.customHeroImage2 || data.heroTemplate2?.imageUrl}
                  className="rounded-2xl w-full h-[400px] object-cover"
                  alt=""
                />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 space-y-16">

          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-third)]">
              Purpose
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Mission */}
            <div className="space-y-6">
              <img
                src={data.customMissionImage1 || data.missionTemplate1?.imageUrl}
                className="rounded-2xl w-full h-72 object-cover"
                alt=""
              />

              <h3 className="text-2xl font-semibold text-[var(--color-secondary)]">
                {data.missionTitle}
              </h3>

              <div
                className="text-[var(--color-third)]"
                dangerouslySetInnerHTML={{ __html: data.missionDesc }}
              />
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <img
                src={data.customVisionImage1 || data.visionTemplate1?.imageUrl}
                className="rounded-2xl w-full h-72 object-cover"
                alt=""
              />

              <h3 className="text-2xl font-semibold text-[var(--color-secondary)]">
                {data.visionTitle}
              </h3>

              <div
                className="text-[var(--color-third)]"
                dangerouslySetInnerHTML={{ __html: data.visionDesc }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      {data.stats && (
        <section className="py-16 bg-[var(--color-fourth)] text-[var(--color-primary)]">

          <div className="max-w-7xl mx-auto px-6 space-y-12">

            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold">
                Our Growth
              </h2>

              <div
                className="text-[var(--color-primary)] opacity-80"
                dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-3xl font-bold">
                    {stat.number}
                  </h3>
                  <p className="opacity-70">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>

        </section>
      )}

      {/* ================= SERVICES ================= */}
      {data.services && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-12">

            <div className="max-w-2xl">
              <p className="text-sm uppercase text-[var(--color-third)]">
                Services
              </p>

              <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
                {data.servicesTitle}
              </h2>

              <div
                className="mt-4 text-[var(--color-third)] border-l-2 border-[var(--color-third)] pl-4"
                dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.services.map((svc, i) => (
                <div
                  key={i}
                  className="p-6 border border-[var(--color-third)] rounded-xl hover:shadow-lg transition"
                >
                  {svc.icon && (
                    <div
                      className="mb-4 text-[var(--color-third)] [&>svg]:w-8 [&>svg]:h-8"
                      dangerouslySetInnerHTML={{ __html: svc.icon }}
                    />
                  )}

                  <h3 className="text-xl font-semibold text-[var(--color-secondary)]">
                    {svc.title}
                  </h3>

                  <p className="text-[var(--color-third)] mt-2">
                    {svc.desc}
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

export default AboutPremium2Display;