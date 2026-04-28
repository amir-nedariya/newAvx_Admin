# Storefront Theme Flow - Web Service Side

## Overview

This document explains the complete flow of how consultants select, customize, and submit storefront themes on the web service side. The system uses the same theme file structure as the admin side, with dynamic data editing and local storage for data persistence.

---

## Architecture Components

### 1. Theme Files Structure

- **About Us Themes**: 3 variants (Basic, Pro, Premium)
- **Why Buy Themes**: 3 variants (Basic, Pro, Premium)
- Each theme has a unique `themeId`
- Files are reusable React components with dynamic data props

### 2. Data Storage Layers

- **Local Storage**: Temporary storage during editing (auto-save on field blur)
- **Backend API**: Permanent storage in `consult_store_draft` entity
- **Theme Registry**: Maps `themeId` to corresponding theme component files

---

## Complete User Flow

### Step 1: Browse Available Themes

**Endpoint**: `GET /api/themes/all`

**User Action**:

- Consultant navigates to "Storefront Themes" section
- System fetches all available themes (About Us + Why Buy)

**Response Structure**:

```json
{
  "aboutUsThemes": [
    {
      "themeId": "about_us_basic_1",
      "title": "About Us - Basic Theme 1",
      "tier": "BASIC",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://..."
    },
    {
      "themeId": "about_us_pro_1",
      "title": "About Us - Pro Theme 1",
      "tier": "PRO",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://..."
    },
    {
      "themeId": "about_us_premium_1",
      "title": "About Us - Premium Theme 1",
      "tier": "PREMIUM",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://..."
    }
  ],
  "whyBuyThemes": [
    {
      "themeId": "why_buy_basic_1",
      "title": "Why Buy - Basic Theme 1",
      "tier": "BASIC",
      "thumbnailUrl": "https://...",
      "previewUrl": "https://..."
    }
    // ... more themes
  ]
}
```

**UI Display**:

- Grid layout showing theme thumbnails
- Filter by tier (Basic/Pro/Premium)
- "Preview with Dummy Data" button on each theme card

---

### Step 2: Preview Theme with Dummy Data

**User Action**:

- Consultant clicks "Preview" on any theme
- System loads the theme component file based on `themeId`

**Theme Registry Mapping**:

```javascript
const THEME_REGISTRY = {
  // About Us Themes
  about_us_basic_1: () =>
    import("./themes/about-us/basic/AboutUsBasic1Display.jsx"),
  about_us_basic_2: () =>
    import("./themes/about-us/basic/AboutUsBasic2Display.jsx"),
  about_us_pro_1: () => import("./themes/about-us/pro/AboutUsPro1Display.jsx"),
  about_us_premium_1: () =>
    import("./themes/about-us/premium/AboutUsPremium1Display.jsx"),

  // Why Buy Themes
  why_buy_basic_1: () =>
    import("./themes/why-buy/basic/WhyBuyBasic1Display.jsx"),
  why_buy_basic_2: () =>
    import("./themes/why-buy/basic/WhyBuyBasic2Display.jsx"),
  why_buy_pro_1: () => import("./themes/why-buy/pro/WhyBuyPro1Display.jsx"),
  why_buy_premium_1: () =>
    import("./themes/why-buy/premium/WhyBuyPremium1Display.jsx"),
};
```

**Dummy Data Structure**:

```javascript
// Example for About Us Basic Theme 1
const DUMMY_DATA_ABOUT_US_BASIC_1 = {
  heading: "About Our Dealership",
  subheading: "Your Trusted Partner in Quality Vehicles",
  description: "We have been serving customers for over 20 years...",
  image: "https://placeholder.com/about-us.jpg",
  stats: [
    { label: "Years in Business", value: "20+" },
    { label: "Happy Customers", value: "5000+" },
    { label: "Vehicles Sold", value: "10000+" },
  ],
  features: [
    {
      icon: "shield",
      title: "Quality Assured",
      description: "All vehicles inspected",
    },
    {
      icon: "dollar",
      title: "Best Prices",
      description: "Competitive pricing",
    },
  ],
};
```

**UI Display**:

- Full-screen preview modal
- Theme rendered with dummy data
- "Use This Theme" button at the bottom
- "Close" button to go back

---

