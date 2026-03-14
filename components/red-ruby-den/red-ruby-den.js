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

/**
 * Falling Pattern UI Implementation
 * Translated from the requested React component for vanilla JS compatibility.
 */
function initFallingPattern() {
  const container = document.getElementById('red-ruby-falling-pattern');
  if (!container) return;

  const color = 'red';
  const duration = 150;

  const patterns = [
    `radial-gradient(4px 100px at 0px 235px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 235px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 117.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 252px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 252px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 126px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 150px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 150px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 75px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 253px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 253px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 126.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 204px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 204px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 102px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 134px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 134px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 67px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 179px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 179px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 89.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 299px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 299px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 149.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 215px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 215px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 107.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 281px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 281px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 140.5px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 158px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 158px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 79px, ${color} 100%, transparent 150%)`,
    `radial-gradient(4px 100px at 0px 210px, ${color}, transparent)`,
    `radial-gradient(4px 100px at 300px 210px, ${color}, transparent)`,
    `radial-gradient(1.5px 1.5px at 150px 105px, ${color} 100%, transparent 150%)`
  ];

  const backgroundSizes = [
    '300px 235px', '300px 235px', '300px 235px',
    '300px 252px', '300px 252px', '300px 252px',
    '300px 150px', '300px 150px', '300px 150px',
    '300px 253px', '300px 253px', '300px 253px',
    '300px 204px', '300px 204px', '300px 204px',
    '300px 134px', '300px 134px', '300px 134px',
    '300px 179px', '300px 179px', '300px 179px',
    '300px 299px', '300px 299px', '300px 299px',
    '300px 215px', '300px 215px', '300px 215px',
    '300px 281px', '300px 281px', '300px 281px',
    '300px 158px', '300px 158px', '300px 158px',
    '300px 210px', '300px 210px', '300px 210px'
  ].join(', ');

  const startPositions = '0px 220px, 3px 220px, 151.5px 337.5px, 25px 24px, 28px 24px, 176.5px 150px, 50px 16px, 53px 16px, 201.5px 91px, 75px 224px, 78px 224px, 226.5px 230.5px, 100px 19px, 103px 19px, 251.5px 121px, 125px 120px, 128px 120px, 276.5px 187px, 150px 31px, 153px 31px, 301.5px 120.5px, 175px 235px, 178px 235px, 326.5px 384.5px, 200px 121px, 203px 121px, 351.5px 228.5px, 225px 224px, 228px 224px, 376.5px 364.5px, 250px 26px, 253px 26px, 401.5px 105px, 275px 75px, 278px 75px, 426.5px 180px';
  const endPositions = '0px 6800px, 3px 6800px, 151.5px 6917.5px, 25px 13632px, 28px 13632px, 176.5px 13758px, 50px 5416px, 53px 5416px, 201.5px 5491px, 75px 17175px, 78px 17175px, 226.5px 17301.5px, 100px 5119px, 103px 5119px, 251.5px 5221px, 125px 8428px, 128px 8428px, 276.5px 8495px, 150px 9876px, 153px 9876px, 301.5px 9965.5px, 175px 13391px, 178px 13391px, 326.5px 13540.5px, 200px 14741px, 203px 14741px, 351.5px 14848.5px, 225px 18770px, 228px 18770px, 376.5px 18910.5px, 250px 5082px, 253px 5082px, 401.5px 5161px, 275px 6375px, 278px 6375px, 426.5px 6480px';

  container.style.backgroundImage = patterns.join(', ');
  container.style.backgroundSize = backgroundSizes;
  
  // Start animation
  container.animate([
    { backgroundPosition: startPositions },
    { backgroundPosition: endPositions }
  ], {
    duration: duration * 1000,
    iterations: Infinity,
    easing: 'linear'
  });

  // Fade in
  setTimeout(() => {
    container.style.opacity = '1';
  }, 100);
}

// Initialize on load or directly if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFallingPattern);
} else {
  initFallingPattern();
}
