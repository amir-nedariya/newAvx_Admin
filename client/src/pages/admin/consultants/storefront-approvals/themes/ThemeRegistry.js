// About Themes - Basic
import AboutBasic1 from "./about/basic/AboutBasic1";
import AboutBasic2 from "./about/basic/AboutBasic2";
import AboutBasic3 from "./about/basic/AboutBasic3";

// About Themes - Pro
import AboutPro1 from "./about/pro/AboutPro1";
import AboutPro2 from "./about/pro/AboutPro2";
import AboutPro3 from "./about/pro/AboutPro3";

// About Themes - Premium
import AboutPremium1 from "./about/premium/AboutPremium1";
import AboutPremium2 from "./about/premium/AboutPremium2";
import AboutPremium3 from "./about/premium/AboutPremium3";

// WhyBuy Themes - Basic
import WhyBuyBasic1 from "./whybuy/basic/WhyBuyBasic1";
import WhyBuyBasic2 from "./whybuy/basic/WhyBuyBasic2";
import WhyBuyBasic3 from "./whybuy/basic/WhyBuyBasic3";

// WhyBuy Themes - Pro
import WhyBuyPro1 from "./whybuy/pro/WhyBuyPro1";
import WhyBuyPro2 from "./whybuy/pro/WhyBuyPro2";
import WhyBuyPro3 from "./whybuy/pro/WhyBuyPro3";

// WhyBuy Themes - Premium
import WhyBuyPremium1 from "./whybuy/premium/WhyBuyPremium1";
import WhyBuyPremium2 from "./whybuy/premium/WhyBuyPremium2";
import WhyBuyPremium3 from "./whybuy/premium/WhyBuyPremium3";

// Theme Registry - Maps theme types to their components
export const THEME_REGISTRY = {
  // About Us Themes - Basic
  about_us_theme_basic_1: AboutBasic1,
  about_us_theme_basic_2: AboutBasic2,
  about_us_theme_basic_3: AboutBasic3,

  // About Us Themes - Pro
  about_us_theme_pro_1: AboutPro1,
  about_us_theme_pro_2: AboutPro2,
  about_us_theme_pro_3: AboutPro3,

  // About Us Themes - Premium
  about_us_theme_premium_1: AboutPremium1,
  about_us_theme_premium_2: AboutPremium2,
  about_us_theme_premium_3: AboutPremium3,

  // Why Buy Themes - Basic
  why_buy_theme_basic_1: WhyBuyBasic1,
  why_buy_theme_basic_2: WhyBuyBasic2,
  why_buy_theme_basic_3: WhyBuyBasic3,

  // Why Buy Themes - Pro
  why_buy_theme_pro_1: WhyBuyPro1,
  why_buy_theme_pro_2: WhyBuyPro2,
  why_buy_theme_pro_3: WhyBuyPro3,

  // Why Buy Themes - Premium
  why_buy_theme_premium_1: WhyBuyPremium1,
  why_buy_theme_premium_2: WhyBuyPremium2,
  why_buy_theme_premium_3: WhyBuyPremium3,
};

// Get theme component by type
export const getThemeComponent = (themeType) => {
  return THEME_REGISTRY[themeType] || null;
};

// Check if theme type is supported
export const isThemeSupported = (themeType) => {
  return themeType in THEME_REGISTRY;
};

// Get all available themes grouped by category
export const getThemesByCategory = () => {
  return {
    about: {
      basic: [AboutBasic1, AboutBasic2, AboutBasic3],
      pro: [AboutPro1, AboutPro2, AboutPro3],
      premium: [AboutPremium1, AboutPremium2, AboutPremium3],
    },
    whybuy: {
      basic: [WhyBuyBasic1, WhyBuyBasic2, WhyBuyBasic3],
      pro: [WhyBuyPro1, WhyBuyPro2, WhyBuyPro3],
      premium: [WhyBuyPremium1, WhyBuyPremium2, WhyBuyPremium3],
    },
  };
};

export default THEME_REGISTRY;
