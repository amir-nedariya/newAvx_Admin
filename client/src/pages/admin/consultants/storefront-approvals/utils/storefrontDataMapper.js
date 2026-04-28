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
 * Returns sections as-is to match theme component expectations
 */
const mapAboutUsData = (draft) => {
  return {
    // Pass through sections with their nested structure
    heroSection: draft.heroSection || null,
    missionSection: draft.missionSection || null,
    visionSection: draft.visionSection || null,
    aboutUsSection: draft.aboutUsSection || null,
    statsSection: draft.aboutUsSection || null, // Stats are in aboutUsSection
    servicesSection: draft.servicesSection || null,
    gallerySection: draft.gallerySection || null,
    testimonialSection: {
      ...draft.testimonialSection,
      featuredReviews: mapTestimonials(draft.featuredReviews),
    },
  };
};

/**
 * Maps "Why Buy Here" section data from nested structure
 * Returns sections as-is to match theme component expectations
 */
const mapWhyBuyData = (draft) => {
  return {
    // Pass through sections with their nested structure
    whyBuyHeroSection: draft.whyBuyHeroSection || null,
    storySection: draft.storySection || null,
    vehicleSelectionSection: draft.vehicleSelectionSection || null,
    processSection: draft.processSection || null,
    inspectionSection: draft.inspectionSection || null,
    customerCommitmentSection: draft.customerCommitmentSection || null,
    gallerySection: draft.gallerySection || null,
    testimonialSection: {
      ...draft.testimonialSection,
      featuredReviews: mapTestimonials(draft.featuredReviews),
    },
  };
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
