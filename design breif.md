# Hair Salon Website: Design Brief

_Single-page, modern, static site hosted on GitHub Pages_

## 1. Overview

A fast, elegant one-page website for  "Eclipse Hair Salon", a modern hair salon. The site has one job: turn a visitor into a booking or a call. It should feel premium and calm, load instantly on a phone, and be easy for the owner to update without a developer.

## 2. Goals

- **Primary:** drive bookings (tap-to-book button and phone number reachable at all times)
- **Secondary:** showcase work, communicate brand personality, establish trust (reviews, stylists)
- **Tertiary:** make location, hours, and pricing obvious in under 10 seconds

**Success metrics:** booking-button click rate, call taps on mobile, Lighthouse score 95+ across all categories, load under 1.5s on 4G.

## 3. Audience

- Primary: women and men aged 22 to 45 looking for cuts, colour, and styling; mostly on mobile; often arriving from Instagram or Google Maps
- Secondary: first-time visitors comparing salons, who need price clarity and proof of quality

## 4. Brand and Tone

- **Personality:** refined, warm, confident, unfussy
- **Voice:** short, human sentences. No salon clichés ("tresses", "locks of love")
- **Keywords:** editorial, soft, tactile, modern

## 5. Page Structure

Single scrolling page with a sticky nav that anchors to each section.

|   |   |   |   |
|---|---|---|---|
|#|Section|Purpose|Key content|
|1|**Header / Nav**|Orientation + constant CTA|Logo, anchor links, persistent "Book" button|
|2|**Hero**|First impression|Full-bleed image or short muted loop, one-line promise, primary CTA|
|3|**Services & Pricing**|Remove price anxiety|4 to 6 categories (cut, colour, balayage, treatments, styling) with "from" prices|
|4|**Gallery**|Prove the quality|8 to 12 before/after or finished-look images in a masonry or grid layout, with lightbox|
|5|**Team**|Build personal trust|Photo, name, specialty, and a one-line bio per stylist|
|6|**About**|Brand story|2 to 3 short paragraphs, one supporting image|
|7|**Testimonials**|Social proof|3 to 4 short quotes with first names and star rating|
|8|**Visit / Contact**|Convert and navigate|Address, embedded map link, hours, phone, email, Instagram, booking CTA|
|9|**Footer**|Closure|Small print, social links, copyright|

## 6. Visual Direction

**Look and feel:** generous whitespace, large photography, restrained typography, subtle motion. Think editorial magazine, not template.

**Colour (suggested starting palette, adjustable to brand):**

- Background: warm off-white `#FAF7F2`
- Text: deep charcoal `#1E1B18`
- Accent: muted clay or terracotta `#B5654A`
- Secondary surface: soft sand `#EDE6DB`
- Dark mode: invert to charcoal background with the same accent

**Typography:**

- Headings: a high-contrast serif (e.g. Playfair Display, Cormorant Garamond, or Fraunces)
- Body and UI: a clean sans-serif (e.g. Inter, DM Sans, or Manrope)
- Large, confident heading scale; body at 16 to 18px with 1.6 line height

**Imagery:**

- Natural light, real clients and real work, consistent colour grading
- No generic stock photos of scissors or combs
- Provide WebP/AVIF with JPEG fallback; lazy-load below the fold

**Motion:**

- Gentle fade/slide-up on scroll (`IntersectionObserver`), 200 to 400ms
- Hover states on buttons and gallery tiles
- Respect `prefers-reduced-motion`

## 7. Interaction and UX

- Mobile-first layout; breakpoints at roughly 640 / 1024 / 1440px
- Sticky "Book" button on mobile (bottom bar) with a tap-to-call secondary
- Smooth-scroll anchors with offset for the sticky header
- Gallery lightbox with keyboard and swipe support
- Hours block highlights "Open now" or "Closed" based on the visitor's time
- Tap targets at least 44px

## 8. Booking and Forms (static-site constraints)

GitHub Pages serves static files only, so there is no server-side code. Options, in order of recommendation:

1. **Link out to a booking platform** (Fresha, Square Appointments, Setmore, Calendly): simplest and most reliable
2. **Embedded booking widget** from the same platform
3. **Contact form** via a form service (Formspree, Web3Forms, or Netlify-style endpoints) for enquiries

Phone and email use `tel:` and `mailto:` links.

## 9. Technical Requirements

- Plain **HTML + CSS + minimal vanilla JS**; no build step required (optionally Tailwind via CLI or Eleventy if the owner wants templating)
- Deployed from the `main` branch (root or `/docs`) via GitHub Pages
- Use **relative paths** for assets so it works under `username.github.io/repo-name/`
- Optional custom domain via `CNAME` file and DNS records; HTTPS enforced
- Self-host fonts or use `font-display: swap`; preload the hero image
- Total page weight target: under 1 MB excluding the gallery's lazy-loaded images

Suggested repository layout:

```text
/
├── index.html        # single page, all sections
├── css/
│   └── style.css     # tokens, layout, components
├── js/
│   └── main.js       # nav, scroll reveal, lightbox
├── img/              # optimised WebP/AVIF + JPEG fallbacks
├── fonts/            # optional self-hosted
├── favicon.svg
├── CNAME             # custom domain (optional)
└── README.md         # how the owner updates content
```

Design tokens live in CSS custom properties so the owner can retheme in one place:

```css
:root {
  --bg: #FAF7F2;      /* page background */
  --text: #1E1B18;    /* body text */
  --accent: #B5654A;  /* buttons, links */
  --radius: 12px;     /* shared corner radius */
}
```

## 10. Accessibility

- Target **WCAG 2.2 AA**
- Colour contrast of at least 4.5:1 for text
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and one `h1`
- Descriptive `alt` text on all images
- Visible focus states and full keyboard navigation
- Skip-to-content link

## 11. SEO and Local Discovery

- Title and meta description with salon name and city
- `LocalBusiness` JSON-LD structured data (address, hours, phone, price range)
- Open Graph and Twitter card images for social sharing
- `sitemap.xml` and `robots.txt`
- Consistent name, address and phone with the Google Business Profile

## 12. Content Needed From the Client

- Logo (SVG preferred) and any brand colours or fonts
- 10 to 15 high-quality photos of work, plus stylist portraits and a salon interior shot
- Service list with prices and durations
- Stylist names, specialties, and short bios
- 3 to 5 genuine client reviews
- Address, hours, phone, email, social handles, and booking link

## 13. Deliverables

1. Responsive single-page site, deployed to GitHub Pages
2. Optimised image set and favicon
3. README with update instructions (swap photos, edit prices, change hours)
4. Lighthouse and accessibility check results

## 14. Out of Scope

- Online payments, user accounts, or a CMS
- Multi-page blog or e-commerce
- Custom backend or database

## 15. Open Questions

- Does the salon already use a booking platform?
- Is there an existing brand identity, or should one be proposed?
- Is a custom domain already owned?
- Preferred tone: more luxe and minimal, or more relaxed and playful?