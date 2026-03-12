# B — BUILD INTENT
### Purple Pill Project · Landing Site PRD
**Version:** 1.0 | **Owner:** DGB Global | **Status:** Active

---

## 1. THE WHY

The Purple Pill Project is a theatrical cyberpunk educational universe. The landing site is its **front door, its proof of concept, and its recruitment engine** — simultaneously introducing the brand to new visitors, teasing the Red Ruby Den metaverse to drive anticipation, and housing a media archive for collaborators and press.

The site must feel like you've arrived somewhere real. Not a portfolio. Not a startup. A **universe.**

---

## 2. PROBLEM STATEMENT

Youth mental health content is either clinical (inaccessible) or superficial (forgettable). The Purple Pill Project exists in a third lane: theatrical, science-backed, and genuinely cinematic. The landing site must communicate that duality — rigorous truth delivered as spectacle — in under 8 seconds of scroll.

**Secondary problem:** Collaborators, press, and partners have no single canonical hub to access past work, pitch materials, or episode archives. The gallery fills this gap.

---

## 3. USER PERSONAS

### Persona A — "The Curious Teen" (Primary)
- Age: 14–22
- Arrives via TikTok/Instagram Reels short-form clip
- Attention window: 6–10 seconds before bounce
- Goal: Understand what this is and whether it's for them
- Success: Scrolls past hero, shares one episode card

### Persona B — "The Educator/Partner" (Secondary)
- Age: 28–50, educator / nonprofit director / journalist
- Arrives via word of mouth, EthDenver/SXSW reference
- Goal: Vet the project for curriculum use, media coverage, or co-production
- Success: Finds the gallery, watches an episode, sends a contact email

### Persona C — "The Den Seeker" (Emerging)
- Heard about the Red Ruby Den metaverse
- Wants sneak-peek access before full launch
- Goal: Feel like an insider. Get waitlisted or previewed
- Success: Engages with the Den preview section, submits access request

---

## 4. SITE GOALS (Prioritized)

| Priority | Goal | Metric |
|----------|------|--------|
| P0 | Communicate the Purple Pill Project's mission clearly | < 8s time-to-understanding |
| P0 | Drive episode views | Click-through to video embeds |
| P1 | Generate Red Ruby Den waitlist signups | Form submissions |
| P1 | Serve collaborators/press with media archive | Gallery page visits, asset downloads |
| P2 | Build email/partner pipeline | Contact form submissions |
| P2 | Establish global credibility | Globe engagement, SXSW/EthDenver callouts |

---

## 5. SECTIONS (Canonical Page Architecture)

```
[NAV]
[HERO]          — Full-screen video bg, glitch title, dual CTAs
[STATS-BAR]     — Scrolling ticker of key facts
[MISSION]       — The why. Remi + Bluey duality introduced
[CHARACTERS]    — Remi card + Bluey card
[EPISODES]      — Season 01 episode list (live + coming soon)
[RED-RUBY-DEN]  — Metaverse teaser + waitlist/sneak peek CTA   ← NEW
[GALLERY]       — Media archive for collaborators/press         ← NEW
[MANIFESTO]     — Quote block + globe
[FOOTER]        — Nav, social links, contact
```

---

## 6. SUCCESS METRICS

- **Bounce rate:** < 55% (industry avg for short-form referral traffic is 70%+)
- **Scroll depth:** 60%+ of visitors reach the Episodes section
- **Den waitlist:** 500 signups within first 30 days post-launch
- **Gallery engagement:** 2+ video plays per collaborator visit
- **Mobile performance:** Lighthouse score ≥ 85 on mobile

---

## 7. CONSTRAINTS

- No framework (React, Vue, etc.) — vanilla HTML/CSS/JS for maximum portability
- No backend required at launch — form submissions via Formspree or equivalent
- Must be editable by non-engineers (component file structure, documented CSS tokens)
- Video asset (`purple_pill_bg_loop.mp4`) must have static gradient fallback
- All animations must respect `prefers-reduced-motion`

---

## 8. OUT OF SCOPE (v1)

- Full metaverse Red Ruby Den (teaser only)
- User accounts / auth
- CMS integration (Contentful, Sanity etc.)
- Paid media / ad pixels (Phase 2)
