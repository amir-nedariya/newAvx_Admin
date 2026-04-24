import React from "react";
import "../../themeStyles.css";

const AboutPremium1 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-24">

      {/* ───────── HERO ───────── */}
      {(data.heroTitle || data.heroDescription) && (
        <section className="relative py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                Premium Experience
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                {data.heroTitle}
              </h1>

              {data.heroDescription && (
                <div
                  className="text-slate-600 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                />
              )}
            </div>

            {/* Right Images */}
            <div className="grid grid-cols-2 gap-4">
              {data.heroTemplate1?.imageUrl && (
                <img
                  src={data.heroTemplate1.imageUrl}
                  className="rounded-2xl h-64 w-full object-cover"
                  alt=""
                />
              )}
              {data.heroTemplate2?.imageUrl && (
                <img
                  src={data.heroTemplate2.imageUrl}
                  className="rounded-2xl h-64 w-full object-cover mt-12"
                  alt=""
                />
              )}
            </div>

          </div>
        </section>
      )}

      {/* ───────── STATS ───────── */}
      {data.stats && (
        <section className="py-16 bg-slate-900 text-white rounded-3xl">
          <div className="px-8 flex flex-col gap-12">

            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                Trusted Worldwide
              </h2>

              {data.aboutUsDescription && (
                <div
                  className="text-slate-300"
                  dangerouslySetInnerHTML={{
                    __html: data.aboutUsDescription,
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.stats.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2"
                >
                  <h3 className="text-4xl font-bold text-sky-400">
                    {item.number}
                    {typeof item.number === "number" ? "+" : ""}
                  </h3>
                  <p className="text-slate-300 text-sm text-center">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ───────── MISSION ───────── */}
      {data.missionTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="flex flex-col gap-6">
            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
              Mission
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {data.missionTitle}
            </h2>

            <div
              className="text-slate-600 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.missionDesc }}
            />
          </div>

          {data.missionTemplate1?.imageUrl && (
            <img
              src={data.missionTemplate1.imageUrl}
              className="rounded-3xl h-[400px] w-full object-cover shadow-xl"
              alt=""
            />
          )}
        </section>
      )}

      {/* ───────── VISION ───────── */}
      {data.visionTitle && (
        <section className="grid md:grid-cols-2 gap-12 items-center">

          {data.visionTemplate1?.imageUrl && (
            <img
              src={data.visionTemplate1.imageUrl}
              className="rounded-3xl h-[400px] w-full object-cover shadow-xl order-2 md:order-1"
              alt=""
            />
          )}

          <div className="flex flex-col gap-6 order-1 md:order-2">
            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
              Vision
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {data.visionTitle}
            </h2>

            <div
              className="text-slate-600 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.visionDesc }}
            />
          </div>
        </section>
      )}

      {/* ───────── SERVICES ───────── */}
      {data.services && (
        <section className="space-y-12">

          <div className="max-w-2xl flex flex-col gap-6">
            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
              Services
            </p>

            <h2 className="text-4xl font-bold text-slate-900">
              {data.servicesTitle}
            </h2>

            {data.servicesDesc && (
              <div
                className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-500 pl-6"
                dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <div
                key={index}
                className="group p-10 border border-slate-200 rounded-3xl hover:shadow-2xl hover:border-sky-400 transition-all duration-300 flex flex-col gap-6"
              >
                {service.icon && (
                  <div
                    className="text-slate-700 group-hover:text-sky-500 transition [&>svg]:w-10 [&>svg]:h-10"
                    dangerouslySetInnerHTML={{ __html: service.icon }}
                  />
                )}

                <h3 className="text-2xl font-semibold text-slate-900">
                  {service.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

        </section>
      )}

    </div>
  );
};

export default AboutPremium1;