#!/usr/bin/env bash
set -e

REPO="lucasgm18/Noctis-Finance"

echo "==> Verificando autenticação no GitHub CLI..."
if ! gh auth status &>/dev/null; then
  echo "ERRO: O gh CLI não está autenticado. Rode 'gh auth login' antes de executar este script."
  exit 1
fi

echo "==> Criando labels personalizadas no repositório $REPO..."
create_label() {
  local name="$1"
  local color="$2"
  local desc="$3"
  gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" --force 2>/dev/null || true
}

create_label "scalability" "6E44FF" "Gargalos de escala e performance"
create_label "performance" "FF6B6B" "Otimização de tempo de carregamento e bundle"
create_label "architecture" "4D96FF" "Refatoração arquitetural e desacoplamento"
create_label "database" "3ECF8E" "Queries, índices e integridade no PostgreSQL"
create_label "pwa" "9B51E0" "Recursos nativos PWA e offline"
create_label "testing" "6BCB77" "Cobertura de testes automatizados"
create_label "ci-cd" "FFD93D" "Pipelines de integração contínua"
create_label "ready-for-agent" "00C9A7" "Issue detalhada e pronta para execução por IA"
create_label "urgency:5" "B00020" "Urgência Crítica (5/5)"
create_label "urgency:4" "E0533C" "Urgência Alta (4/5)"
create_label "urgency:3" "D97706" "Urgência Média (3/5)"
create_label "effort:1" "2ECC71" "Esforço 1/5 - Quick Win (< 1h)"
create_label "effort:2" "27AE60" "Esforço 2/5 - Simples (1-3h)"
create_label "effort:3" "F39C12" "Esforço 3/5 - Médio (Meio dia a 1 dia)"
create_label "effort:4" "E67E22" "Esforço 4/5 - Alto (Vários dias)"

echo "==> Criando Issue 1: Code-Splitting e Lazy Loading de Telas e Recharts..."
gh issue create --repo "$REPO" \
  --title "[Performance | Urgência: 4/5 | Esforço: 2/5] Code-Splitting e Lazy Loading de Telas e Recharts (Bundle 1.87MB)" \
  --label "performance" --label "scalability" --label "urgency:4" --label "effort:2" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
O bundle de produção do Noctis atualmente gera um único arquivo JavaScript monolítico de **1.87 MB** (503 KB gzipped) em `dist/assets/index-*.js`. Isso ocorre porque todas as telas e a biblioteca completa do Recharts (`d3-shape`, `d3-interpolate`, etc.) são importadas estaticamente na raiz de `App.tsx`.

- **Arquivos afetados:** `src/App.tsx`, `src/views/AnalysisView.tsx`
- **Diagnóstico:** Em dispositivos móveis com conexões 3G/4G, baixar e processar 1.87 MB de JS no primeiro acesso gera First Contentful Paint (FCP) lento e alto consumo de memória.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 4/5 (Impacta diretamente a experiência inicial de instalação do PWA no celular)
- **🛠️ Esforço de Implementação:** 2/5 (Quick Win direto com `React.lazy()` e `Suspense`)

---

## 🎯 O que deve ser feito
1. Converter os imports estáticos de `AnalysisView`, `CategoriesView`, `TransactionsView`, `SettingsView`, `AddTransactionModal` e `NotificationDrawer` em imports dinâmicos via `React.lazy()`.
2. Envolver a renderização das telas com `<Suspense fallback={<ViewSkeleton />}>`.
3. Configurar no `vite.config.ts` divisão de chunks manuais (`manualChunks`) para separar `recharts` e `vendor` da aplicação core.

---

## ✅ Critérios de Aceitação
- [ ] O chunk inicial do `index.html` passa de ~1.87 MB para menos de 300 KB.
- [ ] As telas de Análise e Extrato carregam sob demanda sem piscar a interface.
- [ ] O `npm run build` compila sem o aviso de `Some chunks are larger than 500 kB`.
EOF
)"

echo "==> Criando Issue 2: Optimistic UI Updates e Eliminar Refetch Triplo nas Mutações..."
gh issue create --repo "$REPO" \
  --title "[Database | Urgência: 5/5 | Esforço: 2/5] Optimistic UI Updates e Eliminação do Refetch Triplo nas Mutações" \
  --label "database" --label "scalability" --label "urgency:5" --label "effort:2" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
