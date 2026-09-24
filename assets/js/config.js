/*
 * ================================================================
 *  CONFIGURAÇÃO DO SITE — Martanii Figueiredo
 * ================================================================
 *  Edite SOMENTE este arquivo para trocar telefones, e-mail,
 *  endereço, redes sociais, dados de pagamento e moeda.
 *  Todas as páginas são atualizadas automaticamente.
 * ================================================================
 */
window.SITE = {
  nome: "Martanii Figueiredo",
  slogan: "Design & Desenvolvimento Web",

  // WhatsApp: somente números, com código do país + DDD (ex.: 5511999998888)
  whatsapp: "5500000000000",
  whatsappMensagem: "Olá! Tenho interesse em um projeto com a Martanii Figueiredo.",

  telefone: "+55 (00) 00000-0000",
  telefone2: "",                         // deixe vazio para ocultar
  email: "contato@martaniifigueiredo.com",
  emailFinanceiro: "financeiro@martaniifigueiredo.com",

  endereco: "Sua rua, 123 — Centro",
  cidade: "Sua cidade — UF, Brasil",
  mostrarMapa: true,                     // mapa do Google na página de contato

  horario: "Segunda a sexta, das 8h às 18h",

  redes: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: ""                         // deixe vazio para ocultar
  },

  // Moeda usada em todos os preços do site
  moeda: "BRL",                          // ex.: "BRL", "PYG", "USD"
  locale: "pt-BR",

  // Dados para pagamento (página Formas de Pagamento)
  pagamento: {
    pixChave: "seu-email-ou-cnpj@pix",
    pixTipo: "E-mail",
    banco: "Nome do Banco",
    agencia: "0000",
    conta: "00000-0",
    titular: "Martanii Figueiredo",
    documento: "CPF/CNPJ 00.000.000/0000-00",
    parcelamento: "em até 12x no cartão"
  },

  // Opcional: endpoint de formulário (ex.: https://formspree.io/f/xxxx).
  // Se vazio, o formulário de contato abre o WhatsApp com a mensagem pronta.
  formEndpoint: ""
};
