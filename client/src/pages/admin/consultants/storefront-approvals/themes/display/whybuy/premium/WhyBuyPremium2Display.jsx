import "../../../themeStyles.css";
import { Quote } from "lucide-react";

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

const WhyBuyPremium2Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  const heroImage = getImageUrl(data.whyBuyHeroSection, 0);
  const storyImages = getAllImageUrls(data.storySection);
  const vehicleImages = getAllImageUrls(data.vehicleSelectionSection);
  const processImages = getAllImageUrls(data.processSection);
  const inspectionImage = getImageUrl(data.inspectionSection, 0);
  const commitmentImages = getAllImageUrls(data.customerCommitmentSection);
  const galleryImages = getAllImageUrls(data.gallerySection);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          {heroImage?.includes(".mp4") ? (
            <video
              src={heroImage}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={heroImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h1 className="text-5xl text-white mb-6">
            {data.whyBuyHeroSection?.title}
          </h1>
          <div
            className="text-white/80"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroSection?.description }}
          />
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl mb-4 text-secondary">{data.storySection?.title}</h2>
            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: data.storySection?.description }}
            />
          </div>

          <div className="relative h-[400px]">
            {storyImages[0] && (
              <img
                src={storyImages[0]}
                alt="Story"
                className="w-full h-full object-cover rounded-xl"
              />
            )}
            {storyImages[1] && (
              <img
                src={storyImages[1]}
                alt="Story detail"
                className="absolute bottom-4 right-4 w-32 h-24 object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= VEHICLE ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl mb-4 text-secondary">
              {data.vehicleSelectionSection?.title}
            </h2>
            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{
                __html: data.vehicleSelectionSection?.description,
              }}
            />
          </div>

          <div className="relative h-[350px]">
            {vehicleImages[0] && (
              <img
                src={vehicleImages[0]}
                alt="Vehicle selection"
                className="absolute w-3/4 h-full object-cover rounded-xl"
              />
            )}
            {vehicleImages[1] && (
              <img
                src={vehicleImages[1]}
                alt="Vehicle detail"
                className="absolute right-0 top-0 w-1/3 h-1/2 object-cover rounded-xl"
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-10 text-secondary">{data.processSection?.title}</h2>

          <div className="space-y-16">
            {data.processSteps?.map((step, i) => (
              <div key={i} className="grid lg:grid-cols-2 gap-10 items-center">
                <img
                  src={processImages[i % processImages.length]}
                  alt={`Process step ${i + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                />

                <div>
                  <div
                    className="text-fourth"
                    dangerouslySetInnerHTML={{ __html: step.icon }}
                  />
                  <h3 className="text-xl mt-3 text-secondary">{step.title}</h3>
                  <div
                    className="text-third mt-2 font-[Poppins]"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INSPECTION ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl mb-4 text-secondary">{data.inspectionSection?.title}</h2>
            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{ __html: data.inspectionSection?.description }}
            />

            <div className="mt-6 space-y-3">
              {data.inspectionSection?.inspectionPoints?.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-third font-[Poppins]">
                  <span className="text-fourth">✓</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <img
            src={inspectionImage}
            alt="Inspection"
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl mb-4 text-secondary">
              {data.customerCommitmentSection?.title}
            </h2>
            <div
              className="text-third font-[Poppins]"
              dangerouslySetInnerHTML={{
                __html: data.customerCommitmentSection?.description,
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 h-64">
            {commitmentImages.slice(1, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Commitment ${i + 2}`}
                className="w-full h-full object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-6 text-secondary">Gallery</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-48 object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-6 text-secondary">{data.testimonialSection?.title}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data.testimonialSection?.featuredReviews || []).map((t, i) => (
              <div key={i} className="p-6 border border-third/20 rounded-xl bg-white">
                <Quote size={20} className="text-fourth mb-3" />
                <div
                  className="text-third mb-4 font-[Poppins]"
                  dangerouslySetInnerHTML={{
                    __html: t.reviewText,
                  }}
                />
                <p className="font-semibold  font-[Montserrat] text-secondary">
                  {t.reviewerName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyBuyPremium2Display;

