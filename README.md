# Boss Hog Clearing Co. — website

Marketing site for **Boss Hog Clearing Co.**, a family-owned land clearing,
brush removal and forestry mulching business in McKinney, TX (serving a
70-mile radius). Static, dependency-free, and built to deploy anywhere that
serves files (Netlify, Cloudflare Pages, GitHub Pages, S3, nginx…).

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Full marketing site — 3D interactive hero, services, before/after, service-area radar, machine specs, FAQ, quote. |
| `quote.html` | Dedicated **Request-a-Quote landing page**, built for QR codes / ad traffic. Fuller form (acreage, timeline, photos) + fast call/text paths. |

## Structure
```
index.html            quote.html
robots.txt  sitemap.xml  site.webmanifest
assets/
  css/styles.css       # design system (one stylesheet, both pages)
  js/main.js           # hero FX, parallax, slider, reveals, FAQ, nav, mini-quote
  js/quote.js          # quote landing-page form
  img/                 # optimized responsive images (webp + jpg), icons, OG, blueprint SVGs
```

## What's interactive / "high-end"
- **3D immersive hero** — multi-layer pointer + scroll parallax, the Boss/Kubota photo tilts in 3D toward the cursor, a cursor spotlight, live **cigar-smoke** canvas off the hog's cigar, and drifting **embers + ground fog**. Falls back gracefully and respects `prefers-reduced-motion`; uses device-tilt parallax + lighter particle counts on mobile.
- **Construction-blueprint background system** — every section is staged like a drawing sheet: drafting grid, survey crosshairs, engraved section spines ("Nº 01"), giant numeral watermarks, drawing-sheet **title blocks**, and authentic faint linework — a dimensioned **Kubota KX040-5 side elevation**, a **survey site-plan/plat** (bearings, clearing limits, proposed pad, north arrow, scale bar), and a **compass rose** (`bp-*.svg`, light + dark variants).
- **Drag before/after slider** with idle auto-sweep, touch, and keyboard support.
- **Service-area radar**, animated count-up specs, accordion FAQ, marquee.
- **Mobile-first UX** — collapsible nav (tap-outside / Escape to close), sticky call/text bar, `scroll-padding` for clean anchor jumps, and keyboard focus rings throughout.

## Quote form → FormSubmit (with photo attachments)
Both forms (`#quoteForm` on the homepage, `#rfqForm` on the landing page) POST to
**FormSubmit** (`action="https://formsubmit.co/bosshoglandclearing@gmail.com"`),
which emails each submission — **including the uploaded photos as attachments** —
with no backend/server. It's free and supports up to **10 MB of attachments** per
submission ([docs](https://formsubmit.co/documentation)). Before attaching, the
landing-page JS **compresses each photo client-side** (resized to ~1600px JPEG),
so several phone photos land well under the cap and upload fast.

**To activate (one-time):** deploy, submit the form once on the live site, then
click the **"Activate Form"** link FormSubmit emails to
`bosshoglandclearing@gmail.com`. After that, every submission (with photos) is
delivered. No accounts or API keys.

How it works: the form does a native POST to FormSubmit, which emails the lead and
redirects back to `…/quote.html?sent=1`, where the JS shows the success screen.
Hidden fields: `_subject` (auto-set from the submitter's name/city), `_template=table`
(tidy email), `_captcha=false`, `_next` (the redirect), `_honey` (spam honeypot),
and `services` (kept in sync with the chip selection).

To change where leads go, edit the email in each form's `action`. For extra spam
protection you can swap it for the random alias FormSubmit gives you after the
first submission.

Business contact baked in: **469-631-5186** · **bosshoglandclearing@gmail.com**

## ⚠️ Before you deploy — set your real domain
The canonical URLs, Open Graph tags, `sitemap.xml`, `robots.txt` and JSON-LD use
the placeholder **`https://bosshogclearingco.com`**. Find-and-replace it with the
real domain across `index.html`, `quote.html`, `sitemap.xml`, `robots.txt`.

## SEO
Semantic HTML5, descriptive alt text, per-page titles/descriptions, canonical +
Open Graph + Twitter cards, a 1200×630 share image, `LocalBusiness` /
`FAQPage` / `BreadcrumbList` JSON-LD, sitemap, robots, and a web manifest with
favicons. Images are responsive (`<picture>` + `srcset`, WebP with JPEG
fallback) and lazy-loaded below the fold; the hero image is preloaded.

## Regenerating images
Source photos were optimized into responsive WebP/JPEG variants with Pillow.
The generator scripts live in this PR's history (`/tmp/optimize.py`,
`icons.py`, `topo.py`); drop new source files in and re-run to refresh.

### Note on the before/after photos
The before (overgrown) and after (cleared) frames are the same plot shot
handheld, not on a locked tripod, so they can't pixel-match perfectly. The crop
positions in `.ba__after` / `.ba__before` (`styles.css`) are hand-tuned to land
the ground-line across the wipe — the closest honest alignment without
distorting either photo.
