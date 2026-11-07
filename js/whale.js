// A shaded whale built entirely from small ASCII glyphs. Cached text layers
// keep the detailed skin inexpensive while the tail and flipper swim freely.
(() => {
  'use strict';
  const canvas = document.createElement('canvas');
  canvas.id = 'roamingWhale';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'An animated, shaded ASCII whale with a forked tail and a long swimming flipper');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const home = document.getElementById('whaleHome');
  const intro = document.querySelector('.ascii-intro');
  const site = window.CameronSite;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  let reduced = site.reducedMotion.matches;
  let frameId = 0, layoutDirty = true, lastDraw = 0, lastRect = null;
  let atHome = false, atIntro = true, heartTimer;
  canvas.setAttribute('aria-hidden', String(!site.entered));

  const columns = 144, rows = 55, cellWidth = 5.8, rowHeight = 8.5;
  const spriteWidth = columns * cellWidth, spriteHeight = rows * rowHeight;
  const textureScale = 2;
  const font = "9.6px Menlo, Monaco, Consolas, 'Courier New', monospace";
  const outlines = {
    body: [[25,25],[34,23],[44,20],[57,17.2],[76,16.5],[98,16.4],
      [119,17],[131,19],[137,22.5],[139,27],[138,30.5],[134,33],
      [123,35.2],[106,36.8],[82,37.4],[62,36],[46,32.8],[34,28.5],[25,27]],
    tail: [[28,24.5],[22,23],[16,19],[10,12],[4,8],[5,15],[9,22],
      [16,25.5],[10,28],[5,33],[3,37],[12,34],[20,30],[28,27]],
    dorsal: [[48,19.5],[52,16.8],[54,12.2],[57,13.8],[59,16.5],[64,17.5]],
    flipper: [[82,32.2],[88,31.8],[91,34],[87,40],[81,47],[75,51],
      [72,51.5],[74,46],[77,39],[78,35]]
  };

  // Sample closed smooth contours; the curves themselves are never painted.
  function smooth(points) {
    const result = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[(i + points.length - 1) % points.length];
      const b = points[i], c = points[(i + 1) % points.length];
      const d = points[(i + 2) % points.length];
      for (let s = 0; s < 8; s++) {
        const t = s / 8, t2 = t * t, t3 = t2 * t;
        result.push([0, 1].map(k => .5 * (2 * b[k] + (-a[k] + c[k]) * t +
          (2*a[k] - 5*b[k] + 4*c[k] - d[k]) * t2 +
          (-a[k] + 3*b[k] - 3*c[k] + d[k]) * t3)));
      }
    }
    return result;
  }
  function inside(points, px, py) {
    let hit = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [ax, ay] = points[i], [bx, by] = points[j];
      if ((ay > py) !== (by > py) && px < (bx-ax)*(py-ay)/(by-ay)+ax) hit = !hit;
    }
    return hit;
  }
  function columnBounds(points, x) {
    const intersections = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [ax, ay] = points[i], [bx, by] = points[j];
      if ((ax > x) !== (bx > x)) intersections.push(ay + (by-ay)*(x-ax)/(bx-ax));
    }
    return [Math.min(...intersections), Math.max(...intersections)];
  }
  const layers = {};
  for (const [name, outline] of Object.entries(outlines)) {
    const contour = smooth(outline), cells = [];
    const bounds = Array.from({ length: columns }, (_, x) => columnBounds(contour, x + .5));
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (!inside(contour, col + .5, row + .5)) continue;
        const [top, bottom] = bounds[col];
        const v = (row + .5 - top) / Math.max(1, bottom - top);
        const roundness = Math.sqrt(Math.max(0, 1 - (2*v-1)**2));
        const noise = ((col*17 + row*31 + col*row*7) % 29) / 28;
        const edge = v < .06 || v > .95;
        const belly = name === 'flipper' || (name === 'body' && v > .66 && col > 45);
        let light = .2 + roundness * .48 + noise * .12;
        if (name === 'tail' || name === 'dorsal') light *= .76;
        if (belly) light = .48 + roundness * .3 + noise * .12;
        if (edge) light *= .66;
        // Throat pleats curve towards the chin, under the blue-grey flank.
        const pleat = belly && name === 'body' && col > 87 &&
          Math.floor(col + (v-.66)*17) % 9 === 0;
        if (pleat) light *= .63;
        const bank = edge ? '.:;i!' : belly ? '=+*o0sS#' : ';!|/itfLCxvY';
        const char = pleat ? '/' : bank[Math.floor(noise * (bank.length - 1))];
        // A small eye sits within the skin rather than on a cartoon face.
        if (name === 'body' && ((col-129)/1.8)**2 + ((row-26)/1.1)**2 < 1) continue;
        const mouth = name === 'body' && col > 111 && col < 138 &&
          Math.abs(row - (32 - (col-111)*.065)) < .35;
        cells.push({ col, row, char: mouth ? '_' : char, belly,
          tone: Math.round(clamp(mouth ? .2 : light, 0, 1) * 15) });
      }
    }
    const left = Math.min(...cells.map(c => c.col)) * cellWidth;
    const top = Math.min(...cells.map(c => c.row)) * rowHeight;
    const width = (Math.max(...cells.map(c => c.col)) + 1) * cellWidth - left + 2;
    const height = (Math.max(...cells.map(c => c.row)) + 1) * rowHeight - top + 3;
    layers[name] = { cells, left, top, width, height };
  }
  const textures = {};
  function getTextures(dark) {
    const key = dark ? 'dark' : 'light';
    if (textures[key]) return textures[key];
    const palette = [false, true].map(belly => Array.from({ length: 16 }, (_, n) => {
      const low = dark ? (belly ? [92,110,125] : [42,73,92]) : [24,55,67];
      const high = dark ? (belly ? [226,215,219] : [160,203,215]) :
        (belly ? [104,123,137] : [66,114,132]);
      return `rgb(${mix(low, high, n/15).join(',')})`;
    }));
    const result = {};
    for (const [name, layer] of Object.entries(layers)) {
      const image = document.createElement('canvas');
      image.width = Math.ceil(layer.width * textureScale);
      image.height = Math.ceil(layer.height * textureScale);
      const ink = image.getContext('2d');
      ink.scale(textureScale, textureScale);
      ink.font = font;
      ink.textBaseline = 'top';
      for (const cell of layer.cells) {
        ink.fillStyle = palette[Number(cell.belly)][cell.tone];
        ink.fillText(cell.char, cell.col*cellWidth-layer.left, cell.row*rowHeight-layer.top);
      }
      result[name] = { ...layer, image };
    }
    textures[key] = result;
    return result;
  }

  let w = innerWidth, h = innerHeight, dpr = 1;
  let x = w*.32, y = reduced ? h*.65 : -190;
  let scale = .65, direction = 1, last = 0, elapsed = 0;
  let scrollNudge = 0, previousScroll = scrollY, hearts = 0;

  function resize() {
    w = innerWidth; h = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    x = clamp(x,0,w);
    lastRect = null;
    layoutDirty = true;
    requestFrame();
  }
  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', () => {
    const current = scrollY;
    scrollNudge = clamp(scrollNudge + (current-previousScroll)*.28, -50, 75);
    previousScroll = current;
    layoutDirty = true;
    requestFrame();
  }, { passive: true });
  resize();

  addEventListener('click', event => {
    if (!site.entered || event.target.closest('button, a, input, textarea, select, summary, .flower-note-card')) return;
    if (Math.abs(event.clientX-x) < spriteWidth*scale/2 &&
        Math.abs(event.clientY-y) < spriteHeight*scale/2) {
      hearts = 1;
      if (!reduced) direction *= -1;
      else {
        clearTimeout(heartTimer);
        heartTimer = setTimeout(() => { hearts = 0; requestFrame(); }, 900);
      }
      requestFrame();
    }
  }, { passive: true });

  function draw(dark) {
    const skin = getTextures(dark);
    const phase = elapsed * .027;
    const wave = col => reduced ? 0 : Math.sin(phase - col*.018) *
      11 * Math.max(0, (101-col)/76)**2;
    const ox = -spriteWidth/2, oy = -spriteHeight/2;
    const paint = layer => ctx.drawImage(layer.image, layer.left, layer.top, layer.width, layer.height);
    function joint(layer, col, row, angle, stretch = 1) {
      ctx.save();
      ctx.translate(col*cellWidth, row*rowHeight + wave(col));
      ctx.rotate(angle);
      ctx.scale(1, stretch);
      ctx.translate(-col*cellWidth, -row*rowHeight);
      paint(layer);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(ox, oy);
    // Tail stock and flukes share a moving joint with the body's travelling wave.
    joint(skin.tail, 27, 26, reduced ? 0 : Math.sin(phase-.48)*.15,
      reduced ? 1 : .94 + .09*Math.cos(phase));
    joint(skin.dorsal, 57, 18, reduced ? 0 : Math.sin(phase-1)*.025);
    // Narrow cached strips bend the rear smoothly without redrawing the glyphs.
    const body = skin.body;
    for (let sx = 0; sx < body.image.width; sx += 24) {
      const sw = Math.min(24.5, body.image.width-sx);
      const dx = body.left + sx/textureScale;
      ctx.drawImage(body.image, sx, 0, sw, body.image.height,
        dx, body.top + wave((dx+6)/cellWidth), sw/textureScale, body.height);
    }
    joint(skin.flipper, 85, 33, reduced ? -.06 : -.08 + Math.sin(phase-.85)*.17,
      reduced ? 1 : .94 + .07*Math.cos(phase-.85));
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = dark ? '#cbdde0' : '#1e465a';
    ctx.fillText('.', 129*cellWidth, 25.6*rowHeight);
    ctx.fillStyle = dark ? '#456f80' : '#35586b';
    ctx.fillText('::', 116*cellWidth, 16.4*rowHeight);

    // An occasional quiet breath, still drawn from characters like the skin.
    const breath = (elapsed/60) % 8;
    if (!reduced && breath < 1.65) {
      const rise = breath/1.65;
      ctx.globalAlpha = Math.sin(rise*Math.PI)*.72;
      ctx.fillStyle = dark ? '#bed9e2' : '#577f91';
      for (let i = 0; i < 13; i++) {
        const fan = (i-6)/6;
        ctx.fillText(i%3 ? '.' : "'", 117*cellWidth + fan*rise*33,
          16*rowHeight - Math.sin(rise*Math.PI*.75)*(25 + (i%4)*11));
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    if (hearts > 0) {
      ctx.fillStyle = dark ? '#f4afce' : '#ad608b';
      ctx.font = '15px Menlo, Monaco, monospace';
      ctx.globalAlpha = hearts;
      for (let i = 0; i < 3; i++)
        ctx.fillText('<3', -35+i*28, oy+50-i*13-(1-hearts)*60);
      ctx.globalAlpha = 1;
    }
  }

  function frame(now) {
    frameId = 0;
    if (!site.entered || document.hidden) return;
    if (!reduced && lastDraw && now-lastDraw < 1000/30-.5) { requestFrame(); return; }
    lastDraw = now;
    const dt = Math.min((now-last || 16.67)/16.67, 2);
    last = now;
    if (!reduced) elapsed += dt;
    if (layoutDirty) {
      const r = home && home.getBoundingClientRect();
      const introRect = intro && intro.getBoundingClientRect();
      atHome = !!r && r.top < h*.75 && r.bottom > h*.25;
      atIntro = !!introRect && introRect.top < h*.75 && introRect.bottom > h*.25;
      layoutDirty = false;
    }
    if (lastRect) ctx.clearRect(lastRect.x, lastRect.y, lastRect.width, lastRect.height);
    const fitScale = Math.max(.1, (w-32)/(spriteWidth+24));
    const goalScale = Math.min(atHome ? 1.08 : .66, fitScale, h*.45/spriteHeight);
    const goalY = h*(atHome ? .65 : atIntro ? .58 : .64);
    if (reduced) {
      scale = goalScale;
      const half = (spriteWidth/2+12)*scale;
      x = clamp(atHome ? w*.5 : w*.72, half+12, w-half-12);
      y = goalY;
    } else {
      scale = Math.min(fitScale, scale+(goalScale-scale)*Math.min(1,.04*dt));
      y += (goalY+scrollNudge-y)*Math.min(1,.038*dt);
      scrollNudge *= Math.pow(.90, dt);
      const half = (spriteWidth/2+12)*scale+12;
      const travel = Math.max(0, w-half*2);
      if (travel < 90) {
        // On phones, float in place instead of flipping at both edges every second.
        x += (w/2 + Math.sin(elapsed*.012)*travel*.25-x)*Math.min(1,.08*dt);
        x = clamp(x, half, w-half);
      } else {
        x += direction*(atHome ? .5 : .85)*dt;
        if (x < half) { x = half; direction = 1; }
        if (x > w-half) { x = w-half; direction = -1; }
      }
    }
    ctx.save();
    ctx.translate(x, y+(reduced ? 0 : Math.sin(elapsed*.019)*5));
    if (direction < 0) ctx.scale(-1,1);
    ctx.scale(scale,scale);
    ctx.rotate(reduced ? 0 : Math.sin(elapsed*.014)*.012);
    draw(atHome || atIntro);
    ctx.restore();
    // Include fin rotation, the breath and hearts in the cleared rectangle.
    lastRect = { x: x-spriteWidth*scale/2-32,
      y: y-spriteHeight*scale/2-80*scale-32,
      width: spriteWidth*scale+64, height: (spriteHeight+160)*scale+64 };
    if (!reduced) hearts = Math.max(0, hearts-.012*dt);
    if (!reduced) requestFrame();
  }
  function requestFrame() {
    if (!frameId && site.entered && !document.hidden) frameId = requestAnimationFrame(frame);
  }
  function updateActivity() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    last = 0;
    lastDraw = 0;
    layoutDirty = true;
    canvas.setAttribute('aria-hidden', String(!site.entered));
    requestFrame();
  }
  document.addEventListener('cameron:entered', updateActivity);
  document.addEventListener('visibilitychange', updateActivity);
  site.reducedMotion.addEventListener('change', () => {
    reduced = site.reducedMotion.matches;
    updateActivity();
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => { layoutDirty = true; requestFrame(); });
    if (home) observer.observe(home);
    if (intro) observer.observe(intro);
  }
  requestFrame();
})();
