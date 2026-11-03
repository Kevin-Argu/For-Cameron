// A small, illustrated whale that travels across the whole website.
// Its first entrance drops from above the lily garden; it gets bigger
// only when the dedicated ocean section comes into view.
(() => {
  "use strict";

  const canvas = document.createElement("canvas");
  canvas.id = "roamingWhale";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "A little blue whale swimming through the garden");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const home = document.getElementById("whaleHome");
  const intro = document.querySelector(".ascii-intro");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  let w = innerWidth;
  let h = innerHeight;
  let dpr = 1;
  let x = w * 0.79;
  let y = reduced ? h * 0.67 : -170;
  let direction = -1;
  let size = 0.65;
  let last = 0;
  let elapsed = 0;
  let scrollKick = 0;
  let lastScroll = window.scrollY;
  let hearts = 0;

  function resize() {
    w = innerWidth;
    h = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    x = clamp(x, Math.min(80, w * 0.5), Math.max(w - 80, w * 0.5));
  }

  addEventListener("resize", resize);
  addEventListener("scroll", () => {
    const next = window.scrollY;
    scrollKick = clamp(scrollKick + (next - lastScroll) * 0.40, -65, 95);
    lastScroll = next;
  }, { passive: true });
  resize();

  // A gentle secret: tapping the whale releases tiny pink hearts.
  addEventListener("pointerdown", (e) => {
    if (Math.abs(e.clientX - x) < 125 * size &&
        Math.abs(e.clientY - y) < 58 * size) {
      hearts = 1;
      if (!reduced) direction *= -1;
    }
  }, { passive: true });

  function whale(t, dark) {
    const outline = dark ? "#bcebf6" : "#345c78";
    const top = dark ? "#86c4db" : "#5a93af";
    const bottom = dark ? "#376b91" : "#376b8f";
    const belly = dark ? "#c9e4ec" : "#b7d4db";

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowBlur = dark ? 15 : 5;
    ctx.shadowColor = dark ? "rgba(94,195,235,.35)" : "rgba(34,83,114,.18)";
    ctx.lineWidth = 2.3;
    ctx.strokeStyle = outline;

    // Two distinct tail flukes. They move separately from the body.
    ctx.save();
    ctx.translate(-92, 5);
    ctx.rotate(Math.sin(t * .055) * .12);
    const tail = ctx.createLinearGradient(-145, -50, -90, 40);
    tail.addColorStop(0, top);
    tail.addColorStop(1, bottom);
    ctx.fillStyle = tail;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.bezierCurveTo(-18, -14, -37, -48, -63, -49);
    ctx.bezierCurveTo(-65, -26, -52, -7, -32, 0);
    ctx.bezierCurveTo(-53, 4, -67, 25, -65, 49);
    ctx.bezierCurveTo(-36, 42, -15, 15, 0, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // A tiny dorsal fin on top of the broad, rounded back.
    ctx.fillStyle = bottom;
    ctx.beginPath();
    ctx.moveTo(-29, -43);
    ctx.bezierCurveTo(-25, -58, -12, -70, -4, -69);
    ctx.bezierCurveTo(-7, -57, 4, -52, 15, -49);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Soft, rounded blue whale body (not an ASCII outline).
    const body = ctx.createLinearGradient(0, -57, 0, 56);
    body.addColorStop(0, top);
    body.addColorStop(.65, bottom);
    body.addColorStop(1, dark ? "#2c587e" : "#294f72");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-97, 3);
    ctx.bezierCurveTo(-88, -33, -30, -56, 31, -52);
    ctx.bezierCurveTo(82, -49, 110, -25, 113, 0);
    ctx.bezierCurveTo(115, 29, 70, 49, 12, 50);
    ctx.bezierCurveTo(-43, 48, -87, 32, -97, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pale curved underbelly, with two delicate crease lines.
    ctx.fillStyle = belly;
    ctx.globalAlpha = .93;
    ctx.beginPath();
    ctx.moveTo(-83, 19);
    ctx.bezierCurveTo(-26, 34, 41, 40, 109, 10);
    ctx.bezierCurveTo(92, 34, 56, 48, 12, 49);
    ctx.bezierCurveTo(-31, 47, -66, 34, -83, 19);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = dark ? "rgba(50,99,132,.42)" : "rgba(52,100,126,.32)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-44 + i * 22, 31 + i * 3);
      ctx.quadraticCurveTo(12 + i * 13, 51, 69 + i * 8, 29);
      ctx.stroke();
    }

    // Foreground flipper: a softly swinging, pointed paddle.
    ctx.save();
    ctx.translate(-17, 26);
    ctx.rotate(Math.sin(t * .068 + 1.5) * .18);
    ctx.fillStyle = dark ? "#568eb0" : "#44799b";
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(13, -2);
    ctx.bezierCurveTo(7, 22, -10, 42, -37, 48);
    ctx.bezierCurveTo(-42, 23, -24, 1, -6, -9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Eye, eye glint, and a small smile on the right-facing head.
    ctx.fillStyle = "#162c42";
    ctx.beginPath();
    ctx.arc(75, -13, 4.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(76.5, -14.5, 1.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = dark ? "#8ac9dd" : "#386985";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 13);
    ctx.quadraticCurveTo(95, 20, 107, 7);
    ctx.stroke();

    // A little water spout from the blowhole.
    ctx.fillStyle = dark ? "#b8ecf8" : "#659db6";
    const puff = .7 + .3 * Math.sin(t * .035);
    [[65, -62, 3.0], [75, -74, 2.3], [85, -63, 2.7]].forEach(([dx, dy, r]) => {
      ctx.globalAlpha = puff;
      ctx.beginPath();
      ctx.arc(dx, dy - Math.sin(t * .04 + dx) * 4, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    const dt = Math.min((now - last || 16.67) / 16.67, 2);
    last = now;
    elapsed += dt;
    ctx.clearRect(0, 0, w, h);

    const homeRect = home && home.getBoundingClientRect();
    const introRect = intro && intro.getBoundingClientRect();
    const atHome = !!homeRect && homeRect.top < h * .75 && homeRect.bottom > h * .25;
    const atIntro = !!introRect && introRect.top < h * .75 && introRect.bottom > h * .25;
    const targetSize = atHome ? clamp(w / 710, .69, 1.75) : clamp(w / 1700, .44, .83);
    const targetY = (atHome ? .65 : atIntro ? .66 : .62) * h;

    if (reduced) {
      size = targetSize;
      x = atHome ? w * .5 : w * .78;
      y = targetY;
    } else {
      size += (targetSize - size) * Math.min(1, .04 * dt);
      // The first visit animates down from above as a little surprise.
      y += (targetY + scrollKick - y) * Math.min(1, .038 * dt);
      scrollKick *= Math.pow(.90, dt);
      // Keep swimming continuously, across flowers and other sections.
      x += direction * (atHome ? .68 : 1.04) * dt;
      const edge = Math.min(w * .30, 132 * size + 15);
      if (x < edge) { x = edge; direction = 1; }
      if (x > w - edge) { x = w - edge; direction = -1; }
    }

    ctx.save();
    ctx.translate(x, y + (reduced ? 0 : Math.sin(elapsed * .045) * 6));
    ctx.rotate(reduced ? 0 : Math.sin(elapsed * .024) * .035);
    // Whale illustration faces right by default.
    if (direction < 0) ctx.scale(-1, 1);
    ctx.scale(size, size);
    whale(elapsed, atHome || atIntro);

    if (hearts > 0) {
      ctx.fillStyle = "#ed9fc1";
      ctx.font = "23px Georgia, serif";
      ctx.textAlign = "center";
      for (let i = 0; i < 4; i++) {
        const py = -56 - i * 17 - (1 - hearts) * 65;
        ctx.globalAlpha = hearts;
        ctx.fillText("♡", -48 + i * 28 + Math.sin(elapsed * .05 + i) * 6, py);
      }
      ctx.globalAlpha = 1;
      hearts = Math.max(0, hearts - .014 * dt);
    }
    ctx.restore();

    if (!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
