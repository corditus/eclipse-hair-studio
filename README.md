# Eclipse Hair Salon — website

A single-page, static site for a modern hair salon. Plain HTML, CSS and vanilla
JavaScript with **no build step**, designed to be hosted on GitHub Pages.

- One scrolling page, sticky navigation, persistent booking call-to-action.
- Warm editorial look, light/dark themes, subtle scroll motion, reduced-motion aware.
- Accessible (skip link, landmarks, focus states, keyboard + swipe lightbox).
- SEO ready: meta tags, Open Graph, `LocalBusiness`/`HairSalon` JSON-LD, sitemap, robots.

> **Placeholder content:** the images, address, phone, email, Instagram handle,
> prices and reviews are examples. Replace them with the salon's real details
> before going live (see below). Search the project for `eclipsehairsalon.com`,
> `(503) 555-0142`, `hello@eclipsehairsalon.com` and `eclipsehairpdx`.

## Files

```text
/
├── index.html        # the whole page: all nine sections
├── 404.html          # GitHub Pages "not found" page
├── css/style.css     # design tokens + all styling
├── js/main.js        # nav, theme, scroll reveal, open-now, lightbox
├── img/              # SVG placeholders — swap for real photos
├── fonts/            # put self-hosted fonts here (currently using Google Fonts)
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── CNAME.example     # rename to CNAME and edit to use a custom domain
├── .nojekyll         # tells GitHub Pages to serve files as-is
├── tools/make_placeholders.py
└── README.md
```

## Publish to GitHub Pages

1. Create a repository and push these files to the `main` branch.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   branch `main`, folder `/ (root)`, then **Save**.
4. The site appears at `https://<username>.github.io/<repo-name>/` within a minute.

All asset paths are **relative**, so the site works from a project subpath
(`username.github.io/repo-name/`) as well as from a custom domain.

### Custom domain (optional)

1. Rename `CNAME.example` to `CNAME` and replace the domain with your own.
2. At your DNS provider add a `CNAME` record pointing `www` to
   `<username>.github.io`, and redirect the apex domain to `www`.
3. In **Settings → Pages**, tick **Enforce HTTPS**.

## Editing content

Everything lives in `index.html`; look for the section comments
(`<!-- 3. Services & Pricing -->`, etc.).

### Prices and services
Find the `<ul class="services">` list. Each `<li class="service">` has a title,
description, `from` price and duration. Copy a block to add a service, delete one
to remove it. Keep prices as plain text.

### Hours
Two places to update so they stay in sync:

1. The visible list under `#visit` (`<ul class="hours" data-hours>`).
2. The schedule in `js/main.js`, in the `HOURS` object near *Opening hours*.
   Times are **minutes from midnight** (`10:00` = `600`, `18:00` = `1080`);
   use `null` for a closed day. The "Open now / Closed" badge and the hero
   status line update automatically from this object.

### Photos
Replace files in `img/`, keeping the same aspect ratios:

- `hero.svg` — wide (1920×1280). Shows behind the hero text.
- `about.svg` — portrait (6:7). The studio interior.
- `team-1.svg … team-3.svg` — portrait (9:11) stylist head-and-shoulders.
- `look-01.svg … look-12.svg` — gallery, mixed aspect ratios for the masonry.
- `og.svg` — 1200×630 social sharing card.

Prefer **WebP or AVIF with a JPEG fallback** (target under ~200 KB each).
Easiest no-tools option: rename your photo to match the existing filename and
update the `src`, `width`, `height` and `alt` in `index.html`. For modern formats,
use `<picture>`:

```html
<picture>
  <source srcset="img/look-01.avif" type="image/avif">
  <source srcset="img/look-01.webp" type="image/webp">
  <img src="img/look-01.jpg" width="1000" height="1300" loading="lazy"
       decoding="async" alt="Describe the look for screen readers.">
</picture>
```

Always write a meaningful `alt` description. Gallery tiles also carry a
`data-caption` used by the lightbox.

### Booking link
Every booking button has the attribute `data-booking`. Update the `href` on each
one (search for `data-booking`) to the salon's Fresha / Square / Setmore /
Calendly page. To embed a widget instead, replace a button with the platform's
provided embed snippet.

### Contact details
Update the `tel:` and `mailto:` links in the header, hero, visit section, footer
and the mobile bar, plus the address and JSON-LD block in `<head>`.

### Reviews
Edit the `<ul class="reviews">` list. Star rating is set by the `aria-label`
(`Rated 5 out of 5`) and the `★` characters.

### Colours and fonts (retheme in one place)
All design tokens are CSS custom properties at the top of `css/style.css`:

```css
:root {
  --bg: #FAF7F2;        /* page background */
  --text: #1E1B18;      /* body text */
  --accent: #B5654A;    /* brand terracotta */
  --accent-ink: #9C4E34;/* accessible accent for text/buttons */
  --radius: 12px;       /* shared corner radius */
}
```

Dark mode values sit just below. Fonts are loaded from Google Fonts in
`index.html`; to self-host, drop files in `fonts/`, add `@font-face` rules with
`font-display: swap`, and remove the Google Fonts `<link>`s.

## Notes on quality

- The page is intentionally light: SVG placeholders plus system/Google fonts.
  Real photos will dominate the page weight — optimise them.
- Motion respects `prefers-reduced-motion`.
- Keyboard support: <kbd>Esc</kbd> closes the lightbox and mobile menu,
  <kbd>←</kbd>/<kbd>→</kbd> move between images; swipe works on touch screens.
- Run a Lighthouse audit (Chrome DevTools → Lighthouse) on the deployed URL.
