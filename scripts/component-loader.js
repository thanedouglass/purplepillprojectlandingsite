/**
 * component-loader.js — Purple Pill Project
 *
 * Fetches each HTML partial + its CSS, injects them into the DOM.
 * Then initializes all page scripts after components are mounted.
 *
 * To add a new component:
 *   1. Create /components/my-section/my-section.html
 *   2. Create /components/my-section/my-section.css
 *   3. Add <div data-component="my-section"></div> to index.html
 *   Done. This script handles the rest.
 */

const COMPONENT_BASE = '/components';

/**
 * Inject a component's CSS into <head> (once, idempotent)
 */
function injectCSS(name) {
  const id = `style-${name}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id   = id;
  link.rel  = 'stylesheet';
  link.href = `${COMPONENT_BASE}/${name}/${name}.css`;
  document.head.appendChild(link);
}

/**
 * Load a single component: fetch HTML partial, inject CSS, replace slot
 */
async function loadComponent(slot) {
  const name = slot.dataset.component;
  try {
    const [htmlRes] = await Promise.all([
      fetch(`${COMPONENT_BASE}/${name}/${name}.html`),
      injectCSS(name),
    ]);

    if (!htmlRes.ok) throw new Error(`[${name}] HTML not found (${htmlRes.status})`);

    const html = await htmlRes.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    // Replace the slot with actual component markup
    slot.replaceWith(...wrapper.childNodes);
  } catch (err) {
    console.warn(`Component load failed: ${name}`, err);
    slot.remove(); // silently remove broken slots
  }
}

/**
 * Load component-specific JS modules after all HTML is injected
 */
async function loadComponentScripts() {
  const jsComponents = ['red-ruby-den', 'gallery', 'manifesto'];
  for (const name of jsComponents) {
    try {
      await import(`${COMPONENT_BASE}/${name}/${name}.js`);
    } catch {
      // No JS for this component — that's fine
    }
  }
}

/**
 * Init global scripts that depend on full DOM
 */
async function initGlobalScripts() {
  const [
    { initNavScroll },
    { initScrollReveal },
    { initGlobe },
    { initHyperText },
    { initMatrixText },
    { initMagicTextReveal },
  ] = await Promise.all([
    import('/scripts/nav-scroll.js'),
    import('/scripts/scroll-reveal.js'),
    import('/scripts/globe.js'),
    import('/scripts/hyper-text.js'),
    import('/scripts/matrix-text.js'),
    import('/scripts/magic-text-reveal.js'),
  ]);

  initNavScroll();
  initScrollReveal();
  initGlobe();
  initHyperText();
  initMatrixText();
  initMagicTextReveal();
}

/**
 * Main entry point
 */
async function bootstrap() {
  const slots = [...document.querySelectorAll('[data-component]')];

  // Load all components in parallel
  await Promise.all(slots.map(loadComponent));

  // Load component-specific JS (serial — order can matter)
  await loadComponentScripts();

  // Init global page scripts
  await initGlobalScripts();
}

document.addEventListener('DOMContentLoaded', bootstrap);
