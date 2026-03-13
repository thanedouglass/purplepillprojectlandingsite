/**
 * DEN.JS — Breath Weaver
 * Vanilla ES Module. No framework. No build step.
 * Loads MediaPipe tasks-vision directly from CDN.
 *
 * File lives at: /den.js  (same directory as den.html)
 * Loaded via:    <script type="module" src="den.js">
 */

import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/+esm";

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:       "#04000a",
  rib:      "#ff1744",
  spine:    "#ff6d00",
  particle: "#00e5ff",
  gold:     "#ffd600",
  green:    "#00e676",
  phases: {
    idle:   "rgba(255,214,0,0.45)",
    inhale: "#00e5ff",
    hold:   "#ff6d00",
    exhale: "#ff1744",
  },
};

// ─── Breathing pattern timings (ms) ──────────────────────────────────────────
const BREATH = { inhale: 4000, hold: 7000, exhale: 8000 };

// ─── DOM refs ────────────────────────────────────────────────────────────────
const canvas      = document.getElementById("bw-canvas");
const video       = document.getElementById("bw-video");
const loadingEl   = document.getElementById("bw-loading");
const gateEl      = document.getElementById("bw-gate");
const startBtn    = document.getElementById("bw-start-btn");
const errorEl     = document.getElementById("bw-error");
const errorMsgEl  = document.getElementById("bw-error-msg");
const phasePill   = document.getElementById("bw-phase-pill");
const cyclesEl    = document.getElementById("bw-cycles");
const cyclesCount = document.getElementById("bw-cycles-count");
const handsDot    = document.getElementById("bw-hands-dot");
const handsPrompt = document.getElementById("bw-hands-prompt");
const flashEl     = document.getElementById("bw-flash");
const ctx         = canvas.getContext("2d");

// ─── Mutable game state (plain object — no framework needed) ──────────────────
const state = {
  phase:          "idle",
  phaseStartTime: 0,
  scale:          0.28,  // current visual scale (lerped toward target)
  targetScale:    0.28,  // set by hand distance
  cycles:         0,
  lastNorm:       0,
  velocity:       0,
  handsPresent:   false,
  calMin:         0.07,  // auto-calibration floor
  calMax:         0.56,  // auto-calibration ceiling
  flashTimer:     0,
};

// ─── Particles ────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 110;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  angle:  (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4,
  baseR:  78 + Math.random() * 62,
  r:      78 + Math.random() * 62,
  size:   1.1 + Math.random() * 1.9,
  opacity: 0.2 + Math.random() * 0.8,
  speed:  (0.003 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
  offset: Math.random() * Math.PI * 2,
}));

// ─── Utility ─────────────────────────────────────────────────────────────────
function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function show(el)  { el.hidden = false; }
function hide(el)  { el.hidden = true; }

