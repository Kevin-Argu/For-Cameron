// Original ASCII lilies intro for the Cameron website.
// Every stem, leaf and petal is drawn from text glyphs, not flower images.
(() => {
  'use strict';

  const canvas = document.getElementById('asciiLiliesCanvas');
  const enter = document.getElementById('enterGarden');
  const replay = document.getElementById('replayLilies');
  const colorButton = document.getElementById('colorLilies');
  if (!canvas || !enter || !replay || !colorButton) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const site = window.CameronSite;
  const reducedMotion = site.reducedMotion;
  const palettes = [
    { name: 'Pink', petals: ['#f9bfd2', '#ec8fb4', '#ffdfeb'], pollen: '#fbe7a4' },
    { name: 'White', petals: ['#fffdf3', '#d7e6df', '#f6f4e5'], pollen: '#f9dda0' },
    { name: 'Garden', petals: ['#e8a6e5', '#ffc17f', '#ed88a9', '#f9e49f'], pollen: '#fff1b9' }
  ];

  const blooms = [
    { x: 25, y: 36, k: 0, size: 8.1 },
    { x: 35, y: 23, k: 1, size: 8.4 },
    { x: 49, y: 32, k: 2, size: 9.4 },
    { x: 64, y: 20, k: 3, size: 8.3 },
    { x: 76, y: 37, k: 4, size: 8.0 },
    { x: 39, y: 48, k: 5, size: 8.3 },
    { x: 67, y: 46, k: 6, size: 8.1 }
  ];

  let cols = 80, rows = 45, stepX = 9, stepY = 13;
  let pixels = [];
  let palette = 0;
  let growth = 0;
  let growthTarget = 0;
  let dragLastY = null;
  let dragLastX = null;
  let dragDistance = 0;
  let dragPointer = null;
  const water = document.getElementById('waterLilies');
  const growthSlider = document.getElementById('lilyGrowth');
  let lastPaint = 0;
  let active = false;
  let frameId = 0;
  let pixelRatio = 1;

  function clamp(n, low, high) { return Math.max(low, Math.min(high, n)); }
  function ease(n) {
    n = clamp(n, 0, 1);
    return n * n * (3 - 2 * n);
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(box.width * pixelRatio);
    canvas.height = Math.round(box.height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    cols = clamp(Math.floor(box.width / 8), 47, 155);
    rows = clamp(Math.floor(box.height / 13.2), 30, 82);
    stepX = box.width / cols;
    stepY = box.height / rows;
    ctx.font = '600 ' + Math.max(8, Math.min(14, stepY * 0.94)) + 'px Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    invalidate();
  }

  function glyph(x, y, c, color, depth) {
    const xx = Math.round(x * (cols - 1) / 100);
    const yy = Math.round(y * (rows - 1) / 100);
    if (xx < 0 || xx >= cols || yy < 0 || yy >= rows) return;
    const i = yy * cols + xx;
    if (!pixels[i] || pixels[i].depth <= depth) {
      pixels[i] = { c: c, color: color, depth: depth };
    }
  }

  function point(flower, u, t) {
    const drift = reducedMotion.matches ? 0 : Math.sin(t * 0.65 + flower.k * 0.87) * 0.8;
    const root = 49 + (flower.k % 3 - 1) * 2;
    const x = (1-u)*(1-u)*root +
      2*(1-u)*u*(root + (flower.x - root) * 0.44 + (flower.k % 2 ? 4 : -4)) +
      u*u*(flower.x + drift);
    const y = (1-u)*(1-u)*91 + 2*(1-u)*u*57 + u*u*flower.y;
    return { x: x, y: y };
  }

  function stems(t) {
    for (const flower of blooms) {
      const growth = ease((t - flower.k * 0.12) / 2.7);
      for (let u = 0; u < growth; u += 0.006) {
        const a = point(flower, u, t);
        const b = point(flower, Math.min(1, u + 0.02), t);
        const lean = b.x - a.x;
        glyph(a.x, a.y, Math.abs(lean) < 0.15 ? '|' : (lean > 0 ? '/' : '\\'), '#669765', 1);
      }

      for (let j = 0; j < 5; j++) {
        const u = 0.24 + j * 0.14;
        if (growth < u) continue;
        const b = point(flower, u, t);
        const side = (j + flower.k) % 2 ? -1 : 1;
        const leafGrowth = ease((t - 0.75 - j * 0.3) / 1.4);
        const length = (7.3 + j % 3) * leafGrowth;
        for (let q = 0.04; q <= 1; q += 0.045) {
          const x = b.x + side * length * q;
          const y = b.y - (3.2 * Math.sin(Math.PI * q) + q * 3.8) * leafGrowth;
          glyph(x, y, q > 0.75 ? '.' : q > 0.3 ? '+' : '*',
            j % 2 ? '#a5c17b' : '#7eaf70', 2);
        }
      }
    }
  }

  function babiesBreath(t) {
    const progress = ease((t - 2.6) / 5);
    for (let j = 0; j < 78 * progress; j++) {
      // Deterministic scatter of tiny ASCII blossom clusters around the bouquet.
      const x = 15 + ((j * 37 + 19) % 81) * 0.83;
      const y = 12 + ((j * 23 + 13) % 69) * 0.73;
      const offset = reducedMotion.matches ? 0 : Math.sin(t * 0.5 + j) * 0.25;
      glyph(x + offset, y, j % 8 ? '.' : '*',
        j % 5 ? '#b7cab7' : '#fff9ea', 2);
    }
  }

  function lily(flower, t) {
    const start = 4.7 + flower.k * 0.88;
    const open = ease((t - start) / 3.5);
    if (t < 2.0 + flower.k * 0.15) return;
    const center = point(flower, 1, t);
    if (open < 0.06) {
      glyph(center.x, center.y - 1.7, '^', '#b7ce89', 5);
      glyph(center.x, center.y - 0.8, 'o', '#90b56e', 5);
      return;
    }

    const p = palettes[palette];
    const radius = flower.size * (0.34 + 0.66 * open);
    for (let petal = 0; petal < 6; petal++) {
      const angle = -Math.PI / 2 + petal * Math.PI / 3;
      const color = p.petals[(petal + flower.k) % p.petals.length];
      for (let u = 0.08; u <= 1.01; u += 0.065) {
        const halfWidth = (0.8 + 2.5 * open) * Math.sin(Math.PI * u);
        for (let v = -halfWidth; v <= halfWidth; v += 0.42) {
          const x = center.x + radius * u * Math.cos(angle) - v * Math.sin(angle);
          const y = center.y + 0.86 * (radius * u * Math.sin(angle) + v * Math.cos(angle));
          const edge = Math.abs(v) / Math.max(0.2, halfWidth);
          const char = edge > 0.78 ? '.' : u < 0.35 ? 'X' : u > 0.76 ? '*' : 'o';
          glyph(x, y, char, color, 5);
        }
      }
    }
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.42;
      glyph(center.x + Math.cos(a) * 3 * open,
        center.y + Math.sin(a) * 3 * open,
        '+', '#ad6143', 6);
    }
    glyph(center.x, center.y, '@', p.pollen, 7);
  }


  // A bright blue shower, triggered by Water the lilies.
  // This is rendered with the original lily canvas, without covering buttons.
  let rainDrops = [];

  function startRain() {
    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;
    if (!width || !height) return;
    rainDrops = Array.from({ length: 105 }, () => ({
      x: width * (0.12 + Math.random() * 0.76),
      y: -height * (0.08 + Math.random() * 0.53),
      speed: 7 + Math.random() * 8,
      size: 3.3 + Math.random() * 2.9,
      alpha: 0.65 + Math.random() * 0.35,
      sway: (Math.random() - 0.5) * 0.8
    }));
  }

  function paintRain(delta) {
    if (!rainDrops.length) return;
    const height = canvas.height / pixelRatio;
    ctx.save();
    ctx.lineCap = 'round';
    for (const drop of rainDrops) {
      drop.y += drop.speed * delta;
      drop.x += drop.sway * delta;
      if (drop.y > height * 0.94) continue;
      const { x, y, size } = drop;
      const fade = y > height * 0.76
        ? Math.max(0, (height * 0.94 - y) / (height * 0.18)) : 1;
      ctx.globalAlpha = drop.alpha * fade;
      ctx.fillStyle = '#60ceff';
      ctx.shadowColor = '#48c7ff';
      ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.moveTo(x, y - size * 1.55);
      ctx.bezierCurveTo(x - size * 0.6, y - size * 0.5,
                        x - size * 0.85, y + size * 0.2, x, y + size * 0.55);
      ctx.bezierCurveTo(x + size * 0.85, y + size * 0.2,
                        x + size * 0.6, y - size * 0.5, x, y - size * 1.55);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#d7f6ff';
      ctx.fillRect(x - size * 0.24, y - size * 0.48, 1.25, 2);
    }
    ctx.restore();
    rainDrops = rainDrops.filter(drop => drop.y <= height * 0.94);
  }

  function paint(t, delta = 1) {
    pixels = new Array(cols * rows);
    stems(t);
    babiesBreath(t);
    for (const flower of blooms) lily(flower, t);

    const width = canvas.width / pixelRatio;
    const height = canvas.height / pixelRatio;
    ctx.fillStyle = '#040609';
    ctx.fillRect(0, 0, width, height);
    ctx.shadowBlur = 5;
    for (let i = 0; i < pixels.length; i++) {
      const pix = pixels[i];
      if (!pix) continue;
      ctx.fillStyle = pix.color;
      ctx.shadowColor = pix.color;
      const x = (i % cols + 0.5) * stepX;
      const y = (Math.floor(i / cols) + 0.5) * stepY;
      ctx.fillText(pix.c, x, y);
    }
    ctx.shadowBlur = 0;
    paintRain(delta);
  }

  function canPaint() {
    return active && site.entered && !document.hidden;
  }
  function schedule() {
    if (!frameId && canPaint()) frameId = requestAnimationFrame(animate);
  }
  function invalidate() {
    schedule();
  }
  function updateActivity() {
    if (!canPaint()) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      lastPaint = 0;
    } else invalidate();
  }
  function nurture(amount) {
    growthTarget = Math.min(20, growthTarget + amount);
    syncGrowthSlider();
    invalidate();
  }
  function syncGrowthSlider() {
    if (!growthSlider) return;
    growthSlider.value = growthTarget;
    growthSlider.setAttribute('aria-valuetext', Math.round(growthTarget / 20 * 100) + '% bloomed');
  }
  growthSlider?.addEventListener('input', () => {
    growthTarget = clamp(Number(growthSlider.value), 0, 20);
    growth = growthTarget;
    syncGrowthSlider();
    invalidate();
  });
  function restart() {
    growth = 0;
    growthTarget = 0;
    rainDrops = [];
    syncGrowthSlider();
    invalidate();
  }
  function animate(now) {
    frameId = 0;
    if (!canPaint()) return;
    const interval = 1000 / 22;
    if (lastPaint && now - lastPaint < interval) { schedule(); return; }
    const delta = lastPaint ? Math.min(2, (now - lastPaint) / interval) : 1;
    lastPaint = now;
    growth += (growthTarget - growth) * (reducedMotion.matches ? 1 : 1 - Math.pow(.89, delta));
    if (Math.abs(growth - growthTarget) < .004) growth = growthTarget;
    paint(growth, delta);
    if (growth !== growthTarget || rainDrops.length) schedule();
  }

  if (water) water.addEventListener('click', () => {
    if (!reducedMotion.matches) startRain();
    nurture(3.6);
  });
  canvas.addEventListener('pointerdown', event => {
    if (event.isPrimary === false || event.button > 0) return;
    dragPointer = event.pointerId;
    dragLastY = event.clientY;
    dragLastX = event.clientX;
    dragDistance = 0;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', event => {
    if (dragLastY === null || event.pointerId !== dragPointer) return;
    const upward = dragLastY - event.clientY;
    dragDistance += Math.hypot(event.clientX - dragLastX, upward);
    dragLastX = event.clientX;
    dragLastY = event.clientY;
    if (upward > 0) nurture(upward * .047);
  });
  function endDrag() { dragLastY = null; dragLastX = null; dragPointer = null; }
  canvas.addEventListener('pointerup', event => {
    if (event.pointerId !== dragPointer) return;
    dragDistance += Math.hypot(event.clientX - dragLastX, event.clientY - dragLastY);
    if (dragDistance < 8) {
      const box = canvas.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width * 100;
      const y = (event.clientY - box.top) / box.height * 100;
      const hit = blooms.some(flower => {
        if (growth < 5.1 + flower.k * .88) return false;
        const center = point(flower, 1, growth);
        return Math.hypot((x - center.x) / flower.size, (y - center.y) / (flower.size * .86)) < 1.2;
      });
      if (hit) window.CameronNotes?.openLilies();
    }
    endDrag();
  });
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('lostpointercapture', endDrag);
  replay.addEventListener('click', restart);
  colorButton.addEventListener('click', () => {
    palette = (palette + 1) % palettes.length;
    colorButton.textContent = 'Colors: ' + palettes[palette].name;
    invalidate();
  });
  enter.addEventListener('click', () => {
    const target = document.getElementById('gardenStart');
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
      updateActivity();
    }, { threshold: .01 }).observe(canvas);
  } else active = true;
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) rainDrops = [];
    invalidate();
  });
  document.addEventListener('visibilitychange', updateActivity);
  document.addEventListener('cameron:entered', updateActivity);
  resize();
  restart();
})();

