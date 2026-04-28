import React from "react";
import "../../../themeStyles.css";

// Helper function to extract image URL from images array
const getImageUrl = (section, index = 0) => {
  if (!section?.images || !Array.isArray(section.images) || section.images.length === 0) {
    return null;
  }
  const image = section.images[index];
  return image?.customUrl || image?.templateUrl || null;
};

const AboutPremium1Display = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-24">

      {/* HERO */}
      {(data.heroSection?.title || data.heroSection?.description) && (
        <section className="w-full min-h-screen flex items-center justify-center py-12 pt-20">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div>
              <p className="mb-4 text-xs tracking-[0.5em] uppercase text-third font-semibold">
                Hero
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-primary font-[Montserrat]">
                {data.heroSection?.title}
              </h1>

              <div
                className="mt-6 text-third text-lg font-[Poppins] leading-relaxed max-w-xl"
                dangerouslySetInnerHTML={{ __html: data.heroSection?.description }}
              />
            </div>

            {/* RIGHT IMAGE */}
            {getImageUrl(data.heroSection, 0) && (
              <div className="relative rounded-2xl overflow-hidden border border-third/10">
                <img
                  src={getImageUrl(data.heroSection, 0)}
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
      {(data.missionSection?.title || data.visionSection?.title) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 space-y-16">

            <div className="text-center max-w-2xl mx-auto">
              <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">
                Purpose
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary font-[Montserrat]">
                {data.missionSection?.title} & {data.visionSection?.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">

              {/* Mission */}
              {data.missionSection?.title && (
                <div className="space-y-6">
                  {getImageUrl(data.missionSection, 0) && (
                    <img
                      src={getImageUrl(data.missionSection, 0)}
                      className="rounded-2xl w-full h-72 object-cover"
                      alt=""
                    />
                  )}

                  <h3 className="text-3xl font-semibold text-primary font-[Montserrat]">
                    {data.missionSection?.title}
                  </h3>

                  <div
                    className="text-third/70 font-[Poppins] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.missionSection?.description }}
                  />
                </div>
              )}

              {/* Vision */}
              {data.visionSection?.title && (
                <div className="space-y-6">
                  {getImageUrl(data.visionSection, 0) && (
                    <img
                      src={getImageUrl(data.visionSection, 0)}
                      className="rounded-2xl w-full h-72 object-cover"
                      alt=""
                    />
                  )}

                  <h3 className="text-3xl font-semibold text-primary font-[Montserrat]">
                    {data.visionSection?.title}
                  </h3>

                  <div
                    className="text-third/70 font-[Poppins] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: data.visionSection?.description }}
                  />
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      {data.statsSection?.stats && (
        <section className="py-16 bg-primary text-secondary">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-sm uppercase text-secondary/60 mb-4 font-[Montserrat]">
                Impact
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold mb-6 font-[Montserrat]">
                Our <span className="text-fourth">Numbers</span>
              </h2>

              <div
                className="text-secondary/70 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.statsSection?.description }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {data.statsSection.stats.map((item, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-3xl font-semibold text-fourth font-[Montserrat]">
                    {item.number}
                  </h3>
                  <p className="text-secondary/70 font-[Poppins]">{item.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* SERVICES */}
      {data.servicesSection?.services && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-12">

            <div className="max-w-2xl">
              <p className="text-sm uppercase text-third mb-4 font-[Montserrat]">
                Services
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-primary font-[Montserrat]">
                {data.servicesSection?.title}
              </h2>

              <div
                className="mt-6 text-third/70 border-l-2 border-primary/30 pl-6 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.servicesSection?.description }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.servicesSection.services.map((service, i) => (
                <div
                  key={i}
                  className="p-8 border border-third/10 rounded-2xl hover:shadow-lg transition"
                >
                  {service.icon && (
                    <div
                      className="text-third mb-4 [&>svg]:w-10 [&>svg]:h-10"
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                    />
                  )}

                  <h3 className="text-xl font-semibold text-primary font-[Montserrat]">
                    {service.title}
                  </h3>

                  <p className="text-third/70 mt-2 font-[Poppins]">
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