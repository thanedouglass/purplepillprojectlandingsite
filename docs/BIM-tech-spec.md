# BIM — BUILD IMPLEMENTATION
### Purple Pill Project · Tech Spec
**Version:** 1.0 | **Owner:** DGB Global | **Status:** Active

---

## 1. ARCHITECTURE OVERVIEW

**Pattern:** Static Multi-Component HTML — No Build Tool Required

The monolithic `index.html` is decomposed into a **component file system**. Each section lives in its own folder with its own HTML partial, CSS, and (if needed) JS module. The root `index.html` acts as a shell that assembles components at runtime via a lightweight component loader.

This gives you:
- Surgical edits (change `hero/hero.html` without touching anything else)
- AI-friendly file sizes (every file < 150 lines)
- Zero dependency hell
- Full portability to any host (Netlify, Vercel, GitHub Pages, Cloudflare Pages)

---

## 2. TECH STACK

| Layer | Choice | Reason |
|-------|--------|--------|
| Markup | Vanilla HTML5 | Zero lock-in, maximum portability |
| Styling | Vanilla CSS3 + Custom Properties | Tokens already established in existing file |
| Scripting | Vanilla ES6 Modules | No bundler needed, native browser support |
| Globe | COBE `v0.6.3` (CDN) | Already implemented, keep as-is |
| Fonts | Google Fonts CDN | Bebas Neue, Poppins, Share Tech Mono |
| Forms | Formspree (free tier) | No backend required for waitlist + contact |
| Hosting | Cloudflare Pages (recommended) | Free, fast, already using Cloudflare per email links |
| Video | Self-hosted MP4 | `purple_pill_bg_loop.mp4` via `/assets/video/` |

---

## 3. COMPONENT LOADER PATTERN

`index.html` uses a single `ComponentLoader` script to fetch and inject HTML partials:

```javascript
// scripts/component-loader.js
async function loadComponents() {
  const slots = document.querySelectorAll('[data-component]');
  for (const slot of slots) {
    const name = slot.dataset.component;
    const res  = await fetch(`/components/${name}/${name}.html`);
    const html = await res.text();
    slot.outerHTML = html;
  }
}
document.addEventListener('DOMContentLoaded', loadComponents);
```

**Usage in index.html:**
```html
<div data-component="nav"></div>
<div data-component="hero"></div>
<div data-component="stats-bar"></div>
```

---

## 4. FILE SYSTEM ARCHITECTURE

```
purple-pill-project/
│
├── index.html                        ← Shell (< 40 lines)
│
├── styles/
│   ├── tokens.css                    ← All CSS custom properties
│   ├── globals.css                   ← Reset, body, scrollbar, utilities
│   └── animations.css                ← All @keyframes
│
├── scripts/
│   ├── component-loader.js           ← Fetches + injects HTML partials
│   ├── scroll-reveal.js              ← IntersectionObserver reveal logic
│   ├── nav-scroll.js                 ← Nav scrolled state
│   └── globe.js                      ← COBE globe init
│
├── components/
│   ├── nav/
│   │   ├── nav.html
│   │   └── nav.css
│   ├── hero/
│   │   ├── hero.html
│   │   └── hero.css
│   ├── stats-bar/
│   │   ├── stats-bar.html
│   │   └── stats-bar.css
│   ├── mission/
│   │   ├── mission.html
│   │   └── mission.css
│   ├── characters/
│   │   ├── characters.html
│   │   └── characters.css
│   ├── episodes/
│   │   ├── episodes.html
│   │   └── episodes.css
│   ├── red-ruby-den/                 ← NEW SECTION
│   │   ├── red-ruby-den.html
│   │   ├── red-ruby-den.css
│   │   └── red-ruby-den.js           ← Waitlist form handler
│   ├── gallery/                      ← NEW SECTION
│   │   ├── gallery.html
│   │   ├── gallery.css
│   │   └── gallery-data.js           ← Media items array (edit here to add videos)
│   ├── manifesto/
│   │   ├── manifesto.html
│   │   └── manifesto.css
│   └── footer/
│       ├── footer.html
│       └── footer.css
│
├── assets/
│   ├── video/
│   │   └── purple_pill_bg_loop.mp4
│   ├── images/
│   │   ├── og-image.jpg              ← Open Graph / social share image
│   │   └── favicon.png
│   └── icons/
│       └── (any SVG icons)
│
└── docs/
    ├── B-build-intent.md             ← PRD (this project)
    ├── BIM-tech-spec.md              ← This document
    └── BOP-design-doc.md             ← Design spec
```

