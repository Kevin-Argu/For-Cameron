// A shaded whale built entirely from small ASCII glyphs. Cached text layers
// keep the detailed skin inexpensive while the tail and flipper swim freely.
(() => {
  'use strict';
  const home = document.getElementById('whaleHome');
  const roamButton = document.getElementById('whaleRoam');
  const dropButton = document.getElementById('whaleDrop');
  const status = document.getElementById('whaleStatus');
  if (!home || !roamButton || !dropButton || !status) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'roamingWhale';
  canvas.setAttribute('role', 'button');
  canvas.setAttribute('tabindex', '-1');
  canvas.setAttribute('aria-label', 'ASCII whale. Tap or press Enter to make it flip or swim upward.');
  canvas.setAttribute('data-whale-trick', 'idle');
  home.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const intro = document.querySelector('.ascii-intro');
  const darkSections = document.querySelectorAll('.ascii-intro, .whale-section, .birdwatch-entry, .music-section');
  const site = window.CameronSite;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  let reduced = site.reducedMotion.matches;
  let frameId = 0, layoutDirty = true, lastDraw = 0, lastRect = null;
  let roaming = false, homeVisible = false, atHome = true, atIntro = false, heartTimer;
  let darkRects = [];
  // The entrance shares the swimming clock, so leaving the page also pauses the fall.
  let entrance = 'waiting', entranceMs = 0, dropHadFocus = false;
  const fallDuration = 1100, impactDuration = 820;
  canvas.setAttribute('aria-hidden', 'true');

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
  let x = w*.5, y = h*.65;
  let scale = .65, direction = 1, last = 0, elapsed = 0;
  let scrollNudge = 0, previousScroll = scrollY, hearts = 0;
  let trick = null, nextTrick = 0;
  let hasReacted = false;
  // A broad fountain lasts just over two seconds and returns about twice as often as before.
  const breathCycle = 4.2, breathDuration = 2.2, breathHeight = 220;

  function cancelTrick() {
    trick = null;
    canvas.setAttribute('data-whale-trick', 'idle');
  }

  function resize() {
    // A viewport or container change must not leave a turn following coordinates from the old size.
    cancelTrick();
    const bounds = home.getBoundingClientRect();
    w = roaming ? innerWidth : bounds.width;
    h = roaming ? innerHeight : bounds.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    x = clamp(x,0,w);
    if (!roaming) y = h*.65;
    lastRect = null;
    layoutDirty = true;
    requestFrame();
  }
  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', () => {
    const current = scrollY;
    if (roaming) scrollNudge = clamp(scrollNudge + (current-previousScroll)*.28, -50, 75);
    previousScroll = current;
    layoutDirty = true;
    requestFrame();
  }, { passive: true });
  resize();

  function setEntrance(state) {
    entrance = state;
    home.setAttribute('data-whale-state', state);
  }
  function finishLanding() {
    setEntrance('swimming');
    roamButton.hidden = false;
    status.textContent = reduced ? 'The whale is here.' : 'The whale has landed. Now it is swimming.';
    // Restore keyboard access after the trigger disappears, without stealing focus from another control.
    if (dropHadFocus && (document.activeElement === dropButton || document.activeElement === document.body))
      roamButton.focus({ preventScroll: true });
    dropHadFocus = false;
  }
  dropButton.addEventListener('click', () => {
    if (!site.entered || entrance !== 'waiting') return;
    dropHadFocus = document.activeElement === dropButton;
    dropButton.hidden = true;
    entranceMs = 0;
    elapsed = 0;
    direction = 1;
    setEntrance('falling');
    status.textContent = 'Here comes the whale!';
    // Reduced motion still requires the click, but skips falling, squashing, and shaking.
    if (reduced) finishLanding();
    updateActivity();
  });

  roamButton.addEventListener('click', () => {
    if (!site.entered || entrance !== 'swimming') return;
    const previousBounds = canvas.getBoundingClientRect();
    const viewportX = previousBounds.left+x, viewportY = previousBounds.top+y;
    roaming = !roaming;
    const container = roaming ? document.body : home;
    container.appendChild(canvas);
    container.appendChild(roamButton);
    canvas.classList.toggle('is-roaming', roaming);
    roamButton.classList.toggle('is-roaming', roaming);
    roamButton.setAttribute('aria-pressed', String(roaming));
    roamButton.textContent = roaming ? 'Bring the whale back' : 'Let the whale roam';
    scrollNudge = 0;
    hearts = 0;
    resize();
    x = roaming ? clamp(viewportX, 0, w) : w*.5;
    y = roaming ? viewportY : h*.65;
    updateActivity();
    roamButton.focus({ preventScroll: true });
    const bounds = home.getBoundingClientRect();
    if (!roaming && (bounds.top < 0 || bounds.bottom > innerHeight))
      home.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
  });

  function reactToTap() {
    if (!site.entered || entrance !== 'swimming' || trick || (!roaming && !homeVisible)) return;
    hasReacted = true;
    hearts = 1;
    if (reduced) {
      // Keep the response visible without spinning or moving for reduced-motion visitors.
      status.textContent = 'The whale sends you a little heart.';
      clearTimeout(heartTimer);
      heartTimer = setTimeout(() => { hearts = 0; requestFrame(); }, 900);
    } else {
      const kind = nextTrick++ % 2 === 0 ? 'flip' : 'swoop';
      trick = { kind, ms: 0, startX: x, startY: y, heading: direction };
      canvas.setAttribute('data-whale-trick', kind);
      status.textContent = kind === 'flip' ? 'The whale does an upward flip!' : 'The whale swims up in a big swoop!';
    }
    requestFrame();
  }
  canvas.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (!event.repeat) reactToTap();
  });
  addEventListener('click', event => {
    if (!site.entered || entrance !== 'swimming' || event.target.closest('button, a, input, textarea, select, summary, .flower-note-card')) return;
    if (!roaming && (!homeVisible || !home.contains(event.target))) return;
    const bounds = canvas.getBoundingClientRect();
    if (Math.abs(event.clientX-bounds.left-x) < spriteWidth*scale/2 &&
        Math.abs(event.clientY-bounds.top-y) < spriteHeight*scale/2) {
      reactToTap();
    }
  }, { passive: true });

  function draw(dark) {
    const skin = getTextures(dark);
    const still = reduced || entrance === 'falling';
    const phase = elapsed * .027;
    const wave = col => still ? 0 : Math.sin(phase - col*.018) *
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
    joint(skin.tail, 27, 26, still ? 0 : Math.sin(phase-.48)*.15,
      still ? 1 : .94 + .09*Math.cos(phase));
    joint(skin.dorsal, 57, 18, still ? 0 : Math.sin(phase-1)*.025);
    // Narrow cached strips bend the rear smoothly without redrawing the glyphs.
    const body = skin.body;
    for (let sx = 0; sx < body.image.width; sx += 24) {
      const sw = Math.min(24.5, body.image.width-sx);
      const dx = body.left + sx/textureScale;
      ctx.drawImage(body.image, sx, 0, sw, body.image.height,
        dx, body.top + wave((dx+6)/cellWidth), sw/textureScale, body.height);
    }
    // Tuck the flipper during the fall, then unfold it as the whale lifts off the ground.
    const tuck = entrance === 'falling' ? 1 : entrance === 'impact' ? 1-clamp(entranceMs/impactDuration, 0, 1) : 0;
    joint(skin.flipper, 85, 33, tuck*.95 + (1-tuck)*(still ? -.06 : -.08 + Math.sin(phase-.85)*.17),
      still ? 1 : .94 + .07*Math.cos(phase-.85));
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = dark ? '#cbdde0' : '#1e465a';
    ctx.fillText('.', 129*cellWidth, 25.6*rowHeight);
    ctx.fillStyle = dark ? '#456f80' : '#35586b';
    ctx.fillText('::', 116*cellWidth, 16.4*rowHeight);

    drawBreath(dark);
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

  function drawBreath(dark) {
    const breath = (elapsed/60) % breathCycle;
    // The spray uses the existing swimming clock, so offscreen pauses and reduced motion also apply here.
    if (reduced || trick || entrance !== 'swimming' || breath >= breathDuration) return;
    const progress = breath/breathDuration;
    const nozzleX = 117*cellWidth, nozzleY = 16*rowHeight;
    const fade = clamp(Math.min(breath/.18, (breathDuration-breath)/.45), 0, 1);
    ctx.save();
    ctx.font = "13px Menlo, Monaco, Consolas, 'Courier New', monospace";
    ctx.globalAlpha = fade*.9;
    ctx.fillStyle = dark ? '#d3f5ff' : '#356f8b';

    // A narrow, bright column connects the larger droplets to the blowhole.
    const jetHeight = Math.sin(progress*Math.PI)*breathHeight*.78;
    for (let row = 0; row < 15; row++) {
      const t = row/14;
      const sway = Math.sin(row*.8-breath*8)*t*5;
      for (let side = -1; side <= 1; side++) {
        ctx.fillText(row%3 ? '|' : ':', nozzleX+sway+side*(2+t*4), nozzleY-t*jetHeight);
      }
    }

    // Staggered arcs fan outward, then fall back down as the fountain fades.
    ctx.fillStyle = dark ? '#a7e4f4' : '#397c9a';
    for (let i = 0; i < 45; i++) {
      const flight = (breath-(i%6)*.055)/1.85;
      if (flight <= 0 || flight >= 1) continue;
      const fan = (i-22)/22;
      const lift = Math.sin(flight*Math.PI)*(breathHeight-(i%5)*14);
      const spread = fan*flight*(70+flight*70);
      ctx.globalAlpha = fade*(.6+.3*Math.sin(flight*Math.PI));
      ctx.fillText(['o', '.', "'", ':'][i%4], nozzleX+spread, nozzleY-lift);
    }
    ctx.restore();
  }

  // Paint the ground in the same coordinate space as the whale, so contact stays aligned at every screen size.
  function drawGround(shake) {
    ctx.save();
    ctx.font = '16px Menlo, Consolas, monospace';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#789aaa';
    ctx.globalAlpha = .7;
    for (let i = 0, gx = w*.06; gx < w*.94; gx += 21, i++)
      ctx.fillText(i%4 === 1 ? '.' : '_', gx, h*.83+shake-2);
    ctx.restore();
  }

  // A burst of punctuation makes the landing feel heavy without adding another illustration style.
  function drawImpact(progress) {
    ctx.save();
    ctx.font = "16px Menlo, Consolas, monospace";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b2cbd3';
    ctx.globalAlpha = Math.max(0, 1-progress*1.3);
    const spread = Math.min(w*.3, spriteWidth*scale*.35);
    for (let i = 0; i < 22; i++) {
      const side = i%2 ? 1 : -1;
      const distance = spread*.55 + progress*(28 + (i%6)*17);
      const lift = Math.sin(progress*Math.PI)*(18 + (i%5)*13);
      ctx.fillText([".", "'", '*', '_'][i%4], w/2+side*distance, h*.83-lift);
    }
    ctx.fillStyle = '#d6c1ba';
    ctx.font = "13px Menlo, Consolas, monospace";
    ctx.fillText('* thump *', w/2, h*.83+32);
    ctx.restore();
  }

  function frame(now) {
    frameId = 0;
    if (!site.entered || document.hidden || entrance === 'waiting') return;
    if (layoutDirty) {
      const r = home.getBoundingClientRect();
      const introRect = intro && intro.getBoundingClientRect();
      homeVisible = r.bottom > 0 && r.top < innerHeight;
      atHome = !roaming || (r.top < innerHeight*.75 && r.bottom > innerHeight*.25);
      atIntro = roaming && !!introRect && introRect.top < innerHeight*.75 && introRect.bottom > innerHeight*.25;
      darkRects = roaming ? Array.from(darkSections, section => section.getBoundingClientRect()) : [];
      canvas.setAttribute('aria-hidden', String(!roaming && !homeVisible));
      canvas.setAttribute('tabindex', roaming || homeVisible ? '0' : '-1');
      layoutDirty = false;
    }
    // A contained whale scrolls with its section and sleeps when that section leaves view.
    if (!roaming && !homeVisible) { last = 0; lastDraw = 0; return; }
    if (!reduced && lastDraw && now-lastDraw < 1000/30-.5) { requestFrame(); return; }
    lastDraw = now;
    const dt = Math.min((last ? now-last : 16.67)/16.67, 2);
    last = now;
    if (!reduced) elapsed += dt;
    const entering = entrance !== 'swimming';
    const doingTrick = !!trick;
    // Rotations and impact particles extend outside the usual bounds; clear the whole stage during both.
    if (entering || doingTrick) ctx.clearRect(0, 0, w, h);
    else if (lastRect) ctx.clearRect(lastRect.x, lastRect.y, lastRect.width, lastRect.height);
    const fitScale = Math.max(.1, (w-32)/(spriteWidth+24));
    const goalScale = Math.min(atHome ? 1.08 : .66, fitScale, h*.45/spriteHeight);
    const goalY = h*(atHome ? .65 : atIntro ? .58 : .64);
    let compression = 0, shake = 0, turn = 0;
    if (entering) {
      scale = goalScale;
      x = w/2;
      entranceMs += dt*16.67;
      const groundY = h*.83;
      const landingY = groundY-84*scale;
      if (entrance === 'falling') {
        const t = clamp(entranceMs/fallDuration, 0, 1);
        const startY = -spriteHeight*scale*.6;
        // Accelerate from above this section, then stop at the floor in one distinct impact.
        y = startY+(landingY-startY)*t*t;
        if (t === 1) { setEntrance('impact'); entranceMs = 0; }
      }
      if (entrance === 'impact') {
        const t = clamp(entranceMs/impactDuration, 0, 1);
        const rise = clamp((t-.3)/.7, 0, 1);
        y = landingY-Math.sin(Math.min(1, t/.42)*Math.PI)*24-(landingY-goalY)*rise*rise*(3-2*rise);
        compression = Math.exp(-t*9)*Math.cos(t*15);
        // Lower the squashed body by exactly the height it loses, keeping its belly against the ground.
        y += 84*scale*.25*compression;
        shake = Math.sin(t*60)*4*(1-t)**3;
        if (t === 1) finishLanding();
      }
    } else if (trick) {
      trick.ms += dt*16.67;
      const t = clamp(trick.ms/(trick.kind === 'flip' ? 2100 : 2500), 0, 1);
      const eased = t*t*(3-2*t);
      const arc = Math.sin(Math.PI*t);
      turn = trick.kind === 'flip' ? -Math.PI*2*eased : -.55*Math.sin(Math.PI*2*t);
      // Fit the rotated sprite on narrow screens, then move along a smooth arc back to its starting point.
      const cos = Math.abs(Math.cos(turn)), sin = Math.abs(Math.sin(turn));
      const rotatedWidth = cos*spriteWidth+sin*(spriteHeight+50);
      const rotatedHeight = sin*spriteWidth+cos*(spriteHeight+50);
      scale = Math.min(goalScale, (w-36)/(rotatedWidth+24), (h-48)/(rotatedHeight+24));
      const halfWidth = rotatedWidth*scale/2+16, halfHeight = rotatedHeight*scale/2+16;
      const lift = Math.min(h*(trick.kind === 'flip' ? .19 : .28), trick.kind === 'flip' ? 180 : 260);
      const drift = trick.kind === 'flip' ? Math.sin(Math.PI*2*t)*24 : arc*Math.min(w*.12, 100);
      x = clamp(trick.startX+trick.heading*drift, halfWidth, w-halfWidth);
      y = clamp(trick.startY-arc*lift, halfHeight, h-halfHeight);
      direction = trick.heading;
      if (t === 1) cancelTrick();
    } else if (reduced) {
      scale = goalScale;
      const half = (spriteWidth/2+12)*scale;
      x = clamp(atHome ? w*.5 : w*.72, half+12, w-half-12);
      y = goalY;
    } else {
      // After landing, retain the original swimming, turns, scroll response, and roaming behavior.
      scale = Math.min(fitScale, scale+(goalScale-scale)*Math.min(1,.04*dt));
      y += (goalY+scrollNudge-y)*Math.min(1,.038*dt);
      scrollNudge *= Math.pow(.90, dt);
      const half = (spriteWidth/2+12)*scale+12;
      const travel = Math.max(0, w-half*2);
      if (travel < 90) {
        x += (w/2 + Math.sin(elapsed*.012)*travel*.25-x)*Math.min(1,.08*dt);
        x = clamp(x, half, w-half);
      } else {
        x += direction*(atHome ? .5 : .85)*dt;
        if (x < half) { x = half; direction = 1; }
        if (x > w-half) { x = w-half; direction = -1; }
      }
    }
    if (entrance === 'falling' || entrance === 'impact') drawGround(shake);
    ctx.save();
    const bob = reduced || entering || doingTrick ? 0 : Math.sin(elapsed*.019)*5;
    ctx.translate(x+shake, y+bob);
    if (direction < 0) ctx.scale(-1,1);
    ctx.scale(scale*(1+.12*compression), scale*(1-.25*compression));
    ctx.rotate(doingTrick ? turn : reduced || entering ? 0 : Math.sin(elapsed*.014)*.012);
    const dark = !roaming || darkRects.some(rect => rect.top <= y && rect.bottom > y);
    draw(dark);
    ctx.restore();
    // Draw the hint outside the sprite transform so it stays readable on phones and never flips backward.
    // Once the visitor discovers the reaction, leave the swimming whale free of extra text.
    if (entrance === 'swimming' && !hasReacted) {
      ctx.save();
      ctx.font = '12px Menlo, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = dark ? '#c0d7df' : '#35586b';
      // Keep the invitation near the middle of the whale, clear of the larger fountain.
      const hintX = clamp(x+direction*spriteWidth*scale*.06, 44, w-44);
      const hintY = Math.max(26, y-spriteHeight*scale*.34-18);
      ctx.fillText('click me', hintX, hintY);
      ctx.fillText('v', hintX, hintY+15);
      ctx.restore();
    }
    if (entrance === 'impact') drawImpact(entranceMs/impactDuration);
    // Include the entire taller fountain so fading droplets cannot leave trails on the page.
    const sprayClearance = Math.max(80, breathHeight-16*rowHeight+32);
    lastRect = { x: x-spriteWidth*scale/2-32,
      y: y-spriteHeight*scale/2-sprayClearance*scale-32,
      width: spriteWidth*scale+64, height: (spriteHeight+2*sprayClearance)*scale+64 };
    if (!reduced) hearts = Math.max(0, hearts-.012*dt);
    if (!reduced) requestFrame();
  }
  function requestFrame() {
    if (!frameId && entrance !== 'waiting' && site.entered && !document.hidden)
      frameId = requestAnimationFrame(frame);
  }
  function updateActivity() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    last = 0;
    lastDraw = 0;
    layoutDirty = true;
    canvas.setAttribute('aria-hidden', String(entrance === 'waiting' || !site.entered || (!roaming && !homeVisible)));
    canvas.setAttribute('tabindex', entrance !== 'waiting' && site.entered && (roaming || homeVisible) ? '0' : '-1');
    requestFrame();
  }
  document.addEventListener('cameron:entered', updateActivity);
  document.addEventListener('visibilitychange', updateActivity);
  site.reducedMotion.addEventListener('change', () => {
    reduced = site.reducedMotion.matches;
    if (reduced && trick) {
      // Resolve an active reaction immediately when the visitor changes their motion preference.
      cancelTrick();
      hearts = 0;
      ctx.clearRect(0, 0, w, h);
      lastRect = null;
    }
    if (reduced && (entrance === 'falling' || entrance === 'impact')) {
      // Switching the preference mid-fall immediately resolves the entrance and removes all debris.
      ctx.clearRect(0, 0, w, h);
      lastRect = null;
      finishLanding();
    }
    updateActivity();
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    if (home) observer.observe(home);
    if (intro) observer.observe(intro);
  }
  requestFrame();
})();
