# Design Document

## Overview

The 48 Property Marketing Dashboard is a single-page web application built with a dark luxury aesthetic featuring glassmorphism panels, high-contrast typography, and subtle interactive effects. The interface is optimized for large display presentations with TV-friendly spacing and a minimal, clean layout. Phase 1 delivers a static prototype using mock data and static assets.

## Architecture

### Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Styling with CSS Grid, Flexbox, glassmorphism effects, and animations
- **Vanilla JavaScript**: Lightweight interactivity for filter selections and UI updates
- **Static Assets**: SVG graphics for the stylized map and icons

### Design System

#### Color Palette

- **Background**: Deep dark blue-black (#0a0e27)
- **Primary Accent**: Gold (#d4af37)
- **Secondary Accent**: Soft white (#f8f9fa)
- **Glass Panel Background**: rgba(255, 255, 255, 0.05)
- **Glass Panel Border**: rgba(255, 255, 255, 0.1)
- **Hover Glow**: rgba(212, 175, 55, 0.3)
- **Text Primary**: #ffffff
- **Text Secondary**: rgba(255, 255, 255, 0.7)

#### Typography

- **Headings**: 32-48px, font-weight 700, letter-spacing 0.02em
- **Subheadings**: 24-28px, font-weight 600
- **Body Text**: 18-20px, font-weight 400, line-height 1.6
- **Labels**: 16-18px, font-weight 500
- **Font Family**: System font stack with fallback to sans-serif

#### Spacing Scale

- **Extra Small**: 8px
- **Small**: 16px
- **Medium**: 24px
- **Large**: 32px
- **Extra Large**: 48px
- **Touch Target Minimum**: 44x44px

#### Glassmorphism Style

- **Background**: rgba(255, 255, 255, 0.05)
- **Backdrop Filter**: blur(10px)
- **Border**: 1px solid rgba(255, 255, 255, 0.1)
- **Border Radius**: 16px
- **Box Shadow**: 0 8px 32px rgba(0, 0, 0, 0.3)

## Components and Interfaces

### 1. Header Component

**Purpose**: Display branding and establish visual hierarchy

**Layout**:
- Fixed position at top of viewport
- Height: 80px
- Padding: 24px 48px
- Glassmorphism panel with subtle backdrop blur

**Elements**:
- Logo "48." (left-aligned, 48px, gold color, font-weight 700)
- Tagline "Everything under the sun is negotiable" (right-aligned, 18px, secondary text color, italic)

**Styling**:
- Background: rgba(255, 255, 255, 0.03)
- Border-bottom: 1px solid rgba(255, 255, 255, 0.1)
- Backdrop-filter: blur(10px)

### 2. Filter Panel Component

**Purpose**: Provide property filtering controls

**Layout**:
- Fixed position on left side
- Width: 320px
- Height: calc(100vh - 80px)
- Padding: 32px 24px
- Glassmorphism panel
- Vertical scroll if content overflows

**Filter Button Styling**:
- Default State: Background rgba(255, 255, 255, 0.05), Border 1px solid rgba(255, 255, 255, 0.1)
- Hover State: Background rgba(255, 255, 255, 0.08), Box-shadow with gold glow
- Selected State: Background rgba(212, 175, 55, 0.2), Border gold, Gold text

### 3. Map Display Component

**Purpose**: Visual representation of Abuja with location zones

**Layout**:
- Center area between Filter Panel and Details Panel
- Padding: 48px
- SVG background with stylized map

**Zone Styling**:
- Default: Semi-transparent fill
- Selected: Gold accent with glow effect and pulse animation

### 4. Details Panel Component

**Purpose**: Display property information for selected location

**Layout**:
- Fixed position on right side
- Width: 400px
- Glassmorphism panel
- Scrollable property cards

### 5. Responsive Behavior

**Breakpoints**:
- Large Desktop (≥1920px): Default layout
- Desktop (1024px - 1919px): Reduced panel widths
- Tablet (768px - 1023px): Collapsible filter drawer

## Data Models

### Mock Data Structure

```javascript
const PropertyTypes = {
  DUPLEX: 'Duplex',
  APARTMENT: 'Apartment',
  BUNGALOW: 'Bungalow',
  TERRACE: 'Terrace'
};

const Locations = {
  KUJE: 'Kuje',
  IDU: 'Idu',
  BWARI: 'Bwari',
  LOKOGOMA: 'Lokogoma'
};

const Property = {
  id: 'string',
  title: 'string',
  type: 'PropertyTypes',
  location: 'Locations',
  price: 'number',
  priceCategory: 'string',
  paymentOptions: ['string'],
  bedrooms: 'number',
  bathrooms: 'number',
  squareMeters: 'number'
};
```

## Error Handling

Phase 1 error handling focuses on graceful degradation:

1. Missing assets: Display colored placeholders
2. Invalid filter state: Reset to defaults
3. Browser compatibility: Remove unsupported effects
4. Performance: Debounce interactions

## Testing Strategy

### Visual Testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Resolution testing (1080p, 2K, 4K)
- Visual regression for component states

### Functional Testing
- Filter interactions and visual feedback
- Map zone highlighting
- Details panel content updates

### Performance Testing
- Load time target: <2 seconds
- Interaction response: <100ms
- Animation: 60fps target

### Accessibility Testing
- Keyboard navigation
- Color contrast (WCAG AA)
- Screen reader compatibility
