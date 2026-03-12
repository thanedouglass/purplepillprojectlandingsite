/**
 * red-ruby-den.js — Purple Pill Project
 * Handles Den waitlist form submission via Formspree.
 *
 * To activate: replace FORM_ID with your Formspree endpoint ID.
 * Get one free at https://formspree.io
 */

const FORM_ID       = 'YOUR_FORMSPREE_ID'; // ← Replace this
const FORM_ENDPOINT = `https://formspree.io/f/${FORM_ID}`;

const form       = document.getElementById('den-waitlist-form');
const successEl  = document.getElementById('den-success');
const submitBtn  = document.getElementById('den-submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button during submit
    submitBtn.disabled    = true;
    submitBtn.textContent = 'TRANSMITTING...';

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Show success state
        form.style.display = 'none';
        successEl.classList.add('active');
        incrementCounter();
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'REQUEST ACCESS';
      showError();
    }
  });
}

/**
 * Optimistically increment the counter display
 */
function incrementCounter() {
  const numEl = document.querySelector('.den-counter-num');
  if (!numEl) return;
  const current = parseInt(numEl.textContent.replace(/,/g, ''), 10);
  numEl.textContent = (current + 1).toLocaleString();
}

/**
 * Show inline error if submission fails
 */
function showError() {
  const existing = document.querySelector('.den-error');
  if (existing) return;

  const err = document.createElement('p');
  err.className   = 'den-error';
  err.textContent = 'Transmission failed. Try again or email us directly.';
  err.style.cssText = `
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--crimson);
    margin-top: 12px;
    letter-spacing: 0.1em;
  `;
  form.appendChild(err);
}
