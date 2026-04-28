import React, { useState, useEffect, useRef } from "react";
import "../../../themeStyles.css";

// Helper function to extract image URL from images array
const getImageUrl = (section, index = 0) => {
  if (!section?.images || !Array.isArray(section.images) || section.images.length === 0) {
    return null;
  }
  const image = section.images[index];
  return image?.customUrl || image?.templateUrl || null;
};

// Helper function to get all image URLs from a section
const getAllImageUrls = (section) => {
  if (!section?.images || !Array.isArray(section.images)) {
    return [];
  }
  return section.images.map(img => img?.customUrl || img?.templateUrl).filter(Boolean);
};

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

  const galleryImages = getAllImageUrls(data.gallerySection);
  const heroImages = getAllImageUrls(data.whyBuyHeroSection);
  const storyImages = getAllImageUrls(data.storySection);
  const vehicleImages = getAllImageUrls(data.vehicleSelectionSection);
  const processImages = getAllImageUrls(data.processSection);
  const inspectionImages = getAllImageUrls(data.inspectionSection);

  return (
    <div className="space-y-24">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-sm uppercase text-third tracking-widest mb-3 font-[Poppins]">
              Trusted Auto Consultants
            </p>

            <h1 className="text-5xl font-bold  font-[Montserrat] text-primary mb-4 font-[Montserrat]">
              {data.whyBuyHeroSection?.title}
            </h1>

            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: data.whyBuyHeroSection?.description }}
            />
          </div>

          <div className="space-y-4">
            {heroImages[0] && (
              <video
                autoPlay
                muted
                loop
                className="w-full h-64 object-cover rounded-xl"
                src={heroImages[0]}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {heroImages.slice(1, 3).map((img, i) => (
                <img
                  key={i}
                  src={img}
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
          <h2 className="text-4xl text-secondary">
            {data.storySection?.title}
          </h2>

          <div
            className="mt-4 text-third font-[Poppins]"
            dangerouslySetInnerHTML={{ __html: data.storySection?.description }}
          />
        </div>

        <div className="relative h-[400px] hidden md:block">
          {storyImages.slice(0, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              onMouseEnter={() => setHovered(i)}
              className={`absolute rounded-xl object-cover transition-all ${hovered === i ? "scale-105 z-20" : "z-10"
                }`}
              style={{
                width: i === 0 ? "60%" : "45%",
                height: "50%",
                top: i === 0 ? 0 : i === 1 ? "50%" : "25%",
                left: i === 0 ? 0 : i === 1 ? "50%" : "25%",
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
          {vehicleImages.concat(vehicleImages).map((img, idx) => (
            <img
              key={idx}
              src={img}
              className="min-w-[300px] h-full object-cover"
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-4xl text-primary">
            {data.vehicleSelectionSection?.title}
          </h2>

          <div
            className="mt-4 text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.vehicleSelectionSection?.description,
            }}
          />
        </div>

      </section>

      {/* ================= PROCESS ================= */}
      <section className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl mb-6 text-primary">
          {data.processSection?.title}
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          {data.processSteps?.map((step, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              className="relative rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={processImages[i % processImages.length]}
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
          <h2 className="text-4xl text-primary">
            {data.inspectionSection?.title}
          </h2>

          <div
            dangerouslySetInnerHTML={{ __html: data.inspectionSection?.description }}
          />

          {data.inspectionSection?.inspectionPoints?.map((pt, i) => (
            <div key={i} className="flex gap-2 items-center">
              ✔ {pt}
            </div>
          ))}
        </div>

        <div className="relative h-[400px]">
          {inspectionImages.slice(0, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              className="absolute object-cover rounded-xl"
              style={{
                width: i === 0 ? "70%" : "40%",
                height: "60%",
                top: i === 0 ? 0 : i === 1 ? "20%" : "60%",
                left: i === 0 ? 0 : i === 1 ? "60%" : "20%",
              }}
            />
          ))}
        </div>

      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="relative py-24 px-4 text-center">

        <img
          src={getImageUrl(data.customerCommitmentSection, 0)}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl text-primary">
            {data.customerCommitmentSection?.title}
          </h2>

          <div
            className="mt-4 text-third font-[Poppins]"
            dangerouslySetInnerHTML={{
              __html: data.customerCommitmentSection?.description,
            }}
          />
        </div>

      </section>

      {/* ================= GALLERY ================= */}
      <section className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl mb-6 text-primary">
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

