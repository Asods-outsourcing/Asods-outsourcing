# Background Images Configuration

All pages now have their own unique background images in the hero sections. Here's the complete setup:

## Hero Background Images Map

| Page | Route | Background File | Image Theme |
|------|-------|-----------------|-------------|
| **Home** | `/` | `hero-home.jpg` | Professional collaboration |
| **About** | `/about` | `hero-about.jpg` | Team & company culture |
| **Services** | `/services` | `hero-services.jpg` | Professional business |
| **Industries** | `/industries` | `hero-industries.jpg` | Manufacturing & technology |
| **Careers** | `/careers` | `hero-careers.jpg` | Career & recruitment |
| **Contact** | `/contact` | `hero-contact.jpg` | Communication & connection |
| **FAQ** | `/faq` | `hero-faq.jpg` | Help & support |
| **Privacy Policy** | `/privacy-policy` | `hero-privacy.jpg` | Security & privacy |

## Logo Configuration

- **File:** `logo.jpg`
- **Location:** Displayed in the sticky header on all pages
- **Size:** 40x40px (recommended)

## How It Works

Each page uses a hero section with:
- **Background image** with dark overlay (40% opacity) for text readability
- **White text** that contrasts with the dark overlay
- **Responsive design** - images scale on mobile and desktop
- **Consistent branding** - gold accents and navy text throughout

## Customizing Images

### Change overlay opacity:
To adjust darkness of the overlay on any page, modify the `bg-black/40` class:
- `bg-black/20` = lighter (20% opacity)
- `bg-black/50` = darker (50% opacity)

### Use different image for specific page:
If you want to use a different background image later, simply:
1. Save the new image to `public/` folder
2. Update the background image URL in that page's hero section
3. Example: `backgroundImage: "url('/new-hero-image.jpg')"`

## Browser Compatibility

All background images are optimized for:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Responsive design (automatically scales)

## Performance Tips

- JPG format used for optimal file size (typically 50-200KB per image)
- Images cached by browsers for faster subsequent loads
- Overlay reduces need for text shadows/contrast filters

---

**Setup Complete!** All pages now display professional, on-brand hero sections with unique background images. 🎨
