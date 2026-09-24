# Site Martanii Figueiredo

Site institucional de **Martanii Figueiredo — Design & Desenvolvimento Web**.
Site estático (HTML, CSS e JavaScript puro): não precisa de instalação nem de servidor especial.

## Páginas

| Página | Arquivo |
|---|---|
| Início | `index.html` |
| Sobre | `sobre.html` |
| Serviços › Desenvolvimento Web (planos) | `desenvolvimento-web.html` |
| Serviços › Social Media (planos mensal/trimestral/semestral/anual) | `social-media.html` |
| Serviços › Criação de Logo (planos) | `criacao-de-logo.html` |
| Serviços › Google Ads (planos) | `google-ads.html` |
| Serviços › Meta Ads (planos) | `meta-ads.html` |
| Serviços › E-mail Marketing (planos) | `email-marketing.html` |
| Formas de Pagamento | `formas-de-pagamento.html` |
| Portfólio (filtro por plano + “ver mais”) | `portfolio.html` |
| Contato (formulário + mapa) | `contato.html` |
| Página não encontrada | `404.html` |

Todas as páginas compartilham o mesmo menu, rodapé, faixa “Ficou com alguma dúvida?” e o
chat online com WhatsApp. Eles são montados automaticamente por `assets/js/main.js`.

## Como personalizar

### 1. Contatos, redes sociais, pagamento e moeda
Edite **somente** `assets/js/config.js`. Telefone, WhatsApp, e-mail, endereço, horário,
Instagram/Facebook/LinkedIn, dados de PIX e conta bancária e moeda são aplicados em todas as páginas.

- `whatsapp`: apenas números, com código do país e DDD (ex.: `5511999998888`).
- `moeda`: `"BRL"` (Real). Para Guaranis use `"PYG"` e `locale: "es-PY"`.
- `formEndpoint`: opcional. Se vazio, o formulário de contato abre o WhatsApp com a mensagem pronta.
  Para receber por e-mail, crie um formulário grátis no [Formspree](https://formspree.io) e cole a URL aqui.

### 2. Preços dos planos
Em cada página de serviço, procure `data-price="..."` e troque o número (sem pontos).
O valor exibido é formatado automaticamente na moeda escolhida.
Nos planos mensais, o desconto de cada período fica nos botões `data-discount` (5%, 10%, 15%).

### 3. Textos
Os textos estão direto no HTML de cada página. **Revise todos antes de publicar**
(prazos, itens inclusos nos planos, condições de pagamento).

### 4. Portfólio
Os cartões do portfólio são *modelos de layout* ilustrativos. Para adicionar trabalhos reais,
siga as instruções no comentário dentro de `portfolio.html` (trocar a ilustração por uma imagem
em `assets/img/portfolio/` e colocar o link do site do cliente).

### 5. Logo
A marca “MF” está em `assets/img/logo.svg` / `favicon.svg` e é desenhada em `brandMark()` no
`assets/js/main.js`. Se você já tiver uma logo, substitua esses pontos.

## Ver no computador
Abra o `index.html` no navegador ou, na pasta do projeto, rode:

```bash
python3 -m http.server 8000
# e acesse http://localhost:8000
```

## Publicar
Qualquer hospedagem de sites estáticos funciona: basta enviar todos os arquivos.
- **GitHub Pages:** Settings › Pages › Deploy from a branch › `main` / `(root)`.
- **Vercel / Netlify:** importe o repositório; não há comando de build.
- **Hospedagem tradicional (cPanel):** envie os arquivos para `public_html`.

Ícones desenhados no estilo [Lucide](https://lucide.dev) (licença ISC). Fontes: Poppins e Inter (Google Fonts).
