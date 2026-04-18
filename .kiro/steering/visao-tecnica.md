# Visão Técnica — web-math-ia (Vue.js)

## Papel no Sistema
Interface do usuário para interagir com o sistema mathIA.
Permite criar tarefas, ensinar a IA, acompanhar treinamentos, testar inferências
e conversar com o LLM (Qwen2.5) com suporte a múltiplos modos e fine-tuning via feedback.

## Stack
- Vue 3 (Composition API + `<script setup>`)
- Vue Router 4 (SPA, history mode)
- Pinia (gerenciamento de estado)
- Axios (HTTP client)
- Chart.js + vue-chartjs (gráficos de progresso)
- Vite 5 (build tool)
- Nginx (serve o build estático em produção)
- Docker multi-stage: `dev` (Vite HMR) e `prod` (Nginx)

## Arquitetura
```
Views (páginas)
  └── Components (reutilizáveis)
        └── Stores (Pinia — estado global)
              └── api.js (Axios instance)
                    └── api-math (Laravel gateway)
```

## Estrutura de Diretórios
```
src/
  views/
    LoginView.vue       # Autenticação
    TarefasView.vue     # Lista de missões (tarefas)
    EnsinarView.vue     # Enviar lições para uma tarefa
    ProgressoView.vue   # Gráfico de evolução do modelo ("Atributos")
    TestarView.vue      # Testar inferência ("Invocar")
    ChatView.vue        # Chat com LLM ("Consultar Entidade")
  components/
    TarefaCard.vue      # Card de tarefa com status RPG
    LicaoForm.vue       # Formulário de envio de lição
    InferenciaResult.vue # Resultado de predição com confiança
    ProgressoChart.vue  # Gráfico Chart.js de acurácia/perda
    LoadingSpinner.vue  # Spinner estilo RPG
    ErrorMessage.vue    # Alerta de erro padronizado
  stores/
    auth.js             # Autenticação (token no localStorage)
    tarefas.js          # Listar e criar tarefas
    licoes.js           # Enviar lições
    inferencia.js       # Executar predições
    progresso.js        # Histórico de treinamentos
    chat.js             # Mensagens, modos, feedback e fine-tuning
  services/
    api.js              # Axios configurado com interceptors
  router/
    index.js            # Definição de rotas
  App.vue               # Layout raiz (sidebar RPG + main panel)
  main.js               # Bootstrap da aplicação
```

## Rotas do Frontend
| Path | View | Descrição |
|------|------|-----------|
| `/login` | LoginView | Autenticação |
| `/` | TarefasView | Lista de tarefas (Missões) |
| `/ensinar/:tarefaId` | EnsinarView | Enviar lições para uma tarefa |
| `/progresso` | ProgressoView | Gráfico de evolução (Atributos) |
| `/testar` | TestarView | Testar inferência (Invocar) |
| `/chat` | ChatView | Chat com LLM (Consultar Entidade) |

## Stores (Pinia)
| Store | Responsabilidade |
|-------|-----------------|
| `auth` | Token JWT, login/logout |
| `tarefas` | Listar e criar tarefas |
| `licoes` | Enviar lições |
| `inferencia` | Executar predições |
| `progresso` | Histórico de treinamentos |
| `chat` | Mensagens, sessão, modos, feedback, stats, fine-tuning |

## Store de Chat — Detalhes
- `mensagens`: array de `{ id, role, texto, interacao_id, modo, feedback }`
- `modoAtual`: modo ativo (`chat`, `musica`, `resumo`, `codigo`, `criativo`, `professor`)
- `modos`: objeto com metadados dos modos (label, emoji, descricao) — carregado da API
- `sessaoId`: mantém continuidade da conversa; resetado ao trocar de modo
- `stats.interacoes_aprovadas`: contador de 👍 para exibir no badge "almas"
- `darFeedback(mensagemId, aprovado)`: envia feedback e atualiza stats
- `treinar()`: enfileira fine-tuning via `POST /chat/treinar`

## Comunicação com API
- Base URL: `VITE_API_URL` (`.env`) → `http://mathia-api.localhost/api`
- Interceptor de request: injeta `Authorization: Bearer {token}` do localStorage
- Interceptor de response: normaliza para `{ status, data, error }` e rejeita com shape padronizado
- Todas as chamadas passam pelo Laravel (api-math), nunca direto ao Python

## Design System (Tema RPG Grimório)
- Variáveis CSS globais em `App.vue`: `--gold`, `--bg-deep`, `--bg-card`, `--text-main`, etc.
- Classes utilitárias globais: `.rpg-btn`, `.rpg-input`, `.rpg-textarea`, `.rpg-panel`, `.rpg-badge`, `.rpg-alert`, `.rpg-spinner`, `.rpg-empty`
- Badges de status: `.rpg-badge--active` (verde), `.rpg-badge--done` (amarelo), `.rpg-badge--pending` (azul)
- Alertas: `.rpg-alert--error`, `.rpg-alert--success`, `.rpg-alert--info`
- Animações: `rpg-spin` (spinner), `rpg-bounce` (typing dots)

## Padrões Obrigatórios
- Composition API com `<script setup>` em todos os componentes
- Estado global apenas via Pinia — sem props drilling profundo
- Acessibilidade: `aria-label`, `role`, `aria-live` em elementos interativos
- Loading state e error state em todas as operações assíncronas
- Usar classes do design system RPG — não criar estilos ad-hoc para elementos já cobertos
- Manter terminologia RPG na UI: Missões, Atributos, Invocar, Consultar Entidade

## Variáveis de Ambiente
- `VITE_API_URL` — URL base da API Laravel (ex: `http://mathia-api.localhost/api`)

## Ambiente de Desenvolvimento

**Todos os comandos devem ser executados dentro do WSL (Ubuntu 24.04)**, não no terminal Windows.
- Acesso via: `wsl` no terminal ou distro `Ubuntu-24.04` no Windows Terminal
- Caminho dos projetos: `~/projetos_v2/IA/`
- Docker, Make e Git rodam dentro do WSL
- Nunca executar `make`, `docker compose` ou `git` diretamente no PowerShell/CMD

## Padrão de Gerenciamento de .env

**Fonte da verdade:** `k8s/envs/env.local` (versionado no git)

**Fluxo:**
1. `make up` / `make dev` copia `k8s/envs/env.local` → `src/.env` antes de subir o Docker
2. O `docker-compose.yml` usa `env_file: src/.env`
3. O Vite lê `src/.env` (prefixo `VITE_` exposto ao browser)
4. **Nunca editar `src/.env` diretamente** — ele é sempre regenerado pelo make

**Regras:**
- `src/.env` está no `.gitignore` — nunca commitar
- `k8s/envs/env.local` é o único arquivo de env a editar
- Para novos ambientes, criar `k8s/envs/env.staging`, `k8s/envs/env.production` etc.

## Modos de Execução
- `make dev` — Vite com hot-reload (porta 5173, via Traefik)
- `make up` — Build estático servido pelo Nginx (porta 80, via Traefik)
- URL de acesso: `http://mathia.localhost`
