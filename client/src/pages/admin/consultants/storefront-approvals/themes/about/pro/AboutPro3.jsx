import React from "react";
import {
  ShieldCheck,
  Globe,
  TrendingUp,
  Cpu
} from "lucide-react";

const iconMap = {
  ShieldCheck: ShieldCheck,
  Globe: Globe,
  TrendingUp: TrendingUp,
  Cpu: Cpu,
};

const AboutPro3 = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-20">

      {/* HERO */}
      {(data.aboutHeroTitle || data.aboutHeroDescription) && (
        <section className="relative h-[500px] rounded-3xl overflow-hidden">

          {data.aboutHeroTemplate1?.imageUrl && (
            <img
              src={data.aboutHeroTemplate1.imageUrl}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
          )}

          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center px-6">
            <div className="max-w-3xl text-white space-y-6">
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
                {data.aboutHeroTitle}
              </h1>

              {data.aboutHeroDescription && (
                <p className="text-lg text-slate-200">
                  {data.aboutHeroDescription}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* MISSION + VISION */}
      <section className="grid md:grid-cols-2 gap-12">

        {/* Mission */}
        {data.aboutMissionTitle && (
          <div className="flex flex-col gap-6">
            {data.aboutMissionTemplate1?.imageUrl && (
              <img
                src={data.aboutMissionTemplate1.imageUrl}
                className="rounded-2xl h-64 w-full object-cover"
                alt=""
              />
            )}

            <h2 className="text-3xl font-bold text-slate-900">
              {data.aboutMissionTitle}
            </h2>

            <p className="text-slate-600 leading-relaxed">
              {data.aboutMissionDescription}
            </p>
          </div>
        )}

        {/* Vision */}
        {data.aboutVisionTitle && (
          <div className="flex flex-col gap-6">
            {data.aboutVisionTemplate1?.imageUrl && (
              <img
                src={data.aboutVisionTemplate1.imageUrl}
                className="rounded-2xl h-64 w-full object-cover"
                alt=""
              />
            )}

            <h2 className="text-3xl font-bold text-slate-900">
              {data.aboutVisionTitle}
            </h2>

            <p className="text-slate-600 leading-relaxed">
              {data.aboutVisionDescription}
            </p>
          </div>
        )}
      </section>

      {/* STATS */}
      {data.stats && (
        <section className="bg-slate-900 text-white rounded-3xl py-16 px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>

            {data.aboutStatsDescription && (
              <p className="text-slate-300">
                {data.aboutStatsDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.stats.map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="text-4xl font-bold text-sky-400">
                  {item.number}
                </h3>
                <p className="text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {data.services && (
        <section className="space-y-12">

          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              {data.aboutServicesTitle}
            </h2>

            {data.aboutServicesDescription && (
              <p className="text-slate-600">
                {data.aboutServicesDescription}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.services.map((service, i) => {
              const Icon = iconMap[service.icon];

              return (
                <div
                  key={i}
                  className="p-8 border rounded-2xl hover:shadow-xl transition flex flex-col gap-4"
                >
                  {Icon && (
                    <Icon className="w-10 h-10 text-sky-500" />
                  )}

                  <h3 className="text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="text-slate-600">
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

export default AboutPro3;