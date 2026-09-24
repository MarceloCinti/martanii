/* ==========================================================
   Martanii Figueiredo — scripts do site
   Monta cabeçalho, rodapé e chat em todas as páginas e
   liga os comportamentos (menu, planos, portfólio, contato).
   ========================================================== */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var esc = function (str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------------- Ícones (traços inspirados no Lucide, licença ISC) ---------------- */
  var ICONS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    whatsapp: '<path d="M3.5 20.5 5 16.3A8.9 8.9 0 1 1 8.2 19.3z"/><path d="M9 8.6c0 3.3 3.1 6.4 6.4 6.4l1.1-1.5-2-1.1-.9.8a5 5 0 0 1-2.8-2.8l.8-.9-1.1-2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    pen: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
    bank: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    sparkles: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/><path d="M19 3v4M17 5h4"/>',
    trending: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3-3-9 9"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A13 13 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  var markId = 0;
  function brandMark() {
    markId += 1;
    var g = "mfg" + markId;
    return '<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#6a3cff"/><stop offset="1" stop-color="#ff6a3d"/></linearGradient></defs>' +
      '<rect width="48" height="48" rx="14" fill="url(#' + g + ')"/>' +
      '<path d="M11 33V15.5l7.5 10 7.5-10V33" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M31 33V15.5h7.5M31 24h6" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";
  }

  /* ---------------- Dados auxiliares ---------------- */
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o && o[k] != null ? o[k] : ""; }, S);
  }
  function digits(v) { return String(v || "").replace(/\D/g, ""); }
  function waLink(msg) {
    return "https://wa.me/" + digits(S.whatsapp) + "?text=" + encodeURIComponent(msg || S.whatsappMensagem || "");
  }

  var SERVICES = [
    { id: "web", href: "desenvolvimento-web.html", icon: "monitor", t: "Desenvolvimento Web", d: "Sites, landing pages e lojas virtuais" },
    { id: "social", href: "social-media.html", icon: "hash", t: "Social Media", d: "Conteúdo e gestão das suas redes" },
    { id: "logo", href: "criacao-de-logo.html", icon: "pen", t: "Criação de Logo", d: "Marca e identidade visual" },
    { id: "gads", href: "google-ads.html", icon: "target", t: "Google Ads", d: "Seja encontrado no Google" },
    { id: "meta", href: "meta-ads.html", icon: "megaphone", t: "Meta Ads", d: "Anúncios no Instagram e Facebook" },
    { id: "email", href: "email-marketing.html", icon: "send", t: "E-mail Marketing", d: "Campanhas direto na caixa de entrada" }
  ];
  var SERVICE_IDS = SERVICES.map(function (s) { return s.id; });

  var page = document.body.getAttribute("data-page") || "";

  /* ---------------- Ícones declarados no HTML: <i data-icon="nome"></i> ---------------- */
  function hydrateIcons(ctx) {
    $$("i[data-icon]", ctx).forEach(function (el) {
      var tmp = document.createElement("span");
      tmp.innerHTML = icon(el.getAttribute("data-icon"), el.className);
      el.replaceWith(tmp.firstChild);
    });
    $$("[data-brand-mark]", ctx).forEach(function (el) { el.innerHTML = brandMark(); });
  }

  /* ---------------- Cabeçalho ---------------- */
  function renderHeader() {
    var host = $("#site-header");
    if (!host) return;
    var act = function (id) { return page === id ? ' class="active" aria-current="page"' : ""; };
    var ddItems = SERVICES.map(function (s) {
      return '<li><a href="' + s.href + '"' + act(s.id) + '><span class="dd-ico">' + icon(s.icon) + "</span><span><strong>" +
        s.t + "</strong><small>" + s.d + "</small></span></a></li>";
    }).join("");
    var servActive = SERVICE_IDS.indexOf(page) > -1 ? " active" : "";

    host.outerHTML =
      '<header class="site-header" id="topo">' +
      '<div class="container nav">' +
      '<a class="brand" href="index.html" aria-label="' + esc(S.nome) + ' — página inicial">' + brandMark() +
      '<span class="brand-text"><span class="brand-name">' + esc(S.nome) + '</span><span class="brand-tag">' + esc(S.slogan) + "</span></span></a>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu">' + icon("menu") + "</button>" +
      '<nav aria-label="Principal"><ul class="menu" id="menu">' +
      '<li><a href="index.html"' + act("home") + ">Início</a></li>" +
      '<li><a href="sobre.html"' + act("sobre") + ">Sobre</a></li>" +
      '<li class="has-dd"><button type="button" class="dd-toggle' + servActive + '" aria-expanded="false">Serviços ' + icon("chevron") + "</button>" +
      '<ul class="dropdown">' + ddItems + "</ul></li>" +
      '<li><a href="formas-de-pagamento.html"' + act("pagamento") + ">Formas de Pagamento</a></li>" +
      '<li><a href="portfolio.html"' + act("portfolio") + ">Portfólio</a></li>" +
      '<li><a href="contato.html"' + act("contato") + ">Contato</a></li>" +
      '<li class="menu-cta"><a href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + " WhatsApp</a></li>" +
      "</ul></nav></div></header>";
  }

  /* ---------------- Rodapé ---------------- */
  function renderFooter() {
    var host = $("#site-footer");
    if (!host) return;
    var r = S.redes || {};
    var socials = ["instagram", "facebook", "linkedin"].filter(function (k) { return r[k]; }).map(function (k) {
      return '<a href="' + esc(r[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + icon(k) + "</a>";
    }).join("");
    var tel2 = S.telefone2 ? '<li>' + icon("phone") + '<a href="tel:' + digits(S.telefone2) + '">' + esc(S.telefone2) + "</a></li>" : "";

    host.outerHTML =
      '<footer class="site-footer">' +
      '<div class="container footer-top">' +
      '<div><a class="brand" href="index.html">' + brandMark() + '<span class="brand-text"><span class="brand-name">' + esc(S.nome) +
      '</span><span class="brand-tag">' + esc(S.slogan) + "</span></span></a>" +
      "<p>Criamos sites, marcas e campanhas digitais que ajudam negócios a serem encontrados, lembrados e escolhidos.</p>" +
      '<div class="socials">' + socials + "</div></div>" +
      '<div><h5>Institucional</h5><ul>' +
      '<li><a href="sobre.html">Sobre nós</a></li>' +
      '<li><a href="desenvolvimento-web.html#planos">Planos de sites</a></li>' +
      '<li><a href="formas-de-pagamento.html">Formas de pagamento</a></li>' +
      '<li><a href="portfolio.html">Portfólio</a></li>' +
      '<li><a href="contato.html">Contato</a></li></ul></div>' +
      '<div><h5>Serviços</h5><ul>' +
      SERVICES.map(function (s) { return '<li><a href="' + s.href + '">' + s.t + "</a></li>"; }).join("") +
      "</ul></div>" +
      '<div><h5>Fale conosco</h5><ul class="f-contact">' +
      "<li>" + icon("whatsapp") + '<a href="' + waLink() + '" target="_blank" rel="noopener">' + esc(S.telefone) + "</a></li>" + tel2 +
      "<li>" + icon("mail") + '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>" +
      "<li>" + icon("pin") + "<span>" + esc(S.endereco) + "<br>" + esc(S.cidade) + "</span></li>" +
      "<li>" + icon("clock") + "<span>" + esc(S.horario) + "</span></li></ul>" +
      '<div class="footer-pay" aria-label="Formas de pagamento"><span>PIX</span><span>CARTÃO</span><span>TRANSFERÊNCIA</span></div>' +
      "</div></div>" +
      '<div class="footer-bottom"><div class="container"><span>© ' + new Date().getFullYear() + " " + esc(S.nome) +
      ". Todos os direitos reservados.</span>" +
      '<a href="#topo">Voltar ao topo ↑</a></div></div></footer>';
  }

  /* ---------------- Faixa "Ficou com dúvida?" ---------------- */
  function renderHelp() {
    var host = $("#site-help");
    if (!host) return;
    host.outerHTML =
      '<section class="help" aria-label="Atendimento"><div class="container">' +
      "<div><h2>Ficou com alguma dúvida?</h2><p>Fale com a gente pelo canal que preferir. Estamos aqui para ajudar.</p></div>" +
      '<div class="help-actions">' +
      '<a class="btn btn-whats" href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + " " + esc(S.telefone) + "</a>" +
      '<a class="btn" href="tel:+' + digits(S.telefone) + '">' + icon("phone") + " Ligar agora</a>" +
      '<a class="btn" href="mailto:' + esc(S.email) + '">' + icon("mail") + " Enviar e-mail</a>" +
      "</div></div></section>";
  }

  /* ---------------- Chat online / WhatsApp ---------------- */
  function renderChat() {
    var opts = [
      ["monitor", "Quero um site profissional", "Olá! Quero um site profissional. Pode me ajudar?"],
      ["hash", "Gestão de redes sociais", "Olá! Tenho interesse na gestão das minhas redes sociais."],
      ["pen", "Criar a logo da minha marca", "Olá! Quero criar a logo da minha marca."],
      ["target", "Anúncios no Google ou Meta", "Olá! Quero anunciar no Google/Instagram. Como funciona?"],
      ["users", "Falar com um especialista", "Olá! Gostaria de falar com um especialista."]
    ];
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<button class="chat-launcher" type="button" aria-expanded="false" aria-controls="chat-panel">' +
      '<span class="pulse" aria-hidden="true"></span>' + icon("whatsapp") + '<span class="label">Fale conosco</span></button>' +
      '<div class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat online">' +
      '<div class="chat-head"><span class="avatar">' + brandMark() + "</span><span><strong>" + esc(S.nome) +
      "</strong><small>Atendimento via WhatsApp</small></span>" +
      '<button class="chat-close" type="button" aria-label="Fechar chat">' + icon("x") + "</button></div>" +
      '<div class="chat-body"><div class="bubble">Olá! 👋 Que bom ter você por aqui.</div>' +
      '<div class="bubble">Escolha um assunto ou escreva sua mensagem — respondemos pelo WhatsApp.</div>' +
      '<div class="chat-options">' +
      opts.map(function (o) {
        return '<a href="' + waLink(o[2]) + '" target="_blank" rel="noopener">' + icon(o[0]) + esc(o[1]) + "</a>";
      }).join("") +
      "</div></div>" +
      '<form class="chat-form"><label class="sr-only" for="chat-msg">Sua mensagem</label>' +
      '<input id="chat-msg" type="text" placeholder="Digite sua mensagem..." autocomplete="off">' +
      '<button type="submit" aria-label="Enviar pelo WhatsApp">' + icon("send") + "</button></form></div>";
    document.body.appendChild(wrap);

    var btn = $(".chat-launcher", wrap), panel = $(".chat-panel", wrap);
    var toggle = function (open) {
      panel.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) setTimeout(function () { $("#chat-msg").focus(); }, 150);
    };
    btn.addEventListener("click", function () { toggle(!panel.classList.contains("open")); });
    $(".chat-close", wrap).addEventListener("click", function () { toggle(false); btn.focus(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) toggle(false); });
    $(".chat-form", wrap).addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("#chat-msg").value.trim();
      window.open(waLink(v || S.whatsappMensagem), "_blank", "noopener");
    });
  }

  /* ---------------- Preenche dados do config.js ---------------- */
  function fillData() {
    $$("[data-site]").forEach(function (el) {
      var v = get(el.getAttribute("data-site"));
      if (!v && el.hasAttribute("data-hide-empty")) {
        (el.closest("[data-hide-wrap]") || el).hidden = true;
        return;
      }
      el.textContent = v;
    });
    $$("[data-link]").forEach(function (el) {
      var type = el.getAttribute("data-link");
      var href = "";
      if (type === "whatsapp") href = waLink(el.getAttribute("data-msg"));
      else if (type === "tel") href = "tel:+" + digits(S.telefone);
      else if (type === "tel2") href = "tel:+" + digits(S.telefone2);
      else if (type === "email") href = "mailto:" + S.email;
      else if (type === "email-fin") href = "mailto:" + S.emailFinanceiro;
      else href = (S.redes || {})[type] || "";
      if (!href) { el.hidden = true; return; }
      el.setAttribute("href", href);
      if (/^https?:/.test(href)) { el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
    });
  }

  /* ---------------- Preços ---------------- */
  var nf;
  try {
    nf = new Intl.NumberFormat(S.locale || "pt-BR", { style: "currency", currency: S.moeda || "BRL", maximumFractionDigits: 0, minimumFractionDigits: 0 });
  } catch (e) {
    nf = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }
  function money(n) { return nf.format(Math.round(n)); }
  function moneyParts(n) {
    var cur = "", num = "";
    nf.formatToParts(Math.round(n)).forEach(function (p) {
      if (p.type === "currency") cur += p.value;
      else if (p.type !== "literal") num += p.value;
    });
    return { cur: cur, num: num };
  }
  function renderPrices() {
    $$(".plan-price").forEach(function (box) {
      var strong = $("[data-price]", box);
      if (!strong) return;
      var p = moneyParts(parseFloat(strong.getAttribute("data-price")));
      strong.textContent = p.num;
      var cur = $(".cur", box);
      if (cur) cur.textContent = p.cur;
    });
    $$("[data-money]").forEach(function (el) { el.textContent = money(parseFloat(el.getAttribute("data-money"))); });
  }

  /* Planos mensais com período (Social Media, Ads, E-mail) */
  function initPeriodSwitch() {
    $$(".period-switch").forEach(function (sw) {
      var scope = sw.closest("section") || document;
      var buttons = $$("button", sw);
      var apply = function (btn) {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        var months = parseInt(btn.getAttribute("data-months"), 10) || 1;
        var disc = (parseFloat(btn.getAttribute("data-discount")) || 0) / 100;
        $$("[data-monthly]", scope).forEach(function (plan) {
          var base = parseFloat(plan.getAttribute("data-monthly"));
          var perMonth = base * (1 - disc);
          var p = moneyParts(perMonth);
          $(".plan-price strong", plan).textContent = p.num;
          $(".plan-price .cur", plan).textContent = p.cur;
          var note = $(".plan-note", plan);
          if (months === 1) {
            note.innerHTML = "Cobrança mensal";
          } else {
            var total = perMonth * months, saved = base * months - total;
            note.innerHTML = "Pagamento único de " + money(total) + " · <b>economize " + money(saved) + "</b>";
          }
          var cta = $("[data-plan]", plan);
          if (cta) cta.setAttribute("data-period", btn.getAttribute("data-label") || "");
        });
        wirePlanButtons();
      };
      buttons.forEach(function (b) { b.addEventListener("click", function () { apply(b); }); });
      apply(buttons.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0] || buttons[0]);
    });
  }

  /* Botões "Contratar" levam ao contato com serviço e plano preenchidos */
  function wirePlanButtons() {
    $$("[data-plan]").forEach(function (a) {
      var svc = (a.closest("[data-service]") || document.body).getAttribute("data-service") || "";
      var q = "?servico=" + encodeURIComponent(svc) + "&plano=" + encodeURIComponent(a.getAttribute("data-plan"));
      var per = a.getAttribute("data-period");
      if (per) q += "&periodo=" + encodeURIComponent(per);
      a.setAttribute("href", "contato.html" + q);
    });
  }

  /* ---------------- Menu ---------------- */
  function initNav() {
    var header = $(".site-header");
    var toggle = $(".nav-toggle");
    var menu = $("#menu");
    if (!header || !toggle || !menu) return;

    var setMenu = function (open) {
      menu.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      toggle.innerHTML = icon(open ? "x" : "menu");
    };
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });

    $$(".has-dd").forEach(function (li) {
      var btn = $(".dd-toggle", li);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !li.classList.contains("open");
        li.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    document.addEventListener("click", function (e) {
      $$(".has-dd.open").forEach(function (li) {
        if (!li.contains(e.target)) { li.classList.remove("open"); $(".dd-toggle", li).setAttribute("aria-expanded", "false"); }
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      $$(".has-dd.open").forEach(function (li) { li.classList.remove("open"); $(".dd-toggle", li).setAttribute("aria-expanded", "false"); });
      if (menu.classList.contains("open")) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 980 && menu.classList.contains("open")) setMenu(false); });

    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Portfólio: abas por plano + "ver mais" ---------------- */
  function workCard(w, planName) {
    var thumb;
    if (w.imagem) {
      thumb = '<div class="work-thumb has-img"><img src="' + esc(w.imagem) + '" alt="Site ' + esc(w.nome) + '" loading="lazy"></div>';
    } else {
      thumb = '<div class="work-thumb" style="--c1:' + esc(w.c1 || "#5227d9") + ";--c2:" + esc(w.c2 || "#ff6a3d") + '" aria-hidden="true">' +
        '<div class="ui"><div class="ui-bar"><i></i><i></i><i></i><em></em></div>' +
        '<div class="ui-hero"><div class="ui-line w60"></div><div class="ui-line w40 sm"></div><span class="ui-btn"></span></div>' +
        '<div class="ui-body"><div class="ui-card"></div><div class="ui-card"></div><div class="ui-card"></div></div></div></div>';
    }
    var btn = w.url
      ? '<a class="btn btn-primary btn-sm" href="' + esc(w.url) + '" target="_blank" rel="noopener">Ver site ' + icon("arrow") + "</a>"
      : '<a class="btn btn-outline btn-sm" href="contato.html?servico=' + encodeURIComponent("Desenvolvimento Web") +
        "&plano=" + encodeURIComponent(planName) + '">Quero um site assim ' + icon("arrow") + "</a>";
    return '<article class="work">' + thumb +
      '<div class="work-info"><h3>' + esc(w.nome) + "</h3>" +
      '<p class="work-plan">Plano: <strong>' + esc(planName.toUpperCase()) + "</strong>" +
      (w.modelo ? ' <span class="tag">Modelo</span>' : "") + "</p>" + btn + "</div></article>";
  }

  function initPortfolio() {
    var grid = $("#portfolio-grid"), tabsBox = $("#portfolio-tabs");
    if (!grid || !tabsBox) return;
    var works = window.PORTFOLIO || [], plans = window.PORTFOLIO_PLANOS || [];
    var moreBtn = $("#load-more");
    var STEP = 6, visible = STEP;
    plans = plans.filter(function (p) { return works.some(function (w) { return w.plano === p.id; }); });
    if (!plans.length) { grid.innerHTML = '<p class="center">Em breve.</p>'; moreBtn.parentElement.hidden = true; return; }

    var hashId = (window.location.hash || "").slice(1);
    var current = plans.some(function (p) { return p.id === hashId; }) ? hashId : plans[0].id;

    tabsBox.innerHTML = plans.map(function (p) {
      return '<button type="button" role="tab" id="tab-' + p.id + '" data-filter="' + p.id + '">' + esc(p.nome) + "</button>";
    }).join("");
    var buttons = $$("button", tabsBox);

    var render = function () {
      var plan = plans.filter(function (p) { return p.id === current; })[0];
      var list = works.filter(function (w) { return w.plano === current; });
      buttons.forEach(function (b) {
        var on = b.getAttribute("data-filter") === current;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      grid.setAttribute("aria-labelledby", "tab-" + current);
      grid.innerHTML = list.slice(0, visible).map(function (w) { return workCard(w, plan.nome); }).join("");
      moreBtn.parentElement.hidden = list.length <= visible;
    };
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.getAttribute("data-filter");
        visible = STEP;
        if (window.history && history.replaceState) history.replaceState(null, "", "#" + current);
        render();
      });
    });
    moreBtn.addEventListener("click", function () { visible += STEP; render(); });
    render();
  }

  /* ---------------- Formulário de contato ---------------- */
  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;
    var params = new URLSearchParams(window.location.search);
    var svc = params.get("servico"), plano = params.get("plano"), periodo = params.get("periodo");
    var status = $(".form-status", form);

    if (svc) {
      var sel = form.elements.servico;
      var found = false;
      Array.prototype.forEach.call(sel.options, function (o) { if (o.value === svc) { sel.value = svc; found = true; } });
      if (!found) { var o = new Option(svc, svc, true, true); sel.add(o); }
    }
    if (plano) {
      form.elements.plano.value = plano + (periodo ? " (" + periodo + ")" : "");
      form.elements.mensagem.value = "Olá! Tenho interesse no plano " + plano + (svc ? " de " + svc : "") +
        (periodo ? " (" + periodo.toLowerCase() + ")" : "") + ". Gostaria de mais informações.";
    }

    var validate = function () {
      var ok = true;
      ["nome", "email", "mensagem"].forEach(function (n) {
        var input = form.elements[n], field = input.closest(".field");
        var valid = input.value.trim() !== "" && (n !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.classList.toggle("invalid", !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      return ok;
    };
    $$("input, textarea, select", form).forEach(function (el) {
      el.addEventListener("input", function () { var f = el.closest(".field"); if (f) f.classList.remove("invalid"); });
    });

    var buildText = function () {
      var f = form.elements;
      var lines = [
        "*Novo contato pelo site*",
        "Nome: " + f.nome.value.trim(),
        "E-mail: " + f.email.value.trim()
      ];
      if (f.telefone.value.trim()) lines.push("Telefone: " + f.telefone.value.trim());
      if (f.cidade.value.trim()) lines.push("Cidade: " + f.cidade.value.trim());
      if (f.servico.value) lines.push("Serviço: " + f.servico.value);
      if (f.plano.value.trim()) lines.push("Plano: " + f.plano.value.trim());
      lines.push("", f.mensagem.value.trim());
      return lines.join("\n");
    };

    var show = function (ok, msg) { status.className = "form-status " + (ok ? "ok" : "err"); status.textContent = msg; };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      if (S.formEndpoint) {
        var btn = $("button[type=submit]", form);
        btn.disabled = true;
        fetch(S.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error();
            form.reset();
            show(true, "Mensagem enviada! Retornaremos em breve.");
          })
          .catch(function () { show(false, "Não foi possível enviar agora. Tente pelo WhatsApp ou e-mail."); })
          .then(function () { btn.disabled = false; });
      } else {
        window.open(waLink(buildText()), "_blank", "noopener");
        show(true, "Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar!");
      }
    });

    var mailBtn = $("#send-email");
    if (mailBtn) mailBtn.addEventListener("click", function () {
      if (!validate()) return;
      var subject = "Contato pelo site" + (form.elements.servico.value ? " — " + form.elements.servico.value : "");
      window.location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildText().replace(/\*/g, ""));
    });
  }

  /* ---------------- Mapa ---------------- */
  function initMap() {
    var box = $("#map");
    if (!box) return;
    if (!S.mostrarMapa) { box.hidden = true; return; }
    var q = encodeURIComponent([S.endereco, S.cidade].join(", "));
    box.innerHTML = '<iframe title="Mapa de localização" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + q + '&output=embed"></iframe>';
  }

  /* ---------------- Copiar dados (PIX / conta) ---------------- */
  function initCopy() {
    $$("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = get(btn.getAttribute("data-copy"));
        var done = function () {
          var old = btn.innerHTML;
          btn.innerHTML = icon("check") + " Copiado!";
          btn.classList.add("copied");
          setTimeout(function () { btn.innerHTML = old; btn.classList.remove("copied"); }, 1800);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () { window.prompt("Copie o dado abaixo:", v); });
        else window.prompt("Copie o dado abaixo:", v);
      });
    });
  }

  /* ---------------- Animações ao rolar ---------------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Inicialização ---------------- */
  renderHeader();
  renderHelp();
  renderFooter();
  renderChat();
  hydrateIcons(document);
  fillData();
  renderPrices();
  wirePlanButtons();
  initPeriodSwitch();
  initNav();
  initPortfolio();
  initContactForm();
  initMap();
  initCopy();
  initReveal();
})();
