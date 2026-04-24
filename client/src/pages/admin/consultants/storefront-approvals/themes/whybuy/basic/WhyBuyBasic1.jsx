import React from "react";
import "../../themeStyles.css";
import { CheckCircle2, Star, Search, MessageCircle, ShieldCheck, Handshake } from "lucide-react";

const ICON_MAP = {
    Search,
    MessageCircle,
    ShieldCheck,
    Handshake,
};

const WhyBuyBasic1 = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            {/* HERO */}
            {(data.whyBuyHeroTitle || data.whyBuyHeroDescription) && (
                <section className="relative container w-full overflow-hidden flex items-center min-h-fit py-12">
                    <div className="container relative">
                        <p className="mb-4 text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                            Trusted Auto Consultants
                        </p>

                        {data.whyBuyHeroTitle && (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-slate-900 mb-6">
                                {data.whyBuyHeroTitle}
                            </h2>
                        )}

                        {data.whyBuyHeroDescription && (
                            <div
                                className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
                                dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* STORY */}
            {(data.storyTitle || data.storyDescription) && (
                <section className="w-full py-12 bg-slate-900 text-white rounded-3xl">
                    <div className="w-full max-w-[1480px] mx-auto px-8 flex flex-col gap-6">
                        <p className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase text-slate-400 font-semibold">
                            Consultant Story
                        </p>

                        {data.storyTitle && (
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1]">
                                Our <span className="text-sky-400">{data.storyTitle}</span>
                            </h2>
                        )}

                        {data.storyDescription && (
                            <div
                                className="text-slate-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: data.storyDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* VEHICLE SELECTION */}
            {(data.vehicleSelectionTitle || data.vehicleSelectionDescription) && (
                <section className="container w-full py-12">
                    <div className="max-w-7xl flex flex-col gap-8">
                        <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                            Our Standards
                        </p>

                        {data.vehicleSelectionTitle && (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-slate-900">
                                {data.vehicleSelectionTitle}
                            </h2>
                        )}

                        {data.vehicleSelectionDescription && (
                            <div className="flex flex-col gap-4 border-l-2 border-slate-300 pl-5">
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {data.vehicleSelectionDescription}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* PROCESS STEPS */}
            {data.processes && data.processes.length > 0 && (
                <section className="container w-full py-12">
                    <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
                        <div className="flex flex-col gap-3 sm:gap-4 max-w-xl md:max-w-2xl">
                            <p className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Simple Process
                            </p>

                            {data.processTitle && (
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.1] text-slate-900">
                                    {data.processTitle} <span className="text-sky-600">Works</span>
                                </h2>
                            )}

                            {data.processDescription && (
                                <div
                                    className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.processDescription }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {data.processes.map((step, i) => {
                                const Icon = ICON_MAP[step.icon];
                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-3 md:gap-4 p-5 sm:p-6 md:p-6 lg:p-8 border border-slate-200 rounded-xl md:rounded-2xl hover:border-slate-300 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 items-center justify-center border border-slate-200 rounded-lg">
                                                {typeof step.icon === "string" && step.icon.startsWith("<svg") ? (
                                                    <div
                                                        className="text-slate-900 [&>svg]:w-5 [&>svg]:h-5"
                                                        dangerouslySetInnerHTML={{ __html: step.icon }}
                                                    />
                                                ) : Icon ? (
                                                    <Icon className="text-slate-900" size={18} />
                                                ) : null}
                                            </div>
                                        </div>

                                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed">
                                            {step.desc || step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* INSPECTION */}
            {(data.inspectionTitle || data.inspectionPoints) && (
                <section className="container w-full py-12">
                    <div className="max-w-7xl grid md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-4">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Independent Verification
                            </p>

                            {data.inspectionTitle && (
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-slate-900">
                                    {data.inspectionTitle}
                                </h2>
                            )}

                            {data.inspectionDescription && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.inspectionDescription }}
                                />
                            )}
                        </div>

                        {data.inspectionPoints && (
                            <div className="flex flex-col gap-4">
                                {data.inspectionPoints.map((pt, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-5 border border-slate-200 rounded-lg"
                                    >
                                        <CheckCircle2 className="text-slate-900 mt-1" size={16} />
                                        <p className="text-slate-600 leading-relaxed">{pt}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* CUSTOMER COMMITMENT */}
            {(data.customerCommitmentTitle || data.customerCommitmentDescription) && (
                <section className="container w-full py-12">
                    <div className="max-w-7xl flex justify-center">
                        <div className="max-w-2xl text-center flex flex-col gap-6">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Our Promise
                            </p>

                            {data.customerCommitmentTitle && (
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-slate-900">
                                    {data.customerCommitmentTitle}
                                </h2>
                            )}

                            <div className="w-12 h-px bg-slate-300 mx-auto" />

                            {data.customerCommitmentDescription && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.customerCommitmentDescription }}
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* TESTIMONIALS */}
            {data.testimonials && data.testimonials.length > 0 && (
                <section className="w-full py-12 bg-slate-900 rounded-3xl">
                    <div className="container max-w-7xl mx-auto px-8 flex flex-col gap-12">
                        <div className="flex flex-col gap-4 max-w-2xl">
                            <p className="text-sm tracking-[0.35em] uppercase text-slate-400 font-semibold">
                                Real Buyers
                            </p>

                            {data.testimonialTitle && (
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] text-white">
                                    {data.testimonialTitle}
                                </h2>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.testimonials.map((review, i) => (
                                <div
                                    key={i}
                                    className="p-6 md:p-7 rounded-xl border border-white/15 bg-slate-800 flex flex-col gap-4"
                                >
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star
                                                key={idx}
                                                size={15}
                                                className={
                                                    idx < (review.rating || 5)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-slate-600"
                                                }
                                            />
                                        ))}
                                    </div>

                                    {review.reviewTitle && (
                                        <h4 className="text-white font-semibold text-sm">
                                            {review.reviewTitle}
                                        </h4>
                                    )}

                                    <p className="text-slate-300 leading-relaxed text-[15px]">
                                        {review.review || review.reviewText}
                                    </p>

                                    <h4 className="text-white font-semibold text-sm tracking-wide">
                                        — {review.name || review.reviewerName}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default WhyBuyBasic1;
