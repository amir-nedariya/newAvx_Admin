/**
 * Maps backend storefront API response to theme-ready format
 * Handles the new nested section structure from backend
 */

export const mapStorefrontData = (storefrontDraft) => {
  if (!storefrontDraft) return { aboutUs: null, whyBuy: null };

  return {
    aboutUs: mapAboutUsData(storefrontDraft),
    whyBuy: mapWhyBuyData(storefrontDraft),
  };
};

/**
 * Maps "About Us" section data from nested structure
 */
const mapAboutUsData = (draft) => {
  return {
    // Hero Section
    heroTitle: draft.heroSection?.title || null,
    heroDescription: draft.heroSection?.description || null,
    heroImages: extractImagesFromSection(draft.heroSection?.images),

    // Mission
    missionTitle: draft.missionSection?.title || null,
    missionDescription: draft.missionSection?.description || null,
    missionImages: extractImagesFromSection(draft.missionSection?.images),

    // Vision
    visionTitle: draft.visionSection?.title || null,
    visionDescription: draft.visionSection?.description || null,
    visionImages: extractImagesFromSection(draft.visionSection?.images),

    // Stats
    aboutUsDescription: draft.aboutUsSection?.description || null,
    stats: draft.aboutUsSection?.stats || [],

    // Services
    serviceTitle: draft.servicesSection?.title || null,
    serviceDescription: draft.servicesSection?.description || null,
    services: draft.servicesSection?.services || [],

    // Gallery
    galleryTitle: draft.gallerySection?.title || null,
    galleryDescription: draft.gallerySection?.description || null,
    galleryImages: extractImagesFromSection(draft.gallerySection?.images),

    // Testimonials
    testimonialTitle: draft.testimonialSection?.title || null,
    testimonialDescription: draft.testimonialSection?.description || null,
    testimonials: mapTestimonials(draft.featuredReviews),
  };
};

/**
 * Maps "Why Buy Here" section data from nested structure
 */
const mapWhyBuyData = (draft) => {
  return {
    // Hero
    whyBuyHeroTitle: draft.whyBuyHeroSection?.title || null,
    whyBuyHeroDescription: draft.whyBuyHeroSection?.description || null,
    whyBuyHeroImages: extractImagesFromSection(draft.whyBuyHeroSection?.images),

    // Story
    storyTitle: draft.storySection?.title || null,
    storyDescription: draft.storySection?.description || null,
    storyImages: extractImagesFromSection(draft.storySection?.images),

    // Vehicle Selection
    vehicleSelectionTitle: draft.vehicleSelectionSection?.title || null,
    vehicleSelectionDescription:
      draft.vehicleSelectionSection?.description || null,
    vehicleSelectionImages: extractImagesFromSection(
      draft.vehicleSelectionSection?.images,
    ),

    // Process
    processTitle: draft.processSection?.title || null,
    processDescription: draft.processSection?.description || null,
    processes: draft.processSection?.processes || [],

    // Inspection
    inspectionTitle: draft.inspectionSection?.title || null,
    inspectionDescription: draft.inspectionSection?.description || null,
    inspectionPoints: draft.inspectionSection?.inspectionPoints || [],
    inspectionImages: extractImagesFromSection(draft.inspectionSection?.images),

    // Customer Commitment
    customerCommitmentTitle: draft.customerCommitmentSection?.title || null,
    customerCommitmentDescription:
      draft.customerCommitmentSection?.description || null,
    customerCommitmentImages: extractImagesFromSection(
      draft.customerCommitmentSection?.images,
    ),

    // Testimonials
    testimonialTitle: draft.testimonialSection?.title || null,
    testimonialDescription: draft.testimonialSection?.description || null,
    testimonials: mapTestimonials(draft.featuredReviews),
  };
};

/**
 * Extract image URLs from section images array
 * Backend format: [{ templateId, templateUrl, customUrl }]
 */
const extractImagesFromSection = (images) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((img) => img?.customUrl || img?.templateUrl)
    .filter((url) => url && url.trim() !== "");
};

/**
 * Map featured reviews to testimonials format
 */
const mapTestimonials = (reviews) => {
  if (!Array.isArray(reviews)) return [];

  return reviews.map((review) => ({
    name: review.userName || review.reviewerName || "Anonymous",
    reviewTitle: review.reviewTitle || null,
    reviewText: review.reviewText || review.review || "",
    rating: review.rating || 5,
    isEdited: review.isEdited || false,
    createdAt: review.createdAt || null,
  }));
};

export default mapStorefrontData;
