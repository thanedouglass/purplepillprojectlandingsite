/**
 * globe.js — Purple Pill Project
 * COBE globe initialization. Requires cobe CDN script in index.html.
 */
export function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof createGlobe === 'undefined') return;

  let phi        = 0;
  let width      = 0;
  let pointerDown = null;
  let pointerDelta = 0;
  let r          = 0;

  function onResize() {
    width = canvas.offsetWidth;
  }

  window.addEventListener('resize', onResize, { passive: true });
  onResize();

  const globe = createGlobe(canvas, {
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    width:  width * 2,
    height: width * 2,
    phi:    0,
    theta:  0.28,
    dark:   1,
    diffuse: 1.6,
    mapSamples: 20000,
    mapBrightness: 5.5,
    baseColor:   [0.12, 0.0, 0.22],
    markerColor: [0.0,  0.8, 0.82],
    glowColor:   [0.48, 0.0, 0.72],
    opacity:     0.88,
    markers: [
      { location: [40.7128,  -74.0060],  size: 0.09 }, // New York
      { location: [34.0522, -118.2437],  size: 0.07 }, // Los Angeles
      { location: [39.7392, -104.9903],  size: 0.10 }, // Denver (EthDenver)
      { location: [30.2672,  -97.7431],  size: 0.10 }, // Austin (SXSW)
      { location: [51.5074,   -0.1278],  size: 0.07 }, // London
      { location: [48.8566,    2.3522],  size: 0.06 }, // Paris
      { location: [52.5200,   13.4050],  size: 0.05 }, // Berlin
      { location: [35.6762,  139.6503],  size: 0.07 }, // Tokyo
      { location: [37.5665,  126.9780],  size: 0.05 }, // Seoul
      { location: [-23.5505, -46.6333],  size: 0.08 }, // São Paulo
      { location: [19.4326,  -99.1332],  size: 0.07 }, // Mexico City
      { location: [-33.8688, 151.2093],  size: 0.06 }, // Sydney
      { location: [28.6139,   77.2090],  size: 0.07 }, // New Delhi
      { location: [1.3521,   103.8198],  size: 0.05 }, // Singapore
      { location: [6.5244,     3.3792],  size: 0.06 }, // Lagos
      { location: [-1.2921,   36.8219],  size: 0.05 }, // Nairobi
    ],
    onRender(state) {
      if (pointerDown === null) phi += 0.0035;
      state.phi    = phi + r;
      state.width  = width * 2;
      state.height = width * 2;
    },
  });

  // Fade in
  setTimeout(() => { canvas.style.opacity = '1'; }, 100);

  // Pointer drag
  canvas.addEventListener('pointerdown', (e) => {
    pointerDown  = e.clientX - pointerDelta;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('pointerup', () => {
    pointerDown = null;
    canvas.style.cursor = 'grab';
  });
  window.addEventListener('pointermove', (e) => {
    if (pointerDown !== null) {
      const delta = e.clientX - pointerDown;
      pointerDelta = delta;
      r = delta / 220;
    }
  }, { passive: true });

  // Touch support
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      r = (touch.clientX - canvas.getBoundingClientRect().left - width / 2) / 220;
    }
  }, { passive: true });
}