---

## 5. CSS ARCHITECTURE

**Token hierarchy** (everything inherits from `tokens.css`):

```css
/* tokens.css — single source of truth */
:root {
  /* Color Palette */
  --black:       #06020e;
  --crimson:     #8b0014;
  --purple:      #9400d3;
  --teal:        #00ced1;
  --bone:        #f5f0dc;
  --gold:        #ffc832;
  --dim-purple:  #1e0032;
  --dark-red:    #320008;

  /* Typography */
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'Poppins', sans-serif;
  --font-mono:    'Share Tech Mono', monospace;

  /* Spacing Scale */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 32px;
  --space-lg: 64px;
  --space-xl: 120px;

  /* Section Padding */
  --section-padding: 120px 0 100px;

  /* Z-index Scale */
  --z-base:     10;
  --z-nav:      100;
  --z-overlay:  9999;
}
```

**Load order in `index.html`:**
```html
<link rel="stylesheet" href="/styles/tokens.css">
<link rel="stylesheet" href="/styles/globals.css">
<link rel="stylesheet" href="/styles/animations.css">
<!-- Component CSS loaded dynamically by component-loader.js -->
```

---

## 6. DATA LAYER

### Gallery Data (`gallery/gallery-data.js`)
All media items live in a single JS array. To add a new video: edit this file only.

```javascript
export const galleryItems = [
  {
    id: 'ep-01',
    type: 'video',          // 'video' | 'image' | 'embed'
    title: 'The Yes-Man Protocol',
    episode: 'S01E01',
    thumbnail: '/assets/images/ep01-thumb.jpg',
    src: 'https://youtube.com/embed/XXXX',
    tags: ['AI', 'Sycophancy', 'Mental Health'],
    date: '2025-03-01',
    live: true,
  },
  // Add entries here — gallery renders automatically
];
```

### Episode Data (`episodes/episodes-data.js`)
Same pattern — episode cards are rendered from data, not hardcoded HTML.

---

## 7. FORM HANDLING

**Red Ruby Den Waitlist** and **Contact/Partner** forms both submit to Formspree:

```javascript
// red-ruby-den/red-ruby-den.js
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

document.getElementById('den-waitlist-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res  = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  // Show success/error state
});
```

Replace `YOUR_FORM_ID` with your Formspree endpoint. No backend needed.

---

## 8. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Lighthouse Performance (Desktop) | ≥ 90 |
| Lighthouse Performance (Mobile) | ≥ 85 |
| First Contentful Paint | < 1.5s |
| Video loads lazily | Yes (`loading="lazy"` on iframes) |
| Reduced motion respected | Yes (all animations gated on media query) |

---

## 9. BROWSER SUPPORT

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. No IE support.

---

## 10. DEPLOYMENT

**Recommended: Cloudflare Pages**
1. Push repo to GitHub
2. Connect to Cloudflare Pages
3. Build command: *(none — static)*
4. Output directory: `/` (root)
5. Custom domain: `purplepillproject.com`

**Environment Variables (Cloudflare Pages):**
- `FORMSPREE_ENDPOINT_WAITLIST` — Den waitlist form ID
- `FORMSPREE_ENDPOINT_CONTACT` — Partner contact form ID
