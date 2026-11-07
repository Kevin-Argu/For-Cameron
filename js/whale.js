// All visible parts of this roaming whale are ASCII text glyphs.
// It drops into the opening scene, then swims above every section.
(() => {
  "use strict";
  const canvas = document.createElement("canvas");
  canvas.id = "roamingWhale";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "An animated whale made entirely of ASCII characters");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const home = document.getElementById("whaleHome");
  const intro = document.querySelector(".ascii-intro");
  const site = window.CameronSite;
  let reduced = site.reducedMotion.matches;
  let frameId = 0, layoutDirty = true, lastDraw = 0, lastRect = null;
  let atHome = false, atIntro = true, heartTimer;
  canvas.setAttribute("aria-hidden", String(!site.entered));
  const clamp = (n,a,b) => Math.max(a, Math.min(b,n));

  const longest = 64, spriteRows = 25;
  const body = [[14,11.2],[21,9.3],[27,6.7],[35,5],[43,4.6],[51,5.1],
    [57,6.3],[60.5,8.3],[62,10.8],[62.5,13.5],[61,15.2],[58,17],
    [52,18.7],[44,19.4],[36,19.6],[29,18.4],[24,16.6],[18,14.3],[14,13.3]];
  const tail = [[15,11],[12,10],[8,7],[3,6],[1,5.5],[2,9],[6,11],
    [8,12],[6,13],[2,16],[1,18.5],[4,18],[8,16],[11,14],[15,13]];
  const dorsal = [[25,7.6],[27.2,3.8],[29,5.1],[32,5.8]];
  const flipper = [[44,15.3],[42,19.1],[39,22.2],[35,24],[33.8,23],
    [37,18],[39,16]];
  function inside(points, px, py) {
    let hit = false;
    for (let i=0,j=points.length-1;i<points.length;j=i++) {
      const [ax,ay]=points[i], [bx,by]=points[j];
      if ((ay>py)!==(by>py) && px<(bx-ax)*(py-ay)/(by-ay)+ax) hit=!hit;
    }
    return hit;
  }
  const silhouette = (px,py) => inside(body,px,py)||inside(tail,px,py)||inside(dorsal,px,py);
  const sprite = [];
  // Text-only anatomy: a broad forehead, tapered tail stock, forked flukes,
  // pale throat, and a long pectoral flipper hanging below the belly.
  for (let row=4;row<spriteRows;row++) {
    const cells = [];
    for (let col=0;col<longest;col++) {
      const fin = inside(flipper,col,row);
      if (!fin && !silhouette(col,row)) { cells.push(null); continue; }
      const contains = fin ? (a,b)=>inside(flipper,a,b) : silhouette;
      const above = !contains(col,row-.7), below = !contains(col,row+.7);
      const left = !contains(col-.8,row), right = !contains(col+.8,row);
      const edge = above||below||left||right;
      const noise = (col*17+row*31)%13;
      let color = fin?'fin':row>13&&col>23?'belly':'body';
      let char = noise<4?'.':noise<9?':':' ';
      if (edge) {
        color = fin?'finRim':'rim';
        char = above?(left?'/':right?'\\':'_'):below?(left?'\\':right?'/':'_'):left?'(':')';
      } else if (fin) char = noise<3?'.':' ';
      else if (color==='belly') char = col>44&&col%4===0?'/':noise<3?'.':' ';
      // Leave a quiet patch around the eye and the small curved mouth.
      if (!fin && col>=53&&col<=58&&row>=9&&row<=12) char=' ';
      if (!fin && col>=50&&col<=60&&row===14) { char=col>52?'_':'.';color='mouth'; }
      if (col===61&&row===13) {char='/';color='mouth';}
      if (col===56&&row===10) {char='o';color='eye';}
      cells.push({char,color,tail:col<15,fin:fin&&row>18});
    }
    // Batch adjacent characters into short text runs, instead of painting
    // hundreds of glowing glyphs separately on every animation frame.
    for (let col=0;col<cells.length;) {
      const cell=cells[col];
      if (!cell||cell.char===' ') { col++;continue; }
      let text=cell.char, next=col+1;
      while (next<cells.length && cells[next] && cells[next].color===cell.color &&
        cells[next].tail===cell.tail && cells[next].fin===cell.fin) text+=cells[next++].char;
      sprite.push({x:col,y:row,text,color:cell.color,tail:cell.tail,fin:cell.fin});
      col=next;
    }
  }
  const tones = {
    dark: {rim:'#b9ebf3',body:'#65a6c0',belly:'#b9dce5',fin:'#6aadc7',
      finRim:'#a9dcec',eye:'#f3f9ed',mouth:'#92c2d1'},
    light: {rim:'#225a70',body:'#3f7d92',belly:'#507f8c',fin:'#326c83',
      finRim:'#21586e',eye:'#173e51',mouth:'#2a5669'}
  };
  let w = innerWidth, h = innerHeight, dpr = 1;
  let x = w*.78, y = reduced ? h*.68 : -170;
  let scale = .75, direction = -1, last = 0, elapsed = 0;
  let scrollNudge = 0, previousScroll = scrollY, hearts = 0;
  const glyphWidth = 7.41, rowHeight = 11;

  function resize() {
    w = innerWidth; h = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr);
    canvas.height = Math.round(h*dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    x = clamp(x,0,w);
    lastRect = null;
    layoutDirty = true;
    requestFrame();
  }
  addEventListener("resize",resize,{passive:true});
  addEventListener("scroll",()=>{
    const current = scrollY;
    scrollNudge = clamp(scrollNudge + (current-previousScroll)*.28,-50,75);
    previousScroll = current;
    layoutDirty = true;
    requestFrame();
  },{passive:true});
  resize();

  addEventListener("click",e=>{
    if (!site.entered || e.target.closest("button, a, input, textarea, select, summary, .flower-note-card")) return;
    if (Math.abs(e.clientX-x) < longest*glyphWidth*scale/2 &&
        Math.abs(e.clientY-y) < spriteRows*rowHeight*scale/2) {
      hearts = 1;
      if (!reduced) direction *= -1;
      else {
        clearTimeout(heartTimer);
        heartTimer = setTimeout(() => { hearts = 0; requestFrame(); }, 900);
      }
      requestFrame();
    }
  },{passive:true});

  function draw(dark) {
    ctx.font = "600 12.3px Menlo, Monaco, Consolas, 'Courier New', monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    const cw = glyphWidth;
    const ox = -longest*cw/2, oy = -spriteRows*rowHeight/2;
    const colors = tones[dark?'dark':'light'];
    ctx.shadowColor = dark ? "rgba(130,214,244,.35)" : "rgba(35,91,121,.12)";
    ctx.shadowBlur = dark ? 2.5 : 0;
    for (const run of sprite) {
      const flick = reduced ? 0 : Math.sin(elapsed*.065)*(run.tail?2.2:run.fin?1.1:0);
      ctx.fillStyle = colors[run.color];
      ctx.fillText(run.text,ox+run.x*cw,oy+run.y*rowHeight+flick);
    }
    // The spout rises from a single blowhole near the top of the head.
    const spout = Math.floor(elapsed/28)%2
      ? [" .   . ", "  \\|/  ", "   |   ", "   :   "]
      : [".  .  .", " \\ | / ", "  \\|/  ", "   |   "];
    ctx.fillStyle = dark?"#edbed9":"#a45c89";
    for (let i=0;i<spout.length;i++) ctx.fillText(spout[i],ox+43*cw,oy+i*rowHeight);
    ctx.fillStyle = colors.rim;
    ctx.fillText("o",ox+46*cw,oy+4*rowHeight);
    ctx.shadowBlur = 0;
    if (hearts>0) {
      ctx.fillStyle = dark?"#f4afce":"#ad608b";
      ctx.font = "15px Menlo, Monaco, monospace";
      ctx.globalAlpha = hearts;
      for (let i=0;i<3;i++)
        ctx.fillText("<3",-35+i*28,oy-18-i*13-(1-hearts)*60);
      ctx.globalAlpha = 1;
    }
  }

  function frame(now) {
    frameId = 0;
    if (!site.entered || document.hidden) return;
    if (!reduced && lastDraw && now - lastDraw < 1000 / 30 - .5) { requestFrame(); return; }
    lastDraw = now;
    const dt = Math.min((now-last||16.67)/16.67,2);
    last = now;
    if (!reduced) elapsed += dt;
    // Section geometry only changes when scrolling or resizing, not on every swim frame.
    if (layoutDirty) {
      const r = home && home.getBoundingClientRect();
      const introRect = intro && intro.getBoundingClientRect();
      atHome = !!r && r.top<h*.75 && r.bottom>h*.25;
      atIntro = !!introRect && introRect.top<h*.75 && introRect.bottom>h*.25;
      layoutDirty = false;
    }
    if (lastRect) ctx.clearRect(lastRect.x, lastRect.y, lastRect.width, lastRect.height);
    const fitScale = Math.max(.1,(w-32)/(longest*glyphWidth));
    const goalScale = Math.min(atHome?1.3:.82,fitScale,h*.43/(spriteRows*rowHeight));
    const goalY = h*(atHome?.67:atIntro?.58:.64);
    if (reduced) {
      scale=goalScale;
      const half = Math.min(w*.47, longest*glyphWidth*scale/2+6);
      x=clamp(atHome?w*.5:w*.77, half, w-half); y=goalY;
    } else {
      scale = Math.min(fitScale,scale+(goalScale-scale)*Math.min(1,.04*dt));
      y += (goalY+scrollNudge-y)*Math.min(1,.038*dt);
      scrollNudge *= Math.pow(.90,dt);
      x += direction*(atHome?.62:1.06)*dt;
      const half = Math.min(w*.47,longest*glyphWidth*scale/2+6);
      if (x<half){x=half;direction=1;}
      if (x>w-half){x=w-half;direction=-1;}
    }
    ctx.save();
    ctx.translate(x,y+(reduced?0:Math.sin(elapsed*.045)*5));
    if (direction<0) ctx.scale(-1,1);
    ctx.scale(scale,scale);
    draw(atHome||atIntro);
    ctx.restore();
    // Clear the previous whale and splash area, rather than the entire display.
    lastRect = { x: x - longest*glyphWidth*scale/2 - 24,
      y: y - spriteRows*rowHeight*scale/2 - 150*scale - 24,
      width: longest*glyphWidth*scale + 48,
      height: spriteRows*rowHeight*scale + 150*scale + 48 };
    if (!reduced) hearts = Math.max(0,hearts-.012*dt);
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


