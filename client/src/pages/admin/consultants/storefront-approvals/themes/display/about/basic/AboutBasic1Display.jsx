import React from "react";
import "../../../themeStyles.css";

const AboutBasic1Display = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            
            {/* HERO SECTION */}
            <section className="relative flex items-center justify-center py-12 min-h-screen">
                <div className="w-full mx-auto flex flex-col items-center text-center gap-10">
                    {/* Top Label */}
                    <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold">
                        Our Story
                    </p>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] text-primary font-[Montserrat] max-w-3xl">
                        {data.heroSection.title}
                    </h1>

                    {/* Description */}
                    <div className="flex flex-col gap-5 max-w-7xl">
                        <div
                            className="text-third/70 text-lg md:text-xl font-[Poppins] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.heroSection.description }}
                        />
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="relative py-12 px-2 lg:px-4 ">
                <div className=" w-full flex flex-col gap-16">
                    {/* ── MAIN HEADING ───────────────── */}
                    <div className="flex flex-col  gap-6 max-w-2xl text-center">
                        <p className=" text-sm tracking-[0.4em] uppercase text-third font-semibold">
                            Purpose
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                            Mission &<span className="text-primary"> Vision</span>
                        </h2>
                    </div>

                    {/* Mission Row */}
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start  pt-12">
                        <div className="w-full lg:w-1/3">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                                {data.missionSection.title}
                            </h2>
                        </div>
                        <div className="w-full lg:w-2/3">
                            <div
                                className="text-third/70 text-lg md:text-xl font-[Poppins] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: data.missionSection.description }}
                            />
                        </div>
                    </div>

                    {/* Vision Row */}
                    <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-20 items-start pt-12">
                        <div className="w-full lg:w-1/3">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                                {data.visionSection.title}
                            </h2>
                        </div>
                        <div className="w-full lg:w-2/3">
                            <div
                                className="text-third/70 text-lg md:text-xl font-[Poppins] leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: data.visionSection.description }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="relative py-12 px-2 lg:px-4   bg-primary text-secondary">
                <div className=" container  w-full flex flex-col items-center gap-16 text-center">
                    {/* ── HEADING ───────────────── */}
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <p className="text-sm tracking-[0.4em] uppercase text-secondary/60 font-semibold">
                            Impact
                        </p>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] font-[Montserrat]">
                            Our Stats
                        </h2>

                        <div
                            className="text-secondary/70 text-lg md:text-xl font-[Poppins] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: data.aboutUsSection.description }}
                        />
                    </div>

                    {/* ── STATS BOX LAYOUT ───────────────── */}
                    <div className="w-full max-w-5xl grid sm:grid-cols-2 gap-8">
                        {data.aboutUsSection.stats.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-4 border border-secondary/10 p-8 rounded-2xl"
                            >
                                <h3 className="text-4xl lg:text-5xl font-semibold font-[Montserrat]">
                                    {item.number}
                                </h3>

                                <p className="text-secondary/70 text-base font-[Poppins]">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="relative py-12 px-2 lg:px-4   ">
                <div className=" w-full flex flex-col gap-16">
                    {/* Header Section: Vertical Stack */}
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold">
                            Services
                        </p>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                            What <span className="text-primary">We Do</span>
                        </h2>
                        <div
                            className="text-third/70 text-lg md:text-xl font-[Poppins] leading-relaxed border-l-2 border-primary/30 pl-6"
                            dangerouslySetInnerHTML={{ __html: data.servicesSection.description }}
                        />
                    </div>

                    {/* Services Layout: Asymmetrical Masonry Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {data.servicesSection.services.map((service, index) => {
                            // Logic to make boxes asymmetrical: 1st and 4th are wider, 2nd and 3rd are narrower
                            const colSpan =
                                index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5";

                            return (
                                <div
                                    key={index}
                                    className={`${colSpan} flex flex-col justify-between p-8 lg:p-12 border border-third/10 bg-primary/5 hover:bg-primary/10     transition-all duration-300 min-h-[300px]`}
                                >
                                    <div className="flex flex-col gap-6">
                                        {typeof service.icon === "string" &&
                                            service.icon.startsWith("<svg") ? (
                                            <div
                                                className="text-third [&>svg]:w-10 [&>svg]:h-10 transition-colors duration-300"
                                                dangerouslySetInnerHTML={{ __html: service.icon }}
                                            />
                                        ) : (
                                            // Fallback for older configurations where string icon values were used
                                            <div className="w-10 h-10 bg-third/20 rounded flex items-center justify-center text-xs text-third">
                                                Icon
                                            </div>
                                        )}
                                        <h3 className="text-2xl md:text-3xl font-semibold text-primary font-[Montserrat]">
                                            {service.title}
                                        </h3>
                                    </div>

                                    <p className="text-third/60 text-md md:text-lg font-[Poppins] max-w-xs">
                                        {service.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutBasic1Display;
