// One persistent ASCII whale, floating above every section.
(() => {
  const canvas = document.createElement("canvas");
  canvas.id = "roamingWhale";
  canvas.setAttribute("aria-label", "A little ASCII whale swimming around the garden");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const home = document.getElementById("whaleHome");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w=innerWidth,h=innerHeight,dpr=1, last=0, time=0, x=innerWidth*.5,y=-130, vx=1.05, targetY=innerHeight*.35, angle=0, scale=1, spark=0;
  const art=[
"                 __",
"            ____/  \\___",
"      _____/           \\___",
"  ___/                     _\\__",
" /    .                      __  \\",
"|                              \u25cf  |",
" \\__                         ___/",
"    \\____             ______/",
"         \\___________/     \\__",
"                         \\____/"
  ];
  function resize(){
    w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    canvas.style.width=w+"px";canvas.style.height=h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    x=Math.max(60,Math.min(w-60,x));
  }
  addEventListener("resize",resize);resize();
  canvas.addEventListener("pointerdown", e=>{
    const rect=canvas.getBoundingClientRect();
    const dx=e.clientX-x,dy=e.clientY-y;
    if(Math.abs(dx)<110*scale && Math.abs(dy)<65*scale){
      spark=1;vx*=-1;targetY=Math.max(90,Math.min(h-90,e.clientY-100));
    }
  });
  function frame(now){
    const dt=Math.min((now-last||16)/16.67,2);last=now;time+=dt;
    ctx.clearRect(0,0,w,h);
    const r=home?.getBoundingClientRect();
    const atHome=!!r && r.top<h*.7 && r.bottom>h*.3;
    const goalScale=atHome?Math.min(2.1,w/320):Math.min(1,w/270);
    scale+=(goalScale-scale)*.035*dt;
    if(!reduced){
      x+=vx*dt*(atHome?.55:1);
      if(x>w+130) x=-130;
      if(x< -140) x=w+130;
      targetY=atHome?h*.48:h*(.25+.17*Math.sin(time*.006));
      y+=(targetY-y)*.012*dt;
      angle+=(Math.sin(time*.028)*.045-angle)*.08*dt;
    }else{ x=w*.5;y=atHome?h*.48:h*.2; }
    const dark=atHome || (document.elementFromPoint(Math.max(0,Math.min(w-1,x)),Math.max(0,Math.min(h-1,y)))?.closest(".ascii-intro")!=null);
    const fontSize=9*scale, lineHeight=10.8*scale, charWidth=5.5*scale;
    const width=Math.max(...art.map(s=>s.length))*charWidth;
    ctx.save();ctx.translate(x,y+Math.sin(time*.045)*5);ctx.rotate(angle);
    if(vx<0)ctx.scale(-1,1);
    ctx.font=fontSize+"px monospace";ctx.textBaseline="middle";
    ctx.shadowBlur=dark?12:5;ctx.shadowColor=dark?"#91d9ef":"#446e8e";
    ctx.fillStyle=dark?"#c5f3ff":"#2c6880";
    art.forEach((line,i)=>{
      const tail=i>7?Math.sin(time*.12)*5*scale:0;
      ctx.fillText(line,-width/2+tail,(i-art.length/2)*lineHeight);
    });
    if(spark>0){
      ctx.font=(18*scale)+"px Georgia";ctx.fillStyle="#ef9fc4";
      for(let i=0;i<5;i++)ctx.fillText("♡",Math.sin(i*2.5)*60*scale,(-35-i*13-(1-spark)*60)*scale);
      spark=Math.max(0,spark-.014*dt);
    }
    ctx.restore();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