### Step 3: Select Theme for Customization

**User Action**:

- Consultant clicks "Use This Theme" button
- System navigates to editing screen

**Navigation**:

```
/storefront/themes/edit?themeId=about_us_basic_1&section=about-us
```

**Local Storage Check**:

```javascript
// Check if draft exists in local storage
const draftKey = `storefront_draft_${consultantId}_${themeId}`;
const existingDraft = localStorage.getItem(draftKey);

if (existingDraft) {
  // Show "Resume Editing" dialog
  // Option 1: Continue with saved data
  // Option 2: Start fresh (clear local storage)
}
```

---

### Step 4: Edit Theme in Editing Mode

**User Action**:

- Consultant sees the same theme component but in **edit mode**
- All fields are now editable (text inputs, textareas, image uploads, etc.)

**Edit Mode Component Structure**:

```jsx
// AboutUsBasic1Edit.jsx
import React, { useState, useEffect } from "react";

const AboutUsBasic1Edit = ({ initialData, onFieldChange }) => {
  const [formData, setFormData] = useState(
    initialData || {
      heading: "",
      subheading: "",
      description: "",
      image: null,
      stats: [
        { label: "", value: "" },
        { label: "", value: "" },
        { label: "", value: "" },
      ],
      features: [
        { icon: "", title: "", description: "" },
        { icon: "", title: "", description: "" },
      ],
    },
  );

  // Auto-save to local storage on field blur
  const handleFieldBlur = (fieldName, value) => {
    const updatedData = { ...formData, [fieldName]: value };
    setFormData(updatedData);

    // Save to local storage
    const draftKey = `storefront_draft_${consultantId}_${themeId}`;
    localStorage.setItem(draftKey, JSON.stringify(updatedData));

    // Notify parent component
    onFieldChange(updatedData);
  };

  return (
    <div className="edit-mode-container">
      <div className="edit-field">
        <label>Heading</label>
        <input
          type="text"
          value={formData.heading}
          onChange={(e) =>
            setFormData({ ...formData, heading: e.target.value })
          }
          onBlur={(e) => handleFieldBlur("heading", e.target.value)}
          placeholder="Enter heading..."
        />
      </div>

      <div className="edit-field">
        <label>Subheading</label>
        <input
          type="text"
          value={formData.subheading}
          onChange={(e) =>
            setFormData({ ...formData, subheading: e.target.value })
          }
          onBlur={(e) => handleFieldBlur("subheading", e.target.value)}
          placeholder="Enter subheading..."
        />
      </div>

      <div className="edit-field">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          onBlur={(e) => handleFieldBlur("description", e.target.value)}
          placeholder="Enter description..."
          rows={5}
        />
      </div>

      <div className="edit-field">
        <label>Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        {formData.image && (
          <img src={formData.image} alt="Preview" className="image-preview" />
        )}
      </div>

      {/* Stats Section */}
      <div className="edit-section">
        <h3>Statistics</h3>
        {formData.stats.map((stat, index) => (
          <div key={index} className="edit-field-group">
            <input
              type="text"
              value={stat.label}
              onChange={(e) => handleStatChange(index, "label", e.target.value)}
              onBlur={(e) => handleFieldBlur("stats", formData.stats)}
              placeholder="Label (e.g., Years in Business)"
            />
            <input
              type="text"
              value={stat.value}
              onChange={(e) => handleStatChange(index, "value", e.target.value)}
              onBlur={(e) => handleFieldBlur("stats", formData.stats)}
              placeholder="Value (e.g., 20+)"
            />
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="edit-section">
        <h3>Features</h3>
        {formData.features.map((feature, index) => (
          <div key={index} className="edit-field-group">
            <select
              value={feature.icon}
              onChange={(e) =>
                handleFeatureChange(index, "icon", e.target.value)
              }
              onBlur={(e) => handleFieldBlur("features", formData.features)}
            >
              <option value="">Select Icon</option>
              <option value="shield">Shield</option>
              <option value="dollar">Dollar</option>
              <option value="star">Star</option>
              <option value="check">Check</option>
            </select>
            <input
              type="text"
              value={feature.title}
              onChange={(e) =>
                handleFeatureChange(index, "title", e.target.value)
              }
              onBlur={(e) => handleFieldBlur("features", formData.features)}
              placeholder="Feature Title"
            />
            <textarea
              value={feature.description}
              onChange={(e) =>
                handleFeatureChange(index, "description", e.target.value)
              }
              onBlur={(e) => handleFieldBlur("features", formData.features)}
              placeholder="Feature Description"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsBasic1Edit;
```

