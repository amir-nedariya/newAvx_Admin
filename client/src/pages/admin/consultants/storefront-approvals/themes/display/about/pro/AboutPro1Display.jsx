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

function AboutPro1Display({ data }) {
    if (!data) return null;

    return (
        <>
            {/* HERO */}
            <section className="relative w-full min-h-screen overflow-hidden flex px-4 lg:px-8 py-12">
                {/* BACKGROUND IMAGE */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${getImageUrl(data.heroSection, 0)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* LIGHT OVERLAY */}
                <div className="absolute inset-0 bg-black/40" />

                {/* CONTENT */}
                <div className="relative z-10 w-full flex items-center justify-center text-center flex-col gap-2 m-w-7xl">
                    <p className="mb-6 text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">
                        Hero
                    </p>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-primary font-[Montserrat] max-w-[1200px]">
                        {data.heroSection?.title}
                    </h2>

                    <div
                        className="mt-8 text-third/70 text-lg lg:text-xl font-[Poppins] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: data.heroSection?.description }}
                    />
                </div>
            </section>

            {/* MISSION / VISION */}
            <section className="relative py-12 px-2 lg:px-4">
                <div className="container">
                    <div className="flex flex-col gap-6 max-w-2xl text-center mx-auto mb-16">
                        <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">
                            Purpose
                        </p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary font-[Montserrat]">
                            Mission & <span className="text-fourth/80">Vision</span>
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* MISSION */}
                        <div className="relative min-h-80 rounded-2xl overflow-hidden border border-third/10 shadow-2xl">
                            <img
                                src={getImageUrl(data.missionSection, 0)}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Mission"
                            />

                            <div className="relative bg-secondary/70 flex flex-col justify-end p-6 gap-4 h-full">
                                <h2 className="text-3xl sm:text-4xl font-semibold text-primary font-[Montserrat]">
                                    {data.missionSection?.title}
                                </h2>

                                <div
                                    className="text-third/70 text-base md:text-lg font-[Poppins]"
                                    dangerouslySetInnerHTML={{ __html: data.missionSection?.description }}
                                />
                            </div>
                        </div>

                        {/* VISION */}
                        <div className="relative min-h-80 rounded-2xl overflow-hidden border border-third/10 shadow-2xl">
                            <img
                                src={getImageUrl(data.visionSection, 0)}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Vision"
                            />

                            <div className="relative bg-secondary/70 flex flex-col justify-end p-6 gap-4 h-full">
                                <h2 className="text-3xl sm:text-4xl font-semibold text-primary font-[Montserrat]">
                                    {data.visionSection?.title}
                                </h2>

                                <div
                                    className="text-third/70 text-base md:text-lg font-[Poppins]"
                                    dangerouslySetInnerHTML={{ __html: data.visionSection?.description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="relative py-12 px-2 lg:px-4 bg-primary text-secondary overflow-hidden">
                <div className="container">
                    <div className="absolute inset-0 flex justify-center pointer-events-none">
                        <div className="w-[600px] h-[600px] bg-fourth/10 blur-[140px] rounded-full"></div>
                    </div>

                    <div className="relative max-w-5xl mx-auto text-center">
                        <div className="flex flex-col gap-6 mb-20">
                            <p className="text-sm tracking-[0.4em] uppercase text-secondary/60 font-semibold font-[Montserrat]">
                                Impact
                            </p>

                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-[Montserrat]">
                                Our <span className="text-fourth/80">Numbers</span>
                            </h2>

                            <div
                                className="text-secondary/70 text-lg font-[Poppins]"
                                dangerouslySetInnerHTML={{ __html: data.statsSection?.description }}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 border border-secondary/10">
                            {(data.statsSection?.stats || []).map((item, index) => (
                                <div
                                    key={index}
                                    className="relative p-10 group border border-secondary/10 hover:bg-secondary/5 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 border border-fourth/30"></div>

                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-[Montserrat] mb-4">
                                        {item.number}
                                    </h3>

                                    <p className="text-secondary/60 text-sm md:text-base font-[Poppins]">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="relative py-12 px-2 lg:px-4">
                <div className="container">
                    <div className="flex flex-col gap-16">
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat]">
                                Services
                            </p>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary font-[Montserrat]">
                                {data.servicesSection?.title}
                            </h2>

                            <div
                                className="text-third/70 text-lg font-[Poppins] border-l-2 border-primary/30 pl-6"
                                dangerouslySetInnerHTML={{ __html: data.servicesSection?.description }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {(data.servicesSection?.services || []).map((service, index) => {
                                const colSpan = index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5";

                                return (
                                    <div
                                        key={index}
                                        className={`${colSpan} flex flex-col justify-between p-8 lg:p-12 border border-third/10 bg-primary/5 hover:bg-primary/10 transition-all duration-300 min-h-[300px]`}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {typeof service.icon === "string" && service.icon.startsWith("<svg") ? (
                                                <div
                                                    className="text-third [&>svg]:w-10 [&>svg]:h-10 transition-colors duration-300"
                                                    dangerouslySetInnerHTML={{ __html: service.icon }}
                                                />
                                            ) : (
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
                </div>
            </section>
        </>
    );
}

export default AboutPro1Display;