Em `FinanceContext.tsx`, todas as operações de mutação (`togglePaid`, `addTransaction`, `deleteTransaction`, `addSubCategory`, `deleteSubCategory`) executam a operação no Supabase e imediatamente invocam `await refreshFromSupabase()`. 

- **Arquivos afetados:** `src/context/FinanceContext.tsx:L316-L329`
- **Diagnóstico:** `refreshFromSupabase()` executa três queries simultâneas (`fetchSubcategories`, `fetchTransactions`, `fetchUserSettings`). Dar baixa em uma conta de R$ 10,00 dispara 3 queries HTTP completas, gerando latência perceptível e consumo desnecessário de egress no Supabase.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 5/5 (Gargalo de UX diária e desperdício de requisições)
- **🛠️ Esforço de Implementação:** 2/5 (Ajuste de estado local reativo antes do retorno da Promise)

---

## 🎯 O que deve ser feito
1. Aplicar atualizações otimistas no estado do React antes de aguardar o Supabase.
2. Atualizar apenas o item modificado no array em memória em vez de refazer o download de todo o banco.
3. Adicionar rollback do estado local caso a chamada de rede ao Supabase retorne erro.

---

## ✅ Critérios de Aceitação
- [ ] O botão "Pagar / Dar Baixa" responde instantaneamente (< 16ms) na tela.
- [ ] O número de requisições de leitura por mutação cai de 3 queries para 0.
- [ ] Se o banco rejeitar a transação, o estado anterior é restaurado e uma notificação de erro é exibida.
EOF
)"

echo "==> Criando Issue 3: Desacoplamento do Mega-Context (FinanceContext 830+ linhas)..."
gh issue create --repo "$REPO" \
  --title "[Architecture | Urgência: 4/5 | Esforço: 3/5] Desacoplamento do Mega-Context (FinanceContext de 830+ linhas)" \
  --label "architecture" --label "scalability" --label "urgency:4" --label "effort:3" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
O arquivo `src/context/FinanceContext.tsx` concentra atualmente mais de 830 linhas de código e gerencia simultaneamente:
- Estado de UI (aba ativa, modo responsivo/simulador, tema escuro, modais abertos, lock biométrico)
- Estado de dados (transações, subcategorias, configurações, pilares)
- Lógica de sincronização e WebSockets Realtime
- Métricas calculadas (`totalIncome`, `totalPaidExpenses`, `pillarBudgets`, etc.)

- **Arquivos afetados:** `src/context/FinanceContext.tsx`, `src/App.tsx`, componentes consumidores
- **Diagnóstico:** Qualquer mudança em um estado volátil (como abrir o modal de lançamento ou mudar de aba) re-renderiza todos os componentes consumidores da árvore, prejudicando a fluidez e a autonomia dos módulos.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 4/5 (Dificulta manutenção e gera re-renders contínuos no mobile)
- **🛠️ Esforço de Implementação:** 3/5 (Refatoração de seams de arquitetura)

---

## 🎯 O que deve ser feito
1. Criar `UIContext` dedicado para abas, modais, tema e simulador.
2. Manter no `FinanceDataContext` estritamente os dados de transações, categorias e sincronização com Supabase.
3. Isolar os seletores calculados via hooks com memoização refinada (`useFinanceMetrics()`).

---

## ✅ Critérios de Aceitação
- [ ] Alterar o tema ou abrir um modal não re-renderiza o gráfico de pizza nem a lista de transações.
- [ ] `FinanceContext.tsx` é reduzido a submódulos com menos de 250 linhas cada.
- [ ] Todos os testes e tipos de TypeScript continuam 100% íntegros.
EOF
)"

echo "==> Criando Issue 4: Paginação Temporal no Extrato e Lazy Loading de Transações Antigas..."
gh issue create --repo "$REPO" \
  --title "[Database | Urgência: 4/5 | Esforço: 3/5] Paginação Temporal no Extrato e Lazy Loading de Transações Antigas" \
  --label "database" --label "scalability" --label "urgency:4" --label "effort:3" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