**Auto-Save Mechanism**:

- Triggered on `onBlur` event of each field
- Debounced to avoid excessive writes
- Shows "Saved to draft" indicator

**Local Storage Structure**:

```javascript
// Key format: storefront_draft_{consultantId}_{themeId}
{
  "themeId": "about_us_basic_1",
  "section": "about-us",
  "lastModified": "2026-04-28T10:30:00Z",
  "data": {
    "heading": "About Our Dealership",
    "subheading": "Your Trusted Partner",
    "description": "We have been...",
    "image": "base64_or_url",
    "stats": [...],
    "features": [...]
  }
}
```

---

### Step 5: Preview Filled Data

**User Action**:

- Consultant clicks "Preview" button (sticky button at bottom)
- System navigates to preview screen

**Navigation**:

```
/storefront/themes/preview?themeId=about_us_basic_1&section=about-us
```

**Data Loading**:

```javascript
// Load from local storage
const draftKey = `storefront_draft_${consultantId}_${themeId}`;
const draftData = JSON.parse(localStorage.getItem(draftKey));

// Merge with consultant's actual data
const previewData = {
  ...draftData.data,
  consultantName: consultant.name,
  consultantLogo: consultant.logoUrl,
  consultantAddress: consultant.address,
  consultantPhone: consultant.phone,
  consultantEmail: consultant.email,
};
```

**UI Display**:

- Full-screen preview (same as display mode)
- Theme rendered with consultant's filled data
- "Back to Edit" button (top-left)
- "Submit for Approval" button (bottom-right)
- Mobile responsive preview toggle

---

### Step 6: Final Submit

**Endpoint**: `POST /api/storefront/draft/save`

**User Action**:

- Consultant clicks "Submit for Approval" button
- Confirmation dialog appears
- On confirm, system submits data to backend

**Request Payload Structure**:

#### For About Us Themes:

```json
{
  "consultId": "uuid-consultant-id",
  "themeId": "about_us_basic_1",
  "section": "ABOUT_US",
  "themeData": {
    "heading": "About Our Dealership",
    "subheading": "Your Trusted Partner in Quality Vehicles",
    "description": "We have been serving customers for over 20 years with dedication and integrity...",
    "imageUrl": "https://s3.amazonaws.com/storefront/images/about-us-banner.jpg",
    "stats": [
      {
        "label": "Years in Business",
        "value": "20+"
      },
      {
        "label": "Happy Customers",
        "value": "5000+"
      },
      {
        "label": "Vehicles Sold",
        "value": "10000+"
      }
    ],
    "features": [
      {
        "icon": "shield",
        "title": "Quality Assured",
        "description": "All vehicles undergo rigorous inspection"
      },
      {
        "icon": "dollar",
        "title": "Best Prices",
        "description": "Competitive pricing guaranteed"
      }
    ]
  },
  "status": "PENDING_APPROVAL"
}
```

#### For Why Buy Themes:

```json
{
  "consultId": "uuid-consultant-id",
  "themeId": "why_buy_basic_1",
  "section": "WHY_BUY",
  "themeData": {
    "mainHeading": "Why Buy From Us?",
    "subheading": "Experience the Difference",
    "heroImage": "https://s3.amazonaws.com/storefront/images/why-buy-hero.jpg",
    "reasons": [
      {
        "icon": "certificate",
        "title": "Certified Vehicles",
        "description": "Every vehicle is certified and comes with warranty",
        "image": "https://s3.amazonaws.com/storefront/images/certified.jpg"
      },
      {
        "icon": "support",
        "title": "24/7 Support",
        "description": "Our team is always available to help you",
        "image": "https://s3.amazonaws.com/storefront/images/support.jpg"
      },
      {
        "icon": "finance",
        "title": "Easy Financing",
        "description": "Flexible payment options tailored to your needs",
        "image": "https://s3.amazonaws.com/storefront/images/finance.jpg"
      }
    ],
    "testimonials": [
      {
        "customerName": "John Doe",
        "rating": 5,
        "comment": "Best car buying experience ever!",
        "date": "2026-03-15"
      }
    ],
    "ctaButton": {
      "text": "Browse Our Inventory",
      "link": "/vehicles"
    }
  },
  "status": "PENDING_APPROVAL"
}
```

