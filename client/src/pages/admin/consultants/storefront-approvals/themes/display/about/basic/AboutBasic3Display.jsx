import React from 'react';
import '../../../themeStyles.css';

function AboutBasic3Display({ data }) {
    if (!data) return null;

    return (
        <>
            <section className="relative flex flex-col justify-center min-h-screen items-center py-12">
                <div className="mx-auto w-full flex flex-col gap-14">
                    <div className="flex flex-col items-center text-center gap-10 max-w-3xl mx-auto">
                        <p className="text-sm tracking-[0.45em] uppercase text-[var(--color-third)] font-semibold">
                            Hero
                        </p>
                        <h2 className="flex flex-col gap-2 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                            {data.heroTitle}
                        </h2>
                        <div
                            className="text-[var(--color-third)]/55 text-base sm:text-lg font-[Poppins] leading-relaxed max-w-xl"
                            dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                        />
                    </div>
                </div>
            </section>

            <section className="relative flex flex-col items-center py-12">
                <div className="mx-auto w-full flex flex-col gap-16">
                    <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
                        <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                            Mission / Vision
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                            Direction We<span className="text-[var(--color-primary)]"> Move</span>
                        </h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto flex flex-col gap-16">
                        <div className="hidden lg:block absolute left-1/2 top-0 w-px h-full bg-[var(--color-third)]/20 -translate-x-1/2" />

                        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center">
                            <div className="lg:col-start-1 flex flex-col gap-4 pr-0 lg:pr-10 text-left lg:text-right">
                                <p className="text-xs tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                    Mission
                                </p>
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                    {data.missionTitle}
                                </h3>
                                <div
                                    className="text-[var(--color-third)]/70 text-sm sm:text-base font-[Poppins] leading-relaxed max-w-md"
                                    dangerouslySetInnerHTML={{ __html: data.missionDesc }}
                                />
                            </div>
                            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
                                <div className="w-3 h-3 rounded-full bg-[var(--color-third)]" />
                            </div>
                        </div>

                        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center">
                            <div className="hidden lg:block" />
                            <div className="lg:col-start-2 flex flex-col gap-4 pl-0 lg:pl-10 text-left">
                                <p className="text-xs tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                                    Vision
                                </p>
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                    {data.visionTitle}
                                </h3>
                                <div
                                    className="text-[var(--color-third)]/70 text-sm sm:text-base font-[Poppins] leading-relaxed max-w-md"
                                    dangerouslySetInnerHTML={{ __html: data.visionDesc }}
                                />
                            </div>
                            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
                                <div className="w-3 h-3 rounded-full bg-[var(--color-third)]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative flex flex-col justify-center items-center py-12">
                <div className="relative z-10 mx-auto w-full flex flex-col gap-16">
                    <div className="flex flex-col gap-6">
                        <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                            Stats
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                            Numbers that<span className="text-[var(--color-primary)]"> speak for us</span>
                        </h2>
                        <div
                            className="text-[var(--color-third)]/70 text-md font-[Poppins] leading-relaxed max-w-md"
                            dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
                        />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
                        {data.stats.map((item, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                    {item.number}
                                </h3>
                                <p className="text-[var(--color-third)]/60 text-sm sm:text-base font-[Poppins]">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative flex flex-col justify-center items-center py-12">
                <div className="mx-auto w-full max-w-6xl grid lg:grid-cols-2 gap-16">
                    <div className="flex flex-col gap-6 max-w-xl">
                        <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold">
                            Our Services
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                            {data.servicesTitle}
                        </h2>
                        <div
                            className="text-[var(--color-third)]/70 text-md font-[Poppins] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
                        />
                    </div>

                    <div className="flex flex-col gap-12">
                        {data.services.map((service, i) => (
                            <div
                                key={i}
                                className={`flex items-start gap-5 ${i % 2 !== 0 ? "lg:ml-10" : ""}`}
                            >
                                <div className="w-12 h-12 flex items-center justify-center border border-[var(--color-third)]/10 rounded-xl">
                                    {typeof service.icon === "string" && service.icon.startsWith("<svg") ? (
                                        <div
                                            className="text-[var(--color-third)] [&>svg]:w-5 [&>svg]:h-5"
                                            dangerouslySetInnerHTML={{ __html: service.icon }}
                                        />
                                    ) : (
                                        <div className="w-5 h-5 text-[var(--color-third)]">Icon</div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 max-w-sm">
                                    <h3 className="text-xl font-semibold text-[var(--color-primary)] font-[Montserrat]">
                                        {service.title}
                                    </h3>
                                    <p className="text-[var(--color-third)]/60 text-sm font-[Poppins] leading-relaxed">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutBasic3Display;
