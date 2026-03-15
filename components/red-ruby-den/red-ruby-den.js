/**
 * red-ruby-den.js — Purple Pill Project
 * Handles Den waitlist and partner form submissions via Supabase.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase
const supabaseUrl = 'https://nlrxycdsyrpgperlciwq.supabase.co';
const supabaseKey = 'sb_publishable_rHg2JIfISx6XQqQt3YFc3Q_QnYGQViC';
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const viewCards = document.getElementById('view-cards');
const viewBeta = document.getElementById('view-beta');
const viewPartner = document.getElementById('view-partner');

const cardBeta = document.getElementById('card-beta');
const cardPartner = document.getElementById('card-partner');
const backBeta = document.getElementById('back-beta');
const backPartner = document.getElementById('back-partner');

// Setup Beta Tester form
const betaForm = document.getElementById('den-waitlist-form');
const betaSuccessEl = document.getElementById('den-success');
const betaSubmitBtn = document.getElementById('den-submit-btn');

// Setup Partner form
const partnerForm = document.getElementById('den-partner-form');
const partnerSuccessEl = document.getElementById('partner-success');
const partnerSubmitBtn = document.getElementById('partner-submit-btn');

// --- View Switching Logic ---

function showView(viewToShow) {
  // Hide all views
  [viewCards, viewBeta, viewPartner].forEach(view => {
    if (!view) return;
    view.style.opacity = '0';
    view.style.transform = 'translateY(20px)';

    // Wait for transition to finish before hiding
    setTimeout(() => {
      if (view !== viewToShow) {
        view.classList.add('den-view-hidden');
      }
    }, 400);
  });

  // Show target view
  setTimeout(() => {
    if (viewToShow) {
      viewToShow.classList.remove('den-view-hidden');
      // Small reflow delay
      requestAnimationFrame(() => {
        viewToShow.style.opacity = '1';
        viewToShow.style.transform = 'translateY(0)';
      });
    }
  }, 410);
}

if (cardBeta) cardBeta.addEventListener('click', () => showView(viewBeta));
if (cardPartner) cardPartner.addEventListener('click', () => showView(viewPartner));
if (backBeta) backBeta.addEventListener('click', () => showView(viewCards));
if (backPartner) backPartner.addEventListener('click', () => showView(viewCards));

// Add hover effects for back buttons
[backBeta, backPartner].forEach(btn => {
  if (!btn) return;
  btn.addEventListener('mouseenter', () => btn.style.color = 'var(--bone)');
  btn.addEventListener('mouseleave', () => btn.style.color = 'rgba(245,240,220,0.5)');
});


// --- Form Submission Logic ---

if (betaForm) {
  betaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    betaSubmitBtn.disabled = true;
    betaSubmitBtn.textContent = 'TRANSMITTING...';
    clearError(betaForm);

    const formData = new FormData(betaForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      why_interested: formData.get('why_access'),
      can_commit: formData.get('feedback_commit'),
      comfort_level: formData.get('experimental_comfort'),
      referral_source: formData.get('source')
    };

    try {
      const { error } = await supabase.from('beta_testers').insert([data]);
      if (error) throw error;

      betaForm.style.display = 'none';
      backBeta.style.display = 'none';
      betaSuccessEl.classList.add('active');
      updateCounter();
    } catch (err) {
      betaSubmitBtn.disabled = false;
      betaSubmitBtn.textContent = 'REQUEST BETA ACCESS';
      showError(betaForm, err.message);
    }
  });
}

if (partnerForm) {
  partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    partnerSubmitBtn.disabled = true;
    partnerSubmitBtn.textContent = 'TRANSMITTING...';
    clearError(partnerForm);

    const formData = new FormData(partnerForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      organization: formData.get('organization'),
      expertise: formData.get('expertise'),
      collaboration_vision: formData.get('collaboration_vision'),
      work_link: formData.get('portfolio_url')
    };

    try {
      const { error } = await supabase.from('partners').insert([data]);
      if (error) throw error;

      partnerForm.style.display = 'none';
      backPartner.style.display = 'none';
      partnerSuccessEl.classList.add('active');
      updateCounter();
    } catch (err) {
      partnerSubmitBtn.disabled = false;
      partnerSubmitBtn.textContent = 'START THE CONVERSATION';
      showError(partnerForm, err.message);
    }
  });
}

/**
 * Fetch counts from Supabase and increment the counter
 */
async function updateCounter() {
  const numEl = document.querySelector('.den-counter-num');
  if (!numEl) return;

  try {
    const { count: betaCount } = await supabase.from('beta_testers').select('*', { count: 'exact', head: true });
    const { count: partnerCount } = await supabase.from('partners').select('*', { count: 'exact', head: true });

    // Add base count of 847 to keep the aesthetic lore intact
    const total = 984 + (betaCount || 0) + (partnerCount || 0);
    numEl.textContent = total.toLocaleString();
  } catch (err) {
    console.error('Failed to fetch count:', err);
    // Optimistic fallback
    const current = parseInt(numEl.textContent.replace(/,/g, ''), 10);
    numEl.textContent = (current + 1).toLocaleString();
  }
}

/**
 * Clear inline errors
 */
function clearError(formElement) {
  const existing = formElement.querySelector('.den-error');
  if (existing) existing.remove();
}

/**
 * Show inline error if submission fails
 */
function showError(formElement, message) {
  const existing = formElement.querySelector('.den-error');
  if (existing) return;

  const err = document.createElement('p');
  err.className = 'den-error';
  err.textContent = message || 'Transmission failed. Try again or email us directly.';
  err.style.cssText = `
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--crimson);
    margin-top: 12px;
    letter-spacing: 0.1em;
  `;
  formElement.appendChild(err);
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

// Fetch initial counter state
updateCounter();