**Backend Processing**:

1. Validate payload structure
2. Upload images to S3 (if base64 provided)
3. Save to `consult_store_draft` table
4. Set status to `PENDING_APPROVAL`
5. Trigger admin notification

**Response**:

```json
{
  "status": "OK",
  "message": "Storefront draft submitted successfully",
  "data": {
    "draftId": "uuid-draft-id",
    "status": "PENDING_APPROVAL",
    "submittedAt": "2026-04-28T10:45:00Z"
  }
}
```

**Post-Submit Actions**:

```javascript
// Clear local storage
const draftKey = `storefront_draft_${consultantId}_${themeId}`;
localStorage.removeItem(draftKey);

// Show success message
toast.success("Storefront submitted for approval!");

// Redirect to dashboard
navigate("/consultant/dashboard");
```

---

## Theme-Specific Payload Structures

### 1. About Us Basic Theme 1

```typescript
interface AboutUsBasic1Data {
  heading: string;
  subheading: string;
  description: string;
  imageUrl: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}
```

### 2. About Us Basic Theme 2

```typescript
interface AboutUsBasic2Data {
  title: string;
  tagline: string;
  story: string;
  bannerImage: string;
  timeline: Array<{
    year: string;
    milestone: string;
  }>;
  team: Array<{
    name: string;
    role: string;
    photo: string;
  }>;
}
```

### 3. About Us Pro Theme 1

```typescript
interface AboutUsPro1Data {
  heroHeading: string;
  heroSubheading: string;
  heroVideo: string;
  missionStatement: string;
  visionStatement: string;
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  achievements: Array<{
    icon: string;
    number: string;
    label: string;
  }>;
  gallery: Array<{
    imageUrl: string;
    caption: string;
  }>;
}
```

### 4. About Us Premium Theme 1

```typescript
interface AboutUsPremium1Data {
  heroSection: {
    heading: string;
    subheading: string;
    backgroundVideo: string;
    ctaButton: {
      text: string;
      link: string;
    };
  };
  aboutSection: {
    title: string;
    content: string;
    sideImage: string;
  };
  statsSection: {
    stats: Array<{
      icon: string;
      value: string;
      label: string;
      description: string;
    }>;
  };
  teamSection: {
    heading: string;
    members: Array<{
      name: string;
      role: string;
      bio: string;
      photo: string;
      socialLinks: {
        linkedin?: string;
        twitter?: string;
      };
    }>;
  };
  testimonialsSection: {
    heading: string;
    testimonials: Array<{
      customerName: string;
      rating: number;
      comment: string;
      photo: string;
      date: string;
    }>;
  };
}
```

### 5. Why Buy Basic Theme 1

```typescript
interface WhyBuyBasic1Data {
  mainHeading: string;
  subheading: string;
  heroImage: string;
  reasons: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  ctaButton: {
    text: string;
    link: string;
  };
}
```

### 6. Why Buy Basic Theme 2

```typescript
interface WhyBuyBasic2Data {
  title: string;
  subtitle: string;
  benefits: Array<{
    icon: string;
    heading: string;
    description: string;
    image: string;
  }>;
  guarantees: Array<{
    icon: string;
    text: string;
  }>;
}
```

### 7. Why Buy Pro Theme 1

```typescript
interface WhyBuyPro1Data {
  heroSection: {
    heading: string;
    subheading: string;
    backgroundImage: string;
  };
  benefitsSection: {
    heading: string;
    benefits: Array<{
      icon: string;
      title: string;
      description: string;
      image: string;
    }>;
  };
  comparisonSection: {
    heading: string;
    competitors: Array<{
      feature: string;
      us: boolean;
      others: boolean;
    }>;
  };
  testimonialsSection: {
    testimonials: Array<{
      customerName: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
}
```

### 8. Why Buy Premium Theme 1

