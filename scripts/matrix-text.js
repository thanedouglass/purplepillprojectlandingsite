/**
 * matrix-text.js — Purple Pill Project
 *
 * Vanilla JS port of the MatrixText component.
 * Letters cycle through "0"/"1" (green) before snapping back to the real char.
 *
 * Usage:
 *   <span data-matrix-text="Learn About Our Partners"
 *         data-initial-delay="200"
 *         data-letter-duration="500"
 *         data-letter-interval="80">
 *   </span>
 */

function getRandomBit() {
  return Math.random() > 0.5 ? '1' : '0';
}

function buildSpans(el, text) {
  el.innerHTML = text
    .split('')
    .map((char, i) =>
      char === ' '
        ? `<span class="mx-char mx-space" data-i="${i}">&nbsp;</span>`
        : `<span class="mx-char" data-i="${i}">${char}</span>`
    )
    .join('');
  return el.querySelectorAll('.mx-char');
}

function animateLetter(span, originalChar, duration) {
  if (span.classList.contains('mx-space')) return;
  span.textContent = getRandomBit();
  span.classList.add('mx-active');
  setTimeout(() => {
    span.textContent = originalChar;
    span.classList.remove('mx-active');
  }, duration);
}

function runMatrixAnimation(el, text, initialDelay, letterDuration, letterInterval) {
  const chars = text.split('');
  const spans = buildSpans(el, text);

  setTimeout(() => {
    let i = 0;
    function step() {
      if (i >= chars.length) return;
      animateLetter(spans[i], chars[i], letterDuration);
      i++;
      setTimeout(step, letterInterval);
    }
    step();
  }, initialDelay);
}

export function initMatrixText() {
  document.querySelectorAll('[data-matrix-text]').forEach(el => {
    const text           = el.dataset.matrixText;
    const initialDelay   = parseInt(el.dataset.initialDelay   || '200',  10);
    const letterDuration = parseInt(el.dataset.letterDuration  || '500',  10);
    const letterInterval = parseInt(el.dataset.letterInterval  || '100',  10);

    if (!text) return;

    // Build initial spans
    buildSpans(el, text);

    // Run on load
    runMatrixAnimation(el, text, initialDelay, letterDuration, letterInterval);

    // Re-run on hover
    el.closest('section, .partners-header, p')?.addEventListener('mouseenter', () => {
      runMatrixAnimation(el, text, 0, letterDuration, letterInterval);
    });
  });
}
