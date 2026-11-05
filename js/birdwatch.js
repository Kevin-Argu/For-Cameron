(() => {
  'use strict';
  const canvas = document.getElementById('splitRockerCanvas');
  const status = document.getElementById('artStatus');
  if (!canvas) return;

  // A local, lightweight version of the supplied photograph supplies exact contours
  // and flower colors. The visible texture is redrawn from tiny characters.
  const reference = new Image();

  function imageToCharacters() {
    if (!reference.complete || !reference.naturalWidth) return;
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = width * 460 / 546;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Underpainting makes the split face, projecting ears, eyes and snout legible.
    ctx.fillStyle = '#a9d4f0';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 0.72;
    ctx.filter = 'saturate(1.4) contrast(1.16)';
    ctx.drawImage(reference, 0, 0, width, height);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';

    const columns = Math.round(Math.max(95, Math.min(165, width / 6.5)));
    const rows = Math.round(columns * (460 / 546) * 0.98);
    const stepX = width / columns;
    const stepY = height / rows;
    const sampler = document.createElement('canvas');
    sampler.width = columns;
    sampler.height = rows;
    const sampleCtx = sampler.getContext('2d', { willReadFrequently: true });
    sampleCtx.drawImage(reference, 0, 0, columns, rows);
    const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
    const hash = (x, y) => ((x * 83 + y * 197 + x * y * 13) >>> 0);
    const font = Math.max(3, stepY * 1.15);
    ctx.font = `700 ${font}px "DejaVu Sans Mono", "Courier New", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const petals = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const i = (y * columns + x) * 4;
        let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
        const luminance = (r * .2126 + g * .7152 + b * .0722);
        const highest = Math.max(r, g, b), lowest = Math.min(r, g, b);
        const vivid = highest - lowest;
        const n = hash(x, y);
        const blueSky = y < rows * .88 && b > r * 1.08 && b > g * 1.035 && b > 145;
        const paleCloud = y < rows * .75 && luminance > 192 && vivid < 32;
        if (blueSky || paleCloud) {
          if (n % 21 === 0) {
            ctx.fillStyle = blueSky ? 'rgba(248,253,255,.43)' : 'rgba(255,255,255,.38)';
            ctx.fillText(n % 3 === 0 ? '.' : '·', (x + .5) * stepX, (y + .52) * stepY);
          }
          continue;
        }

        const isPink = r > g * 1.17 && b > g * 1.07;
        const isGold = r > b * 1.27 && g > b * 1.10 && r > 105;
        const isWhite = luminance > 165 && vivid < 52 && y < rows * .9;
        const isGreen = g > r * 1.06 && g > b * .91;
        const dark = luminance < 65;
        let glyph;
        if (dark) glyph = ['@', '#', '&', '%'][n % 4];
        else if (isPink) glyph = ['✿', '✽', '*', '✳', '+'][n % 5];
        else if (isGold) glyph = ['✿', '✻', '*', '✶', '+'][n % 5];
        else if (isWhite) glyph = ['✿', '*', '✳', 'o', '+'][n % 5];
        else if (isGreen) glyph = ['&', 'v', '%', '#', 'x', '*', ':'][n % 7];
        else if (y > rows * .91 && vivid < 42) glyph = ['=', '-', '_', ':'][n % 4];
        else glyph = ['#', '&', '+', 'o', 'x', '.'][n % 6];

        const boost = isPink || isGold || isWhite ? 1.19 : .96;
        r = Math.min(255, Math.round(r * boost));
        g = Math.min(255, Math.round(g * boost));
        b = Math.min(255, Math.round(b * boost));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(glyph, (x + .5) * stepX, (y + .55) * stepY);
        if ((isPink || isGold || isWhite) && n % 9 === 0 && y < rows * .89 && y > rows * .015) {
          petals.push({ x: (x + .5) * stepX, y: (y + .55) * stepY, r, g, b });
        }
      }
    }
    // Larger flower glyphs distinguish the blossom clusters from the foliage.
    ctx.font = `600 ${Math.max(8, stepY * 1.70)}px Georgia, serif`;
    for (const petal of petals) {
      ctx.fillStyle = `rgb(${petal.r},${petal.g},${petal.b})`;
      ctx.fillText('✿', petal.x, petal.y);
    }
  }

  reference.onload = () => {
    imageToCharacters();
    if ('ResizeObserver' in window) {
      new ResizeObserver(imageToCharacters).observe(canvas);
    } else window.addEventListener('resize', imageToCharacters);
  };
  reference.onerror = () => {
    status.hidden = false;
    status.textContent = 'The flowers could not be loaded. Please refresh the page.';
  };

  fetch('assets/split-rocker.webp.base64')
    .then(response => {
      if (!response.ok) throw new Error('reference missing');
      return response.text();
    })
    .then(encoded => { reference.src = 'data:image/webp;base64,' + encoded.trim(); })
    .catch(() => { reference.onerror(); });
})();
