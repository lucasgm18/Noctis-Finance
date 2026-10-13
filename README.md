<div align="center">
  <img src="public/noctis-logo.svg" alt="Noctis Logo" width="110" height="110" style="border-radius: 28px;" />
  <br />
  <br />
  <h1>🦉 Noctis — Guardião Financeiro Pessoal</h1>
  <p><strong>A experiência definitiva de gestão orçamentária, planejamento de patrimônio e controle de fluxo de caixa em tempo real.</strong></p>
  <p>Construído para quem busca clareza mental, controle absoluto e estética de ponta — sem anúncios, sem dados vendidos e sem burocracia.</p>

  <p>
    <a href="#-por-que-o-noctis">Por que o Noctis?</a> •
    <a href="#-principais-funcionalidades">Funcionalidades</a> •
    <a href="#-a-filosofia-dos-5-pilares">Os 5 Pilares</a> •
    <a href="#-design-system--paleta-de-cores">Design System</a> •
    <a href="#-arquitetura--stack">Tecnologias</a> •
    <a href="#-como-rodar-localmente">Instalação</a> •
    <a href="#-deploy-na-vercel">Deploy</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-6E44FF?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Realtime" />
    <img src="https://img.shields.io/badge/PWA-Ready-5A32E6?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready" />
    <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge" alt="MIT License" />
  </p>
</div>

---

## 💡 Por que o Noctis?

A maioria dos aplicativos de finanças pessoais sofre dos mesmos problemas: conexões bancárias instáveis que expõem seus dados bancários, interfaces cheias de propagandas de empréstimos, cobranças de assinaturas mensais abusivas e formulários lentos que desestimulam o uso no dia a dia.

O **Noctis** foi desenhado sob uma premissa diferente: **gestão financeira consciente, direta e bela**. 

Inspirado no visual escandinavo do *FinWise UI Kit*, ele combina o aconchego de uma paleta **Bege Creme** com a sofisticação do **Roxo Profundo** e um **Dark Mode** projetado para uso noturno confortável. 

Cada lançamento alimenta instantaneamente seu próprio banco **PostgreSQL no Supabase**, sincronizando seu computador e celular em milissegundos via WebSockets.

---

## ✨ Principais Funcionalidades

### ⚡ Sincronização em Tempo Real (Supabase Realtime WebSockets)
- Registre uma despesa no celular enquanto está na rua e veja a interface atualizar automaticamente no monitor do seu computador sem precisar recarregar a página.
- Banco de dados relacional dedicado na nuvem com isolamento completo e integridade referencial.

### 📱 PWA Nativa (Mobile & Desktop First)
- **Instalação Instantânea:** Instale como aplicativo nativo diretamente pelo navegador no **iPhone (iOS Safari)** ou no **Android (Google Chrome)**, sem passar por lojas de aplicativos.
- **Layout Fluido:**
  - **No Celular:** Cabeçalho imersivo com leitura instantânea do Saldo Líquido, barra de progresso do orçamento mensal, gaveta de notificações e **Bottom Navigation Bar** flutuante ergonômica com botão de ação centralizado.
  - **No Desktop:** Navegação ampla via Sidebar lateral com atalhos de produtividade e um espaçoso **Bento Grid** que aproveita toda a resolução do monitor.

### 🏛️ A Filosofia dos 5 Pilares Estratégicos
Em vez de um emaranhado de centenas de tags sem sentido, o Noctis estrutura sua saúde financeira em 5 categorias macro claras:

| Pilar | Propósito | Exemplo de Despesas |
| :--- | :--- | :--- |
| 🏠 **Fixo & Moradia** | Custos mandatórios para manter a vida funcionando | Aluguel, condomínio, luz, água, internet |
| 🛒 **Conforto & Rotina** | Despesas cotidianas de suporte ao estilo de vida | Supermercado, cuidados com pets, combustível, farmácia |
| ☕ **Lazer & Desejos** | O que traz alegria e descanso sem peso na consciência | Restaurantes, passeios, delivery, cinema, hobbies |
| 🎯 **Planos Futuros** | Projetos com prazo definido e metas de médio alcance | Viagens de férias, cursos, eletrônicos, reformas |
| 🛡️ **Liberdade & Reserva** | Construção patrimonial e blindagem contra imprevistos | Aportes mensais e meta da Reserva de Emergência |

