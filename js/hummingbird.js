// A tiny green hummingbird, drawn with the same text glyphs as the flowers.
(() => {
  'use strict';
  const canvas = document.getElementById('hummingbirdCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // These coordinates share the sculpture's 146 × 156 drawing space.
  const stops = [[143, 25], [138, 7], [105, -3], [43, 9], [29, 59], [34, 95], [137, 108], [145, 69]];
  let width = 0, height = 0, scale = 1;
  let frameId = 0, previous = 0, time = 0, visible = true;

  function glyph(char, x, y, color, size = 1.8) {
    ctx.font = '600 ' + size + 'px Menlo, Consolas, monospace';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.fillText(char, x, y);
  }
  function feather(x0, y0, x1, y1, color) {
    const length = Math.hypot(x1 - x0, y1 - y0);
    const character = Math.abs(y1 - y0) > Math.abs(x1 - x0) ? '/' : '-';
    for (let d = 0; d <= length; d += .95) {
      const u = d / length;
      glyph(character, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, color);
    }
  }
  function wing(phase, far) {
    const angle = -1.65 + Math.sin(phase) * .95;
    const reach = far ? 6.8 : 8.2;
    const tipX = -2 + Math.cos(angle) * reach;
    const tipY = -.5 + Math.sin(angle) * reach;
    const color = far ? '#6fa88b' : '#b4efd0';
    feather(-2, 0, tipX, tipY, color);
    feather(-3, .5, tipX - 1.1, tipY + 1.4, color);
    glyph('*', tipX, tipY, color, 1.5);
  }
  function drawBird(t) {
    const phase = motion.matches ? -.3 : t * Math.PI * 2 * 8;
    wing(phase + .7, true);
    // A forked tail trails behind the small, tapered body.
    feather(-3, .5, -8, 3.2, '#72c59c');
    feather(-3, .5, -8.2, 1.2, '#a2e3b2');
    for (let y = -1.8; y <= 2; y += .85) {
      for (let x = -4.5; x <= 2; x += .9) {
        if ((x + 1.4) ** 2 / 10 + (y + .18 * x) ** 2 / 2.5 > 1) continue;
        glyph(y > .6 ? '+' : '*', x, y, y > .6 ? '#b4d69c' : x > -1 ? '#62dfa1' : '#399d78');
      }
    }
    wing(phase, false);
    // Round head, bright throat, one eye and a long fine bill.
    glyph('o', 1.9, -1.8, '#8cf0ac', 3.4);
    glyph('*', 2.2, -.05, '#c0e4ab', 2);
    glyph('.', 2.5, -2.25, '#040609', 2.2);
    for (let x = 3.7; x <= 9.2; x += 1.1) glyph('-', x, -1.9 - (x - 3.7) * .07, '#d2e0ab', 1.7);
  }
  function paint() {
    ctx.clearRect(0, 0, width, height);
    // Hover at each flower patch, then ease into the next short flight.
    const leg = time / 4.2;
    const index = Math.floor(leg) % stops.length;
    const local = leg - Math.floor(leg);
    const u = Math.max(0, Math.min(1, (local - .28) / .72));
    const ease = u * u * (3 - 2 * u);
    const from = stops[index], to = stops[(index + 1) % stops.length];
    const x = from[0] + (to[0] - from[0]) * ease;
    const y = from[1] + (to[1] - from[1]) * ease + (motion.matches ? 0 : Math.sin(time * 3.7) * .65);
    ctx.save();
    ctx.translate((x - 14) * scale, (y + 12) * scale);
    ctx.scale((x < 86 ? 1 : -1) * scale, scale);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = Math.min(3, scale * .45);
    drawBird(time);
    ctx.restore();
  }
  function canAnimate() { return visible && !document.hidden && !motion.matches; }
  function schedule() {
    if (!frameId && canAnimate()) frameId = requestAnimationFrame(frame);
  }
  function frame(now) {
    frameId = 0;
    if (!canAnimate()) return;
    if (previous && now - previous < 1000 / 30) { schedule(); return; }
    if (previous) time += Math.min(now - previous, 100) / 1000;
    previous = now;
    paint();
    schedule();
  }
  function updateActivity() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previous = 0;
    if (motion.matches) { time = 0; paint(); }
    schedule();
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    width = box.width; height = box.height; scale = width / 146;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    paint();
    schedule();
  }
  document.addEventListener('visibilitychange', updateActivity);
  motion.addEventListener('change', updateActivity);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updateActivity();
    }, { threshold: .01 }).observe(canvas);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  resize();
})();
