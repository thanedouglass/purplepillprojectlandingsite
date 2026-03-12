# BOP — BUILD APPLICATION
### Purple Pill Project · Design Document
**Version:** 1.0 | **Owner:** DGB Global | **Status:** Active

---

## 1. DESIGN LANGUAGE

**Aesthetic:** Theatrical Cyberpunk. Think: a speakeasy from 2087 that also teaches biology.

**Duality rule:** Every design decision lives in tension between two poles.

| Pole A | Pole B |
|--------|--------|
| Warm (crimson, bone, gold) | Cold (teal, purple, black) |
| Organic (velvet, wood, skin) | Digital (scan lines, mono fonts, glitch) |
| Theater (curtains, stage) | Science (data, diagrams, citations) |
| Remi (system, sociology) | Bluey (body, biology) |

This duality is not decorative. It IS the show.

---

## 2. DESIGN TOKENS (Canonical)

```
COLORS
──────────────────────────────────────────────
Black (background)    #06020e
Crimson               #8b0014    — danger, Remi accent
Purple                #9400d3    — brand hero color
Teal                  #00ced1    — truth, Bluey accent
Bone                  #f5f0dc    — readable body text
Gold                  #ffc832    — highlight, emphasis
Dim Purple            #1e0032    — deep section backgrounds
Dark Red              #320008    — footer, den backgrounds

TYPOGRAPHY
──────────────────────────────────────────────
Display   Bebas Neue        — headlines, section labels
Body      Poppins 300/400/600/700/900  — paragraphs, CTAs
Mono      Share Tech Mono   — eyebrows, tags, code-feel UI

SPACING SCALE (8px base)
──────────────────────────────────────────────
xs   8px
sm   16px
md   32px
lg   64px
xl   120px
```

---

## 3. SECTION-BY-SECTION DESIGN SPEC

---

### 3.1 NAV
- Fixed, transparent on load
- On scroll: `background: rgba(6,2,14,0.92)` + `backdrop-filter: blur(12px)`
- Border-bottom: `1px solid rgba(148,0,211,0.2)` on scroll
- Logo: "PURPLE **PILL**" — PILL in purple
- Links: Share Tech Mono, 12px, 0.25em tracking, rgba(bone, 0.6) → teal on hover
- **Mobile:** hamburger menu (nav-links hidden < 900px) — hamburger to be implemented

---

### 3.2 HERO
- Full viewport, video background at `opacity: 0.72`
- Overlay: gradient fade to black at bottom
- Glitch effect on title (CSS data-text duplication, red/teal offset)
- Eyebrow: "DGB Global Presents" — Share Tech Mono, teal
- Title: "PURPLE PILL PROJECT" — Bebas Neue, 80–180px clamp, "PROJECT" in purple
- Subtitle: "// Truth Is The Antidote //" — Share Tech Mono, gold
- CTAs: "Enter The Den" (teal border) + "Watch Episodes" (bone border)
- Scroll hint: teal gradient line, bone label, animated pulse
- **Fallback:** If video fails → `linear-gradient(135deg, #1e0032, #06020e, #320008)`

---

### 3.3 STATS BAR
- Full-width horizontal ticker
- Background: `rgba(148,0,211,0.12)` with top/bottom borders in purple at 20% opacity
- Items: Share Tech Mono, 12px, bone text — `<strong>` tags in teal
- Separator: ◆ diamond in purple
- Infinite scroll left animation, 32s duration

---

### 3.4 MISSION
- 2-column grid (1-col on mobile)
- Left: Large Bebas Neue headline with teal + crimson accent lines
- Right: Body copy + neon divider + CTA button
- Neon divider: 2px line, teal → purple gradient, glow effect

---

### 3.5 CHARACTERS
- 2-column card grid (Remi | Bluey)
- Cards: `border: 1px solid rgba(color, 0.25)` — crimson for Remi, teal for Bluey
- Background: subtle gradient from dim-purple to black
- Icon circle: initials "R" / "B", color-matched
- Hover: border brightens, card lifts with `translateY(-4px)`
- Domain label: Share Tech Mono, italic-feel spacing

---

### 3.6 EPISODES
- Section header: left-aligned, "The Red Ruby Den is open."
- Episode cards: 3-column grid `[number | info | status-tag]`
- Number: Large Bebas Neue, crimson, with left accent border
- Status tags: "Live" → teal bg | "Coming Soon" → purple bg | "The Future" → gold bg
- Hover: left border brightens, card shifts right 4px

---

### 3.7 RED RUBY DEN — NEW SECTION ★

**Purpose:** Drive metaverse anticipation + collect waitlist signups.

**Layout:**
```
[SECTION TAG: // 005 — THE DEN]
[HEADLINE: "THE DOOR IS ALMOST OPEN"]
[SUBHEADING: Describing the Den as metaverse room]
[PREVIEW PANEL: Dark atmospheric card with Den aesthetic]
  └── Dim ambient glow (crimson + purple)
  └── "PREVIEW ACCESS" watermark text
  └── Looping subtle particle/noise texture
[WAITLIST FORM]
  └── Email input (mono font)
  └── "Request Access" CTA button (crimson)
[COUNTER: "XXX agents already on the list" — updates dynamically]
```

