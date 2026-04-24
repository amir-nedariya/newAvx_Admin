import React from "react";
import "../../themeStyles.css";

const AboutPro2 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-16">

      {/* HERO SECTION */}
      {(data.aboutHeroTitle || data.aboutHeroDescription) && (
        <section className="relative py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="flex flex-col gap-6">
              <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                About Us
              </p>

              {data.aboutHeroTitle && (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.1]">
                  {data.aboutHeroTitle}
                </h1>
              )}

              {data.aboutHeroDescription && (
                <div
                  className="text-slate-600 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.aboutHeroDescription }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {data.aboutHeroTemplate1?.imageUrl && (
                <img
                  src={data.aboutHeroTemplate1.imageUrl}
                  className="rounded-2xl h-48 w-full object-cover"
                  alt=""
                />
              )}
              {data.aboutHeroTemplate2?.imageUrl && (
                <img
                  src={data.aboutHeroTemplate2.imageUrl}
                  className="rounded-2xl h-48 w-full object-cover"
                  alt=""
                />
              )}
              {data.aboutHeroTemplate3?.imageUrl && (
                <img
                  src={data.aboutHeroTemplate3.imageUrl}
                  className="rounded-2xl h-48 w-full object-cover col-span-2"
                  alt=""
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* MISSION */}
      {data.aboutMissionTitle && (
        <section className="py-12 bg-slate-50 rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {data.aboutMissionTemplate1?.imageUrl && (
              <img
                src={data.aboutMissionTemplate1.imageUrl}
                className="rounded-2xl h-96 w-full object-cover"
                alt=""
              />
            )}

            <div className="flex flex-col gap-6">
              <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                Mission
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {data.aboutMissionTitle}
              </h2>

              {data.aboutMissionDescription && (
                <div
                  className="text-slate-600 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.aboutMissionDescription,
                  }}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* VISION */}
      {data.aboutVisionTitle && (
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="flex flex-col gap-6">
              <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                Vision
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {data.aboutVisionTitle}
              </h2>

              {data.aboutVisionDescription && (
                <div
                  className="text-slate-600 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.aboutVisionDescription,
                  }}
                />
              )}
            </div>

            {data.aboutVisionTemplate1?.imageUrl && (
              <img
                src={data.aboutVisionTemplate1.imageUrl}
                className="rounded-2xl h-96 w-full object-cover"
                alt=""
              />
            )}
          </div>
        </section>
      )}

      {/* STATS */}
      {data.stats && data.stats.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl">
          <div className="px-8 flex flex-col gap-12">

            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Our Numbers
              </h2>

              {data.aboutStatsDescription && (
                <div
                  className="text-slate-300 text-lg"
                  dangerouslySetInnerHTML={{
                    __html: data.aboutStatsDescription,
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.stats.map((item, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
                >
                  <h3 className="text-4xl font-bold text-sky-400">
                    {item.number}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      {data.services && data.services.length > 0 && (
        <section className="py-12">
          <div className="flex flex-col gap-12">

            <div className="max-w-2xl flex flex-col gap-6">
              <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                Services
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {data.aboutServicesTitle}
              </h2>

              {data.aboutServicesDescription && (
                <div
                  className="text-slate-600 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.aboutServicesDescription,
                  }}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data.services.map((service, index) => (
                <div
                  key={index}
                  className="p-10 border-2 border-slate-200 rounded-2xl hover:border-sky-400 hover:shadow-xl transition"
                >
                  {service.icon && (
                    <div
                      className="mb-4 text-slate-600 [&>svg]:w-10 [&>svg]:h-10"
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                    />
                  )}

                  <h3 className="text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="text-slate-600">
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

export default AboutPro2;