/**
 * gallery.js — Purple Pill Project
 * Renders media grid from gallery-data.js
 * Handles filter tabs and lightbox.
 */
import { galleryItems } from './gallery-data.js';

const grid      = document.getElementById('gallery-grid');
const emptyEl   = document.getElementById('gallery-empty');
const lightbox  = document.getElementById('gallery-lightbox');
const lightboxInner = document.getElementById('lightbox-inner-container');
const closeBtn  = document.getElementById('lightbox-close');

let currentFilter = 'all';

// ── Render ──────────────────────────────────────────────────────────────────

function renderGrid(filter = 'all') {
  const items = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  grid.innerHTML = '';

  if (items.length === 0) {
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';

  items.forEach((item, i) => {
    const card = buildCard(item, i);
    grid.appendChild(card);
  });
}

function buildCard(item, index) {
  const card = document.createElement('div');
  card.className   = 'gallery-card reveal';
  card.role        = 'listitem';
  card.style.transitionDelay = `${index * 0.06}s`;

  const hasThumbnail = item.thumbnail && item.thumbnail !== '';
  const thumbnailStyle = hasThumbnail
    ? `background-image: url('${item.thumbnail}');`
    : '';

  card.innerHTML = `
    <div class="gallery-card-thumb ${hasThumbnail ? '' : 'gallery-card-thumb--fallback'}"
         style="${thumbnailStyle}"
         aria-hidden="true">
      ${item.type === 'video' ? '<div class="gallery-play-btn" aria-hidden="true">▶</div>' : ''}
      ${item.live ? '<span class="gallery-badge gallery-badge--live">Live</span>' : ''}
      ${item.episode ? `<span class="gallery-badge gallery-badge--ep">${item.episode}</span>` : ''}
    </div>
    <div class="gallery-card-info">
      <h3 class="gallery-card-title">${item.title}</h3>
      <div class="gallery-card-tags">
        ${item.tags.slice(0, 3).map(t => `<span class="gallery-tag">${t}</span>`).join('')}
      </div>
      <p class="gallery-card-date">${formatDate(item.date)}</p>
    </div>
  `;

  if (item.type === 'video' && item.embedUrl) {
    card.addEventListener('click', () => openLightbox(item.embedUrl, item.title, item.category));
    card.style.cursor = 'pointer';
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Play: ${item.title}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(item.embedUrl, item.title, item.category);
    });
  }

  return card;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Filters ─────────────────────────────────────────────────────────────────

document.querySelectorAll('.gallery-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-filter').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentFilter = btn.dataset.filter;
    renderGrid(currentFilter);

    // Re-observe new cards for scroll reveal
    requestAnimationFrame(() => {
      document.querySelectorAll('.gallery-card.reveal:not(.visible)').forEach(el => {
        el.classList.add('visible');
      });
    });
  });
});

// ── Lightbox ─────────────────────────────────────────────────────────────────

function openLightbox(embedUrl, title, category) {
  let finalUrl = embedUrl;
  
  // Clear out previous content
  lightboxInner.innerHTML = '';
  
  // Reset inline styling that might have been added by specific media formats
  lightboxInner.style.cssText = '';

  if (embedUrl.endsWith('.mp4')) {
    // Treat as local video with 9:16 mobile aspect ratio style (like Red Ruby Den)
    lightboxInner.style.cssText = 'position: relative; width: 100%; max-width: 512px; aspect-ratio: 9/16; margin: 0 auto; border-radius: 32px; box-shadow: 0 0 50px rgba(139,0,20,0.5); overflow: hidden;';
    
    lightboxInner.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        <video autoplay controls playsinline aria-hidden="true" style="position: absolute; width: 100%; height: 100%; object-fit: cover; z-index: 0; opacity: 1;">
          <source src="${finalUrl}" type="video/mp4" />
        </video>
        <div class="den-noise" aria-hidden="true" style="position: absolute; inset: 0; background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E&quot;); background-size: 200px 200px; opacity: 0.4; pointer-events: none;"></div>
        <div class="den-curtain-left" aria-hidden="true" style="position: absolute; top: 0; left: 0; width: 22%; height: 100%; background: linear-gradient(to right, rgba(139,0,20,0.55) 0%, transparent 100%); pointer-events: none;"></div>
        <div class="den-curtain-right" aria-hidden="true" style="position: absolute; top: 0; right: 0; width: 22%; height: 100%; background: linear-gradient(to left, rgba(139,0,20,0.55) 0%, transparent 100%); pointer-events: none;"></div>
      </div>
    `;
  } else {
    // Standard embed handling (YouTube, Instagram)
    if (embedUrl.includes('instagram.com')) {
      const baseUrl = embedUrl.split('?')[0].replace(/\/+$/, "");
      finalUrl = baseUrl + '/embed';
    } else if (embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com')) {
      finalUrl += (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
    }

    lightboxInner.innerHTML = `
      <iframe src="${finalUrl}" title="${title}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen loading="lazy" style="width: 100%; height: 100%; border: 1px solid rgba(148,0,211,0.3); border-radius: var(--radius-md);"></iframe>
    `;
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxInner.innerHTML = ''; // Stop video playback
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('gallery-lightbox')) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

// ── Init ─────────────────────────────────────────────────────────────────────
renderGrid('all');

// Observe gallery cards for scroll reveal after render
requestAnimationFrame(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-card.reveal').forEach(el => observer.observe(el));
});
