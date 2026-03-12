/**
 * magic-text-reveal.js — Purple Pill Project
 * 
 * Vanilla JS port of the MagicTextReveal canvas particle system.
 * Disintegrates text into floating particles that snap back together on hover.
 */

function measureText(ctx, text, font) {
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const fontSize = parseInt(font.match(/\d+px/)?.[0] || '70', 10);
  return {
    width: Math.ceil(metrics.width + fontSize * 0.5),
    height: Math.ceil(fontSize * 1.4)
  };
}

export function initMagicTextReveal() {
  const elements = document.querySelectorAll('[data-magic-text]');

  elements.forEach(el => {
    // Avoid double initialization
    if (el.hasAttribute('data-magic-initialized')) return;
    el.setAttribute('data-magic-initialized', 'true');

    const text = el.dataset.magicText || 'Magic Text';
    const color = el.dataset.color || 'rgba(255, 255, 255, 1)';
    // Compute font size based on current style, or use dataset
    const computedStyle = window.getComputedStyle(el);
    const fontSize = parseFloat(computedStyle.fontSize) || 70;
    const fontFamily = computedStyle.fontFamily || '"Bebas Neue", sans-serif';
    const fontWeight = computedStyle.fontWeight || 600;
    
    const spread = parseFloat(el.dataset.spread || '40');
    const speed = parseFloat(el.dataset.speed || '0.5');
    const density = parseFloat(el.dataset.density || '4');
    
    const transformedDensity = 6 - density;
    const globalDpr = window.devicePixelRatio * 1.5 || 1;

    // Structure
    el.style.position = 'relative';
    el.innerHTML = ''; // Clear original text
    
    // Create text div (invisible until hovered)
    const textDiv = document.createElement('div');
    textDiv.textContent = text;
    textDiv.style.position = 'absolute';
    textDiv.style.left = '50%';
    textDiv.style.top = '50%';
    textDiv.style.transform = 'translate(-50%, -50%)';
    textDiv.style.textAlign = 'center';
    textDiv.style.zIndex = '10';
    textDiv.style.opacity = '0';
    textDiv.style.transition = 'opacity 0.2s ease-in-out';
    textDiv.style.pointerEvents = 'none';
    textDiv.style.color = color;
    textDiv.style.whiteSpace = 'nowrap';
    el.appendChild(textDiv);

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    el.appendChild(canvas);

    let isHovered = false;
    let showText = false;
    let hasBeenShown = false;
    let particles = [];
    let animationFrameId = null;
    let lastTime = performance.now();

    // Event listeners on the main element
    el.addEventListener('mouseenter', () => {
      isHovered = true;
      hasBeenShown = true;
    });

    el.addEventListener('mouseleave', () => {
      if (!hasBeenShown) return;
      isHovered = false;
    });

    const fontStr = `${fontWeight} ${fontSize}px ${fontFamily}`;

    function createParticles(ctx, width, height) {
      particles = [];
      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = color;
      ctx.font = fontStr;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.imageSmoothingEnabled = true;

      // Draw text to sample
      ctx.fillText(text, width / 2, height / 2);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const currentDPR = width / el.clientWidth;
      const baseSampleRate = Math.max(2, Math.round(currentDPR));
      const sampleRate = baseSampleRate * transformedDensity;

      let minX = width, maxX = 0, minY = height, maxY = 0;
      
      // Bounds pass
      for (let y = 0; y < height; y += sampleRate) {
        for (let x = 0; x < width; x += sampleRate) {
          const index = (y * width + x) * 4;
          if (data[index + 3] > 0) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const textWidth = maxX - minX;
      const textHeight = maxY - minY;
      const spreadRadius = Math.max(textWidth, textHeight) * 0.1;

      // Particles pass
      for (let y = 0; y < height; y += sampleRate) {
        for (let x = 0; x < width; x += sampleRate) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 0) {
            const originalAlpha = alpha / 255;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * spreadRadius;
            
            particles.push({
              x: x + Math.cos(angle) * distance,
              y: y + Math.sin(angle) * distance,
              originalX: x,
              originalY: y,
              color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
              opacity: originalAlpha * 0.3,
              originalAlpha,
              floatingSpeed: Math.random() * 2 + 1,
              floatingAngle: Math.random() * Math.PI * 2,
              targetOpacity: Math.random() * originalAlpha * 0.5,
              sparkleSpeed: Math.random() * 2 + 1
            });
          }
        }
      }
      ctx.clearRect(0, 0, width, height);
    }

    function setupCanvas() {
      // Create a temporary canvas Context to measure
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      const dimensions = measureText(tempCtx, text, fontStr);

      const isMobile = window.innerWidth < 768;
      const basePadding = isMobile ? Math.max(fontSize * 0.3, 20) : Math.max(fontSize * 0.5, 40);
      
      const minWidth = Math.max(dimensions.width + basePadding * 2, isMobile ? 120 : 200);
      const minHeight = Math.max(dimensions.height + basePadding * 2, isMobile ? 60 : 100);

      const parentRect = el.parentElement?.getBoundingClientRect();
      const maxWidth = parentRect ? parentRect.width * 0.9 : window.innerWidth * 0.9;
      const maxHeight = parentRect ? parentRect.height * 0.9 : window.innerHeight * 0.9;

      const finalWidth = Math.min(minWidth, maxWidth);
      const finalHeight = Math.min(minHeight, maxHeight);

      el.style.width = '100%';
      el.style.height = `${finalHeight}px`;

      const cWidth = el.clientWidth || finalWidth;
      const cHeight = finalHeight;

      canvas.width = cWidth * globalDpr;
      canvas.height = cHeight * globalDpr;

      const ctx = canvas.getContext('2d');
      createParticles(ctx, canvas.width, canvas.height);
    }

    function animate(currentTime) {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const FLOAT_RADIUS = spread;
      const RETURN_SPEED = 3;
      const FLOAT_SPEED = speed;
      const TRANSITION_SPEED = 5 * FLOAT_SPEED;
      const NOISE_SCALE = 0.6;
      const CHAOS_FACTOR = 1.3;
      const FADE_SPEED = 13;

      particles.forEach(p => {
        if (isHovered) {
          const dx = p.originalX - p.x;
          const dy = p.originalY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0.1) {
            p.x += (dx / dist) * RETURN_SPEED * deltaTime * 60;
            p.y += (dy / dist) * RETURN_SPEED * deltaTime * 60;
          } else {
            p.x = p.originalX;
            p.y = p.originalY;
          }
          p.opacity = Math.max(0, p.opacity - FADE_SPEED * deltaTime);
        } else {
          p.floatingAngle += deltaTime * p.floatingSpeed * (1 + Math.random() * CHAOS_FACTOR);
          
          const time = Date.now() * 0.001;
          const uniqueOffset = p.floatingSpeed * 2000;
          const noiseX = (
            Math.sin(time * p.floatingSpeed + p.floatingAngle) * 1.2 +
            Math.sin((time + uniqueOffset) * 0.5) * 0.8 +
            (Math.random() - 0.5) * CHAOS_FACTOR
          ) * NOISE_SCALE;
          
          const noiseY = (
            Math.cos(time * p.floatingSpeed + p.floatingAngle * 1.5) * 0.6 +
            Math.cos((time + uniqueOffset) * 0.5) * 0.4 +
            (Math.random() - 0.5) * CHAOS_FACTOR
          ) * NOISE_SCALE;

          const targetX = p.originalX + FLOAT_RADIUS * noiseX;
          const targetY = p.originalY + FLOAT_RADIUS * noiseY;
          
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const jitterScale = Math.min(1, dist / (FLOAT_RADIUS * 1.5));
          p.x += dx * TRANSITION_SPEED * deltaTime + (Math.random() - 0.5) * FLOAT_SPEED * jitterScale;
          p.y += dy * TRANSITION_SPEED * deltaTime + (Math.random() - 0.5) * FLOAT_SPEED * jitterScale;

          const distOrigin = Math.sqrt(Math.pow(p.x - p.originalX, 2) + Math.pow(p.y - p.originalY, 2));
          if (distOrigin > FLOAT_RADIUS) {
            const angle = Math.atan2(p.y - p.originalY, p.x - p.originalX);
            const pull = (distOrigin - FLOAT_RADIUS) * 0.1;
            p.x -= Math.cos(angle) * pull;
            p.y -= Math.sin(angle) * pull;
          }

          const opDiff = p.targetOpacity - p.opacity;
          p.opacity += opDiff * p.sparkleSpeed * deltaTime * 3;
          if (Math.abs(opDiff) < 0.01) {
            p.targetOpacity = Math.random() < 0.5 
              ? Math.random() * 0.1 * p.originalAlpha 
              : p.originalAlpha * 3;
            p.sparkleSpeed = Math.random() * 3 + 1;
          }
        }
      });

      if (isHovered && !showText) {
        showText = true;
        textDiv.style.opacity = '1';
      }
      if (!isHovered && showText) {
        showText = false;
        textDiv.style.opacity = '0';
      }

      // Render
      ctx.save();
      ctx.scale(globalDpr, globalDpr);
      
      const byColor = new Map();
      particles.forEach(p => {
        if (p.opacity <= 0) return;
        const col = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        if (!byColor.has(col)) byColor.set(col, []);
        byColor.get(col).push({ x: p.x / globalDpr, y: p.y / globalDpr });
      });

      byColor.forEach((positions, col) => {
        ctx.fillStyle = col;
        positions.forEach(({x, y}) => ctx.fillRect(x, y, 1, 1));
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    }

    setupCanvas();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrameId);
      setupCanvas();
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    });
    
    animationFrameId = requestAnimationFrame(animate);
  });
}