```typescript
interface WhyBuyPremium1Data {
  heroSection: {
    heading: string;
    subheading: string;
    backgroundVideo: string;
    ctaButton: {
      text: string;
      link: string;
    };
  };
  featuresSection: {
    heading: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
      image: string;
      benefits: string[];
    }>;
  };
  processSection: {
    heading: string;
    steps: Array<{
      stepNumber: number;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  guaranteeSection: {
    heading: string;
    guarantees: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    badgeImage: string;
  };
  socialProofSection: {
    heading: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
    reviews: Array<{
      customerName: string;
      rating: number;
      comment: string;
      photo: string;
      verifiedBadge: boolean;
    }>;
  };
  faqSection: {
    heading: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}
```

---

## Database Schema

### `consult_store_draft` Table

```sql
CREATE TABLE consult_store_draft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consult_id UUID NOT NULL REFERENCES consultations(id),
  theme_id VARCHAR(100) NOT NULL,
  section VARCHAR(50) NOT NULL, -- 'ABOUT_US' or 'WHY_BUY'
  theme_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING_APPROVAL', -- PENDING_APPROVAL, APPROVED, REJECTED, REQUEST_CHANGES
  admin_remark TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consult_store_draft_consult_id ON consult_store_draft(consult_id);
CREATE INDEX idx_consult_store_draft_status ON consult_store_draft(status);
CREATE INDEX idx_consult_store_draft_section ON consult_store_draft(section);
```

---

## Error Handling

### Local Storage Failures

```javascript
try {
  localStorage.setItem(draftKey, JSON.stringify(data));
} catch (error) {
  if (error.name === "QuotaExceededError") {
    // Storage full - show warning
    toast.warning("Local storage is full. Please submit your changes soon.");
  } else {
    // Other errors
    console.error("Failed to save draft:", error);
  }
}
```

### API Failures

```javascript
try {
  await submitStorefrontDraft(payload);
  // Success handling
} catch (error) {
  if (error.response?.status === 413) {
    toast.error("Images are too large. Please compress them.");
  } else if (error.response?.status === 400) {
    toast.error("Invalid data. Please check all fields.");
  } else {
    toast.error("Failed to submit. Please try again.");
  }
}
```

---

## Admin Approval Flow

### Admin Side Actions

1. View submitted draft in "Storefront Approvals" section
2. Preview the theme with consultant's data
3. Actions available:
   - **Approve**: Publish to live storefront
   - **Reject**: Send back with remarks
   - **Request Changes**: Ask for specific modifications

### Consultant Notifications

- Email notification on approval/rejection
- In-app notification with admin remarks
- Ability to edit and resubmit if changes requested

---

## Key Features

### 1. Auto-Save

- Saves on field blur
- Debounced (500ms delay)
- Visual indicator ("Saved" / "Saving...")

### 2. Data Persistence

- Local storage for drafts
- Survives page refresh
- Cleared only on successful submit

### 3. Image Handling

- Client-side compression before upload
- Base64 preview during editing
- S3 upload on final submit
- Fallback to placeholder if upload fails

### 4. Validation

- Required field checks
- Character limits
- Image size/format validation
- Real-time error messages

### 5. Responsive Design

- Mobile-friendly editing
- Touch-optimized inputs
- Preview in different screen sizes

---

## Technical Stack

### Frontend

- **React**: Component-based UI
- **React Router**: Navigation
- **Axios**: API calls
- **React Hook Form**: Form management
- **Yup**: Validation
- **React Toastify**: Notifications
- **TailwindCSS**: Styling

### Backend

- **Spring Boot**: REST API
- **PostgreSQL**: Database
- **AWS S3**: Image storage
- **Redis**: Caching (optional)

---

## Future Enhancements

1. **Real-time Collaboration**: Multiple admins can review simultaneously
2. **Version History**: Track changes over time
3. **A/B Testing**: Test different themes with real users
4. **Analytics**: Track which themes perform best
5. **AI Suggestions**: Auto-fill content based on consultant's business
6. **Drag-and-Drop Builder**: Visual theme customization
7. **Template Marketplace**: Consultants can purchase premium themes

---

## Conclusion

This flow ensures a seamless experience for consultants to customize their storefront while maintaining data integrity through local storage and backend persistence. The use of the same theme files on both admin and web service sides ensures consistency and reduces maintenance overhead.
