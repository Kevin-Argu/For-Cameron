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

  const whale = [
    "                                       .   .",
    "                                        \\ /",
    "                                         v",
    "                                      .-||-.",
    "            __                ____..--'      '-.",
    "   __     _/  \\___       _.-''                 '-.",
    "  /  \\___/        '----''                       o  \\",
    "  \\__           __                               _/",
    "     \\___    __/  '-..                    __..--'",
    "         \\__/         '---...____________...---'"
  ];
  const alternateSpout = [
    "                                      .  .  .",
    "                                        \\|/",
    "                                         |",
    "                                      .-||-."
  ];
  const longest = Math.max(...whale.map(line => line.length));
  let w = innerWidth, h = innerHeight, dpr = 1;
  let x = w*.78, y = reduced ? h*.68 : -170;
  let scale = .75, direction = -1, last = 0, elapsed = 0;
  let scrollNudge = 0, previousScroll = scrollY, hearts = 0;
  const glyphWidth = 7.41, rowHeight = 15;

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
    if (!site.entered || e.target.closest("button, a, input, textarea, select, summary, .flower-math-card")) return;
    if (Math.abs(e.clientX-x) < longest*glyphWidth*scale/2 &&
        Math.abs(e.clientY-y) < whale.length*rowHeight*scale/2) {
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
    ctx.font = "12.3px Menlo, Monaco, Consolas, 'Courier New', monospace";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    const cw = ctx.measureText("M").width;
    const ox = -longest*cw/2, oy = -whale.length*rowHeight/2;
    const spout = Math.floor(elapsed/36)%2===0 ? whale : alternateSpout;
    ctx.shadowColor = dark ? "rgba(130,214,244,.38)" : "rgba(35,91,121,.15)";
    ctx.shadowBlur = dark ? 4 : 2;
    whale.forEach((line,i)=>{
      ctx.fillStyle = i<4 ? (dark?"#edbed9":"#a45c89") : (dark?"#c1efff":"#295f78");
      if (i>=4) {
        // Slight tail flick: move only the tail-side characters.
        const count = [18,20,20,19,22,23][i-4];
        ctx.fillText(line.slice(0,count),ox+Math.sin(elapsed*.065)*2.2,oy+i*rowHeight);
        ctx.fillText(line.slice(count),ox+count*cw,oy+i*rowHeight);
      } else {
        ctx.fillText(spout[i],ox,oy+i*rowHeight);
      }
    });
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
    if (!reduced && lastDraw && now - lastDraw < 1000 / 60 - .5) { requestFrame(); return; }
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
    const goalScale = Math.max(.3,Math.min(atHome?1.55:.94,(w-32)/(longest*glyphWidth)));
    const goalY = h*(atHome?.67:atIntro?.69:.64);
    if (reduced) {
      scale=goalScale;
      const half = Math.min(w*.47, longest*glyphWidth*scale/2+6);
      x=clamp(atHome?w*.5:w*.77, half, w-half); y=goalY;
    } else {
      scale += (goalScale-scale)*Math.min(1,.04*dt);
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
      y: y - whale.length*rowHeight*scale/2 - 150*scale - 24,
      width: longest*glyphWidth*scale + 48,
      height: whale.length*rowHeight*scale + 150*scale + 48 };
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