**Visual Direction:**
- Section background: `linear-gradient(180deg, #06020e 0%, #1a0008 50%, #06020e 100%)`
- Red velvet texture overlay on preview panel (CSS or asset)
- Preview panel border: `2px solid rgba(139,0,20,0.5)` with crimson glow
- Headline: Bebas Neue, crimson + bone split — "THE DOOR IS" (bone) / "ALMOST OPEN" (crimson)

**Interaction States:**
- Form empty → button disabled, bone border
- Form valid email → button activates, crimson
- Form submitted → panel animates to "ACCESS PENDING" state with glitch flash

---

### 3.8 GALLERY — NEW SECTION ★

**Purpose:** Media archive for collaborators, press, and educators.

**Layout:**
```
[SECTION TAG: // 006 — ARCHIVE]
[HEADLINE: "THE RECORD"]
[FILTER TABS: All | Episodes | Live Events | Press]
[MEDIA GRID: 3-col masonry-ish grid]
  └── Card: thumbnail + episode label + title + play button overlay
[LIGHTBOX: Full-screen video player on card click]
```

**Card Design:**
- Background: dim-purple to black gradient
- Thumbnail: 16:9 ratio, with purple/teal overlay on hover
- Play button: circular, bone with 40% opacity → full on hover
- Episode badge: Share Tech Mono, top-left corner
- "Live" tag inherited from episodes design system
- Hover: thumbnail scales 1.04, play button fully opaque

**Filter Tabs:**
- Share Tech Mono, inactive: bone at 40% | active: teal with bottom border
- Smooth opacity/display transition on filter change
- Filter logic: pure JS, data-attribute matching on cards

**Lightbox:**
- Dark overlay (`rgba(6,2,14,0.95)`)
- Centered iframe embed (YouTube/Vimeo)
- Close button: bone X, top-right
- Keyboard: ESC to close

---

### 3.9 MANIFESTO
- Full-width dark panel (`--dim-purple` background)
- Centered blockquote: Bebas Neue, large — bone + teal color split
- Attribution: "— REMI, Red Ruby Den, Season 01" — Share Tech Mono, gold
- CTAs: "Watch Episodes" + "Partner With Us"
- Globe: COBE globe with purple/teal color scheme, draggable
- Globe label: "// The Truth Travels //"

---

### 3.10 FOOTER
- 3-column grid: Brand description | Navigate | Connect
- Background: `var(--dark-red)` with top border in crimson at 20%
- Logo: Bebas Neue display — "PURPLE **PILL** PROJECT"
- Links: mono font, bone 60% → teal on hover
- Bottom bar: "© 2026 DGB Global" left, domain right

---

## 4. ANIMATION SYSTEM

All animations defined in `styles/animations.css`.

| Animation | Usage | Duration |
|-----------|-------|----------|
| `fadeUp` | Hero elements, section reveals | 1s ease |
| `fadeIn` | Scroll hint, overlays | 1s ease |
| `scrollPulse` | Scroll line | 2s infinite |
| `ticker` | Stats bar scroll | 32s linear infinite |
| `glitchShift` | Hero title glitch | 2.5s infinite |
| `glitchFlash` | Glitch overlay flash | 2.5s infinite |
| `globePulse` | Globe outer ring | 4s infinite |
| `revealFade` | `.reveal → .visible` | 0.7s ease |

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 5. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Mobile | < 600px | Single column, hero title scales down, no nav links |
| Tablet | 600–900px | 2-col collapses to 1-col, episode cards simplify |
| Desktop | > 900px | Full layout as designed |
| Wide | > 1280px | Max-width container caps at 1280px, centered |

---

## 6. COMPONENT EDIT GUIDE

Quick reference for non-engineer updates:

| Want to change... | Edit this file |
|-------------------|---------------|
| Add a new episode | `components/episodes/episodes-data.js` |
| Add a new gallery video | `components/gallery/gallery-data.js` |
| Update Den waitlist copy | `components/red-ruby-den/red-ruby-den.html` |
| Change a color | `styles/tokens.css` |
| Update nav links | `components/nav/nav.html` |
| Change the manifesto quote | `components/manifesto/manifesto.html` |
| Update social links in footer | `components/footer/footer.html` |
| Change the hero headline | `components/hero/hero.html` |

---

## 7. OPEN GRAPH / SEO

```html
<meta property="og:title" content="Purple Pill Project — Truth Is The Antidote">
<meta property="og:description" content="Theatrical cyberpunk education for a generation that deserves the truth.">
<meta property="og:image" content="/assets/images/og-image.jpg">
<meta property="og:url" content="https://purplepillproject.com">
<meta name="twitter:card" content="summary_large_image">
```

OG image spec: 1200 × 630px, hero title on dark background with purple glow. File: `/assets/images/og-image.jpg`