// ─── Canvas sizing ────────────────────────────────────────────────────────────
function resizeCanvas() {
  canvas.width  = window.innerWidth  * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width  = window.innerWidth  + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ─── Draw: particles ─────────────────────────────────────────────────────────
function drawParticles(cx, cy, breathScale, t) {
  particles.forEach((p) => {
    p.angle += p.speed;
    const targetR = p.baseR * (0.42 + breathScale * 1.42);
    p.r = lerp(p.r, targetR, 0.06);

    const x = cx + Math.cos(p.angle) * p.r;
    const y = cy + Math.sin(p.angle + p.offset * 0.28) * p.r * 0.6;
    const pulse = 0.48 + 0.52 * Math.sin(t * 0.003 + p.offset);

    ctx.save();
    ctx.globalAlpha = p.opacity * pulse * Math.max(0.28, breathScale);
    ctx.shadowColor = C.particle;
    ctx.shadowBlur  = 7;
    ctx.fillStyle   = C.particle;
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// ─── Draw: ribcage ───────────────────────────────────────────────────────────
function drawRibcage(cx, cy, scale, t) {
  const RIBS  = 6;
  const sH    = 168 * scale;
  const maxRW = 132 * scale;
  const rGap  = sH / (RIBS + 1);
  const pulse = Math.sin(t * 0.0022) * 0.018 * scale;

  ctx.save();

  // Spine line
  ctx.beginPath();
  ctx.moveTo(cx, cy - sH / 2);
  ctx.lineTo(cx, cy + sH / 2);
  ctx.strokeStyle  = C.spine;
  ctx.lineWidth    = 1.5 * scale;
  ctx.shadowColor  = C.spine;
  ctx.shadowBlur   = 12;
  ctx.globalAlpha  = 0.88;
  ctx.stroke();

  // Vertebrae discs
  for (let i = 0; i <= RIBS + 1; i++) {
    const vy = cy - sH / 2 + i * rGap;
    ctx.beginPath();
    ctx.arc(vy === vy ? cx : cx, vy, 3.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle   = C.spine;
    ctx.shadowColor = C.spine;
    ctx.shadowBlur  = 7;
    ctx.fill();
  }

  // Ribs
  for (let i = 0; i < RIBS; i++) {
    const ry    = cy - sH / 2 + (i + 1) * rGap;
    const taper = 1 - (Math.abs(i - (RIBS - 1) / 2) / RIBS) * 0.44;
    const rw    = maxRW * taper * (scale + pulse);
    const crv   = rGap * 0.38 * taper;

    const drawRib = (side, lw, alpha, blur, color) => {
      ctx.beginPath();
      ctx.moveTo(cx, ry);
      ctx.bezierCurveTo(
        cx + side * rw * 0.44, ry - crv * 0.78,
        cx + side * rw * 0.84, ry - crv * 0.38,
        cx + side * rw,        ry + crv * 0.38
      );
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw * scale;
      ctx.shadowColor = C.rib;
      ctx.shadowBlur  = blur;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    };

    // Glow pass
    drawRib( 1, 5, 0.35, 20, "rgba(255,23,68,0.18)");
    drawRib(-1, 5, 0.35, 20, "rgba(255,23,68,0.18)");
    // Sharp pass
    drawRib( 1, 1.2, 0.88, 7, C.rib);
    drawRib(-1, 1.2, 0.88, 7, C.rib);
  }

  ctx.restore();
}

// ─── Draw: breath ring ───────────────────────────────────────────────────────
function drawBreathRing(cx, cy, breathScale, phase, t) {
  const r     = lerp(88, 228, breathScale);
  const color = C.phases[phase] || C.gold;

  ctx.save();

  // Dashed expanding ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth   = 0.9;
  ctx.globalAlpha = 0.28 + 0.14 * Math.sin(t * 0.0028);
  ctx.setLineDash([5, 11]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Static floor ring
  ctx.beginPath();
  ctx.arc(cx, cy, 88, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth   = 0.5;
  ctx.globalAlpha = 1;
  ctx.stroke();

  ctx.restore();
}

// ─── Draw: phase label (inside ring) ─────────────────────────────────────────
function drawPhaseLabel(cx, cy, breathScale, phase) {
  if (phase === "idle") return;
  const LABELS = { inhale: "INHALE ▲", hold: "HOLD ◆", exhale: "EXHALE ▼" };
  const r      = lerp(88, 228, breathScale);
  const color  = C.phases[phase];

  ctx.save();
  ctx.font        = `500 12px 'Courier New', monospace`;
  ctx.fillStyle   = color;
  ctx.textAlign   = "center";
  ctx.shadowColor = color;
  ctx.shadowBlur  = 14;
  ctx.globalAlpha = 0.92;
  ctx.fillText(LABELS[phase] || "", cx, cy + r + 34);
  ctx.restore();
}

// ─── Render loop ─────────────────────────────────────────────────────────────
let rafId = null;

function renderLoop() {
  const W  = window.innerWidth;
  const H  = window.innerHeight;
  const cx = W / 2;
  const cy = H / 2;
  const t  = performance.now();

  // Lerp scale toward target
  state.scale = lerp(state.scale, state.targetScale, 0.07);

  // Tick flash timer
  if (state.flashTimer > 0) state.flashTimer -= 16;

  // ── Background ────────────────────────────────────────────
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Vignette
  const vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.72);
  vig.addColorStop(0, "transparent");
  vig.addColorStop(1, "rgba(0,0,0,0.78)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // Scanlines
  ctx.save();
  ctx.globalAlpha = 0.022;
  ctx.fillStyle   = "#000";
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
  ctx.restore();

  // ── Scene ─────────────────────────────────────────────────
  drawParticles(cx, cy, state.scale, t);
  drawRibcage(cx, cy, 0.84 + state.scale * 0.26, t);
  drawBreathRing(cx, cy, state.scale, state.phase, t);
  drawPhaseLabel(cx, cy, state.scale, state.phase);

  rafId = requestAnimationFrame(renderLoop);
}

// ─── Hand result → game state ─────────────────────────────────────────────────
function processResult(result) {
  const now    = performance.now();
  const hasTwo = result.landmarks?.length >= 2;

  // ── Update HUD: hands presence ──────────────────────────
  if (hasTwo !== state.handsPresent) {
    state.handsPresent = hasTwo;
    handsDot.classList.toggle("hands-on", hasTwo);

    // Show/hide the hands prompt
    if (hasTwo) {
      hide(handsPrompt);
    } else {
      show(handsPrompt);
    }
  }

  if (!hasTwo) {
    // Gracefully reset to idle
    if (state.phase !== "idle") {
      state.phase       = "idle";
      state.targetScale = 0.28;
      updatePhasePill("idle");
    }
    return;
  }

  // ── Wrist-to-wrist distance (landmark index 0 = wrist) ──
  const w1     = result.landmarks[0][0];
  const w2     = result.landmarks[1][0];
  const rawDist = Math.hypot(w1.x - w2.x, w1.y - w2.y);

  // Rolling auto-calibration — expands min/max window over time
  if (rawDist < state.calMin) state.calMin = rawDist * 0.94;
  if (rawDist > state.calMax) state.calMax = rawDist * 1.06;

  const norm      = Math.max(0, Math.min(1,
    (rawDist - state.calMin) / (state.calMax - state.calMin)
  ));
  state.velocity  = norm - state.lastNorm;
  state.lastNorm  = norm;
  state.targetScale = norm;

  const elapsed    = now - state.phaseStartTime;
  const expanding  = state.velocity >  0.006;
  const contracting = state.velocity < -0.006;

  // ── Phase state machine: 4-7-8 pattern ──────────────────
  switch (state.phase) {

    case "idle":
      if (expanding) {
        state.phase          = "inhale";
        state.phaseStartTime = now;
        updatePhasePill("inhale");
      }
      break;

    case "inhale":
      // Transition to hold when expansion slows, after minimum inhale time
      if (elapsed > BREATH.inhale * 0.55 && !expanding) {
        state.phase          = "hold";
        state.phaseStartTime = now;
        updatePhasePill("hold");
      }
      break;

    case "hold":
      // Transition to exhale when contraction begins, after minimum hold time
      if (elapsed > BREATH.hold * 0.38 && contracting) {
        state.phase          = "exhale";
        state.phaseStartTime = now;
        updatePhasePill("exhale");
      }
      break;

    case "exhale":
      // Cycle complete when hands are back together, after minimum exhale time
      if (norm < 0.16 && elapsed > 2200) {
        state.cycles++;
        cyclesCount.textContent = state.cycles;
        triggerFlash();
        state.phase          = "idle";
        state.phaseStartTime = now;
        updatePhasePill("idle");
      }
      break;
  }
}

// ─── HUD helpers ──────────────────────────────────────────────────────────────
function updatePhasePill(phase) {
  const LABELS = { idle: "IDLE", inhale: "INHALE", hold: "HOLD", exhale: "EXHALE" };
  phasePill.textContent         = LABELS[phase] || "IDLE";
  phasePill.dataset.phase       = phase;
}

function triggerFlash() {
  flashEl.classList.add("visible");
  state.flashTimer = 2000;
  setTimeout(() => flashEl.classList.remove("visible"), 2000);
}

// ─── MediaPipe init ───────────────────────────────────────────────────────────
let handLandmarker = null;
let detectRafId    = null;
let lastVideoTime  = -1;

async function initMediaPipe() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode:                  "VIDEO",
    numHands:                     2,
    minHandDetectionConfidence:   0.5,
    minHandPresenceConfidence:    0.5,
    minTrackingConfidence:        0.5,
  });
}

// Detection loop — runs independently from render loop
function startDetectionLoop() {
  const detect = () => {
    if (video.paused || video.ended || !handLandmarker) {
      detectRafId = requestAnimationFrame(detect);
      return;
    }
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime;
      try {
        const result = handLandmarker.detectForVideo(video, performance.now());
        processResult(result);
      } catch (_) {
        // Transient GPU error — skip frame silently
      }
    }
    detectRafId = requestAnimationFrame(detect);
  };
  detectRafId = requestAnimationFrame(detect);
}

// ─── Camera start ─────────────────────────────────────────────────────────────
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
    audio: false,
  });

  video.srcObject = stream;
  await video.play();
}