*Crie e edite subcategorias ilimitadas dentro de cada pilar, estabelecendo tetos orçamentários personalizados com alerta visual de estouro.*

### 📊 Análise Gráfica & Calendário Financeiro
- **Gráfico Donut Interativo (Recharts):** Distribuição percentual visual dos seus custos entre os pilares, com cartões de legenda detalhados.
- **Extrato Agrupado por Mês:** Filtre por receitas, despesas, valores pendentes ou aportes guardados com busca instantânea.
- **Calendário de Vencimentos:** Identifique facilmente os dias de maior concentração de boletos e dê baixa com um toque no botão "Pagar".

### 🔒 Noctis Safe Vault & Biometria
- Bloqueio biométrico via WebAuthn nativo (**Touch ID, Face ID ou impressão digital** do aparelho) para garantir privacidade total.
- Botão de bloqueio rápido para quando você precisar se ausentar do computador.

### 🔔 Alertas & Canais de Notificação
- **Web Push Nativo:** Receba notificações de contas a vencer na tela do celular ou computador mesmo com o aplicativo fechado.
- **Lembretes por E-mail:** Disparo programado de vencimentos diretamente na sua caixa de entrada.

### 🌓 Tema Escuro Cinematográfico (Noctis Dark Mode)
- Alternância rápida com 1 clique (Sol / Lua) disponível no topo, na sidebar e nas configurações.
- Paleta noturna com contraste balanceado (`#0F0B1A`, `#1A142D` e `#7C5CFF`), sem agressão visual aos olhos.

---

## 🎨 Design System & Paleta de Cores

O Noctis adota uma identidade visual elegante, translúcida (*Glassmorphism*) e acolhedora:

```
Tema Claro (Bege & Roxinho):
├─ Roxo Principal:     #6E44FF (Hover: #5A32E6)
├─ Lavanda Suave:      #E5DEFF
├─ Fundo Base:         #F7F2E7 (Bege Creme)
├─ Superfícies/Cards:  #FCF9F2 e #EDE5D5 (Bordas: #DFD5C3)
└─ Tipografia:         #231942 (Primário) e #655A7C (Secundário)

Noctis Dark Mode:
├─ Fundo Noturno Base: #0F0B1A
├─ Superfícies/Cards:  #1A142D (Bordas: #322653)
├─ Inputs & Badges:    #241C3D
├─ Destaque Roxo:      #7C5CFF
└─ Tipografia Clara:   #F7F2E7 e #A69BB8

Cores Semânticas:
├─ Entradas / Economia: #1F9D73 (Esmeralda)
├─ Saídas / Dívidas:    #E0533C (Coral Carmim)
└─ Avisos / Pendências: #D97706 (Âmbar)
```

---

## 🛠️ Arquitetura & Stack Tecnológica

- **Frontend Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com utilitários de glassmorphism e container queries
- **Gráficos:** [Recharts](https://recharts.org/) com donuts responsivos e tooltips customizadas
- **Ícones:** [Lucide Icons](https://lucide.dev/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Banco de Dados & Realtime:** [Supabase](https://supabase.com/) (PostgreSQL 15 + WebSockets Realtime Channel)
- **PWA & Service Worker:** `vite-plugin-pwa` com suporte a Workbox e cache offline
- **Build Tool:** [Vite](https://vitejs.dev/)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes `npm`, `pnpm` ou `yarn`

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/lucasgm18/Noctis-Finance.git
   cd Noctis-Finance
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Copie o modelo de exemplo:
   ```bash
   cp .env.example .env
   ```
   Preencha o `.env` com suas credenciais do projeto no Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

5. **Gerar Build de Produção:**
   ```bash
   npm run build
   ```

---

## ☁️ Deploy na Vercel

O Noctis já vem configurado de fábrica com [vercel.json](vercel.json) para roteamento de Single Page Application (SPA).

1. Conecte o repositório na [Vercel](https://vercel.com/new).
2. Adicione as variáveis de ambiente em **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Clique em **Deploy**.
4. Acesse a URL gerada pelo celular e clique em **"Adicionar à Tela Inicial"** para instalar o PWA nativo!

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <sub>Desenvolvido com foco em alta performance, privacidade financeira e design excepcional.</sub>
</div>