A query `supabase.from('transactions').select('*').order('created_at', { ascending: false })` busca todas as transações cadastradas de uma só vez sem limite ou filtro temporal.

- **Arquivos afetados:** `src/context/FinanceContext.tsx:L279`, `src/views/TransactionsView.tsx`
- **Diagnóstico:** À medida que o usuário acumula anos de uso, a quantidade de registros cresce indefinidamente, aumentando o tempo de transferência, o uso de memória do navegador e o custo de renderização do DOM.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 4/5 (Gargalo direto com o crescimento da base de dados)
- **🛠️ Esforço de Implementação:** 3/5 (Ajuste da query e do seletor de meses)

---

## 🎯 O que deve ser feito
1. Alterar o carregamento inicial para buscar apenas as transações do ano/mês vigente ou últimos 90 dias (`gte('due_date', ...)`) com limite inicial de 100 itens.
2. Carregar meses históricos sob demanda quando o usuário selecionar um mês específico no filtro de meses.
3. Adicionar índices no PostgreSQL para `due_date` e `macro_pillar`.

---

## ✅ Critérios de Aceitação
- [ ] O carregamento inicial baixa apenas registros do período atual.
- [ ] Navegar para meses anteriores carrega os dados com indicador de loading discreto.
- [ ] A performance em celulares permanece estável mesmo com centenas de transações.
EOF
)"

echo "==> Criando Issue 5: Offline Write-Queue com IndexedDB para Resiliência PWA..."
gh issue create --repo "$REPO" \
  --title "[PWA | Urgência: 3/5 | Esforço: 3/5] Fila de Escrita Offline (Write-Queue com IndexedDB) para o PWA" \
  --label "pwa" --label "resilience" --label "urgency:3" --label "effort:3" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
Como PWA instalada no celular, o usuário frequentemente utiliza o Noctis em locais com conectividade intermitente (garagens subterrâneas, elevadores, viagens). Se uma transação for criada sem conexão à internet, a chamada ao Supabase falha com erro de rede.

- **Arquivos afetados:** `src/context/FinanceContext.tsx`, `src/lib/supabase.ts`
- **Diagnóstico:** O cache atual no `localStorage` é somente de leitura/espelho e não enfileira mutações de escrita pendentes para envio posterior.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 3/5 (Recurso essencial para consolidar a confiabilidade de aplicativo nativo)
- **🛠️ Esforço de Implementação:** 3/5 (Criação de fila de sincronização com IndexedDB)

---

## 🎯 O que deve ser feito
1. Implementar uma fila de mutações pendentes (`offlineQueue`) no IndexedDB.
2. Quando a conexão com a internet cair, salvar a transação localmente com flag `sync_pending: true`.
3. Escutar o evento `window.addEventListener('online', ...)` e esvaziar a fila, sincronizando com o Supabase com retry exponencial.

---

## ✅ Critérios de Aceitação
- [ ] Criar um lançamento em Modo Avião funciona sem erros na UI.
- [ ] O SyncBadge exibe o estado "🟡 Pendente de Sincronização".
- [ ] Ao reconectar à internet, os dados são automaticamente persistidos no Supabase.
EOF
)"

echo "==> Criando Issue 6: Suíte de Testes Automatizados com Vitest para Cálculos Financeiros..."
gh issue create --repo "$REPO" \
  --title "[Testing | Urgência: 4/5 | Esforço: 2/5] Suíte de Testes Automatizados com Vitest para Cálculos Financeiros" \
  --label "testing" --label "reliability" --label "urgency:4" --label "effort:2" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
O projeto atualmente possui zero testes unitários ou de integração (`package.json` possui apenas `tsc` e `oxlint`). Em uma aplicação financeira, qualquer erro de aritmética ou regressão em lógica de datas pode exibir saldos errados ou status de vencimento incorretos.

- **Arquivos afetados:** `src/utils/formatters.ts`, `src/context/FinanceContext.tsx`
- **Diagnóstico:** Cálculos como `realFreeSavings`, divisão percentual do orçamento FinWise, parcelamento `currentInstallment / totalInstallments` e formatação monetária BR precisam de cobertura à prova de falhas.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 4/5 (Confiabilidade e prevenção de bugs em valores em R$)
- **🛠️ Esforço de Implementação:** 2/5 (Configuração do Vitest e testes em funções puras)

