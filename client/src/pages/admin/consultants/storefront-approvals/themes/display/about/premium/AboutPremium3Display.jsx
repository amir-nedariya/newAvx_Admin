"use client";
import React from "react";
import "../../../themeStyles.css";
import { Cpu, Globe, ShieldCheck, TrendingUp } from "lucide-react";

const iconMap = { ShieldCheck, Globe, TrendingUp, Cpu };

// helper
const getImageUrl = (section, index = 0) => {
  if (!section?.images?.length) return null;
  return section.images[index]?.customUrl || section.images[index]?.templateUrl;
};

const AboutPremium3Display = ({ data }) => {
  if (!data) return null;

  const isVideo = (url) => url?.includes(".mp4");

  const heroImage = getImageUrl(data.heroSection, 0);

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {heroImage && (
          <div className="absolute inset-0">
            {isVideo(heroImage) ? (
              <video src={heroImage} autoPlay muted loop className="w-full h-full object-cover" />
            ) : (
              <img src={heroImage} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-secondary/60" />
          </div>
        )}

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.4em] text-third">
            Hero
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold text-primary mt-6">
            {data.heroSection?.title}
          </h1>

          <div
            className="text-third/70 mt-6"
            dangerouslySetInnerHTML={{
              __html: data.heroSection?.description || "",
            }}
          />
        </div>
      </section>

      {/* ================= MISSION ================= */}
      {data.missionSection?.title && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="relative">
            <img
              src={getImageUrl(data.missionSection, 0)}
              className="w-full h-80 object-cover rounded-2xl opacity-70"
            />

            <div className="absolute right-0 -bottom-16 bg-secondary/60 backdrop-blur-md border border-third/10 rounded-2xl p-6 max-w-md">
              <h3 className="text-2xl font-semibold text-primary">
                {data.missionSection?.title}
              </h3>

              <div
                className="text-third/70 mt-3"
                dangerouslySetInnerHTML={{
                  __html: data.missionSection?.description || "",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= VISION ================= */}
      {data.visionSection?.title && (
        <section className="py-12 px-6 max-w-7xl mx-auto">
          <div className="relative">
            <img
              src={getImageUrl(data.visionSection, 0)}
              className="w-full h-80 object-cover rounded-2xl opacity-70"
            />

            <div className="absolute left-0 -bottom-16 bg-secondary/60 backdrop-blur-md border border-third/10 rounded-2xl p-6 max-w-md">
              <h3 className="text-2xl font-semibold text-primary">
                {data.visionSection?.title}
              </h3>

              <div
                className="text-third/70 mt-3"
                dangerouslySetInnerHTML={{
                  __html: data.visionSection?.description || "",
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= STATS ================= */}
      {data.aboutUsSection?.stats && (
        <section className="py-16 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-third">
              Stats
            </p>

            <h2 className="text-4xl font-semibold text-primary">
              Numbers that speak for us
            </h2>

            <div
              className="text-third/70"
              dangerouslySetInnerHTML={{
                __html: data.aboutUsSection?.description || "",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            {data.aboutUsSection.stats.map((stat, i) => (
              <div key={i}>
                <h3 className="text-3xl font-semibold text-primary">
                  {stat.number}
                </h3>
                <p className="text-third/70">{stat.label}</p>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* ================= SERVICES ================= */}
      {data.servicesSection?.services && (
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">

          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-third">
              Services
            </p>

            <h2 className="text-4xl font-semibold text-primary">
              {data.servicesSection?.title}
            </h2>

            <div
              className="text-third/70 mt-4"
              dangerouslySetInnerHTML={{
                __html: data.servicesSection?.description || "",
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.servicesSection.services.map((service, i) => {
              const Icon = iconMap[service.icon];

              return (
                <div key={i} className="p-6 border rounded-2xl">
                  {Icon && <Icon className="w-8 h-8 mb-4" />}

                  <h3 className="text-xl font-semibold text-primary">
                    {service.title}
                  </h3>

                  <p className="text-third/70 mt-2">
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