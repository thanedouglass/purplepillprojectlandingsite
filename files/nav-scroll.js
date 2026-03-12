/**
 * nav-scroll.js — Purple Pill Project
 * Adds .scrolled class to nav when user scrolls past 60px
 */
export function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const THRESHOLD = 60;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case page is already scrolled
}
