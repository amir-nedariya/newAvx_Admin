import React from "react";

const AboutPro1 = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            {/* HERO SECTION WITH IMAGE */}
            {(data.heroTitle || data.heroDescription) && (
                <section className="relative py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Our Story
                            </p>

                            {data.heroTitle && (
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-slate-900">
                                    {data.heroTitle}
                                </h1>
                            )}

                            {data.heroDescription && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                                />
                            )}
                        </div>

                        {data.heroTemplate1?.imageUrl && (
                            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={data.heroTemplate1.imageUrl}
                                    alt="Hero"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* MISSION WITH IMAGE */}
            {data.missionTitle && (
                <section className="relative py-12 bg-slate-50 rounded-3xl p-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {data.missionTemplate1?.imageUrl && (
                            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
                                <img
                                    src={data.missionTemplate1.imageUrl}
                                    alt="Mission"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-6 order-1 md:order-2">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Purpose
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                {data.missionTitle}
                            </h2>

                            {data.missionDesc && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.missionDesc }}
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* VISION WITH IMAGE */}
            {data.visionTitle && (
                <section className="relative py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Future
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                {data.visionTitle}
                            </h2>

                            {data.visionDesc && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.visionDesc }}
                                />
                            )}
                        </div>

                        {data.visionTemplate1?.imageUrl && (
                            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={data.visionTemplate1.imageUrl}
                                    alt="Vision"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* STATS */}
            {data.stats && data.stats.length > 0 && (
                <section className="relative py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl">
                    <div className="w-full px-8 flex flex-col gap-12">
                        <div className="max-w-2xl mx-auto text-center">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-400 font-semibold mb-4">
                                Impact
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                Our <span className="text-sky-400">Numbers</span>
                            </h2>
                            {data.aboutUsDescription && (
                                <div
                                    className="text-slate-300 text-lg"
                                    dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {data.stats.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    <h3 className="text-4xl lg:text-5xl font-bold text-sky-400">
                                        {typeof item.number === 'number' ? `${item.number}+` : item.number}
                                    </h3>
                                    <p className="text-slate-300 text-sm text-center leading-snug">
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
                <section className="relative py-12">
                    <div className="w-full flex flex-col gap-12">
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Services
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                {data.servicesTitle || "What We Do"}
                            </h2>
                            {data.servicesDesc && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed border-l-4 border-sky-500 pl-6"
                                    dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.services.map((service, index) => (
                                <div
                                    key={index}
                                    className="group flex flex-col gap-6 p-10 border-2 border-slate-200 rounded-2xl hover:border-sky-400 hover:shadow-xl transition-all duration-300"
                                >
                                    {service.icon && (
                                        <div
                                            className="text-slate-600 group-hover:text-sky-600 transition-colors [&>svg]:w-10 [&>svg]:h-10"
                                            dangerouslySetInnerHTML={{ __html: service.icon }}
                                        />
                                    )}
                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 text-base leading-relaxed">
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

export default AboutPro1;
