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

const EyeBrow = ({ children }) => (
    <p className="text-sm tracking-[0.4em] uppercase text-third font-semibold font-[Montserrat] mb-4">
        {children}
    </p>
);

const Divider = () => <div className="w-8 h-px bg-primary/15 my-2" />;

function AboutPro2Display({ data }) {
    if (!data) return null;

    const missionVisionCards = [
        {
            tag: "01",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
            prefix: "Our",
            keyword: "Mission",
            title: data.missionSection?.title,
            desc: data.missionSection?.description,
            image: getImageUrl(data.missionSection, 0),
            flip: false,
        },
        {
            tag: "02",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
            prefix: "Our",
            keyword: "Vision",
            title: data.visionSection?.title,
            desc: data.visionSection?.description,
            image: getImageUrl(data.visionSection, 0),
            flip: true,
        },
    ];

    return (
        <>
            {/* HERO */}
            <section className="relative h-screen px-2 lg:px-4 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(data.heroSection, 0)}
                        alt="Our story"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container relative z-10 h-full flex flex-col justify-center">
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <div className="flex flex-col gap-5">
                            <EyeBrow>About Us</EyeBrow>
                            <h1
                                className="font-[Montserrat] font-bold text-white leading-[1.08]"
                                style={{ fontSize: "clamp(30px, 4vw, 60px)" }}
                            >
                                {data.heroSection?.title}
                            </h1>
                            <div className="w-10 h-0.5 bg-fourth/70" />
                        </div>

                        <div>
                            <div
                                className="font-[Poppins] text-[14px] text-white/80 leading-[1.9]"
                                dangerouslySetInnerHTML={{ __html: data.heroSection?.description }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="py-12 px-2 lg:px-4">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end mb-12">
                        <div>
                            <EyeBrow>What Drives Us</EyeBrow>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-primary font-[Montserrat]">
                                Mission & <span className="text-fourth/80">Vision</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {missionVisionCards.map((item) => {
                            return (
                                <div
                                    key={item.tag}
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-0 border border-third/10 rounded-2xl overflow-hidden
                    hover:border-primary/20 transition-colors duration-300 hover:shadow-[0_10px_40px_-10px_rgba(230,230,230,0.15)]
                    ${item.flip ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}
                                >
                                    <div className="relative overflow-hidden min-h-[260px]">
                                        <img
                                            src={item.image}
                                            alt={item.keyword}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-secondary/60 to-transparent" />
                                        <div className="absolute bottom-5 left-5 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl border border-fourth/50 bg-secondary/60 backdrop-blur-sm flex items-center justify-center">
                                                <span
                                                    className="text-fourth"
                                                    dangerouslySetInnerHTML={{ __html: item.icon }}
                                                />
                                            </div>
                                            <span className="font-[Montserrat] font-bold text-[10px] tracking-[0.28em] uppercase text-primary/60">
                                                {item.tag}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center gap-5 p-8 lg:p-10">
                                        <h3 className="text-2xl sm:text-3xl font-semibold font-[Montserrat] leading-[1.1]">
                                            <span className="text-primary">{item.title} </span>
                                        </h3>
                                        <div className="w-8 h-0.5 bg-fourth/50" />
                                        <p className="text-third/65 text-[14px] leading-[1.95] font-[Poppins]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="py-12">
                <div className="overflow-hidden bg-fourth">
                    <div className="container">
                        <div className="px-2 lg:px-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-primary/10">
                                <div className="flex flex-col justify-center gap-5 py-14 lg:border-r border-primary/10">
                                    <EyeBrow>By The Numbers</EyeBrow>
                                    <h2
                                        className="font-[Montserrat] font-bold text-primary leading-[1.08]"
                                        style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
                                    >
                                        Our Growth <span className="text-secondary">in Numbers</span>
                                    </h2>
                                    <div className="w-8 h-px bg-primary/30" />
                                </div>

                                <div className="flex flex-col justify-center px-2 lg:px-4 py-14">
                                    <div
                                        className="font-[Poppins] text-[13.5px] text-primary/65 leading-[1.9]"
                                        dangerouslySetInnerHTML={{ __html: data.statsSection?.description }}
                                    />
                                </div>
                            </div>

                            <div className="lg:px-4 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-primary/10">
                                {(data.statsSection?.stats || []).map((stat, i) => (
                                    <div
                                        key={i}
                                        className="group relative flex flex-col gap-2 px-10 py-9 transition-colors duration-300 overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/0 transition-all duration-300" />
                                        <span className="absolute top-6 right-7 font-[Montserrat] font-bold text-[9px] tracking-[0.3em] uppercase text-primary/30">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            className="font-[Montserrat] font-bold text-primary leading-none"
                                            style={{ fontSize: "clamp(30px, 3vw, 42px)" }}
                                        >
                                            {stat.number}
                                        </span>
                                        <span className="font-[Poppins] text-[11px] text-primary/55 uppercase tracking-widest font-medium">
                                            {stat.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="py-12 px-2 lg:px-4">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 mb-5">
                        <div className="flex flex-col gap-4 pb-10 lg:pr-16">
                            <EyeBrow>Services</EyeBrow>
                            <h2
                                className="font-[Montserrat] font-bold text-primary leading-[1.08]"
                                style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}
                            >
                                {data.servicesSection?.title}
                            </h2>
                        </div>
                        <div className="flex flex-col justify-center pb-10 lg:pl-16">
                            <p className="font-[Poppins] text-[13.5px] text-third/65 leading-[1.9]">
                                {data.servicesSection?.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
                        {(data.servicesSection?.services || []).map((svc, i) => {
                            return (
                                <div
                                    key={i}
                                    className="group relative flex flex-col gap-5 p-7 border border-third/10 rounded-2xl overflow-hidden
                 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(230,230,230,0.15)]"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-fourth transition-all duration-300" />

                                    <div className="flex items-center justify-between">
                                        <div className="w-[42px] h-[42px] rounded-xl border border-third/10 flex items-center justify-center group-hover:border-fourth/50 transition-colors duration-300">
                                            <span
                                                className="text-fourth"
                                                dangerouslySetInnerHTML={{ __html: svc.icon }}
                                            />
                                        </div>
                                        <span className="font-[Montserrat] font-bold text-[9px] tracking-[0.2em] text-fourth/40">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <h3 className="font-[Montserrat] font-semibold text-[15px] text-primary group-hover:text-fourth transition-colors duration-300">
                                        {svc.title}
                                    </h3>

                                    <p className="font-[Poppins] text-[13px] text-third/65 leading-[1.8]">
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

export default AboutPro2Display;
