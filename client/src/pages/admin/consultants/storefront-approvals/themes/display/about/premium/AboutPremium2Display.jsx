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

const AboutPremium2Display = ({ data }) => {
  if (!data) return null;

  const isVideo = (url) => url?.includes(".mp4");
  const heroImage = getImageUrl(data.heroSection, 0);
  const heroImage2 = getImageUrl(data.heroSection, 1);

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden">

        {/* BACKGROUND */}
        {heroImage && (
          <div className="absolute inset-0">
            {isVideo(heroImage) ? (
              <video
                src={heroImage}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={heroImage}
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
              <p className="text-sm uppercase tracking-[0.4em] text-third font-[Montserrat]">
                About Us
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold text-primary font-[Montserrat]">
                {data.heroSection?.title}
              </h1>

              <div
                className="text-third/70 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.heroSection?.description }}
              />
            </div>

            {/* SIDE IMAGE */}
            {heroImage2 && (
              <div className="hidden lg:block">
                <img
                  src={heroImage2}
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
            <p className="text-sm uppercase tracking-[0.4em] text-third font-[Montserrat]">
              Purpose
            </p>

            <h2 className="text-4xl font-semibold text-primary font-[Montserrat]">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Mission */}
            <div className="space-y-6">
              <img
                src={getImageUrl(data.missionSection, 0)}
                className="rounded-2xl w-full h-72 object-cover"
                alt=""
              />

              <h3 className="text-2xl font-semibold text-primary font-[Montserrat]">
                {data.missionSection?.title}
              </h3>

              <div
                className="text-third/70 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.missionSection?.description }}
              />
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <img
                src={getImageUrl(data.visionSection, 0)}
                className="rounded-2xl w-full h-72 object-cover"
                alt=""
              />

              <h3 className="text-2xl font-semibold text-primary font-[Montserrat]">
                {data.visionSection?.title}
              </h3>

              <div
                className="text-third/70 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.visionSection?.description }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      {data.statsSection?.stats && (
        <section className="py-16 bg-fourth text-primary">

          <div className="max-w-7xl mx-auto px-6 space-y-12">

            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold font-[Montserrat]">
                Our Growth
              </h2>

              <div
                className="text-primary/80 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.statsSection?.description }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.statsSection.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-3xl font-bold font-[Montserrat]">
                    {stat.number}
                  </h3>
                  <p className="opacity-70 font-[Poppins]">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>

        </section>
      )}

      {/* ================= SERVICES ================= */}
      {data.servicesSection?.services && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 space-y-12">

            <div className="max-w-2xl">
              <p className="text-sm uppercase text-third font-[Montserrat]">
                Services
              </p>

              <h2 className="text-4xl font-semibold text-primary font-[Montserrat]">
                {data.servicesSection?.title}
              </h2>

              <div
                className="mt-4 text-third/70 border-l-2 border-primary/30 pl-4 font-[Poppins]"
                dangerouslySetInnerHTML={{ __html: data.servicesSection?.description }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.servicesSection.services.map((svc, i) => (
                <div
                  key={i}
                  className="p-6 border border-third/10 rounded-xl hover:shadow-lg transition"
                >
                  {svc.icon && (
                    <div
                      className="mb-4 text-third [&>svg]:w-8 [&>svg]:h-8"
                      dangerouslySetInnerHTML={{ __html: svc.icon }}
                    />
                  )}

                  <h3 className="text-xl font-semibold text-primary font-[Montserrat]">
                    {svc.title}
                  </h3>

                  <p className="text-third/70 mt-2 font-[Poppins]">
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
