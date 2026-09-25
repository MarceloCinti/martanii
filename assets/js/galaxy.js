/* ==========================================================
   Galáxia animada da primeira seção (canvas 2D)
   Redemoinho de partículas brilhantes em braços espirais,
   com brilhos desfocados, estrelas piscando e rotação suave.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("hero-galaxy");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var wrap = canvas.parentElement;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Configuração ---------- */
  var ARMS = 9;             // quantidade de braços
  var TWIST = 1.75;         // curvatura dos braços (radianos do centro até a borda)
  var INNER = 0.3;          // raio interno (fração do raio total)
  var SPIN = 0.11;          // velocidade de rotação (rad/s)
  var DRIFT = 0.018;        // velocidade com que as partículas “escorrem” pelos braços
  var COLORS = [
    [255, 255, 255, 0.42],  // branco
    [206, 190, 255, 0.24],  // lavanda
    [170, 200, 255, 0.2],   // azul-claro
    [255, 170, 135, 0.14]   // pêssego (cor de destaque da marca)
  ];

  /* ---------- Sprites de brilho pré-renderizados ---------- */
  function sprite(rgb, soft) {
    var s = 64, c = document.createElement("canvas");
    c.width = c.height = s;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    var col = rgb[0] + "," + rgb[1] + "," + rgb[2];
    if (soft) {
      // disco suave, estilo “bokeh”
      grd.addColorStop(0, "rgba(" + col + ",0.75)");
      grd.addColorStop(0.45, "rgba(" + col + ",0.55)");
      grd.addColorStop(0.75, "rgba(" + col + ",0.18)");
      grd.addColorStop(1, "rgba(" + col + ",0)");
    } else {
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.12, "rgba(" + col + ",0.95)");
      grd.addColorStop(0.35, "rgba(" + col + ",0.28)");
      grd.addColorStop(1, "rgba(" + col + ",0)");
    }
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    return c;
  }
  var SOFT = COLORS.map(function (c) { return sprite(c, true); });
  var STAR = COLORS.map(function (c) { return sprite(c, false); });

  function pickColor() {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < COLORS.length; i++) {
      acc += COLORS[i][3];
      if (r <= acc) return i;
    }
    return 0;
  }
  function gauss() { // aproximação de distribuição normal
    return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
  }

  /* ---------- Partículas ---------- */
  var blobs = [], stars = [], dust = [];
  var size = 0, R = 0, dpr = 1;

  function build() {
    blobs = []; stars = []; dust = [];
    var small = size < 420;
    var clumps = small ? 8 : 11;
    var starsPerArm = small ? 55 : 90;

    for (var a = 0; a < ARMS; a++) {
      var base = (a / ARMS) * Math.PI * 2;
      // Aglomerados de brilhos desfocados ao longo do braço
      for (var j = 0; j < clumps; j++) {
        var t0 = (j + Math.random() * 0.8) / clumps;
        var n = 2 + Math.floor(Math.random() * 3);
        for (var k = 0; k < n; k++) {
          blobs.push({
            arm: base, t: t0 + Math.random() * 0.05, off: gauss() * 1.1,
            size: 0.034 + Math.random() * 0.06, color: pickColor(),
            phase: Math.random() * 6.28, freq: 0.6 + Math.random() * 1.2
          });
        }
      }
      // Estrelas finas seguindo o braço
      for (var s = 0; s < starsPerArm; s++) {
        stars.push({
          arm: base, t: Math.random(), off: gauss() * 1.4,
          size: 0.004 + Math.random() * 0.012, color: pickColor(),
          phase: Math.random() * 6.28, freq: 1 + Math.random() * 3
        });
      }
    }
    // Poeira estelar espalhada pelo disco
    var nd = small ? 90 : 170;
    for (var d = 0; d < nd; d++) {
      dust.push({
        ang: Math.random() * Math.PI * 2, rad: INNER * 0.8 + Math.random() * (1.08 - INNER * 0.8),
        size: 0.003 + Math.random() * 0.006, color: pickColor(),
        phase: Math.random() * 6.28, freq: 0.5 + Math.random() * 2
      });
    }
  }

  function resize() {
    var w = wrap.clientWidth;
    if (!w) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var newSize = Math.round(w);
    canvas.width = newSize * dpr;
    canvas.height = newSize * dpr;
    canvas.style.width = newSize + "px";
    canvas.style.height = newSize + "px";
    var rebuild = Math.abs(newSize - size) > 60 || !blobs.length;
    size = newSize;
    R = size * 0.4;
    if (rebuild) build();
    if (reduce || !running) draw(performance.now());
  }

  /* ---------- Interação (leve parallax e aceleração) ---------- */
  var tx = 0, ty = 0, px = 0, py = 0, boost = 0, boostTarget = 0;
  var hero = canvas.closest(".hero") || wrap;
  hero.addEventListener("pointermove", function (e) {
    var r = wrap.getBoundingClientRect();
    tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 18;
    ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 18;
    boostTarget = 1;
  });
  hero.addEventListener("pointerleave", function () { tx = ty = 0; boostTarget = 0; });

  /* ---------- Desenho ---------- */
  var start = performance.now(), last = start, rot = 0;

  function place(arm, t, off) {
    var r = R * (INNER + (1 - INNER) * t);
    var ang = arm + TWIST * t + rot;
    var width = R * (0.05 + 0.09 * t);
    // deslocamento perpendicular ao braço
    var x = Math.cos(ang) * r - Math.sin(ang) * off * width;
    var y = Math.sin(ang) * r + Math.cos(ang) * off * width;
    return [x, y];
  }
  function envelope(t) { // surge no centro e some na borda
    var a = t < 0.12 ? t / 0.12 : 1;
    var b = t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1;
    return a * b;
  }

  function draw(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var elapsed = (now - start) / 1000;

    boost += (boostTarget - boost) * 0.04;
    if (!reduce) {
      rot += dt * SPIN * (1 + boost * 0.9);
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
    }
    // Entrada: a galáxia “nasce” do centro
    var intro = reduce ? 1 : Math.min(1, elapsed / 1.8);
    var ease = 1 - Math.pow(1 - intro, 3);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2 + px, size / 2 + py);
    ctx.scale(0.55 + 0.45 * ease, 0.55 + 0.45 * ease);
    ctx.globalCompositeOperation = "lighter";

    var i, p, pos, t, a, s, tw;
    var drift = reduce ? 0 : dt * DRIFT * (1 + boost * 0.6);

    for (i = 0; i < dust.length; i++) {
      p = dust[i];
      tw = 0.45 + 0.55 * Math.sin(elapsed * p.freq + p.phase);
      a = Math.max(0, tw) * 0.8 * ease;
      if (a < 0.02) continue;
      var ang = p.ang + rot * 0.85;
      s = p.size * size;
      ctx.globalAlpha = a;
      ctx.drawImage(STAR[p.color], Math.cos(ang) * p.rad * R - s * 2, Math.sin(ang) * p.rad * R - s * 2, s * 4, s * 4);
    }

    for (i = 0; i < blobs.length; i++) {
      p = blobs[i];
      p.t += drift; if (p.t >= 1) p.t -= 1;
      t = p.t;
      pos = place(p.arm, t, p.off);
      tw = 0.78 + 0.22 * Math.sin(elapsed * p.freq + p.phase);
      a = envelope(t) * tw * 0.19 * ease;
      if (a < 0.01) continue;
      s = p.size * size * (0.7 + 0.5 * t);
      ctx.globalAlpha = a;
      ctx.drawImage(SOFT[p.color], pos[0] - s, pos[1] - s, s * 2, s * 2);
    }

    for (i = 0; i < stars.length; i++) {
      p = stars[i];
      p.t += drift * 1.15; if (p.t >= 1) p.t -= 1;
      t = p.t;
      pos = place(p.arm, t, p.off);
      tw = 0.3 + 0.7 * Math.abs(Math.sin(elapsed * p.freq + p.phase));
      a = envelope(t) * tw * 0.9 * ease;
      if (a < 0.02) continue;
      s = p.size * size;
      ctx.globalAlpha = a;
      ctx.drawImage(STAR[p.color], pos[0] - s * 2, pos[1] - s * 2, s * 4, s * 4);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------- Loop (pausa fora da tela ou com a aba oculta) ---------- */
  var running = false, visible = true, raf = 0;
  function loop(now) {
    draw(now);
    raf = window.requestAnimationFrame(loop);
  }
  function play() {
    if (running || reduce || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = window.requestAnimationFrame(loop);
  }
  function pause() {
    running = false;
    window.cancelAnimationFrame(raf);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) play(); else pause();
    }).observe(canvas);
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); else play(); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  resize();
  if (reduce) draw(performance.now()); else play();
})();
