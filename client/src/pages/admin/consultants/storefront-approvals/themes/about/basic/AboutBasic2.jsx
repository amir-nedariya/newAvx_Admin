import React from "react";
import "../../themeStyles.css";

const AboutBasic2 = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            {/* HERO SECTION */}
            {(data.heroTitle || data.heroDescription) && (
                <section className="relative flex items-center justify-center py-12">
                    <div className="w-full mx-auto flex flex-col items-center text-center gap-10">
                        <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                            Our Story
                        </p>

                        {data.heroTitle && (
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] text-slate-900 max-w-3xl">
                                {data.heroTitle}
                            </h1>
                        )}

                        {data.heroDescription && (
                            <div
                                className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-4xl"
                                dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* MISSION & VISION */}
            {(data.missionTitle || data.visionTitle) && (
                <section className="relative py-12">
                    <div className="w-full grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        {data.missionTitle && (
                            <div className="flex flex-col gap-6 p-8 bg-slate-50 rounded-2xl">
                                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                                    {data.missionTitle}
                                </h2>
                                <div
                                    className="text-slate-600 text-base md:text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.missionDesc }}
                                />
                            </div>
                        )}

                        {/* Vision */}
                        {data.visionTitle && (
                            <div className="flex flex-col gap-6 p-8 bg-slate-50 rounded-2xl">
                                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                                    {data.visionTitle}
                                </h2>
                                <div
                                    className="text-slate-600 text-base md:text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.visionDesc }}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* STATS */}
            {data.stats && data.stats.length > 0 && (
                <section className="relative py-12 bg-slate-900 text-white rounded-3xl">
                    <div className="container w-full flex flex-col items-center gap-16 text-center px-8">
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-400 font-semibold">
                                Impact
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05]">
                                Our <span className="text-sky-400">Numbers</span>
                            </h2>
                        </div>

                        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
                            {data.stats.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 border border-white/10 p-8 rounded-2xl"
                                >
                                    <h3 className="text-4xl lg:text-5xl font-semibold">
                                        {item.number}
                                    </h3>
                                    <p className="text-slate-300 text-base">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* SERVICES */}
            {data.services && data.services.length > 0 && (
                <section className="relative py-12">
                    <div className="w-full flex flex-col gap-16">
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Services
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-slate-900">
                                {data.servicesTitle || "What We Do"}
                            </h2>
                            {data.servicesDesc && (
                                <div
                                    className="text-slate-600 text-lg md:text-xl leading-relaxed border-l-2 border-slate-300 pl-6"
                                    dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col justify-between p-8 lg:p-12 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all duration-300 rounded-2xl min-h-[300px]"
                                >
                                    <div className="flex flex-col gap-6">
                                        {service.icon && (
                                            <div className="text-slate-600 text-4xl">
                                                {service.icon}
                                            </div>
                                        )}
                                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 text-md md:text-lg max-w-xs">
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

export default AboutBasic2;