---

## 🎯 O que deve ser feito
1. Instalar `vitest` e `@testing-library/react`.
2. Criar testes unitários para:
   - `formatCurrency` e `formatDateBR`
   - `getDueStatus` (vencido, vence hoje, em aberto)
   - Agrupamento mensal e cálculo de balanço
   - Mapeamento de dados DB <-> App
3. Adicionar script `"test": "vitest run"` no `package.json`.

---

## ✅ Critérios de Aceitação
- [ ] Comando `npm test` executa suíte de testes em menos de 2 segundos.
- [ ] 100% das funções utilitárias e de cálculo financeiro cobertas por testes.
EOF
)"

echo "==> Criando Issue 7: Versionamento de Schema e Migrations SQL do Supabase..."
gh issue create --repo "$REPO" \
  --title "[Database | Urgência: 3/5 | Esforço: 1/5] Versionamento do Schema PostgreSQL e Migrations do Supabase" \
  --label "database" --label "ci-cd" --label "urgency:3" --label "effort:1" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
As tabelas `subcategories`, `transactions` e `user_settings` foram criadas manualmente no painel web do Supabase. O repositório não possui nenhum arquivo SQL versionado para recriar o banco ou auditar alterações.

- **Arquivos afetados:** `supabase/migrations/` (novo diretório)
- **Diagnóstico:** Sem migrações rastreadas em Git, qualquer necessidade de recriar o banco, rodar testes ou criar ambientes de staging exige reescrever o schema do zero.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 3/5 (Boa prática essencial de DevOps e governança de dados)
- **🛠️ Esforço de Implementação:** 1/5 (Quick Win trivial de documentação e DDL)

---

## 🎯 O que deve ser feito
1. Criar o arquivo `supabase/migrations/20261014000000_init_noctis_schema.sql`.
2. Incluir o DDL de criação das 3 tabelas com constraints de chave primária, tipos corretos e índices.
3. Documentar as regras de RLS (Row Level Security) e habilitar realtime nas tabelas.

---

## ✅ Critérios de Aceitação
- [ ] Arquivo SQL funcional na pasta `supabase/migrations/`.
- [ ] Um comando simples de SQL recria toda a estrutura do Noctis perfeitamente.
EOF
)"

echo "==> Criando Issue 8: GitHub Actions Workflow para Lint, Typecheck e Build (CI)..."
gh issue create --repo "$REPO" \
  --title "[CI-CD | Urgência: 3/5 | Esforço: 1/5] GitHub Actions Workflow para Lint, Typecheck e Build (CI)" \
  --label "ci-cd" --label "automation" --label "urgency:3" --label "effort:1" --label "ready-for-agent" \
  --body "$(cat <<'EOF'
## 📋 Resumo & Contexto
Atualmente, qualquer commit direto ou Pull Request pode quebrar o build de produção sem aviso prévio caso contenha erros de TypeScript ou lint não verificados localmente.

- **Arquivos afetados:** `.github/workflows/ci.yml` (novo arquivo)
- **Diagnóstico:** A ausência de uma esteira de CI no GitHub permite que regressões sejam enviadas diretamente para a branch `main`, afetando o deploy na Vercel.

---

## ⚖️ Classificação de Prioridade
- **🚨 Urgência:** 3/5 (Garante a integridade automática de cada alteração)
- **🛠️ Esforço de Implementação:** 1/5 (Configuração direta de GitHub Actions)

---

## 🎯 O que deve ser feito
1. Criar o workflow `.github/workflows/ci.yml`.
2. Configurar etapas:
   - Checkout do código
   - Setup Node.js 22 com cache de dependências
   - `npm ci`
   - `npm run lint` (Oxlint)
   - `npm run build` (tsc + vite)
3. Disparar em push e pull_request para a branch `main`.

---

## ✅ Critérios de Aceitação
- [ ] Workflow executa automaticamente no GitHub em menos de 1 minuto.
- [ ] Badges de build verde no repositório.
EOF
)"

echo "==> Todas as 8 issues foram criadas com sucesso no repositório $REPO!"
