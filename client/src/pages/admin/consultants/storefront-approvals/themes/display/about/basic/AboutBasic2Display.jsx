import React from 'react';
import '../../../themeStyles.css';

const EyeBrow = ({ children }) => (
    <p className="text-sm tracking-[0.4em] uppercase text-[var(--color-third)] font-semibold font-[Montserrat] mb-4">
        {children}
    </p>
);

const Divider = () => <div className="w-8 h-px bg-[var(--color-primary)]/15 my-2" />;

function AboutBasic2Display({ data }) {
    if (!data) return null;

    return (
        <>
            <section className="relative flex items-center justify-center min-h-screen py-14 lg:py-24">
                <div className="px-5 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
                    <div>
                        <EyeBrow>About Us</EyeBrow>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] text-[var(--color-primary)] font-[Montserrat]">
                            {data.heroTitle}
                        </h1>
                    </div>

                    <div className="w-10 h-px bg-[var(--color-primary)]/15" />

                    <div
                        className="text-[var(--color-third)]/70 text-[15px] leading-[1.9] font-[Poppins]"
                        dangerouslySetInnerHTML={{ __html: data.heroDescription }}
                    />
                </div>
            </section>

            <section className="py-14 lg:py-20">
                <div className="px-2 lg:px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-12">
                        <div>
                            <EyeBrow>What Drives Us</EyeBrow>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                                Mission & <span className="text-[var(--color-primary)]">Vision</span>
                            </h2>
                        </div>

                        <div>
                            <Divider />
                            <p className="text-[var(--color-third)]/70 text-[15px] leading-[1.9] font-[Poppins]">
                                The principles behind everything we build and every decision we make.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="group flex flex-col gap-5 p-8 border border-[var(--color-third)]/10 rounded-2xl hover:border-[var(--color-primary)]/25 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(230,230,230,0.15)]">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-semibold font-[Montserrat]">
                                    <span className="text-[var(--color-primary)]">{data.missionTitle}</span>
                                </h3>
                                <span className="text-[11px] tracking-[0.25em] text-[var(--color-fourth)]/60 font-[Montserrat] font-bold mt-1 shrink-0">
                                    01
                                </span>
                            </div>
                            <div className="w-8 h-0.5 bg-[var(--color-fourth)]/50" />
                            <div
                                className="text-[var(--color-third)]/65 text-[13.5px] leading-[1.9] font-[Poppins]"
                                dangerouslySetInnerHTML={{ __html: data.missionDesc }}
                            />
                        </div>

                        <div className="group flex flex-col gap-5 p-8 border border-[var(--color-third)]/10 rounded-2xl hover:border-[var(--color-primary)]/25 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(230,230,230,0.15)]">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-semibold font-[Montserrat]">
                                    <span className="text-[var(--color-primary)]">{data.visionTitle}</span>
                                </h3>
                                <span className="text-[11px] tracking-[0.25em] text-[var(--color-fourth)]/60 font-[Montserrat] font-bold mt-1 shrink-0">
                                    02
                                </span>
                            </div>
                            <div className="w-8 h-0.5 bg-[var(--color-fourth)]/50" />
                            <div
                                className="text-[var(--color-third)]/65 text-[13.5px] leading-[1.9] font-[Poppins]"
                                dangerouslySetInnerHTML={{ __html: data.visionDesc }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 lg:py-16 bg-[var(--color-fourth)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center px-10">
                    <div>
                        <EyeBrow>By The Numbers</EyeBrow>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat] mb-4">
                            Our Growth <span className="text-[var(--color-primary)]">in Numbers</span>
                        </h2>
                        <Divider />
                        <div
                            className="text-[var(--color-primary)]/80 text-[15px] leading-[1.9] font-[Poppins]"
                            dangerouslySetInnerHTML={{ __html: data.aboutUsDescription }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {(data.stats || []).map((stat, i) => (
                            <div
                                key={i}
                                className="group flex flex-col gap-2 p-6 border border-[var(--color-primary)]/20 rounded-2xl hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 transition-all duration-300"
                            >
                                <span className="text-3xl font-bold text-[var(--color-primary)] font-[Montserrat]">
                                    {stat.number}
                                </span>
                                <span className="text-[12px] text-[var(--color-primary)]/70 font-[Poppins] leading-normal">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-14 lg:py-20">
                <div className="px-2 lg:px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-12">
                        <div>
                            <EyeBrow>Services</EyeBrow>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-[var(--color-primary)] font-[Montserrat]">
                                {data.servicesTitle}
                            </h2>
                        </div>

                        <div>
                            <Divider />
                            <div
                                className="text-[var(--color-third)]/70 text-[15px] leading-[1.9] font-[Poppins]"
                                dangerouslySetInnerHTML={{ __html: data.servicesDesc }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(data.services || []).map((svc, i) => {
                            return (
                                <div
                                    key={i}
                                    className="group flex flex-col gap-5 p-7 border border-[var(--color-third)]/10 rounded-2xl hover:border-[var(--color-primary)]/25 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(230,230,230,0.15)]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl border border-[var(--color-third)]/10 flex items-center justify-center group-hover:border-[var(--color-fourth)]/40 transition-colors duration-300">
                                            {typeof svc.icon === 'string' && svc.icon.startsWith('<svg') ? (
                                                <div
                                                    className="text-[var(--color-fourth)] [&>svg]:w-5 [&>svg]:h-5"
                                                    dangerouslySetInnerHTML={{ __html: svc.icon }}
                                                />
                                            ) : (
                                                <div className="w-5 h-5 bg-[var(--color-third)]/20 rounded flex items-center justify-center text-xs text-[var(--color-fourth)]">
                                                    Icon
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-[Montserrat] font-bold text-[10px] tracking-[0.2em] text-[var(--color-fourth)]/50">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <h3 className="text-[15px] font-semibold text-[var(--color-primary)] font-[Montserrat] group-hover:text-[var(--color-fourth)] transition-colors duration-300">
                                        {svc.title}
                                    </h3>
                                    <p className="text-[var(--color-third)]/65 text-[13px] leading-[1.8] font-[Poppins]">
                                        {svc.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

export default AboutBasic2Display;
