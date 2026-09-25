/* ==========================================================
   Cardume animado no fundo da primeira seção (canvas 2D)
   Silhuetas de peixe (só contorno) nadam da direita para a
   esquerda. A cada 10 peixes, um se preenche de cor, fica
   mais forte, dá meia-volta e nada contra a corrente.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("hero-fish");        // cardume (atrás do conteúdo)
  var front = document.getElementById("hero-fish-front");   // peixes escolhidos (na frente)
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var ctxF = front && front.getContext ? front.getContext("2d") : ctx;
  var hero = canvas.parentElement;
  var stage = hero.querySelector(".devices");                // área onde os escolhidos viram

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Configuração ---------- */
  var DENSITY = 26000;          // px² de tela por peixe (menor = mais peixes)
  var CHOSEN_EVERY = 10;        // 1 a cada 10 vira “escolhido”
  var OUTLINE = "205, 196, 255"; // cor do contorno (lavanda)
  var CHOSEN_A = "#ffd27a";     // cores do peixe preenchido (dourado → laranja da marca)
  var CHOSEN_B = "#ff5a2e";

  var W = 0, H = 0, dpr = 1, target = 0;
  var zone = { x0: 0.5, x1: 1, y0: 0.2, y1: 0.8 };        // em px após o resize
  var fish = [], spawned = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function smooth(e0, e1, x) {
    var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }

  /* Peixe desenhado com o focinho para a esquerda, comprimento 1 (de -0.5 a 0.5) */
  function fishPath(wag) {
    var p = new Path2D();
    var tb = 0.24, tt = 0.5;                 // base e ponta da cauda
    var w1 = wag * 0.05, w2 = wag * 0.1;     // balanço da cauda
    p.moveTo(-0.5, 0);
    p.bezierCurveTo(-0.34, -0.26, -0.02, -0.3, tb, -0.035 + w1);
    p.lineTo(tt, -0.22 + w2);
    p.quadraticCurveTo(0.41, 0 + w2, tt, 0.22 + w2);
    p.lineTo(tb, 0.035 + w1);
    p.bezierCurveTo(-0.02, 0.3, -0.34, 0.26, -0.5, 0);
    p.closePath();
    return p;
  }

  function makeFish(x) {
    var depth = Math.random();               // 0 = longe, 1 = perto
    var len = 16 + depth * 46;
    spawned += 1;
    var f = {
      x: x != null ? x : W + len + rand(0, 80),
      y: rand(H * 0.06, H * 0.94),
      len: len,
      depth: depth,
      speed: 22 + depth * 38 + rand(-6, 6),  // px/s
      alpha: 0.16 + depth * 0.3,
      phase: rand(0, 6.28),
      wagFreq: 5 + rand(0, 3),
      bob: rand(3, 9),
      chosen: spawned % CHOSEN_EVERY === 0,
      state: 0,                               // 0 nadando, 1 transformando, 2 contra a corrente
      k: 0,                                   // progresso da transformação (0 a 1)
      triggerX: 0
    };
    // O escolhido fica um pouco maior e nada pela área do notebook (longe do texto)
    if (f.chosen) {
      f.len = 52 + rand(0, 18);
      f.alpha = Math.max(f.alpha, 0.45);
      f.speed = Math.max(f.speed, 40);
      f.y = rand(zone.y0, zone.y1);
      f.triggerX = rand(zone.x0 + (zone.x1 - zone.x0) * 0.3, zone.x0 + (zone.x1 - zone.x0) * 0.7);
      // no cardume inicial, o escolhido começa à direita do ponto de virada
      if (x != null && f.x <= f.triggerX + 40) f.x = rand(f.triggerX + 60, W + 20);
    }
    return f;
  }

  function resize() {
    var r = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    [canvas, front].forEach(function (c) {
      if (!c) return;
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + "px";
      c.style.height = H + "px";
    });
    if (stage) {
      var d = stage.getBoundingClientRect();
      var pad = Math.min(d.height * 0.12, 60);
      zone = { x0: d.left - r.left, x1: d.right - r.left, y0: d.top - r.top + pad, y1: d.bottom - r.top - pad };
    } else {
      zone = { x0: W * 0.5, x1: W, y0: H * 0.2, y1: H * 0.8 };
    }
    target = Math.max(10, Math.min(60, Math.round((W * H) / DENSITY)));
    if (!fish.length) {
      // Já começa com o cardume espalhado pela tela
      for (var i = 0; i < target; i++) fish.push(makeFish(rand(-40, W + 40)));
      if (reduce) staticScene();
    }
    if (!running) draw(0);
  }

  /* Com “reduzir movimento”: cena parada com um peixe já virado */
  function staticScene() {
    var f = makeFish(W * 0.62);
    f.chosen = true; f.state = 2; f.k = 1; f.len = 48; f.alpha = 0.9;
    f.x = zone.x0 + (zone.x1 - zone.x0) * 0.6; f.y = zone.y0 + (zone.y1 - zone.y0) * 0.5;
    fish.push(f);
  }

  /* ---------- Atualização ---------- */
  function update(dt, time) {
    for (var i = fish.length - 1; i >= 0; i--) {
      var f = fish[i];
      if (f.state === 0) {
        f.x -= f.speed * dt;
        if (f.chosen && f.x <= f.triggerX) f.state = 1;
      } else if (f.state === 1) {
        f.k = Math.min(1, f.k + dt / 1.8);
        // desacelera, vira e acelera para a direita
        var turn = Math.cos(Math.PI * smooth(0.3, 0.85, f.k));
        f.x -= f.speed * turn * dt * (turn > 0 ? 1 : 1.35);
        if (f.k >= 1) f.state = 2;
      } else {
        f.x += f.speed * 1.35 * dt;
      }
      f.y += Math.sin(time * 0.6 + f.phase) * f.bob * dt * 0.6;

      var gone = f.state === 2 ? f.x > W + f.len * 2 : f.x < -f.len * 2;
      if (gone) fish.splice(i, 1);
    }
    while (fish.length < target) fish.push(makeFish());
  }

  /* ---------- Desenho ---------- */
  function drawFish(ctx, f, time) {
    var wag = Math.sin(time * f.wagFreq + f.phase) * (f.state === 2 ? 1.2 : 1);
    var facing = 1;                          // 1 = para a esquerda, -1 = para a direita
    var fill = 0;
    if (f.state >= 1) {
      fill = smooth(0, 0.45, f.k);
      facing = Math.cos(Math.PI * smooth(0.3, 0.85, f.k));
      if (Math.abs(facing) < 0.06) facing = facing < 0 ? -0.06 : 0.06; // evita espessura zero no giro
    }
    var tilt = Math.cos(time * 0.6 + f.phase) * 0.06;
    var L = f.len;

    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(tilt * (facing >= 0 ? 1 : -1));
    ctx.scale(L * facing, L * (1 + fill * 0.08));
    var path = fishPath(wag);

    if (fill > 0) {
      var g = ctx.createLinearGradient(-0.5, -0.25, 0.5, 0.25);
      g.addColorStop(0, CHOSEN_A);
      g.addColorStop(1, CHOSEN_B);
      ctx.globalAlpha = fill * 0.95;
      ctx.shadowColor = "rgba(255, 106, 61, 0.7)";
      ctx.shadowBlur = 18 * fill;
      ctx.fillStyle = g;
      ctx.fill(path);
      ctx.shadowBlur = 0;
      // borda clara para destacar o peixe sobre qualquer fundo
      ctx.globalAlpha = fill * 0.9;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.6 / L;
      ctx.stroke(path);
      // olho
      ctx.globalAlpha = fill * 0.9;
      ctx.fillStyle = "#2a0f06";
      ctx.beginPath();
      ctx.arc(-0.32, -0.045, 0.028, 0, Math.PI * 2);
      ctx.fill();
    }

    // contorno: some aos poucos enquanto o peixe se preenche
    var outlineAlpha = f.alpha * (1 - fill * 0.85);
    if (outlineAlpha > 0.01) {
      ctx.globalAlpha = outlineAlpha;
      ctx.strokeStyle = "rgba(" + OUTLINE + ", 1)";
      ctx.lineWidth = (1.1 + f.depth * 0.6) / L;
      ctx.lineJoin = "round";
      ctx.stroke(path);
    }
    ctx.restore();
  }

  function draw(time) {
    [ctx, ctxF].forEach(function (c) { c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H); });
    // peixes distantes primeiro; os escolhidos vão para a camada da frente
    fish.sort(function (a, b) { return (a.chosen - b.chosen) || (a.depth - b.depth); });
    for (var i = 0; i < fish.length; i++) drawFish(fish[i].chosen ? ctxF : ctx, fish[i], time);
    ctx.globalAlpha = 1;
    ctxF.globalAlpha = 1;
  }

  /* ---------- Loop (pausa fora da tela ou com a aba oculta) ---------- */
  var running = false, visible = true, raf = 0, last = 0, clock = 0;
  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;
    update(dt, clock);
    draw(clock);
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
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); else play(); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  play();
})();
