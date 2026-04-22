# Theme Loading Flow Diagram

## 🔄 Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         API RESPONSE                             │
│  GET /api/storefront-approvals/:id                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    StorefrontApprovalDetail.jsx                  │
│                                                                  │
│  1. Extract theme IDs from API response:                        │
│     - aboutThemeId = storefrontDraft.theme.themeId              │
│     - whyBuyThemeId = storefrontDraft.whyBuyTheme.themeId       │
│                                                                  │
│  2. Normalize theme IDs:                                        │
│     - "about_pro_3" → "about_us_theme_pro_3"                    │
│     - "whybuy_premium_2" → "why_buy_theme_premium_2"            │
│                                                                  │
│  3. Map storefront data:                                        │
│     - mappedData = mapStorefrontData(storefrontDraft)           │
│                                                                  │
│  4. Get theme components:                                       │
│     - AboutThemeComponent = getThemeComponent(aboutThemeType)   │
│     - WhyBuyThemeComponent = getThemeComponent(whyBuyThemeType) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ThemeRegistry.js                            │
│                                                                  │
│  THEME_REGISTRY = {                                             │
│    "about_us_theme_basic_1": AboutBasic1,                       │
│    "about_us_theme_basic_2": AboutBasic2,                       │
│    "about_us_theme_basic_3": AboutBasic3,                       │
│    "about_us_theme_pro_1": AboutPro1,                           │
│    "about_us_theme_pro_2": AboutPro2,                           │
│    "about_us_theme_pro_3": AboutPro3,                           │
│    "about_us_theme_premium_1": AboutPremium1,                   │
│    "about_us_theme_premium_2": AboutPremium2,                   │
│    "about_us_theme_premium_3": AboutPremium3,                   │
│    "why_buy_theme_basic_1": WhyBuyBasic1,                       │
│    "why_buy_theme_basic_2": WhyBuyBasic2,                       │
│    "why_buy_theme_basic_3": WhyBuyBasic3,                       │
│    "why_buy_theme_pro_1": WhyBuyPro1,                           │
│    "why_buy_theme_pro_2": WhyBuyPro2,                           │
│    "why_buy_theme_pro_3": WhyBuyPro3,                           │
│    "why_buy_theme_premium_1": WhyBuyPremium1,                   │
│    "why_buy_theme_premium_2": WhyBuyPremium2,                   │
│    "why_buy_theme_premium_3": WhyBuyPremium3                    │
│  }                                                              │
│                                                                  │
│  getThemeComponent(themeType) → Returns component or null       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   storefrontDataMapper.js                        │
│                                                                  │
│  mapStorefrontData(storefrontDraft) → {                         │
│    aboutUs: {                                                   │
│      heroTitle, heroDescription, heroImages,                    │
│      missionTitle, missionDescription, missionImages,           │
│      visionTitle, visionDescription, visionImages,              │
│      aboutUsDescription, stats,                                 │
│      serviceTitle, serviceDescription, services,                │
│      galleryTitle, galleryDescription, galleryImages,           │
│      testimonialTitle, testimonialDescription, testimonials     │
│    },                                                           │
│    whyBuy: {                                                    │
│      whyBuyHeroTitle, whyBuyHeroDescription, whyBuyHeroImages,  │
│      storyTitle, storyDescription, storyImages,                 │
│      vehicleSelectionTitle, vehicleSelectionDescription,        │
│      vehicleSelectionImages,                                    │
│      processTitle, processDescription, processes,               │
│      inspectionTitle, inspectionDescription, inspectionPoints,  │
│      inspectionImages,                                          │
│      customerCommitmentTitle, customerCommitmentDescription,    │
│      customerCommitmentImages,                                  │
│      testimonialTitle, testimonialDescription, testimonials     │
│    }                                                            │
│  }                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Theme Components                            │
│                                                                  │
│  themes/about/basic/AboutBasic1.jsx                             │
│  themes/about/basic/AboutBasic2.jsx                             │
│  themes/about/basic/AboutBasic3.jsx                             │
│  themes/about/pro/AboutPro1.jsx                                 │
│  themes/about/pro/AboutPro2.jsx                                 │
│  themes/about/pro/AboutPro3.jsx                                 │
│  themes/about/premium/AboutPremium1.jsx                         │
│  themes/about/premium/AboutPremium2.jsx                         │
│  themes/about/premium/AboutPremium3.jsx                         │
│  themes/whybuy/basic/WhyBuyBasic1.jsx                           │
│  themes/whybuy/basic/WhyBuyBasic2.jsx                           │
│  themes/whybuy/basic/WhyBuyBasic3.jsx                           │
│  themes/whybuy/pro/WhyBuyPro1.jsx                               │
│  themes/whybuy/pro/WhyBuyPro2.jsx                               │
│  themes/whybuy/pro/WhyBuyPro3.jsx                               │
│  themes/whybuy/premium/WhyBuyPremium1.jsx                       │
│  themes/whybuy/premium/WhyBuyPremium2.jsx                       │
│  themes/whybuy/premium/WhyBuyPremium3.jsx                       │
│                                                                  │
│  Each component receives: { data }                              │
│  - data.aboutUs (for About themes)                              │
│  - data.whyBuy (for WhyBuy themes)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RENDERED UI                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [About Us Tab] [Why Buy Here Tab]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  {activeTab === "about" && AboutThemeComponent && (     │   │
│  │    <AboutThemeComponent data={mappedData.aboutUs} />    │   │
│  │  )}                                                      │   │
│  │                                                          │   │
│  │  {activeTab === "whybuy" && WhyBuyThemeComponent && (   │   │
│  │    <WhyBuyThemeComponent data={mappedData.whyBuy} />    │   │
│  │  )}                                                      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Request Changes] [Reject] [Approve]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Points

