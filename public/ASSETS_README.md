# Asset Files for ASODS

This folder stores all static assets (images, logos, etc.) that are used throughout the application.

## Required Assets

### 1. Logo
- **File:** `logo.png`
- **Size:** 40x40px (appears in header)
- **Format:** PNG with transparent background
- **Usage:** Header component displays your company logo

### 2. Hero Background Images
- **File:** `hero-background.jpg`
- **Size:** Recommended 1920x1080px or larger
- **Format:** JPG (for optimal performance)
- **Usage:** Background image for hero sections across all pages
- **Tip:** Use a professional, high-quality image that works with the dark overlay

## How to Add Your Assets

1. Save your logo as `logo.png` (40x40px recommended)
2. Save your hero background image as `hero-background.jpg`
3. Place both files in this `public/` directory
4. The app will automatically use them

## Optional: Custom Hero Images Per Page

If you want different background images for different pages, pass the `backgroundImage` prop to the `HeroSection` component:

```tsx
<HeroSection
  title="Your Title"
  subtitle="Your subtitle"
  backgroundImage="/careers-hero.jpg"
>
  {/* content */}
</HeroSection>
```

Then add `careers-hero.jpg` to this folder.

## Image Optimization Tips

- **Logo:** Keep it simple, works well as a square
- **Hero Images:** Use high-quality images but optimize file size (compress JPGs to <200KB)
- **Format:** Use PNG for logos (transparency), JPG for photos (smaller file size)
- **Placeholder:** If assets aren't added yet, the app will show a fallback background color

---

**Next Steps:**
1. Create or get your logo (40x40px PNG)
2. Create or get a hero background image (1920x1080px JPG)
3. Save them with the filenames above
4. Restart your dev server (`npm run dev`)
5. Your assets will appear automatically!
