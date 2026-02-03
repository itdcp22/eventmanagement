# Dubai Crocodile Park - Elementor Landing Page Guide

This guide explains how to recreate the campaign landing page in Elementor using the provided HTML/CSS as reference.

## Design System

### Color Palette (Add to Elementor Global Colors)

| Name | Hex Code | Usage |
|------|----------|-------|
| Primary | `#1a5d1a` | Buttons, Icons, Accents |
| Primary Light | `#2d7a2d` | Hover states, Gradients |
| Primary Dark | `#0d3d0d` | Dark accents |
| Secondary | `#f5a623` | CTAs, Highlights, Badges |
| Dark | `#1a1a1a` | Headings |
| Gray | `#666666` | Body text |
| Light BG | `#f8f9f5` | Section backgrounds |

### Typography (Add to Elementor Global Fonts)

- **Headings**: Montserrat (600-800 weight)
- **Body**: Open Sans (400-600 weight)

## Page Sections & Widgets

### 1. Header Section
**Widgets needed:**
- Site Logo
- Nav Menu (horizontal)
- Button (CTA)

**Settings:**
- Position: Fixed
- Background: White
- Box Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Height: 80px

---

### 2. Hero Section
**Widgets needed:**
- Heading (H1)
- Text Editor
- Button Group
- Icon Box (3x for features)

**Background:**
- Type: Gradient overlay on image
- Gradient: 135deg, rgba(26, 93, 26, 0.95) to rgba(13, 61, 13, 0.9)
- Min Height: 100vh
- Padding: 120px top, 80px bottom

**Badge (Limited Time Offer):**
- Use Text widget with custom styling
- Background: #f5a623
- Border Radius: 50px
- Add animation: Pulse

---

### 3. Promo Banner Section
**Widgets needed:**
- Heading
- Text Editor
- Countdown Timer (Elementor Pro)
- Button

**Background:**
- Gradient: 90deg, #1a5d1a to #2d7a2d

**Layout:**
- Flexbox: Space between
- Gap: 30px

---

### 4. Experience Section
**Widgets needed:**
- Section Label (Text widget)
- Heading
- Text Editor
- Image
- Icon Box (3x)
- Button

**Layout:**
- 2 columns (1:1 ratio)
- Gap: 50px
- Background: #f8f9f5

**Image Badge:**
- Position: Absolute
- Bottom: -20px, Right: -20px
- Background: #f5a623
- Border Radius: 16px

---

### 5. Highlights Section
**Widgets needed:**
- Section Header widgets
- Icon Box (6x in 3-column grid)

**Icon Box Settings:**
- Text align: Center
- Padding: 40px
- Background: White
- Border Radius: 16px
- Box Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Hover: translateY(-8px), larger shadow

---

### 6. Gallery Section
**Widgets needed:**
- Image Gallery or Grid widget
- Lightbox enabled

**Layout:**
- CSS Grid: 4 columns
- First image: span 2 columns, 2 rows
- Gap: 15px
- Border Radius: 8px

---

### 7. Tickets/Pricing Section
**Widgets needed:**
- Price Table (3x)
- OR custom layout with Inner Section

**Featured Card:**
- Border: 2px solid #1a5d1a
- Scale: 1.05
- Badge position: Absolute top center

**Price Styling:**
- Amount: Montserrat, 48px, 800 weight, #1a5d1a
- Currency/Period: 14-16px, gray

---

### 8. Testimonials Section
**Widgets needed:**
- Testimonial Carousel (Elementor Pro)
- OR 3-column grid with custom testimonial cards

**Card Settings:**
- Background: White
- Padding: 40px
- Border Radius: 16px
- Stars: #f5a623

---

### 9. CTA Section
**Widgets needed:**
- Heading
- Text Editor
- Button Group

**Background:**
- Same as Hero (gradient + image)
- Text: White, centered

---

### 10. Contact Section
**Widgets needed:**
- Heading
- Icon List
- Social Icons
- Google Maps embed

**Layout:**
- 2 columns (1:1.5 ratio)

---

### 11. Footer Section
**Widgets needed:**
- Site Logo
- Text Editor
- Nav Menu (vertical)
- Form (newsletter)

**Layout:**
- 4 columns
- Background: #1a1a1a
- Text: White/Gray

---

## Button Styles

### Primary Button
```
Background: #1a5d1a
Color: White
Padding: 14px 28px
Border Radius: 8px
Font: Montserrat, 15px, 600, Uppercase
Hover: #0d3d0d, translateY(-2px)
```

### Secondary Button
```
Background: #f5a623
Color: #1a1a1a
Same padding/radius as primary
```

### Outline Button
```
Background: Transparent
Border: 2px solid #1a5d1a
Color: #1a5d1a
Hover: Fill with #1a5d1a, text white
```

---

## Responsive Breakpoints

| Breakpoint | Adjustments |
|------------|-------------|
| 1024px | Stack experience grid, 2-col highlights |
| 768px | Hide nav (hamburger), stack most grids |
| 480px | Full-width buttons, smaller padding |

---

## Quick Start Steps

1. **Create new page** in WordPress
2. **Edit with Elementor**
3. **Set up Global Colors** (Site Settings > Colors)
4. **Set up Global Fonts** (Site Settings > Typography)
5. **Build sections** following the widget guide above
6. **Add custom CSS** if needed (Page Settings > Custom CSS)
7. **Check responsive** at each breakpoint
8. **Publish** and test

---

## Files Included

- `landing-page.html` - Complete HTML structure
- `styles.css` - Full CSS with comments
- `script.js` - JavaScript functionality

Use these as reference when building in Elementor. The HTML comments indicate which Elementor widgets to use for each section.