### 1. Theme ID Formats Supported

- `about_basic_1`, `about_pro_2`, `about_premium_3`
- `ABOUT_BASIC_1`, `ABOUT_PRO_2`, `ABOUT_PREMIUM_3`
- `basic_1`, `pro_2`, `premium_3`
- `whybuy_basic_1`, `whybuy_pro_2`, `whybuy_premium_3`
- `WHYBUY_BASIC_1`, `WHYBUY_PRO_2`, `WHYBUY_PREMIUM_3`

### 2. Normalization Process

```javascript
normalizeThemeId("about_pro_3", "about")
  ↓ toLowerCase()
  ↓ regex match: /(basic|pro|premium)_(\d+)/
  ↓ extract: tier="pro", number="3"
  ↓ construct: "about_us_theme_pro_3"
  ↓ return theme type
```

### 3. Fallback Strategy

```
Theme ID from API
  ↓
Normalize to theme type
  ↓
Look up in THEME_REGISTRY
  ↓
Found? → Render component
  ↓
Not found? → Fallback to basic_1
  ↓
Still not found? → Show "Theme not available" message
```

### 4. Data Flow

```
API Response (raw backend data)
  ↓
storefrontDataMapper.js (transform to theme format)
  ↓
mappedData.aboutUs / mappedData.whyBuy
  ↓
Theme Component (render with data)
  ↓
UI Display
```

## 🔍 Debugging Steps

1. **Check API Response:**
   - Open browser DevTools → Network tab
   - Look for `/api/storefront-approvals/:id` request
   - Verify `storefrontDraft.theme.themeId` and `storefrontDraft.whyBuyTheme.themeId`

2. **Check Console Logs:**
   - Look for "Theme Debug:" log
   - Verify theme IDs are being extracted correctly
   - Verify normalized theme types match registry keys

3. **Check Component Rendering:**
   - If theme shows "Theme not available", check:
     - Is themeId in correct format?
     - Does normalized theme type exist in THEME_REGISTRY?
     - Is the component file present in themes folder?

4. **Check Data Mapping:**
   - Verify mappedData structure in console
   - Check if data is being passed to theme component
   - Verify theme component is receiving data prop

## ✅ Verification Checklist

- [x] All 18 theme files exist in correct folders
- [x] ThemeRegistry imports all theme components
- [x] THEME_REGISTRY maps all 18 themes
- [x] normalizeThemeId handles various formats
- [x] Both About and WhyBuy themes load dynamically
- [x] Data mapper transforms API data correctly
- [x] Fallback handling works for missing themes
- [x] Console logging enabled for debugging
- [x] No TypeScript/ESLint errors
- [x] Component rendering logic is correct

**Status:** ✅ ALL SYSTEMS GO!
