# 🚀 Quick Reference Guide - Theme System

## 📁 Folder Structure

```
themes/
├── about/
│   ├── basic/      → AboutBasic1, AboutBasic2, AboutBasic3
│   ├── pro/        → AboutPro1, AboutPro2, AboutPro3
│   └── premium/    → AboutPremium1, AboutPremium2, AboutPremium3
├── whybuy/
│   ├── basic/      → WhyBuyBasic1, WhyBuyBasic2, WhyBuyBasic3
│   ├── pro/        → WhyBuyPro1, WhyBuyPro2, WhyBuyPro3
│   └── premium/    → WhyBuyPremium1, WhyBuyPremium2, WhyBuyPremium3
└── ThemeRegistry.js
```

---

## 🔑 Theme Registry Keys

### About Us Themes

| Tier    | Variant 1                  | Variant 2                  | Variant 3                  |
| ------- | -------------------------- | -------------------------- | -------------------------- |
| Basic   | `about_us_theme_basic_1`   | `about_us_theme_basic_2`   | `about_us_theme_basic_3`   |
| Pro     | `about_us_theme_pro_1`     | `about_us_theme_pro_2`     | `about_us_theme_pro_3`     |
| Premium | `about_us_theme_premium_1` | `about_us_theme_premium_2` | `about_us_theme_premium_3` |

### Why Buy Themes

| Tier    | Variant 1                 | Variant 2                 | Variant 3                 |
| ------- | ------------------------- | ------------------------- | ------------------------- |
| Basic   | `why_buy_theme_basic_1`   | `why_buy_theme_basic_2`   | `why_buy_theme_basic_3`   |
| Pro     | `why_buy_theme_pro_1`     | `why_buy_theme_pro_2`     | `why_buy_theme_pro_3`     |
| Premium | `why_buy_theme_premium_1` | `why_buy_theme_premium_2` | `why_buy_theme_premium_3` |

---

## 🔄 API Response Format

```json
{
  "storefrontDraft": {
    "theme": {
      "themeId": "about_pro_3"
    },
    "whyBuyTheme": {
      "themeId": "whybuy_premium_2"
    }
  }
}
```

---

## 💡 Supported Theme ID Formats

The system automatically handles these formats:

| Input Format       | Normalized Output         |
| ------------------ | ------------------------- |
| `about_basic_1`    | `about_us_theme_basic_1`  |
| `ABOUT_BASIC_1`    | `about_us_theme_basic_1`  |
| `basic_1`          | `about_us_theme_basic_1`  |
| `about_pro_2`      | `about_us_theme_pro_2`    |
| `ABOUT_PRO_2`      | `about_us_theme_pro_2`    |
| `pro_2`            | `about_us_theme_pro_2`    |
| `whybuy_premium_3` | `why_buy_theme_premium_3` |
| `WHYBUY_PREMIUM_3` | `why_buy_theme_premium_3` |
| `premium_3`        | `why_buy_theme_premium_3` |

---

## 🛠️ How to Add a New Theme

### Step 1: Create Theme Component

```bash
# Create new theme file
touch themes/about/pro/AboutPro4.jsx
```

### Step 2: Write Component

```jsx
import React from "react";

const AboutPro4 = ({ data }) => {
  if (!data) return null;

  return <div className="space-y-16">{/* Your theme layout here */}</div>;
};

export default AboutPro4;
```

### Step 3: Register in ThemeRegistry.js

```javascript
// Add import
import AboutPro4 from "./about/pro/AboutPro4";

// Add to THEME_REGISTRY
export const THEME_REGISTRY = {
  // ... existing themes
  about_us_theme_pro_4: AboutPro4,
};
```

### Step 4: Test

- Set `themeId: "about_pro_4"` in API response
- Verify theme loads correctly
- Check console for "Theme Debug:" logs

---

## 🐛 Debugging

### Check Theme Loading

```javascript
// Open browser console and look for:
console.log("Theme Debug:", {
  aboutThemeId, // Raw ID from API
  whyBuyThemeId, // Raw ID from API
  aboutThemeType, // Normalized type
  whyBuyThemeType, // Normalized type
  themeData, // Full theme data
  whyBuyThemeData, // Full whyBuy theme data
});
```

### Common Issues

**Issue:** Theme not loading  
**Solution:**

1. Check if themeId exists in API response
2. Verify theme file exists in correct folder
3. Check ThemeRegistry has correct import and mapping
4. Look for console errors

**Issue:** Wrong theme loading  
**Solution:**

1. Check themeId format in API response
2. Verify normalization logic
3. Check THEME_REGISTRY key matches

**Issue:** "Theme not available" message  
**Solution:**

1. Theme file doesn't exist
2. Import path in ThemeRegistry is wrong
3. THEME_REGISTRY key doesn't match normalized type

---

## 📊 Data Structure

### About Us Data

```javascript
{
  (heroTitle,
    heroDescription,
    heroImages,
    missionTitle,
    missionDescription,
    missionImages,
    visionTitle,
    visionDescription,
    visionImages,
    aboutUsDescription,
    stats,
    serviceTitle,
    serviceDescription,
    services,
    galleryTitle,
    galleryDescription,
    galleryImages,
    testimonialTitle,
    testimonialDescription,
    testimonials);
}
```

### Why Buy Data

```javascript
{
  (whyBuyHeroTitle,
    whyBuyHeroDescription,
    whyBuyHeroImages,
    storyTitle,
    storyDescription,
    storyImages,
    vehicleSelectionTitle,
    vehicleSelectionDescription,
    vehicleSelectionImages,
    processTitle,
    processDescription,
    processes,
    inspectionTitle,
    inspectionDescription,
    inspectionPoints,
    inspectionImages,
    customerCommitmentTitle,
    customerCommitmentDescription,
    customerCommitmentImages,
    testimonialTitle,
    testimonialDescription,
    testimonials);
}
```

---

## 🎯 Best Practices

1. **Always check if data exists**

   ```jsx
   if (!data) return null;
   ```

2. **Use optional chaining for nested data**

   ```jsx
   {
     data?.heroTitle && <h1>{data.heroTitle}</h1>;
   }
   ```

3. **Handle arrays safely**

   ```jsx
   {Array.isArray(data.services) && data.services.map(...)}
   ```

4. **Provide fallbacks**

   ```jsx
   const title = data?.heroTitle || "Default Title";
   ```

5. **Use semantic HTML**
   ```jsx
   <section>, <article>, <header>, <footer>
   ```

---

## 📞 Quick Commands

### List all theme files

```bash
ls -R themes/
```

### Check for errors

```bash
npm run lint
```

### Search for theme usage

```bash
grep -r "getThemeComponent" .
```

---

## ✅ Checklist for New Themes

- [ ] Theme file created in correct folder
- [ ] Component exported as default
- [ ] Accepts `data` prop
- [ ] Handles null/undefined data
- [ ] Imported in ThemeRegistry.js
- [ ] Added to THEME_REGISTRY object
- [ ] Tested with actual data
- [ ] No console errors
- [ ] Responsive design
- [ ] Accessible markup

---

**Quick Links:**

- [Full Verification Report](./THEME_STRUCTURE_VERIFICATION.md)
- [Flow Diagram](./FLOW_DIAGRAM.md)
- [Final Summary](./FINAL_VERIFICATION_SUMMARY.md)
