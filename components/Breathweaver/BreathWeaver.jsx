"use client";

/**
 * BREATH WEAVER — Purple Pill / Red Ruby Den
 * Hand-tracking regulation game using MediaPipe HandLandmarker
 *
 * Install: npm install @mediapipe/tasks-vision
 * Place:   components/BreathWeaver/index.jsx  (or .tsx with minor typing)
 * Import:  import dynamic from 'next/dynamic'
 *          const BreathWeaver = dynamic(() => import('@/components/BreathWeaver'), { ssr: false })
 */

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Breathing pattern (ms) ───────────────────────────────────────────────────
const BREATH = { inhale: 4000, hold: 7000, exhale: 8000 };

// ─── Red Ruby Den palette ─────────────────────────────────────────────────────
const C = {
  bg: "#04000a",
  rib: "#ff1744",
  spine: "#ff6d00",
  particle: "#00e5ff",
  gold: "#ffd600",
  goldDim: "rgba(255,214,0,0.4)",
  green: "#00e676",
  phases: {
    idle: "rgba(255,214,0,0.45)",
    inhale: "#00e5ff",
    hold: "#ff6d00",
    exhale: "#ff1744",
  },
};

function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

// ─── Particle factory ─────────────────────────────────────────────────────────
function makeParticles(count = 110) {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2 + Math.random() * 0.4,
    baseR: 78 + Math.random() * 62,
    r: 78 + Math.random() * 62,
    size: 1.1 + Math.random() * 1.9,
    opacity: 0.2 + Math.random() * 0.8,
    speed: (0.003 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
    offset: Math.random() * Math.PI * 2,
  }));
}

