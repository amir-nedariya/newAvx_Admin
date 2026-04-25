import React, { useState, useEffect, useRef } from "react";
import "../../../themeStyles.css";

const WhyBuyPremium1Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  /* ================== AUTO SCROLL ================== */
  useEffect(() => {
    let scrollAmount = 0;
    const scroll = () => {
      if (!scrollRef.current) return;
      scrollAmount += 1;
      scrollRef.current.scrollLeft = scrollAmount;
      if (scrollAmount >= scrollRef.current.scrollWidth / 2)
        scrollAmount = 0;
      requestAnimationFrame(scroll);
    };
    const id = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(id);
  }, []);

  const galleryImages = [
    data.customGallery1 || data.galleryTemplate1?.imageUrl,
    data.customGallery2 || data.galleryTemplate2?.imageUrl,
    data.customGallery3 || data.galleryTemplate3?.imageUrl,
    data.customGallery4 || data.galleryTemplate4?.imageUrl,
    data.customGallery5 || data.galleryTemplate5?.imageUrl,
  ].filter(Boolean);

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-sm uppercase text-[var(--color-third)] tracking-widest mb-3">
              Trusted Auto Consultants
            </p>

            <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-4">
              {data.whyBuyHeroTitle}
            </h1>

            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
            />
          </div>

          <div className="space-y-4">
            <video
              autoPlay
              muted
              loop
              className="w-full h-64 object-cover rounded-xl"
              src={
                data.customWhyBuyHero1 ||
                data.whyBuyHeroTemplate1?.imageUrl
              }
            />

            <div className="grid grid-cols-2 gap-4">
              {[2, 3].map((i) => (
                <img
                  key={i}
                  src={
                    data[`customWhyBuyHero${i}`] ||
                    data[`whyBuyHeroTemplate${i}`]?.imageUrl
                  }
                  className="h-32 w-full object-cover rounded-xl"
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 px-4">

        <div>
          <h2 className="text-4xl text-[var(--color-secondary)]">
            {data.storyTitle}
          </h2>

          <div
            className="mt-4 text-[var(--color-third)]"
            dangerouslySetInnerHTML={{ __html: data.storyDescription }}
          />
        </div>

        <div className="relative h-[400px] hidden md:block">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={
                data[`customWhyBuyStory${i}`] ||
                data[`storyTemplate${i}`]?.imageUrl
              }
              onMouseEnter={() => setHovered(i)}
              className={`absolute rounded-xl object-cover transition-all ${hovered === i ? "scale-105 z-20" : "z-10"
                }`}
              style={{
                width: i === 1 ? "60%" : "45%",
                height: "50%",
                top: i === 1 ? 0 : i === 2 ? "50%" : "25%",
                left: i === 1 ? 0 : i === 2 ? "50%" : "25%",
              }}
            />
          ))}
        </div>

      </section>

      {/* ================= VEHICLE ================= */}
      <section className="relative py-20 px-4">

        <div
          ref={scrollRef}
          className="absolute inset-0 flex opacity-30 overflow-hidden"
        >
          {[1, 2, 1, 2].map((i, idx) => (
            <img
              key={idx}
              src={
                data[`customWhyBuyVehicleSelection${i}`] ||
                data[`vehicleSelectionTemplate${i}`]?.imageUrl
              }
              className="min-w-[300px] h-full object-cover"
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-4xl text-[var(--color-primary)]">
            {data.vehicleSelectionTitle}
          </h2>

          <div
            className="mt-4 text-[var(--color-third)]"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionDescription,
            }}
          />
        </div>

      </section>

      {/* ================= PROCESS ================= */}
      <section className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl mb-6 text-[var(--color-primary)]">
          {data.processTitle}
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {data.processSteps?.map((step, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              className="relative rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={
                  data[`customWhyBuyProcess${i + 1}`] ||
                  data[`processTemplate${i + 1}`]?.imageUrl
                }
                className="h-48 w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute bottom-4 left-4 text-white">
                <h3>{step.title}</h3>
                {active === i && (
                  <p className="text-sm">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ================= INSPECTION ================= */}
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-4">

        <div className="space-y-4">
          <h2 className="text-4xl text-[var(--color-primary)]">
            {data.inspectionTitle}
          </h2>

          <div
            dangerouslySetInnerHTML={{ __html: data.inspectionText }}
          />

          {data.inspectionPoints?.map((pt, i) => (
            <div key={i} className="flex gap-2 items-center">
              ✔ {pt}
            </div>
          ))}
        </div>

        <div className="relative h-[400px]">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={
                data[`customWhyBuyInspection${i}`] ||
                data[`inspectionTemplate${i}`]?.imageUrl
              }
              className="absolute object-cover rounded-xl"
              style={{
                width: i === 1 ? "70%" : "40%",
                height: "60%",
                top: i === 1 ? 0 : i === 2 ? "20%" : "60%",
                left: i === 1 ? 0 : i === 2 ? "60%" : "20%",
              }}
            />
          ))}
        </div>

      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="relative py-24 px-4 text-center">

        <img
          src={
            data.customWhyBuyCustomerCommitment1 ||
            data.customerCommitmentTemplate1?.imageUrl
          }
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl text-[var(--color-primary)]">
            {data.customerCommitmentTitle}
          </h2>

          <div
            className="mt-4 text-[var(--color-third)]"
            dangerouslySetInnerHTML={{
              __html: data.customerCommitmentDescription,
            }}
          />
        </div>

      </section>

      {/* ================= GALLERY ================= */}
      <section className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl mb-6 text-[var(--color-primary)]">
          Gallery
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-48 w-full object-cover rounded-xl"
            />
          ))}
        </div>

      </section>

    </div>
  );
};

export default WhyBuyPremium1Display;