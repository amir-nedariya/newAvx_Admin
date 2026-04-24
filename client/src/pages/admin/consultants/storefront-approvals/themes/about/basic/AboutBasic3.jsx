import React from "react";
import "../../themeStyles.css";

const AboutBasic3 = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            {/* HERO SECTION */}
            {(data.heroTitle || data.heroDescription) && (
                <section className="relative py-16 bg-gradient-to-br from-slate-50 to-white rounded-3xl">
                    <div className="w-full mx-auto flex flex-col items-center text-center gap-8 px-8">
                        <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                            About Us
                        </p>

                        {data.heroTitle && (
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-slate-900 max-w-4xl">
                                {data.heroTitle}
                            </h1>
                        )}

                        {data.heroDescription && (
                            <div
                                className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl"
                                dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* MISSION & VISION - Side by Side */}
            {(data.missionTitle || data.visionTitle) && (
                <section className="relative py-12">
                    <div className="w-full grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        {data.missionTitle && (
                            <div className="flex flex-col gap-6 p-10 border-2 border-slate-200 rounded-2xl hover:border-slate-300 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        {data.missionTitle}
                                    </h2>
                                </div>
                                <div
                                    className="text-slate-600 text-base leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.missionDesc }}
                                />
                            </div>
                        )}

                        {/* Vision */}
                        {data.visionTitle && (
                            <div className="flex flex-col gap-6 p-10 border-2 border-slate-200 rounded-2xl hover:border-slate-300 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-2xl">👁️</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                        {data.visionTitle}
                                    </h2>
                                </div>
                                <div
                                    className="text-slate-600 text-base leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.visionDesc }}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* STATS */}
            {data.stats && data.stats.length > 0 && (
                <section className="relative py-16 bg-slate-900 text-white rounded-3xl">
                    <div className="w-full px-8">
                        {data.statsDesc && (
                            <div className="max-w-3xl mx-auto text-center mb-12">
                                <div
                                    className="text-slate-300 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.statsDesc }}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {data.stats.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10"
                                >
                                    <h3 className="text-3xl lg:text-4xl font-bold text-sky-400">
                                        {item.number}
                                    </h3>
                                    <p className="text-slate-300 text-sm text-center">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* SERVICES */}
            {data.services && data.services.length > 0 && (
                <section className="relative py-12">
                    <div className="w-full flex flex-col gap-12">
                        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Our Services
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                {data.servicesTitle || "What We Do"}
                            </h2>
                            {data.servicesDesc && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 p-6 border border-slate-200 rounded-xl hover:shadow-lg hover:border-sky-300 transition-all duration-300"
                                >
                                    {service.icon && (
                                        <div className="text-sky-600 text-3xl">
                                            {service.icon}
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
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

export default AboutBasic3;
