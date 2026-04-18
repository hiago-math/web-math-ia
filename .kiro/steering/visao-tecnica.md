# Visão Técnica — web-math-ia (Vue.js)

## Papel no Sistema
Interface do usuário para interagir com o sistema mathIA.
Permite criar tarefas, ensinar a IA, acompanhar treinamentos e conversar com o modelo.

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
  views/          # Páginas roteadas
  components/     # Componentes reutilizáveis
  stores/         # Pinia stores (um por domínio)
  services/
    api.js        # Axios configurado com interceptors
  router/
    index.js      # Definição de rotas
  App.vue         # Layout raiz + nav
  main.js         # Bootstrap da aplicação
```

## Rotas do Frontend
| Path | View | Descrição |
|------|------|-----------|
| `/` | TarefasView | Lista de tarefas |
| `/ensinar/:tarefaId` | EnsinarView | Enviar lições para uma tarefa |
| `/progresso` | ProgressoView | Gráfico de evolução do modelo |
| `/testar` | TestarView | Testar inferência manualmente |
| `/chat` | ChatView | Chat interativo com a IA |

## Stores (Pinia)
| Store | Responsabilidade |
|-------|-----------------|
| `tarefas` | Listar e criar tarefas |
| `licoes` | Enviar lições |
| `inferencia` | Executar predições |
| `progresso` | Histórico de treinamentos |
| `chat` | Mensagens e estado do chat |

## Comunicação com API
- Base URL: `VITE_API_URL` (`.env`) → `http://mathia-api.localhost/api`
- Interceptor de request: injeta `Authorization: Bearer {token}` do localStorage
- Interceptor de response: normaliza erros para `{ status, data, error }`
- Todas as chamadas passam pelo Laravel (api-math), nunca direto ao Python

## Padrões Obrigatórios
- Composition API com `<script setup>` em todos os componentes
- Estado global apenas via Pinia — sem props drilling profundo
- Acessibilidade: `aria-label`, `role`, `aria-live` em elementos interativos
- Loading state e error state em todas as operações assíncronas
- Componentes `LoadingSpinner` e `ErrorMessage` para estados de UI

## Variáveis de Ambiente
- `VITE_API_URL` — URL base da API Laravel (ex: `http://mathia-api.localhost/api`)

## Modos de Execução
- `make dev` — Vite com hot-reload (porta 5173, via Traefik)
- `make up` — Build estático servido pelo Nginx (porta 80, via Traefik)
- URL de acesso: `http://mathia.localhost`
