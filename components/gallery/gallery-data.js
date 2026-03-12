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
 *   embedUrl    — YouTube/Vimeo embed URL (for type: 'video')
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
    embedUrl: 'https://www.youtube.com/embed/REPLACE_ME',
    tags: ['AI', 'Sycophancy', 'Mental Health'],
    date: '2025-03-01',
    live: true,
  },
  {
    id: 'ep-02',
    type: 'video',
    category: 'episode',
    title: 'The Digital Ghost',
    episode: 'S01 · EP 02',
    thumbnail: '/assets/images/ep02-thumb.png',
    embedUrl: 'https://www.youtube.com/embed/REPLACE_ME',
    tags: ['Parasocial', 'AI', 'Teen Mental Health'],
    date: '2025-04-01',
    live: true,
  },
  {
    id: 'ep-03',
    type: 'video',
    category: 'episode',
    title: 'Critical Thinking',
    episode: 'S01 · EP 03',
    thumbnail: '/assets/images/ep03-thumb.png',
    embedUrl: 'https://www.youtube.com/embed/REPLACE_ME',
    tags: ['Parasocial', 'AI', 'Teen Mental Health'],
    date: '2025-04-01',
    live: true,
  },
  {
    id: 'ethdenvr-2025',
    type: 'video',
    category: 'event',
    title: 'EthDenver 2026 — Zen Den',
    episode: null,
    thumbnail: '/assets/images/ethdenver-thumb.png',
    embedUrl: 'https://www.youtube.com/embed/REPLACE_ME',
    tags: ['EthDenver', 'Live', 'Web3'],
    date: '2025-02-27',
    live: false,
  },
  {
    id: 'sxsw-2025',
    type: 'video',
    category: 'event',
    title: 'SXSW 2025 — Red Ruby Den Stage',
    episode: null,
    thumbnail: '/assets/images/sxsw-thumb.jpg',
    embedUrl: 'https://www.youtube.com/embed/REPLACE_ME',
    tags: ['SXSW', 'Live', 'Austin'],
    date: '2025-03-10',
    live: false,
  },
  // ── Add new items below this line ──────────────────────
];