// ─── Boot sequence ────────────────────────────────────────────────────────────
async function boot() {
  // 1. Show loading overlay while MediaPipe wasm downloads
  show(loadingEl);

  try {
    await initMediaPipe();
  } catch (err) {
    hide(loadingEl);
    errorMsgEl.textContent = "Failed to load hand tracking model. " + (err?.message || "");
    show(errorEl);
    return;
  }

  // 2. Model ready — show permission gate
  hide(loadingEl);
  show(gateEl);

  // 3. User clicks "Allow Camera & Begin"
  startBtn.addEventListener("click", async () => {
    hide(gateEl);

    try {
      await startCamera();
    } catch (err) {
      errorMsgEl.textContent = err?.name === "NotAllowedError"
        ? "Camera permission denied. Allow access in your browser settings and reload."
        : "Could not access camera: " + (err?.message || "Unknown error.");
      show(errorEl);
      return;
    }

    // 4. Show HUD elements
    show(phasePill);
    show(cyclesEl);
    show(handsDot);
    show(handsPrompt);
    updatePhasePill("idle");

    // 5. Start both loops
    renderLoop();
    startDetectionLoop();
  }, { once: true });
}

// ─── Start the render loop immediately (animates idle state during gate) ──────
renderLoop();

// ─── Kick off full boot ───────────────────────────────────────────────────────
boot();

// ─── Cleanup on page hide (mobile tab switching) ──────────────────────────────
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (rafId)       cancelAnimationFrame(rafId);
    if (detectRafId) cancelAnimationFrame(detectRafId);
  } else {
    rafId = requestAnimationFrame(renderLoop);
    startDetectionLoop();
  }
});
