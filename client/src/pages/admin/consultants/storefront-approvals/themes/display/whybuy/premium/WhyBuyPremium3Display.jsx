import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const WhyBuyPremium3Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [processIndex, setProcessIndex] = useState(0);
  const [inspectionIndex, setInspectionIndex] = useState(0);
  const [commitmentIndex, setCommitmentIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const inspectionPoints = data.inspectionPoints || [];
  const reviews = data.featuredReviews || [];

  /* AUTO SLIDE */
  useEffect(() => {
    const interval = setInterval(() => {
      setInspectionIndex((p) => (p + 1) % inspectionPoints.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [inspectionPoints.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCommitmentIndex((p) => (p + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ================= HERO ================= */
  return (
    <>
      <section className="relative h-screen">
        {(data.customWhyBuyHero1 || data.whyBuyHeroTemplate1?.imageUrl)?.includes(".mp4") ? (
          <video
            src={data.customWhyBuyHero1 || data.whyBuyHeroTemplate1?.imageUrl}
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={data.customWhyBuyHero1 || data.whyBuyHeroTemplate1?.imageUrl}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl text-white mb-6">
            {data.whyBuyHeroTitle}
          </h1>
          <div
            className="text-white/80 max-w-2xl"
            dangerouslySetInnerHTML={{
              __html: data.whyBuyHeroDescription,
            }}
          />
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl mb-4">{data.storyTitle}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: data.storyDescription }}
            />
          </div>

          <div className="relative h-[450px]">
            <img
              src={data.customStory1 || data.storyTemplate1?.imageUrl}
              className="absolute w-3/4 h-full object-cover rounded-xl"
            />
            <img
              src={data.customStory2 || data.storyTemplate2?.imageUrl}
              className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= VEHICLE APPROACH ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            {[
              data.customVehicleSelection1 || data.vehicleSelectionTemplate1?.imageUrl,
              data.customVehicleSelection2 || data.vehicleSelectionTemplate2?.imageUrl,
            ]
              .filter(Boolean)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className={`absolute inset-0 w-full h-full object-cover transition ${activeIndex === i ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}

            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl mb-2">
                {data.vehicleSelectionTitle}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.vehicleSelectionDescription,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-10">{data.processTitle}</h2>

          <div className="relative h-[350px] overflow-hidden rounded-xl">
            {(data.processSteps || []).map((step, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition ${processIndex === i ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={
                    data[`customWhyBuyProcess${i + 1}`] ||
                    data[`processTemplate${i + 1}`]?.imageUrl
                  }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 p-6 text-white">
                  <h3 className="text-2xl">{step.title}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: step.description,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button onClick={() => setProcessIndex((p) => Math.max(p - 1, 0))}>
              Prev
            </button>
            <button
              onClick={() =>
                setProcessIndex((p) =>
                  Math.min(p + 1, (data.processSteps || []).length - 1)
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* ================= INSPECTION ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl mb-4">{data.inspectionTitle}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: data.inspectionText }}
            />

            <div className="mt-6 space-y-3">
              {inspectionPoints.map((pt, i) => (
                <div key={i} onClick={() => setInspectionIndex(i)}>
                  {pt}
                </div>
              ))}
            </div>
          </div>

          <img
            src={
              data[`customInspection${inspectionIndex + 1}`] ||
              data[`inspectionTemplate${inspectionIndex + 1}`]?.imageUrl
            }
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-20 px-4 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl mb-4">
            {data.customerCommitmentTitle}
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: data.customerCommitmentDescription,
            }}
          />
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <img
              key={i}
              src={
                data[`customGallery${i}`] ||
                data[`galleryTemplate${i}`]?.imageUrl
              }
              className="w-full h-60 object-cover rounded-xl"
            />
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-4xl mb-6">{data.testimonialTitle}</h2>

        <div className="max-w-3xl mx-auto border p-8 rounded-xl">
          <Quote className="mx-auto mb-4" />
          <div
            dangerouslySetInnerHTML={{
              __html: reviews[testimonialIndex]?.reviewText,
            }}
          />
          <p className="mt-4 font-semibold">
            {reviews[testimonialIndex]?.reviewerName}
          </p>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() =>
              setTestimonialIndex(
                (p) => (p - 1 + reviews.length) % reviews.length
              )
            }
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() =>
              setTestimonialIndex((p) => (p + 1) % reviews.length)
            }
          >
            <ChevronRight />
          </button>
        </div>
      </section>
    </>
  );
};

export default WhyBuyPremium3Display;