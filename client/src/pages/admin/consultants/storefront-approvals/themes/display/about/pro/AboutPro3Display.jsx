import React from 'react';
import '../../../themeStyles.css';

function AboutPro3Display({ data }) {
    if (!data) return null;

    return (
        <>
            {/* HERO */}
            <section className="relative min-h-screen py-12 flex flex-col overflow-hidden">
                <img
                    src={data.aboutHeroTemplate1?.imageUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Hero"
                />
                <div className="absolute inset-0 bg-[var(--color-secondary)]/65" />
                <div className="absolute inset-0 bg-linear-to-b from-[var(--color-secondary)]/20 via-[var(--color-secondary)]/40 to-[var(--color-secondary)]" />

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 text-center px-2 lg:px-4 pt-16 pb-6">
                    <p className="text-sm tracking-[0.45em] uppercase text-[var(--color-third)] font-semibold">
                        Hero
                    </p>
                    <h2 className="flex flex-col gap-2 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                        <span>{data.aboutHeroTitle}</span>
                    </h2>
                    <div
                        className="text-[var(--color-third)]/55 text-base sm:text-lg font-[Poppins] leading-relaxed max-w-6xl"
                        dangerouslySetInnerHTML={{ __html: data.aboutHeroDescription }}
                    />
                </div>
            </section>

            {/* MISSION / VISION */}
            <section className="relative py-8 overflow-hidden px-2 lg:px-4">
                <div className="container">
                    <div className="flex flex-col items-center gap-3 mb-12">
                        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
                            <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                Mission / Vision
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                                Mission <span className="text-[var(--color-primary)]">& Vision</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
                        <div className="mv-card relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-third)]/10 py-14">
                            <img
                                src={data.aboutMissionTemplate1?.imageUrl}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Mission"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-[var(--color-secondary)]/95 via-[var(--color-secondary)]/85 to-[var(--color-secondary)]/70" />

                            <div className="relative z-10 px-8 sm:px-12 lg:px-16 max-w-2xl flex flex-col gap-4">
                                <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">01</p>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                    {data.aboutMissionTitle}
                                </h2>
                                <div
                                    className="text-[var(--color-third)]/70"
                                    dangerouslySetInnerHTML={{ __html: data.aboutMissionDescription }}
                                />
                            </div>
                        </div>

                        <div className="mv-card relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-third)]/10 py-14">
                            <img
                                src={data.aboutVisionTemplate1?.imageUrl}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Vision"
                            />
                            <div className="absolute inset-0 bg-linear-to-l from-[var(--color-secondary)]/95 via-[var(--color-secondary)]/85 to-[var(--color-secondary)]/70" />

                            <div className="relative z-10 px-8 sm:px-12 lg:px-16 text-right ml-auto max-w-2xl flex flex-col gap-4 w-full">
                                <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">02</p>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                    {data.aboutVisionTitle}
                                </h2>
                                <div
                                    className="text-[var(--color-third)]/70"
                                    dangerouslySetInnerHTML={{ __html: data.aboutVisionDescription }}
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
                            <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                Stats
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                Numbers that <br />
                                <span className="text-[var(--color-primary)]">speak for us</span>
                            </h2>
                            <div
                                className="text-[var(--color-third)]/70"
                                dangerouslySetInnerHTML={{ __html: data.aboutStatsDescription }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {(data.stats || []).map((stat, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-2 border border-[var(--color-third)]/10 rounded-2xl p-6 lg:p-8 hover:border-[var(--color-third)]/20 hover:bg-[var(--color-third)]/3 shadow-2xl"
                                >
                                    <span className="text-xl lg:text-3xl text-[var(--color-primary)]">{stat.number}</span>
                                    <span className="text-sm text-[var(--color-third)]/50">{stat.label}</span>
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
                            <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold mb-8">
                                Our Services
                            </p>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                {data.aboutServicesTitle}
                            </h2>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {(data.services || []).map((item, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="group flex flex-col justify-between border border-[var(--color-third)]/10 rounded-2xl p-6 backdrop-blur-lg hover:border-[var(--color-third)]/30 transition"
                                    >
                                        <div>
                                            <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-[var(--color-third)]/10 mb-6">
                                                <span
                                                    className="w-5 h-5 text-[var(--color-third)] [&>svg]:w-full [&>svg]:h-full"
                                                    dangerouslySetInnerHTML={{ __html: item.icon }}
                                                />
                                            </div>
                                            <span className="text-[var(--color-third)]/40 text-sm mb-3 block">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <h3 className="text-xl font-semibold text-[var(--color-primary)] font-[Montserrat] mb-2">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div
                                            className="text-[var(--color-third)]/60 text-sm"
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
