# PROJECT DIRECTORY — Purple Pill Project
### Canonical File Map + Edit Guide
**Last updated:** 2026

---

## Full Structure

```
purple-pill-project/
│
├── index.html                          ← Shell only (~35 lines). Do not add content here.
│
├── docs/
│   ├── B-build-intent.md               ← PRD. Why we're building this.
│   ├── BIM-tech-spec.md                ← Tech spec. How it's built.
│   └── BOP-design-doc.md               ← Design doc. How it looks and feels.
│
├── styles/
│   ├── tokens.css                      ← ALL design variables. Change colors/fonts/spacing here.
│   ├── globals.css                     ← Reset, body, shared utilities, .btn, .reveal
│   └── animations.css                  ← ALL @keyframes. One place, zero hunting.
│
├── scripts/
│   ├── component-loader.js             ← Fetches HTML partials, injects CSS, boots scripts.
│   ├── nav-scroll.js                   ← Nav .scrolled state on scroll
│   ├── scroll-reveal.js                ← IntersectionObserver reveal for .reveal elements
│   └── globe.js                        ← COBE globe initialization
│
├── components/
│   │
│   ├── nav/
│   │   ├── nav.html                    ← Edit nav links here
│   │   └── nav.css
│   │
│   ├── hero/                           [DEPRECATED — removed in favor of Gallery at front]
│   │   └── README.md
│   │
│   ├── stats-bar/
│   │   ├── stats-bar.html              ← Edit ticker facts here
│   │   └── stats-bar.css
│   │
│   ├── mission/
│   │   ├── mission.html                ← Edit mission copy here
│   │   └── mission.css
│   │
│   ├── characters/
│   │   ├── characters.html             ← Edit Remi + Bluey bios here
│   │   └── characters.css
│   │
│   ├── episodes/
│   │   ├── episodes.html               ← Edit episode cards here
│   │   ├── episodes.css
│   │   └── episodes-data.js            ← [FUTURE] Move episode data here to auto-render
│   │
│   ├── red-ruby-den/                   ★ NEW SECTION
│   │   ├── red-ruby-den.html           ← Edit Den teaser copy, form fields here
│   │   ├── red-ruby-den.css
│   │   └── red-ruby-den.js             ← Set FORM_ID to your Formspree endpoint
│   │
│   ├── gallery/                        ★ NEW SECTION
│   │   ├── gallery.html                ← Edit filter tab labels here
│   │   ├── gallery.css
│   │   ├── gallery.js                  ← Renders cards, handles filters + lightbox
│   │   └── gallery-data.js             ← ADD NEW VIDEOS HERE. No other files needed.
│   │
│   ├── manifesto/
│   │   ├── manifesto.html              ← Edit manifesto quote here
│   │   └── manifesto.css
│   │
│   └── footer/
│       ├── footer.html                 ← Edit social links, nav links here
│       └── footer.css
│
└── assets/
    ├── video/
    │   └── purple_pill_bg_loop.mp4     ← Hero background video
    ├── images/
    │   ├── og-image.jpg                ← Social share image (1200×630px)
    │   ├── favicon.png
    │   ├── ep01-thumb.jpg              ← Episode thumbnails (16:9 ratio)
    │   └── ep02-thumb.jpg
    └── icons/
        └── (SVG icons as needed)
```

---

## Quick Edit Reference

| I want to... | Open this file |
|---|---|
| Add a new gallery video | `components/gallery/gallery-data.js` |
| Update Den waitlist copy | `components/red-ruby-den/red-ruby-den.html` |
| Activate the waitlist form | `components/red-ruby-den/red-ruby-den.js` → set `FORM_ID` |
| Change brand colors | `styles/tokens.css` |
| Add a new episode card | `components/episodes/episodes.html` |
| Add a new nav link | `components/nav/nav.html` |
| Update the manifesto quote | `components/manifesto/manifesto.html` |
| Edit archives / shorts headline | `components/gallery/gallery.html` |
| Add a new animation | `styles/animations.css` |
| Add a brand-new section | Create `components/new-section/` folder with `.html` + `.css`, add `<div data-component="new-section"></div>` to `index.html` |

---

## Dev Notes

- **No build tool required.** Open `index.html` in a browser via a local server (e.g., `npx serve .`).
- **Component CSS** is injected automatically by `component-loader.js` when each partial loads.
- **Gallery thumbnails:** 16:9 ratio, place in `/assets/images/`, reference path in `gallery-data.js`.
- **Formspree activation:** Register at formspree.io, get your form ID, paste into `red-ruby-den.js`.
- **Video fallback:** If `purple_pill_bg_loop.mp4` is missing, hero falls back to a gradient automatically.
