import AboutBasic1 from "./AboutBasic1";
import WhyBuyBasic1 from "./WhyBuyBasic1";

// Theme Registry - Maps theme types to their components
export const THEME_REGISTRY = {
  about_us_theme_basic_1: AboutBasic1,
  why_buy_theme_basic_1: WhyBuyBasic1,
  // Add more themes here as they're created
  // about_us_theme_basic_2: AboutBasic2,
  // why_buy_theme_premium_1: WhyBuyPremium1,
};

// Get theme component by type
export const getThemeComponent = (themeType) => {
  return THEME_REGISTRY[themeType] || null;
};

// Check if theme type is supported
export const isThemeSupported = (themeType) => {
  return themeType in THEME_REGISTRY;
};

export default THEME_REGISTRY;
