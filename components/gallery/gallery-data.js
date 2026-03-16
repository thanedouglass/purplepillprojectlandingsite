/**
 * gallery-data.js — Purple Pill Project
 *
 * ── HOW TO ADD NEW MEDIA ─────────────────────────────────
 * Add a new object to the `galleryItems` array below.
 * The gallery renders automatically from this data.
 * No HTML editing needed.
 *
 * Fields:
 *   id          — unique string identifier
 *   type        — 'video' | 'image'
 *   category    — 'episode' | 'event' | 'press'  (used by filter tabs)
 *   title       — display title
 *   episode     — episode label e.g. 'S01E01' (optional)
 *   thumbnail   — path to thumbnail image (fallback if no thumb: gradient)
 *   embedUrl    — YouTube/Vimeo/Instagram embed URL or local .mp4 path (for type: 'video')
 *   srcUrl      — direct image URL (for type: 'image')
 *   tags        — array of strings for metadata display
 *   date        — ISO date string 'YYYY-MM-DD'
 *   live        — boolean (shows 'Live' badge if true)
 * ──────────────────────────────────────────────────────────
 */

export const galleryItems = [
  {
    id: 'ep-01',
    type: 'video',
    category: 'episode',
    title: 'The Yes-Man Protocol',
    episode: 'S01 · EP 01',
    thumbnail: '/assets/images/ep01-thumb.png',
    embedUrl: '/assets/video/refresher_V1.mp4',
    tags: ['AI', 'Sycophancy', 'Echo Chamber', 'Spanish'],
    date: '2025-12-25',
    live: true,
  },
  {
    id: 'ep-02',
    type: 'video',
    category: 'episode',
    title: 'Behind The Echo',
    episode: 'S01 · EP 02',
    thumbnail: '/assets/images/ep02-thumb.png',
    embedUrl: '/assets/video/TheBond.mp4',
    tags: ['AI', 'Sycophancy', 'Youth Mental Health'],
    date: '2026-01-15',
    live: true,
  },
  {
    id: 'ep-03',
    type: 'video',
    category: 'episode',
    title: 'Critical Thinking',
    episode: 'S01 · EP 03',
    thumbnail: '/assets/images/ep03-thumb.png',
    embedUrl: '/assets/video/Critical_Think.mp4',
    tags: ['Safety', 'Prompting', 'AI'],
    date: '2026-01-31',
    live: true,
  },
  {
    id: 'ep-04',
    type: 'video',
    category: 'episode',
    title: 'Safe Prompting',
    episode: 'S01 · EP 04',
    thumbnail: '/assets/images/ep04-thumb.png',
    embedUrl: '/assets/video/Safe_Prompt.mp4',
    tags: ['Safety', 'Prompting', 'AI'],
    date: '2026-02-14',
    live: true,
  },
  {
    id: 'ethdenvr-2025',
    type: 'video',
    category: 'event',
    title: 'EthDenver 2026 — Zen Den',
    episode: null,
    thumbnail: '/assets/images/ethdenver-thumb.png',
    embedUrl: '/assets/video/Video-912.mp4',
    tags: ['EthDenver', 'Live', 'Web3'],
    date: '2026-02-18',
    live: false,
  },
  {
    id: 'remi-2026',
    type: 'video',
    category: 'event',
    title: 'Red Ruby Den - COMING SOON',
    episode: null,
    thumbnail: '/assets/images/remi-thumb.png',
    embedUrl: '/assets/video/purple_pill_trailer.mp4',
    tags: ['Metaverse', 'Research', 'Education Series'],
    date: '2026-03-14',
    live: false,
  },
  // ── Add new items below this line ──────────────────────
];
