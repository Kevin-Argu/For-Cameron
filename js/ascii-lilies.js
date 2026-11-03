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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  let t0 = performance.now();
  let lastPaint = 0;
  let active = true;
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

  function paint(t) {
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
  }

  function restart() {
    t0 = performance.now() - (reducedMotion.matches ? 20000 : 0);
    paint(reducedMotion.matches ? 20 : 0);
  }

  function animate(now) {
    requestAnimationFrame(animate);
    if (!active || now - lastPaint < 1000 / 22) return;
    lastPaint = now;
    paint(reducedMotion.matches ? 20 : Math.min(22, (now - t0) / 1000));
  }

  replay.addEventListener('click', restart);
  colorButton.addEventListener('click', function () {
    palette = (palette + 1) % palettes.length;
    colorButton.textContent = 'Colors: ' + palettes[palette].name;
    restart();
  });
  enter.addEventListener('click', function () {
    const target = document.getElementById('gardenStart');
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }
  });
  window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      active = !!entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(canvas);
  }
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', restart);
  resize();
  restart();
  requestAnimationFrame(animate);
})();
