// About Themes - Basic (Display Components for Admin Approval)
import AboutBasic1Display from "./display/about/basic/AboutBasic1Display";
import AboutBasic2Display from "./display/about/basic/AboutBasic2Display";
import AboutBasic3Display from "./display/about/basic/AboutBasic3Display";

// About Themes - Pro (Display Components for Admin Approval)
import AboutPro1Display from "./display/about/pro/AboutPro1Display";
import AboutPro2Display from "./display/about/pro/AboutPro2Display";
import AboutPro3Display from "./display/about/pro/AboutPro3Display";

// About Themes - Premium (Display Components for Admin Approval)
import AboutPremium1Display from "./display/about/premium/AboutPremium1Display";
import AboutPremium2Display from "./display/about/premium/AboutPremium2Display";
import AboutPremium3Display from "./display/about/premium/AboutPremium3Display";

// WhyBuy Themes - Basic (Display Components for Admin Approval)
import WhyBuyBasic1Display from "./display/whybuy/basic/WhyBuyBasic1Display";
import WhyBuyBasic2Display from "./display/whybuy/basic/WhyBuyBasic2Display";
import WhyBuyBasic3Display from "./display/whybuy/basic/WhyBuyBasic3Display";

// WhyBuy Themes - Pro (Display Components for Admin Approval)
import WhyBuyPro1Display from "./display/whybuy/pro/WhyBuyPro1Display";
import WhyBuyPro2Display from "./display/whybuy/pro/WhyBuyPro2Display";
import WhyBuyPro3Display from "./display/whybuy/pro/WhyBuyPro3Display";

// WhyBuy Themes - Premium (Display Components for Admin Approval)
import WhyBuyPremium1Display from "./display/whybuy/premium/WhyBuyPremium1Display";
import WhyBuyPremium2Display from "./display/whybuy/premium/WhyBuyPremium2Display";
import WhyBuyPremium3Display from "./display/whybuy/premium/WhyBuyPremium3Display";

// Theme Registry - Maps theme types to their Display components (for Admin Approval Screen)
export const THEME_REGISTRY = {
  // About Us Themes - Basic
  about_us_theme_basic_1: AboutBasic1Display,
  about_us_theme_basic_2: AboutBasic2Display,
  about_us_theme_basic_3: AboutBasic3Display,

  // About Us Themes - Pro
  about_us_theme_pro_1: AboutPro1Display,
  about_us_theme_pro_2: AboutPro2Display,
  about_us_theme_pro_3: AboutPro3Display,

  // About Us Themes - Premium
  about_us_theme_premium_1: AboutPremium1Display,
  about_us_theme_premium_2: AboutPremium2Display,
  about_us_theme_premium_3: AboutPremium3Display,

  // Why Buy Themes - Basic
  why_buy_theme_basic_1: WhyBuyBasic1Display,
  why_buy_theme_basic_2: WhyBuyBasic2Display,
  why_buy_theme_basic_3: WhyBuyBasic3Display,

  // Why Buy Themes - Pro
  why_buy_theme_pro_1: WhyBuyPro1Display,
  why_buy_theme_pro_2: WhyBuyPro2Display,
  why_buy_theme_pro_3: WhyBuyPro3Display,

  // Why Buy Themes - Premium
  why_buy_theme_premium_1: WhyBuyPremium1Display,
  why_buy_theme_premium_2: WhyBuyPremium2Display,
  why_buy_theme_premium_3: WhyBuyPremium3Display,
};

// Get theme component by type
export const getThemeComponent = (themeType) => {
  return THEME_REGISTRY[themeType] || null;
};

// Check if theme type is supported
export const isThemeSupported = (themeType) => {
  return themeType in THEME_REGISTRY;
};

// Get all available themes grouped by category (Display Components)
export const getThemesByCategory = () => {
  return {
    about: {
      basic: [AboutBasic1Display, AboutBasic2Display, AboutBasic3Display],
      pro: [AboutPro1Display, AboutPro2Display, AboutPro3Display],
      premium: [
        AboutPremium1Display,
        AboutPremium2Display,
        AboutPremium3Display,
      ],
    },
    whybuy: {
      basic: [WhyBuyBasic1Display, WhyBuyBasic2Display, WhyBuyBasic3Display],
      pro: [WhyBuyPro1Display, WhyBuyPro2Display, WhyBuyPro3Display],
      premium: [
        WhyBuyPremium1Display,
        WhyBuyPremium2Display,
        WhyBuyPremium3Display,
      ],
    },
  };
};

export default THEME_REGISTRY;
