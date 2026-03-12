/**
 * hyper-text.js — Purple Pill Project
 *
 * Vanilla JS port of the HyperText scramble animation.
 * Letters cycle through random alphabet chars before resolving to the real text.
 *
 * Usage:
 *   <h1 data-hyper-text="Text"></h1>
 *
 * Options via data attributes:
 *   data-duration="800"        total animation ms (default 800)
 *   data-animate-on-load="true" run on page load (default true)
 *   data-hyper-hover="true"    re-trigger on hover (default true)
 */

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const getRandomChar = () => ALPHABETS[Math.floor(Math.random() * 26)];

function scrambleText(el, text, duration = 800) {
  const chars = text.split('');
  let iterations = 0;
  const totalSteps = chars.length * 10;
  const interval = duration / totalSteps;

  // Build spans once
  if (!el.dataset.hyperReady) {
    el.innerHTML = chars
      .map((l, i) =>
        `<span data-index="${i}" class="${l === ' ' ? 'hyper-space' : ''}">${l === ' ' ? ' ' : getRandomChar()}</span>`
      )
      .join('');
    el.dataset.hyperReady = 'true';
  }

  const spans = el.querySelectorAll('span[data-index]');

  const tick = setInterval(() => {
    spans.forEach((span, i) => {
      const letter = chars[i];
      if (letter === ' ') return;
      if (i <= iterations) {
        span.textContent = letter.toUpperCase();
        span.classList.add('resolved');
      } else {
        span.textContent = getRandomChar();
        span.classList.remove('resolved');
      }
    });

    iterations += 0.1;

    if (iterations >= chars.length) {
      clearInterval(tick);
      // Ensure fully resolved
      spans.forEach((span, i) => {
        span.textContent = chars[i] === ' ' ? ' ' : chars[i].toUpperCase();
        span.classList.add('resolved');
      });
    }
  }, interval);

  return tick;
}

export function initHyperText() {
  document.querySelectorAll('[data-hyper-text]').forEach(el => {
    const text = el.dataset.hyperText;
    const duration = parseInt(el.dataset.duration || '800', 10);
    const onLoad = el.dataset.animateOnLoad !== 'false';
    const onHover = el.dataset.hyperHover !== 'false';

    if (!text) return;

    // Set initial structure
    el.innerHTML = text
      .split('')
      .map((l, i) =>
        `<span data-index="${i}" class="${l === ' ' ? 'hyper-space' : ''}">${l === ' ' ? '\u00A0' : l.toUpperCase()}</span>`
      )
      .join('');
    el.dataset.hyperReady = 'true';

    if (onLoad) {
      // Small delay so the page has painted
      setTimeout(() => scrambleText(el, text, duration), 300);
    }

    if (onHover) {
      el.addEventListener('mouseenter', () => scrambleText(el, text, duration));
    }
  });
}
