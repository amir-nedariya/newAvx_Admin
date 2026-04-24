import React from "react";
import "../../themeStyles.css";
import { CheckCircle2, Star, Search, MessageCircle, ShieldCheck, Handshake } from "lucide-react";

const ICON_MAP = {
    Search,
    MessageCircle,
    ShieldCheck,
    Handshake,
};

const WhyBuyBasic2 = ({ data }) => {
    if (!data) return null;

    return (
        <div className="space-y-16">
            {/* HERO */}
            {(data.whyBuyHeroTitle || data.whyBuyHeroDescription) && (
                <section className="relative w-full py-16 bg-gradient-to-br from-sky-50 to-white rounded-3xl">
                    <div className="container px-8">
                        <p className="mb-6 text-sm tracking-[0.4em] uppercase text-sky-600 font-bold">
                            Why Choose Us
                        </p>

                        {data.whyBuyHeroTitle && (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] text-slate-900 mb-6 max-w-3xl">
                                {data.whyBuyHeroTitle}
                            </h2>
                        )}

                        {data.whyBuyHeroDescription && (
                            <div
                                className="max-w-2xl text-lg leading-relaxed text-slate-600"
                                dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* STORY */}
            {(data.storyTitle || data.storyDescription) && (
                <section className="w-full py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Our Journey
                            </p>

                            {data.storyTitle && (
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                    {data.storyTitle}
                                </h2>
                            )}

                            {data.storyDescription && (
                                <div
                                    className="text-slate-600 leading-relaxed whitespace-pre-line"
                                    dangerouslySetInnerHTML={{ __html: data.storyDescription }}
                                />
                            )}
                        </div>

                        <div className="h-96 bg-slate-200 rounded-2xl flex items-center justify-center">
                            <span className="text-slate-400 text-sm">Story Image Placeholder</span>
                        </div>
                    </div>
                </section>
            )}

            {/* VEHICLE SELECTION */}
            {(data.vehicleSelectionTitle || data.vehicleSelectionDescription) && (
                <section className="w-full py-12 bg-slate-50 rounded-2xl p-8">
                    <div className="max-w-3xl mx-auto text-center flex flex-col gap-6">
                        <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                            Quality Assurance
                        </p>

                        {data.vehicleSelectionTitle && (
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                {data.vehicleSelectionTitle}
                            </h2>
                        )}

                        {data.vehicleSelectionDescription && (
                            <p className="text-slate-600 text-lg leading-relaxed">
                                {data.vehicleSelectionDescription}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* PROCESS STEPS */}
            {data.processSteps && data.processSteps.length > 0 && (
                <section className="w-full py-12">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-4 max-w-2xl">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Simple Process
                            </p>

                            {data.processTitle && (
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                    {data.processTitle}
                                </h2>
                            )}

                            {data.processDescription && (
                                <div
                                    className="text-slate-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: data.processDescription }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.processSteps.map((step, i) => {
                                const Icon = ICON_MAP[step.icon];
                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-4 p-6 border-2 border-slate-200 rounded-xl hover:border-sky-400 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center bg-sky-100 rounded-full">
                                                {Icon ? (
                                                    <Icon className="text-sky-600" size={20} />
                                                ) : (
                                                    <span className="text-sky-600 font-bold">{i + 1}</span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900">
                                            {step.title}
                                        </h3>

                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {step.description}
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
                <section className="w-full py-12 bg-emerald-50 rounded-2xl p-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-6">
                            <p className="text-sm tracking-[0.4em] uppercase text-emerald-700 font-semibold">
                                Quality Check
                            </p>

                            {data.inspectionTitle && (
                                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                    {data.inspectionTitle}
                                </h2>
                            )}

                            {data.inspectionText && (
                                <p className="text-slate-600 leading-relaxed">
                                    {data.inspectionText}
                                </p>
                            )}
                        </div>

                        {data.inspectionPoints && (
                            <div className="flex flex-col gap-3">
                                {data.inspectionPoints.map((pt, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-4 bg-white rounded-lg"
                                    >
                                        <CheckCircle2 className="text-emerald-600" size={20} />
                                        <p className="text-slate-700 font-medium">{pt}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* CUSTOMER COMMITMENT */}
            {(data.customerCommitmentTitle || data.customerCommitmentDescription) && (
                <section className="w-full py-16 text-center">
                    <div className="max-w-3xl mx-auto flex flex-col gap-6">
                        <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                            Our Promise
                        </p>

                        {data.customerCommitmentTitle && (
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                {data.customerCommitmentTitle}
                            </h2>
                        )}

                        <div className="w-16 h-1 bg-sky-500 mx-auto rounded-full" />

                        {data.customerCommitmentDescription && (
                            <div
                                className="text-slate-600 text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: data.customerCommitmentDescription }}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* TESTIMONIALS */}
            {data.testimonials && data.testimonials.length > 0 && (
                <section className="w-full py-12">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
                            <p className="text-sm tracking-[0.4em] uppercase text-slate-500 font-semibold">
                                Customer Reviews
                            </p>

                            {data.testimonialTitle && (
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                                    {data.testimonialTitle}
                                </h2>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.testimonials.map((review, i) => (
                                <div
                                    key={i}
                                    className="p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star
                                                key={idx}
                                                size={16}
                                                className="text-amber-400 fill-amber-400"
                                            />
                                        ))}
                                    </div>

                                    <p className="text-slate-600 leading-relaxed mb-6">
                                        "{review.review}"
                                    </p>

                                    <h4 className="text-slate-900 font-bold">
                                        — {review.name}
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

export default WhyBuyBasic2;
