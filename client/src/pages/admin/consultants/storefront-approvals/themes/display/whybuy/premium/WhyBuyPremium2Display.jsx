import "../../../themeStyles.css";
import { Quote } from "lucide-react";

const WhyBuyPremium2Display = ({ data }) => {
  if (!data) return null;

  if (data?.processes && Array.isArray(data.processes) && data.processes.length > 0) {
    data.processSteps = data.processes.map(p => ({
      title: p.title || "",
      description: p.desc || p.description || "",
      icon: p.icon || ""
    }));
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          {(data.customWhyBuyHero1 || data.whyBuyHeroTemplate1?.imageUrl)?.includes(".mp4") ? (
            <video
              src={data.customWhyBuyHero1 || data.whyBuyHeroTemplate1?.imageUrl}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={data.customWhyBuyHero1 || data.whyBuyHeroTemplate1?.imageUrl}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h1 className="text-5xl text-white mb-6">
            {data.whyBuyHeroTitle}
          </h1>
          <div
            className="text-white/80"
            dangerouslySetInnerHTML={{ __html: data.whyBuyHeroDescription }}
          />
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl mb-4 text-[var(--color-secondary)]">{data.storyTitle}</h2>
            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{ __html: data.storyDescription }}
            />
          </div>

          <div className="relative h-[400px]">
            <img
              src={data.customStory1 || data.storyTemplate1?.imageUrl}
              alt="Story"
              className="w-full h-full object-cover rounded-xl"
            />
            <img
              src={data.customStory2 || data.storyTemplate2?.imageUrl}
              alt="Story detail"
              className="absolute bottom-4 right-4 w-32 h-24 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* ================= VEHICLE ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl mb-4 text-[var(--color-secondary)]">
              {data.vehicleSelectionTitle}
            </h2>
            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{
                __html: data.vehicleSelectionDescription,
              }}
            />
          </div>

          <div className="relative h-[350px]">
            <img
              src={data.customVehicleSelection1 || data.vehicleSelectionTemplate1?.imageUrl}
              alt="Vehicle selection"
              className="absolute w-3/4 h-full object-cover rounded-xl"
            />
            <img
              src={data.customVehicleSelection2 || data.vehicleSelectionTemplate2?.imageUrl}
              alt="Vehicle detail"
              className="absolute right-0 top-0 w-1/3 h-1/2 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-10 text-[var(--color-secondary)]">{data.processTitle}</h2>

          <div className="space-y-16">
            {data.processSteps?.map((step, i) => (
              <div key={i} className="grid lg:grid-cols-2 gap-10 items-center">
                <img
                  src={data[`customProcess${i + 1}`] || data[`processTemplate${i + 1}`]?.imageUrl}
                  alt={`Process step ${i + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                />

                <div>
                  <div
                    className="text-[var(--color-fourth)]"
                    dangerouslySetInnerHTML={{ __html: step.icon }}
                  />
                  <h3 className="text-xl mt-3 text-[var(--color-secondary)]">{step.title}</h3>
                  <div
                    className="text-[var(--color-third)] mt-2"
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
            <h2 className="text-4xl mb-4 text-[var(--color-secondary)]">{data.inspectionTitle}</h2>
            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{ __html: data.inspectionText }}
            />

            <div className="mt-6 space-y-3">
              {data.inspectionPoints?.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-[var(--color-third)]">
                  <span className="text-[var(--color-fourth)]">✓</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <img
            src={
              data.customInspection1 ||
              data.inspectionTemplate1?.imageUrl
            }
            alt="Inspection"
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-4xl mb-4 text-[var(--color-secondary)]">
              {data.customerCommitmentTitle}
            </h2>
            <div
              className="text-[var(--color-third)]"
              dangerouslySetInnerHTML={{
                __html: data.customerCommitmentDescription,
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 h-64">
            {[2, 3, 4].map((i) => (
              <img
                key={i}
                src={
                  data[`customCustomerCommitment${i}`] ||
                  data[`customerCommitmentTemplate${i}`]?.imageUrl
                }
                alt={`Commitment ${i}`}
                className="w-full h-full object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-6 text-[var(--color-secondary)]">Gallery</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={data[`customGallery${i}`] || data[`galleryTemplate${i}`]?.imageUrl}
                alt={`Gallery ${i}`}
                className="w-full h-48 object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-6 text-[var(--color-secondary)]">{data.testimonialTitle}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data.featuredReviews || []).map((t, i) => (
              <div key={i} className="p-6 border border-[var(--color-third)]/20 rounded-xl bg-white">
                <Quote size={20} className="text-[var(--color-fourth)] mb-3" />
                <div
                  className="text-[var(--color-third)] mb-4"
                  dangerouslySetInnerHTML={{
                    __html: t.reviewText,
                  }}
                />
                <p className="font-semibold text-[var(--color-secondary)]">
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