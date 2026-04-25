import React from "react";
import "../../../themeStyles.css";
import { Cpu, Globe, ShieldCheck, TrendingUp } from "lucide-react";

const iconMap = { ShieldCheck, Globe, TrendingUp, Cpu };

const AboutPremium3Display = ({ data }) => {
  if (!data) return null;

  const isVideo = (url) => url?.includes(".mp4");

  return (
    <div className="space-y-24">

      {/* ========= HERO ========= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
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
            <div className="absolute inset-0 bg-[var(--color-secondary)]/60" />
          </div>
        )}

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-third)]">
            Hero
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--color-primary)] mt-6">
            {data.heroTitle}
          </h1>

          <div
            className="text-[var(--color-third)] mt-6"
            dangerouslySetInnerHTML={{ __html: data.heroDescription }}
          />
        </div>
      </section>

      {/* ========= MISSION & VISION ========= */}
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-24">

        {/* Mission */}
        <div className="relative">
          <img
            src={data.customMissionImage1 || data.missionTemplate1?.imageUrl}
            className="w-full h-80 object-cover rounded-2xl opacity-70"
            alt=""
          />

          <div className="absolute right-0 -bottom-16 bg-[var(--color-secondary)]/60 backdrop-blur-md border border-[var(--color-third)] rounded-2xl p-6 max-w-md">
            <h3 className="text-2xl font-semibold text-[var(--color-primary)]">
              {data.missionTitle}
            </h3>

            <div
              className="text-[var(--color-third)] mt-3"
              dangerouslySetInnerHTML={{ __html: data.missionDesc }}
            />
          </div>
        </div>

        {/* Vision */}
        <div className="relative">
          <img
            src={data.customVisionImage1 || data.visionTemplate1?.imageUrl}
            className="w-full h-80 object-cover rounded-2xl opacity-70"
            alt=""
          />

          <div className="absolute left-0 -bottom-16 bg-[var(--color-secondary)]/60 backdrop-blur-md border border-[var(--color-third)] rounded-2xl p-6 max-w-md">
            <h3 className="text-2xl font-semibold text-[var(--color-primary)]">
              {data.visionTitle}
            </h3>

            <div
              className="text-[var(--color-third)] mt-3"
              dangerouslySetInnerHTML={{ __html: data.visionDesc }}
            />
          </div>
        </div>

      </section>

      {/* ========= STATS ========= */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-third)]">
            Stats
          </p>

          <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
            Numbers that speak for us
          </h2>

          <div
            className="text-[var(--color-third)]"
            dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          {data.stats?.map((stat, i) => (
            <div key={i}>
              <h3 className="text-3xl font-semibold text-[var(--color-secondary)]">
                {stat.number}
              </h3>
              <p className="text-[var(--color-third)]">{stat.label}</p>
            </div>
          ))}
        </div>

      </section>

      {/* ========= SERVICES ========= */}
      {data.services && (
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-third)]">
              Services
            </p>

            <h2 className="text-4xl font-semibold text-[var(--color-secondary)]">
              {data.servicesTitle}
            </h2>

            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.services.map((service, i) => {
              const Icon = iconMap[service.icon];

              return (
                <div
                  key={i}
                  className="p-6 border border-[var(--color-third)] rounded-2xl hover:shadow-lg transition"
                >
                  {Icon && (
                    <Icon className="w-8 h-8 text-[var(--color-fourth)] mb-4" />
                  )}

                  <h3 className="text-xl font-semibold text-[var(--color-secondary)]">
                    {service.title}
                  </h3>

                  <p className="text-[var(--color-third)] mt-2">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </section>
      )}

    </div>
  );
};

export default AboutPremium3Display;