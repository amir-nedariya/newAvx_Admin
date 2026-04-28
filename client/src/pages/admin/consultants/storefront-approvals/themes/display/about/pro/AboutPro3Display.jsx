import React from 'react';
import '../../../themeStyles.css';

// Helper function to extract image URL from images array
const getImageUrl = (section, index = 0) => {
    if (!section?.images || !Array.isArray(section.images) || section.images.length === 0) {
        return null;
    }
    const image = section.images[index];
    return image?.customUrl || image?.templateUrl || null;
};

function AboutPro3Display({ data }) {
    if (!data) return null;

    return (
        <>
            {/* HERO */}
            <section className="relative min-h-screen py-12 flex flex-col overflow-hidden">
                <img
                    src={getImageUrl(data.heroSection, 0)}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Hero"
                />
                <div className="absolute inset-0 bg-secondary/65" />
                <div className="absolute inset-0 bg-linear-to-b from-secondary/20 via-secondary/40 to-secondary" />

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 text-center px-2 lg:px-4 pt-16 pb-6">
                    <p className="text-sm tracking-[0.45em] uppercase text-third font-semibold font-[Montserrat]">
                        Hero
                    </p>
                    <h2 className="flex flex-col gap-2 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                        <span>{data.heroSection?.title}</span>
                    </h2>
                    <div
                        className="text-third/55 text-base sm:text-lg font-[Poppins] leading-relaxed max-w-6xl"
                        dangerouslySetInnerHTML={{ __html: data.heroSection?.description }}
                    />
                </div>
            </section>

            {/* MISSION / VISION */}
            <section className="relative py-8 overflow-hidden px-2 lg:px-4">
                <div className="container">
                    <div className="flex flex-col items-center gap-3 mb-12">
                        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
                            <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">
                                Mission / Vision
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                                Mission <span className="text-primary">& Vision</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                        <div className="mv-card relative rounded-2xl overflow-hidden shadow-2xl border border-third/10 py-14">
                            <img
                                src={getImageUrl(data.missionSection, 0)}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Mission"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-secondary/95 via-secondary/85 to-secondary/70" />

                            <div className="relative z-10 px-8 sm:px-12 lg:px-16 max-w-2xl flex flex-col gap-4">
                                <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">01</p>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary font-[Montserrat]">
                                    {data.missionSection?.title}
                                </h2>
                                <div
                                    className="text-third/70 font-[Poppins]"
                                    dangerouslySetInnerHTML={{ __html: data.missionSection?.description }}
                                />
                            </div>
                        </div>

                        <div className="mv-card relative rounded-2xl overflow-hidden shadow-2xl border border-third/10 py-14">
                            <img
                                src={getImageUrl(data.visionSection, 0)}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Vision"
                            />
                            <div className="absolute inset-0 bg-linear-to-l from-secondary/95 via-secondary/85 to-secondary/70" />

                            <div className="relative z-10 px-8 sm:px-12 lg:px-16 text-right ml-auto max-w-2xl flex flex-col gap-4 w-full">
                                <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">02</p>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary font-[Montserrat]">
                                    {data.visionSection?.title}
                                </h2>
                                <div
                                    className="text-third/70 font-[Poppins]"
                                    dangerouslySetInnerHTML={{ __html: data.visionSection?.description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="relative overflow-hidden px-2 lg:px-4">
                <div className="container">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
                        <div className="flex flex-col gap-6">
                            <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">
                                Stats
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary font-[Montserrat]">
                                Numbers that <br />
                                <span className="text-primary">speak for us</span>
                            </h2>
                            <div
                                className="text-third/70 font-[Poppins]"
                                dangerouslySetInnerHTML={{ __html: data.statsSection?.description }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {(data.statsSection?.stats || []).map((stat, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-2 border border-third/10 rounded-2xl p-6 lg:p-8 hover:border-third/20 hover:bg-third/3 shadow-2xl"
                                >
                                    <span className="text-xl lg:text-3xl text-primary font-[Montserrat]">{stat.number}</span>
                                    <span className="text-sm text-third/50 font-[Poppins]">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="relative px-2 lg:px-4">
                <div className="container">
                    <div className="mx-auto w-full">
                        <div className="mb-8 max-w-3xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold mb-8 font-[Montserrat]">
                                Our Services
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary font-[Montserrat]">
                                {data.servicesSection?.title}
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {(data.servicesSection?.services || []).map((item, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="group flex flex-col justify-between border border-third/10 rounded-2xl p-6 backdrop-blur-lg hover:border-third/30 transition"
                                    >
                                        <div>
                                            <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-third/10 mb-6">
                                                <span
                                                    className="w-5 h-5 text-third [&>svg]:w-full [&>svg]:h-full"
                                                    dangerouslySetInnerHTML={{ __html: item.icon }}
                                                />
                                            </div>
                                            <span className="text-third/40 text-sm mb-3 block font-[Montserrat]">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <h3 className="text-xl font-semibold text-primary font-[Montserrat] mb-2">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div
                                            className="text-third/60 text-sm font-[Poppins]"
                                            dangerouslySetInnerHTML={{ __html: item.desc }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutPro3Display;
