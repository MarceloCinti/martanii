/*
 * ================================================================
 *  PORTFÓLIO — Martanii Figueiredo
 * ================================================================
 *  Cada linha abaixo é um cartão da página Portfólio.
 *
 *  Para adicionar um trabalho REAL:
 *    1. Salve a captura de tela do site em assets/img/portfolio/
 *       (ex.: assets/img/portfolio/cliente.webp — de preferência 1200x900).
 *    2. Adicione uma linha como esta:
 *       { nome: "NOME DO CLIENTE", plano: "landing", imagem: "assets/img/portfolio/cliente.webp", url: "https://site-do-cliente.com" },
 *    3. Apague os modelos (linhas com "modelo: true") quando tiver trabalhos reais.
 *
 *  Planos (abas): inicial | landing | onepage | start | avancado | completo | medida
 *  Sem "imagem": mostra uma ilustração nas cores c1/c2.
 *  Sem "url": o botão vira "Quero um site assim" (leva ao contato).
 * ================================================================
 */
window.PORTFOLIO_PLANOS = [
  { id: "inicial", nome: "Página Inicial" },
  { id: "landing", nome: "Landing Page" },
  { id: "onepage", nome: "One Page" },
  { id: "start", nome: "Start" },
  { id: "avancado", nome: "Avançado" },
  { id: "completo", nome: "Completo" },
  { id: "medida", nome: "Sob medida" }
];

window.PORTFOLIO = [
  // ---- Modelos de layout (substitua pelos trabalhos reais) ----
  { nome: "Escritório de Advocacia", plano: "inicial", modelo: true, c1: "#1f2a44", c2: "#b08d57" },
  { nome: "Estúdio de Pilates", plano: "inicial", modelo: true, c1: "#9d174d", c2: "#f9a8d4" },
  { nome: "Consultório de Psicologia", plano: "inicial", modelo: true, c1: "#5b21b6", c2: "#c4b5fd" },

  { nome: "Cafeteria", plano: "landing", modelo: true, c1: "#6b3e26", c2: "#d9a066" },
  { nome: "Escritório de Contabilidade", plano: "landing", modelo: true, c1: "#1e3a8a", c2: "#60a5fa" },
  { nome: "Oficina Mecânica", plano: "landing", modelo: true, c1: "#111827", c2: "#ef4444" },

  { nome: "Construtora", plano: "onepage", modelo: true, c1: "#243b53", c2: "#f0b429" },
  { nome: "Restaurante", plano: "onepage", modelo: true, c1: "#7f1d1d", c2: "#fb923c" },
  { nome: "Escola de Idiomas", plano: "onepage", modelo: true, c1: "#047857", c2: "#facc15" },

  { nome: "Clínica Odontológica", plano: "start", modelo: true, c1: "#0e7490", c2: "#67e8f9" },
  { nome: "Pet Shop", plano: "start", modelo: true, c1: "#6d28d9", c2: "#fcd34d" },

  { nome: "Agência de Turismo", plano: "avancado", modelo: true, c1: "#0369a1", c2: "#f97316" },
  { nome: "Engenharia", plano: "avancado", modelo: true, c1: "#334155", c2: "#38bdf8" },

  { nome: "Imobiliária", plano: "completo", modelo: true, c1: "#14532d", c2: "#4ade80" },
  { nome: "Loja de Moda", plano: "completo", modelo: true, c1: "#be185d", c2: "#fb7185" },

  { nome: "Loja Virtual", plano: "medida", modelo: true, c1: "#312e81", c2: "#f472b6" },
  { nome: "Sistema de Agendamento", plano: "medida", modelo: true, c1: "#0f172a", c2: "#22d3ee" }
];
