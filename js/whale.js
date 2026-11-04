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
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  }
  addEventListener("resize",resize,{passive:true});
  addEventListener("scroll",()=>{
    const current = scrollY;
    scrollNudge = clamp(scrollNudge + (current-previousScroll)*.28,-50,75);
    previousScroll = current;
  },{passive:true});
  resize();

  addEventListener("pointerdown",e=>{
    if (Math.abs(e.clientX-x) < longest*glyphWidth*scale/2 &&
        Math.abs(e.clientY-y) < whale.length*rowHeight*scale/2) {
      hearts = 1;
      if (!reduced) direction *= -1;
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
    const dt = Math.min((now-last||16.67)/16.67,2);
    last = now; elapsed += dt;
    ctx.clearRect(0,0,w,h);
    const r = home && home.getBoundingClientRect();
    const introRect = intro && intro.getBoundingClientRect();
    const atHome = !!r && r.top<h*.75 && r.bottom>h*.25;
    const atIntro = !!introRect && introRect.top<h*.75 && introRect.bottom>h*.25;
    const goalScale = Math.max(.3,Math.min(atHome?1.55:.94,(w-32)/(longest*glyphWidth)));
    const goalY = h*(atHome?.67:atIntro?.69:.64);
    if (reduced) {
      scale=goalScale; x=atHome?w*.5:w*.77; y=goalY;
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
    hearts = Math.max(0,hearts-.012*dt);
    if (!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
