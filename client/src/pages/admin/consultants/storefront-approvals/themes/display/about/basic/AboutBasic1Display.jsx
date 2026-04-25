import React from "react";
import "../../../themeStyles.css";

const AboutBasic1Display = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            {/* HERO SECTION */}
            {(data.heroTitle || data.heroDescription) && (
                <section className="relative flex items-center justify-center py-12">
                    <div className="w-full mx-auto flex flex-col items-center text-center gap-10">
                        <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                            Our Story
                        </p>

                        {data.heroTitle && (
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] text-[var(--color-secondary)] max-w-3xl">
                                {data.heroTitle}
                            </h1>
                        )}

                        {data.heroDescription && (
                            <div
                                className="text-[var(--color-third)] text-lg md:text-xl leading-relaxed max-w-4xl"
                                dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* MISSION & VISION */}
            {(data.missionTitle || data.visionTitle) && (
                <section className="relative py-12">
                    <div className="w-full flex flex-col gap-16">
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                Purpose
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-secondary)]">
                                Mission & <span className="text-[var(--color-fourth)]">Vision</span>
                            </h2>
                        </div>

                        {/* Mission */}
                        {data.missionTitle && (
                            <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start pt-12">
                                <div className="w-full lg:w-1/3">
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-secondary)]">
                                        {data.missionTitle}
                                    </h2>
                                </div>
                                <div className="w-full lg:w-2/3">
                                    <div
                                        className="text-[var(--color-third)] text-lg md:text-xl leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: data.missionDesc || data.missionDescription }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Vision */}
                        {data.visionTitle && (
                            <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-20 items-start pt-12">
                                <div className="w-full lg:w-1/3">
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-secondary)]">
                                        {data.visionTitle}
                                    </h2>
                                </div>
                                <div className="w-full lg:w-2/3">
                                    <div
                                        className="text-[var(--color-third)] text-lg md:text-xl leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: data.visionDesc || data.visionDescription }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* STATS */}
            {data.stats && data.stats.length > 0 && (
                <section className="relative py-12 bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-3xl">
                    <div className="container w-full flex flex-col items-center gap-16 text-center px-8">
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                Impact
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05]">
                                Our <span className="text-[var(--color-fourth)]">Numbers</span>
                            </h2>
                            {data.aboutUsDescription && (
                                <div
                                    className="text-[var(--color-third)] text-lg md:text-xl leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
                                />
                            )}
                        </div>

                        <div className="w-full max-w-5xl grid sm:grid-cols-2 gap-8">
                            {data.stats.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 border border-white/10 p-8 rounded-2xl"
                                >
                                    <h3 className="text-4xl lg:text-5xl font-semibold">
                                        {item.number}
                                    </h3>
                                    <p className="text-[var(--color-third)] text-base">{item.label}</p>
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
                            <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                Services
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-secondary)]">
                                What <span className="text-[var(--color-fourth)]">We Do</span>
                            </h2>
                            {(data.serviceDescription || data.servicesDesc) && (
                                <div
                                    className="text-[var(--color-third)] text-lg md:text-xl leading-relaxed border-l-2 border-[var(--color-third)] pl-6"
                                    dangerouslySetInnerHTML={{ __html: data.serviceDescription || data.servicesDesc }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.services.map((service, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col justify-between p-8 lg:p-12 border border-[var(--color-third)] bg-[var(--color-primary)] hover:shadow-lg transition-all duration-300 rounded-2xl min-h-[300px]"
                                >
                                    <div className="flex flex-col gap-6">
                                        {service.icon && (
                                            <div
                                                className="text-[var(--color-third)] [&>svg]:w-10 [&>svg]:h-10"
                                                dangerouslySetInnerHTML={{ __html: service.icon }}
                                            />
                                        )}
                                        <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-secondary)]">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <p className="text-[var(--color-third)] text-md md:text-lg max-w-xs">
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

export default AboutBasic1Display;
