/**
 * scroll-reveal.js — Purple Pill Project
 * IntersectionObserver-based reveal for .reveal elements.
 * Stagger episode cards automatically.
 */
export function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  // Stagger episode cards with CSS delay
  document.querySelectorAll('.episode-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
}
