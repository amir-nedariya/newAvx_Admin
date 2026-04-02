# Storefront Theme Engine

A dynent layouts and designs.amic theme rendering system for displaying consultant storefronts with differ

## Architecture

### 1. Theme Components (`/themes`)

Individual React components that render specific theme layouts:

- `AboutBasic1.jsx` - Basic "About Us" theme
- `WhyBuyBasic1.jsx` - Basic "Why Buy Here" theme

### 2. Theme Registry (`ThemeRegistry.js`)

Central registry that maps theme type identifiers to their components:

```javascript
{
  'about_us_theme_basic_1': AboutBasic1,
  'why_buy_theme_basic_1': WhyBuyBasic1,
}
```

### 3. Data Mapper (`/utils/storefrontDataMapper.js`)

Transforms backend entity data into theme-ready format:

- Maps complex backend fields to simplified theme props
- Handles image arrays, JSON fields, and nested data
- Separates "About Us" and "Why Buy Here" data

### 4. Main Component (`StorefrontApprovalDetail.jsx`)

Orchestrates the theme rendering:

- Fetches storefront data from API
- Maps data using `storefrontDataMapper`
- Loads appropriate theme component from registry
- Renders with tabs for different sections

## How It Works

```
Backend API Response
        ↓
storefrontDataMapper (transforms data)
        ↓
Theme Registry (selects component)
        ↓
Theme Component (renders UI)
```

## Adding New Themes

### Step 1: Create Theme Component

```jsx
// themes/AboutPremium1.jsx
const AboutPremium1 = ({ data }) => {
  return (
    <div>
      <h1>{data.heroTitle}</h1>
      {/* Your custom layout */}
    </div>
  );
};
export default AboutPremium1;
```

### Step 2: Register Theme

```javascript
// ThemeRegistry.js
import AboutPremium1 from "./AboutPremium1";

export const THEME_REGISTRY = {
  about_us_theme_basic_1: AboutBasic1,
  about_us_theme_premium_1: AboutPremium1, // Add here
  // ...
};
```

### Step 3: Backend Returns Theme Type

```json
{
  "themeType": "about_us_theme_premium_1",
  "storefront": {
    /* data */
  }
}
```

## Data Structure

### About Us Data

```javascript
{
  heroTitle: string,
  heroDescription: string,
  heroImages: string[],
  missionTitle: string,
  missionDescription: string,
  visionTitle: string,
  visionDescription: string,
  stats: [{ number: string, label: string }],
  services: [{ title: string, desc: string, icon: string }],
  testimonials: [{ name: string, review: string, rating: number }]
}
```

### Why Buy Data

```javascript
{
  whyBuyHeroTitle: string,
  whyBuyHeroDescription: string,
  storyTitle: string,
  storyDescription: string,
  vehicleSelectionTitle: string,
  vehicleSelectionDescription: string,
  processes: [{ title: string, desc: string, icon: string }],
  inspectionTitle: string,
  inspectionPoints: string[],
  customerCommitmentTitle: string,
  customerCommitmentDescription: string,
  testimonials: [{ name: string, review: string, rating: number }]
}
```

## Backend Entity Mapping

The mapper handles these backend fields:

**Hero Section:**

- `heroTitle`, `heroDescription`
- `customHeroImageUrl1-5`

**Mission:**

- `missionTitle`, `missionDescription`
- `customMissionUrl1-5`

**Vision:**

- `visionTitle`, `visionDescription`
- `customVisionUrl1-5`

**Stats (JSON):**

- `stats` array
- `aboutUsDescription`

**Services (JSON):**

- `services` array
- `serviceTitle`, `serviceDescription`

**Why Buy Hero:**

- `whyBuyHeroTitle`, `whyBuyHeroDescription`
- `customWhyBuyHeroUrl1-5`

**Story:**

- `storyTitle`, `storyDescription`
- `customStoryUrl1-5`

**Vehicle Selection:**

- `vehicleSelectionTitle`, `vehicleSelectionDescription`
- `customVehicleSelectionUrl1-5`

**Process (JSON):**

- `processes` array
- `processTitle`, `processDescription`

**Inspection:**

- `inspectionTitle`, `inspectionDescription`
- `inspectionPoints` array
- `customInspectionUrl1-5`

**Customer Commitment:**

- `customerCommitmentTitle`, `customerCommitmentDescription`
- `customCustomerCommitmentUrl1-5`

**Testimonials (JSON):**

- `testimonials` array
- `testimonialTitle`, `testimonialDescription`

## Benefits

1. **Scalable** - Add new themes without modifying core logic
2. **Maintainable** - Each theme is isolated in its own component
3. **Flexible** - Supports any number of theme variations
4. **Type-Safe** - Clear data contracts between backend and frontend
5. **Reusable** - Theme components can be used in multiple contexts

## Future Enhancements

- Theme preview in admin panel
- Theme A/B testing
- Custom theme builder
- Theme marketplace
- Dynamic theme switching
- Theme versioning
