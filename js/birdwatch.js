// The same little alphabet and palette as the lilies. No photograph is painted.
(() => {
  'use strict';
  const canvas = document.getElementById('splitRockerCanvas');
  const status = document.getElementById('artStatus');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (status) { status.hidden = false; status.textContent = 'This browser cannot draw the flowers.'; }
    return;
  }

  const palette = { petals: ['#e8a6e5', '#ffc17f', '#ed88a9', '#f9e49f'], pollen: '#fff1b9' };
  const leaves = ['#669765', '#7eaf70', '#a5c17b', '#92b67b'];
  const world = { left: 14, top: -12, width: 146, height: 156 };

  // Hand-drawn contours follow the two halves of Split-Rocker. Paths only
  // decide where letters go; the visible sculpture is exclusively fillText.
  const outline = new Path2D(
    'M 46 124 C 46 109 49 90 50 72 L 51 49 ' +
    'L 30 49 Q 25 48 26 41 Q 25 36 30 35 L 51 35 ' +
    'Q 53 23 57 15 Q 59 10 66 9 L 80 8 ' +
    'Q 85 7 89 3 Q 91 0 95 3 Q 104 6 109 14 ' +
    'Q 121 16 127 25 Q 132 33 132 43 L 142 46 ' +
    'Q 148 47 145 54 L 141 61 Q 142 79 132 90 ' +
    'Q 127 96 116 98 L 121 124 Z'
  );
  const face = new Path2D(
    'M 66 10 Q 79 16 83 31 Q 83 48 92 60 ' +
    'Q 96 71 91 80 Q 84 89 71 91 L 51 88 L 52 43 Z'
  );
  const blaze = new Path2D(
    'M 75 12 Q 81 25 82 36 Q 83 48 91 58 ' +
    'Q 96 70 88 78 L 82 78 Q 87 69 83 61 ' +
    'Q 76 49 76 35 Q 74 23 70 15 Z'
  );
  const seam = new Path2D('M 92 13 Q 104 27 106 42 Q 110 52 111 65');
  const mouth = new Path2D('M 83 81 Q 107 91 133 72');
  const rightEye = new Path2D();
  rightEye.ellipse(120, 31, 5.5, 11, -.30, 0, Math.PI * 2);
  const leftEye = new Path2D();
  leftEye.ellipse(62, 56, 3.4, 5.2, .27, 0, Math.PI * 2);

  // Blossom clusters use the lilies' ., o, * and @ characters.
  const flowers = [
    [61,16,2.6], [73,13,2.4], [87,9,2.5], [97,9,2.8],
    [103,18,2.6], [91,24,2.5], [67,26,3], [58,35,2.2],
    [37,39,2.7], [46,40,2.3], [75,39,2.8], [96,37,2.7],
    [111,22,2.1], [129,41,2.7], [136,49,2.8], [125,52,3],
    [115,61,2.7], [136,64,2.5], [126,72,3], [106,77,2.3],
    [99,55,2.6], [81,54,2.4], [72,62,2.8], [58,69,2.4],
    [80,75,3], [64,82,2.4], [92,85,2.2], [119,85,2.3],
    [54,97,2.5], [65,104,2.4], [79,98,2.2], [105,103,2.4],
    [115,117,2.5], [89,115,2.4], [74,120,2.6], [54,118,2.4]
  ];

  let cells = [];
  let width = 0, height = 0, scale = 1, stepX = 1, stepY = 1;
  function hash(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function strokeContains(path, x, y, weight) {
    ctx.lineWidth = weight;
    return ctx.isPointInStroke(path, x, y);
  }

  function makeCells() {
    cells = [];
    // Sample in world coordinates, independently of the retina drawing scale.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const columns = width < 520 ? 52 : 72;
    stepX = world.width / columns;
    stepY = stepX * 1.6;
    const rows = Math.ceil(world.height / stepY);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = world.left + (col + .5) * stepX;
        const y = world.top + (row + .5) * stepY;
        const n = hash(col, row);
        const inside = ctx.isPointInPath(outline, x, y);
        let char, color;
        if (!inside) {
          if (y > 125 && y < 135 && x > 28 && x < 144) {
            if (row % 3 === 0 && n > .52) {
              char = n > .87 ? '*' : n > .65 ? '/' : '.';
              color = n > .87 ? palette.petals[0] : '#52784f';
            }
          } else if (n > .994 && y > 0 && y < 124) {
            char = n > .998 ? '*' : '.';
            color = n > .998 ? '#f9e7ba' : '#729581';
          }
          if (!char) continue;
        } else {
          const eye = ctx.isPointInPath(rightEye, x, y) || ctx.isPointInPath(leftEye, x, y);
          if (eye || strokeContains(seam, x, y, 2.2) || strokeContains(mouth, x, y, 1.8)) continue;
          const edge = strokeContains(outline, x, y, 2.8);
          const eyeRim = strokeContains(rightEye, x, y, 2.8) || strokeContains(leftEye, x, y, 2.2);
          const onBlaze = ctx.isPointInPath(blaze, x, y);
          const onFace = ctx.isPointInPath(face, x, y);
          const neckShadow = y > 91 && x > 76 && x < 110;
          char = '.+*+/'[Math.floor(n * 5)];
          color = leaves[Math.floor(n * leaves.length)];
          if (n < .16 && !edge && !onBlaze && !eyeRim) continue;
          if (neckShadow) color = ['#385947', '#4e7557', '#6c9064'][Math.floor(n * 3)];
          else if (onFace) color = ['#77976b', '#95b680', '#b7cab7'][Math.floor(n * 3)];
          if (edge) { char = n > .5 ? '*' : '.'; color = '#a5c17b'; }
          if (onBlaze) { char = n > .6 ? 'o' : n > .3 ? '*' : '.'; color = '#d7e6c6'; }

          for (let i = 0; i < flowers.length; i++) {
            const [fx, fy, radius] = flowers[i];
            const dx = x - fx, dy = y - fy;
            const angle = Math.atan2(dy, dx);
            const distance = Math.hypot(dx, dy) / (radius * 1.55 * (1 + .19 * Math.cos(angle * 5)));
            if (distance > 1.35) continue;
            const p = palette;
            char = distance < .25 ? '@' : distance < .6 ? 'o' : distance < 1 ? '*' : '.';
            color = distance < .25 ? p.pollen : p.petals[i % p.petals.length];
            break;
          }
          if (eyeRim) { char = n > .6 ? 'o' : '*'; color = '#e7d8bc'; }
        }
        cells.push({ x, y, char, color });
      }
    }
    cells.push({ x: 119, y: 26, char: '*', color: '#fff9ea' });
    cells.push({ x: 61.5, y: 54, char: '.', color: '#fff9ea' });
    ctx.restore();
  }

  function paint() {
    // Let the shared page color show between glyphs instead of painting a black box.
    ctx.clearRect(0, 0, width, height);
    ctx.font = '600 ' + (stepY * scale * .89) + 'px Menlo, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const cell of cells) {
      ctx.fillStyle = cell.color;
      ctx.shadowColor = cell.color;
      ctx.shadowBlur = Math.min(4, stepX * scale * .44);
      ctx.fillText(cell.char,
        (cell.x - world.left) * scale, (cell.y - world.top) * scale);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    width = box.width;
    height = box.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    scale = width / world.width;
    makeCells();
    paint();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  resize();
})();