// ─── Canvas draw helpers ──────────────────────────────────────────────────────
function drawRibcage(ctx, cx, cy, scale, t) {
  const RIBS = 6;
  const sH = 168 * scale;
  const maxRW = 132 * scale;
  const rGap = sH / (RIBS + 1);
  const pulse = Math.sin(t * 0.0022) * 0.018 * scale;

  ctx.save();

  // Spine glow
  ctx.beginPath();
  ctx.moveTo(cx, cy - sH / 2);
  ctx.lineTo(cx, cy + sH / 2);
  ctx.strokeStyle = C.spine;
  ctx.lineWidth = 1.5 * scale;
  ctx.shadowColor = C.spine;
  ctx.shadowBlur = 12;
  ctx.globalAlpha = 0.88;
  ctx.stroke();

  // Vertebrae discs
  for (let i = 0; i <= RIBS + 1; i++) {
    const vy = cy - sH / 2 + i * rGap;
    ctx.beginPath();
    ctx.arc(cx, vy, 3.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = C.spine;
    ctx.shadowColor = C.spine;
    ctx.shadowBlur = 7;
    ctx.fill();
  }

  // Ribs — glow pass then sharp pass
  for (let i = 0; i < RIBS; i++) {
    const ry = cy - sH / 2 + (i + 1) * rGap;
    const taper = 1 - (Math.abs(i - (RIBS - 1) / 2) / RIBS) * 0.44;
    const rw = maxRW * taper * (scale + pulse);
    const crv = rGap * 0.38 * taper;

    const drawRib = (side, lw, alpha, blur, color) => {
      ctx.beginPath();
      ctx.moveTo(cx, ry);
      ctx.bezierCurveTo(
        cx + side * rw * 0.44, ry - crv * 0.78,
        cx + side * rw * 0.84, ry - crv * 0.38,
        cx + side * rw, ry + crv * 0.38
      );
      ctx.strokeStyle = color;
      ctx.lineWidth = lw * scale;
      ctx.shadowColor = C.rib;
      ctx.shadowBlur = blur;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    };

    // glow
    drawRib(1, 5, 0.35, 20, "rgba(255,23,68,0.18)");
    drawRib(-1, 5, 0.35, 20, "rgba(255,23,68,0.18)");
    // sharp
    drawRib(1, 1.2, 0.88, 7, C.rib);
    drawRib(-1, 1.2, 0.88, 7, C.rib);
  }

  ctx.restore();
}

function drawParticles(ctx, cx, cy, breathScale, t, particles) {
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
    ctx.shadowBlur = 7;
    ctx.fillStyle = C.particle;
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawBreathRing(ctx, cx, cy, breathScale, phase, t) {
  const r = lerp(88, 228, breathScale);
  const color = C.phases[phase] || C.gold;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.9;
  ctx.globalAlpha = 0.28 + 0.14 * Math.sin(t * 0.0028);
  ctx.setLineDash([5, 11]);
  ctx.stroke();
  ctx.setLineDash([]);
  // Solid inner floor ring
  ctx.beginPath();
  ctx.arc(cx, cy, 88, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.restore();
}

function drawPhaseLabel(ctx, cx, cy, breathScale, phase) {
  if (phase === "idle") return;
  const r = lerp(88, 228, breathScale);
  const color = C.phases[phase];
  const LABELS = { inhale: "INHALE ▲", hold: "HOLD ◆", exhale: "EXHALE ▼" };
  ctx.save();
  ctx.font = `500 12px 'Courier New', monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.globalAlpha = 0.92;
  ctx.fillText(LABELS[phase] || "", cx, cy + r + 32);
  ctx.restore();
}

function drawHUD(ctx, w, h, cycles, hasHands, flashTimer) {
  ctx.save();
  ctx.font = `10px 'Courier New', monospace`;
  ctx.textAlign = "left";
  ctx.fillStyle = C.goldDim;
  ctx.fillText("THE BREATH WEAVER", 22, 26);
  ctx.fillStyle = "rgba(255,214,0,0.28)";
  ctx.fillText(`CYCLES : ${cycles}`, 22, 44);
  ctx.fillText("PATTERN · 4 · 7 · 8", 22, 60);

  // Hands prompt
  if (!hasHands) {
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(performance.now() * 0.002);
    ctx.fillStyle = C.gold;
    ctx.fillText("RAISE BOTH HANDS INTO FRAME", w / 2, h - 26);
  }

  // Cycle complete flash
  if (flashTimer > 0) {
    ctx.textAlign = "center";
    ctx.font = `bold 14px 'Courier New', monospace`;
    ctx.fillStyle = C.green;
    ctx.shadowColor = C.green;
    ctx.shadowBlur = 18;
    ctx.globalAlpha = Math.min(1, flashTimer / 600);
    ctx.fillText("✦  CYCLE COMPLETE  ✦", w / 2, 56);
  }

  ctx.restore();
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BreathWeaver() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const detectRef = useRef(null);
  const particlesRef = useRef(makeParticles());

  // All mutable game state lives here to avoid stale closures
  const sRef = useRef({
    phase: "idle",
    phaseStartTime: 0,
    scale: 0.28,
    targetScale: 0.28,
    completedCycles: 0,
    lastNorm: 0,
    velocity: 0,
    detected: false,
    calMin: 0.07,
    calMax: 0.56,
    flashTimer: 0,
  });

  const [uiPhase, setUiPhase] = useState("idle");
  const [cycles, setCycles] = useState(0);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [hasHands, setHasHands] = useState(false);

  // ─── Render loop ─────────────────────────────────────────────────────────
  const renderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const t = performance.now();
    const s = sRef.current;

    s.scale = lerp(s.scale, s.targetScale, 0.07);
    if (s.flashTimer > 0) s.flashTimer -= 16;

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);

    // Vignette
    const vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, "rgba(0,0,0,0.78)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // Scanlines
    ctx.save();
    ctx.globalAlpha = 0.022;
    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, y, w, 2);
    }
    ctx.restore();

    // Scene
    drawParticles(ctx, cx, cy, s.scale, t, particlesRef.current);
    drawRibcage(ctx, cx, cy, 0.84 + s.scale * 0.26, t);
    drawBreathRing(ctx, cx, cy, s.scale, s.phase, t);
    drawPhaseLabel(ctx, cx, cy, s.scale, s.phase);
    drawHUD(ctx, w, h, s.completedCycles, s.detected, s.flashTimer);

    animRef.current = requestAnimationFrame(renderLoop);
  }, []);

  // ─── Hand result processor ───────────────────────────────────────────────
  const processResult = useCallback((result) => {
    const s = sRef.current;
    const now = performance.now();
    const hasTwo = result.landmarks?.length >= 2;

    s.detected = hasTwo;
    setHasHands(hasTwo);

    if (!hasTwo) {
      if (s.phase !== "idle") {
        s.phase = "idle";
        s.targetScale = 0.28;
        setUiPhase("idle");
      }
      return;
    }

    // Wrist-to-wrist distance (landmark 0)
    const w1 = result.landmarks[0][0];
    const w2 = result.landmarks[1][0];
    const rawDist = Math.hypot(w1.x - w2.x, w1.y - w2.y);

    // Rolling auto-calibration
    if (rawDist < s.calMin) s.calMin = rawDist * 0.94;
    if (rawDist > s.calMax) s.calMax = rawDist * 1.06;

    const norm = Math.max(0, Math.min(1, (rawDist - s.calMin) / (s.calMax - s.calMin)));
    s.velocity = norm - s.lastNorm;
    s.lastNorm = norm;
    s.targetScale = norm;

    const elapsed = now - s.phaseStartTime;
    const expanding = s.velocity > 0.006;
    const contracting = s.velocity < -0.006;

    // ── Phase state machine (4-7-8 pattern) ──────────────────────────────
    if (s.phase === "idle" && expanding) {
      s.phase = "inhale";
      s.phaseStartTime = now;
      setUiPhase("inhale");
    } else if (s.phase === "inhale" && elapsed > BREATH.inhale * 0.55 && !expanding) {
      s.phase = "hold";
      s.phaseStartTime = now;
      setUiPhase("hold");
    } else if (s.phase === "hold" && elapsed > BREATH.hold * 0.38 && contracting) {
      s.phase = "exhale";
      s.phaseStartTime = now;
      setUiPhase("exhale");
    } else if (s.phase === "exhale" && norm < 0.16 && elapsed > 2200) {
      s.completedCycles++;
      s.flashTimer = 2000;
      s.phase = "idle";
      s.phaseStartTime = now;
      setCycles(s.completedCycles);
      setUiPhase("idle");
    }
  }, []);

  // ─── MediaPipe init ──────────────────────────────────────────────────────
  useEffect(() => {
    let handLandmarker = null;
    let stream = null;
    let active = true;

    const init = async () => {
      try {
        // Dynamic import avoids SSR crash in Next.js
        const vision = await import("@mediapipe/tasks-vision");
        const { HandLandmarker, FilesetResolver } = vision;

        const fs = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        handLandmarker = await HandLandmarker.createFromOptions(fs, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: false,
        });

        if (!active) return;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        setStatus("ready");

        // Detection loop (reads from video frames)
        let lastTime = -1;
        const detect = () => {
          if (!active || !video || video.paused || video.ended) return;
          if (video.currentTime !== lastTime) {
            lastTime = video.currentTime;
            try {
              const result = handLandmarker.detectForVideo(video, performance.now());
              processResult(result);
            } catch (_) {
              // transient GPU error — skip frame
            }
          }
          detectRef.current = requestAnimationFrame(detect);
        };
        detectRef.current = requestAnimationFrame(detect);

        // Render loop (visual at 60fps, independent of detection)
        animRef.current = requestAnimationFrame(renderLoop);
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setErrorMsg(err?.message || "Initialization failed");
      }
    };

    init();

    return () => {
      active = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (detectRef.current) cancelAnimationFrame(detectRef.current);
      stream?.getTracks().forEach((t) => t.stop());
      handLandmarker?.close?.();
    };
  }, [processResult, renderLoop]);

  const phaseColor = C.phases[uiPhase] || C.gold;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        maxWidth: "1280px",
        margin: "0 auto",
        background: C.bg,
        borderRadius: "4px",
        overflow: "hidden",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Hidden video feed (MediaPipe reads from this) */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 1,
          height: 1,
        }}
        playsInline
        muted
      />

      {/* Main render canvas */}
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {/* ── Loading ── */}
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: C.bg,
            gap: 18,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              border: "1px solid #ff1744",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "bw-spin 0.85s linear infinite",
            }}
          />
          <span
            style={{
              color: "#ffd600",
              fontSize: 10,
              letterSpacing: "0.22em",
              opacity: 0.7,
            }}
          >
            INITIALIZING BREATH WEAVER
          </span>
          <style>{`@keyframes bw-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Error ── */}
      {status === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: C.bg,
            color: "#ff1744",
            fontSize: 10,
            padding: 24,
            textAlign: "center",
            gap: 10,
            letterSpacing: "0.12em",
          }}
        >
          <span>CAMERA ACCESS REQUIRED</span>
          <span style={{ color: "rgba(255,23,68,0.45)", fontSize: 9 }}>{errorMsg}</span>
        </div>
      )}

      {/* ── Phase pill ── */}
      {status === "ready" && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "4px 12px",
            border: `1px solid ${phaseColor}`,
            color: phaseColor,
            fontSize: 9,
            letterSpacing: "0.28em",
            textShadow: `0 0 8px ${phaseColor}`,
            transition: "all 0.38s ease",
          }}
        >
          {uiPhase.toUpperCase()}
        </div>
      )}

      {/* ── Hands indicator dot ── */}
      {status === "ready" && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: hasHands ? C.green : "rgba(255,255,255,0.2)",
            boxShadow: hasHands ? `0 0 8px ${C.green}` : "none",
            transition: "all 0.3s ease",
          }}
        />
      )}
    </div>
  );
}
