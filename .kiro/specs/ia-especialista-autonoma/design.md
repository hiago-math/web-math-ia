# Design — IA Especialista Autônoma — web-math-ia

## Estrutura de Rotas

```
/especialidades                    → EspecialidadesView.vue  (listagem + criação)
/especialidades/:id                → EspecialidadeDetalheView.vue (abas)
/especialidades/:id/chat           → (aba dentro de EspecialidadeDetalheView)
```

---

## Árvore de Componentes

```
App.vue
  └── nav: item "Especialidades" com badge de perguntas pendentes

EspecialidadesView.vue
  ├── EspecialidadeCard.vue         — card com nome, confiança, fontes, status
  └── CriarEspecialidadeModal.vue   — modal de criação com validação inline

EspecialidadeDetalheView.vue
  ├── EspecialidadeHeader.vue       — nome, status, nível de confiança, botões
  └── EspecialidadeTabs.vue         — abas: Fontes | Progresso | Perguntas | Chat
       ├── [aba] FontesTab.vue
       │    ├── FonteCard.vue        — item da lista com status animado
       │    └── AdicionarFonteModal.vue — seletor de tipo + campos dinâmicos
       ├── [aba] ProgressoTab.vue
       │    ├── ConfiancaGauge.vue   — gauge circular SVG
       │    ├── ConceituosLista.vue  — top 10 dominados + top 10 lacunas
       │    ├── ProgressoChart.vue   — gráfico de linha semanal (reutiliza componente existente)
       │    └── SessoesHistorico.vue — tabela de sessões de estudo
       ├── [aba] PerguntasTab.vue
       │    ├── PerguntaCard.vue     — pergunta + contexto + campo de resposta
       │    └── PerguntasRespondidas.vue — histórico colapsável
       └── [aba] ChatEspecialistaTab.vue
            ├── (reutiliza lógica do ChatView.vue)
            ├── FontesCitadas.vue    — lista de fontes abaixo da resposta
            └── ConfiancaBadge.vue  — badge colorido com nível de confiança
```

---

## Store: `src/stores/especialista.js`

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useEspecialistaStore = defineStore('especialista', () => {
    // Estado
    const especialidades       = ref([])
    const especialidadeAtual   = ref(null)
    const fontes               = ref([])
    const perguntas            = ref([])
    const relatorio            = ref(null)
    const sessoes              = ref([])
    const loading              = ref(false)
    const loadingFontes        = ref(false)
    const error                = ref(null)
    const pollingInterval      = ref(null)

    // Computed
    const totalPerguntasPendentes = computed(() =>
        especialidades.value.reduce((acc, e) => acc + (e.perguntas_pendentes || 0), 0)
    )

    // Especialidades
    async function buscarEspecialidades() { ... }
    async function buscarEspecialidade(id) { ... }
    async function criarEspecialidade(dados) { ... }
    async function atualizarEspecialidade(id, dados) { ... }
    async function removerEspecialidade(id) { ... }

    // Fontes
    async function buscarFontes(especialidadeId) { ... }
    async function adicionarFonte(especialidadeId, dados) { ... }
    async function removerFonte(especialidadeId, fonteId) { ... }
    function iniciarPollingFontes(especialidadeId) {
        pollingInterval.value = setInterval(() => buscarFontes(especialidadeId), 5000)
    }
    function pararPollingFontes() {
        clearInterval(pollingInterval.value)
        pollingInterval.value = null
    }

    // Perguntas
    async function buscarPerguntas(especialidadeId) { ... }
    async function responderPergunta(especialidadeId, perguntaId, resposta) { ... }

    // Sessões e Relatório
    async function dispararSessaoEstudo(especialidadeId) { ... }
    async function buscarSessoes(especialidadeId) { ... }
    async function buscarRelatorio(especialidadeId) { ... }
    async function buscarHistoricoRelatorio(especialidadeId) { ... }

    return {
        especialidades, especialidadeAtual, fontes, perguntas,
        relatorio, sessoes, loading, loadingFontes, error,
        totalPerguntasPendentes,
        buscarEspecialidades, buscarEspecialidade, criarEspecialidade,
        atualizarEspecialidade, removerEspecialidade,
        buscarFontes, adicionarFonte, removerFonte,
        iniciarPollingFontes, pararPollingFontes,
        buscarPerguntas, responderPergunta,
        dispararSessaoEstudo, buscarSessoes,
        buscarRelatorio, buscarHistoricoRelatorio,
    }
})
```

---

## Extensão do `ChatStore` para Modo Especialista

```javascript
// src/stores/chat.js — campos e lógica novos

const especialidadeAtiva = ref(null)  // { id, nome, nivel_confianca_medio }

function ativarModoEspecialista(especialidade) {
    especialidadeAtiva.value = especialidade
    sessaoId.value = null  // nova sessão ao trocar de especialidade
}

function desativarModoEspecialista() {
    especialidadeAtiva.value = null
    sessaoId.value = null
}

// No método enviar() — adicionar ao payload:
// especialidade_id: especialidadeAtiva.value?.id || undefined

// Na resposta da IA — salvar campos extras:
// msg.fontes_citadas = res.data.fontes_citadas || []
// msg.nivel_confianca_topico = res.data.nivel_confianca_topico ?? null
```

---

## Componentes — Detalhes de Implementação

### `EspecialidadeCard.vue`
```vue
<!-- Props: especialidade: Object -->
<!-- Exibe: nome, descricao (truncada 80 chars), barra de progresso de confiança,
     badge de status, total de fontes, botão "Conversar" e link para detalhes -->
```

### `AdicionarFonteModal.vue`
```vue
<!-- Estado interno: tipoSelecionado, arquivo (File), url (string) -->
<!-- Tipos: pdf | url | youtube_video | youtube_canal | youtube_playlist -->
<!-- Para PDF: input type=file com accept=".pdf", drag-and-drop, limite 50MB -->
<!-- Para demais: input text com placeholder específico por tipo -->
<!-- Validação: URL deve começar com https://, arquivo deve ser .pdf -->
```

### `FonteCard.vue`
```vue
<!-- Props: fonte: Object -->
<!-- Status visual:
     pendente    → ⏳ cinza
     processando → 🔄 azul animado (spin)
     indexado    → ✅ verde + "X chunks"
     erro        → ❌ vermelho + tooltip com mensagem
     sem_transcricao → ⚠️ amarelo + tooltip "Transcrição não disponível" -->
```

### `ConfiancaGauge.vue`
```vue
<!-- Props: valor: Number (0-100), tamanho: String ('sm'|'md'|'lg') -->
<!-- SVG circular com gradiente: vermelho (0-30) → amarelo (30-70) → verde (70-100) -->
<!-- Exibe percentual no centro -->
```

### `ConfiancaBadge.vue`
```vue
<!-- Props: nivel: Number (0-100) -->
<!-- < 30  → badge vermelho "Confiança baixa: X%" -->
<!-- 30-69 → badge amarelo "Confiança média: X%" -->
<!-- ≥ 70  → badge verde "Confiança alta: X%" -->
```

### `FontesCitadas.vue`
```vue
<!-- Props: fontes: Array<{fonte_id, url_ou_nome, trecho_relevante}> -->
<!-- Seção colapsável "📚 Fontes consultadas (N)" -->
<!-- Cada item: ícone por tipo + nome/URL clicável + trecho em itálico -->
```

---

## Fluxo: Adicionar Fonte

```
Usuário clica "Adicionar Fonte"
    → Abre AdicionarFonteModal
    → Seleciona tipo (ex: youtube_video)
    → Preenche URL
    → Clica "Adicionar"
    → POST /api/especialidades/{id}/fontes
    → Fonte aparece na lista com status "Processando..." + spinner
    → Polling a cada 5s em GET /api/especialidades/{id}/fontes
    → Status muda para "indexado" → spinner vira ✅ + "34 chunks"
    → Polling para quando todas as fontes estiverem em estado final
```

---

## Fluxo: Chat Especialista

```
Usuário abre aba "Chat Especialista"
    → ChatStore.ativarModoEspecialista({ id, nome, nivel_confianca_medio })
    → Header exibe "🎓 Especialista: Mercado Financeiro | Confiança: 62%"
    → Usuário digita mensagem
    → Payload inclui especialidade_id
    → Resposta retorna fontes_citadas + nivel_confianca_topico
    → Badge de confiança exibido (verde/amarelo/vermelho)
    → Seção "Fontes consultadas" exibida abaixo da resposta
```

---

## Rotas da API Consumidas

| Método | Rota | Store / Componente |
|--------|------|--------------------|
| POST | /api/especialidades | `criarEspecialidade()` |
| GET | /api/especialidades | `buscarEspecialidades()` |
| GET | /api/especialidades/{id} | `buscarEspecialidade()` |
| PUT | /api/especialidades/{id} | `atualizarEspecialidade()` |
| DELETE | /api/especialidades/{id} | `removerEspecialidade()` |
| POST | /api/especialidades/{id}/fontes | `adicionarFonte()` |
| GET | /api/especialidades/{id}/fontes | `buscarFontes()` + polling |
| DELETE | /api/especialidades/{id}/fontes/{fid} | `removerFonte()` |
| GET | /api/especialidades/{id}/perguntas | `buscarPerguntas()` |
| POST | /api/especialidades/{id}/perguntas/{pid}/resposta | `responderPergunta()` |
| POST | /api/especialidades/{id}/estudar | `dispararSessaoEstudo()` |
| GET | /api/especialidades/{id}/sessoes | `buscarSessoes()` |
| GET | /api/especialidades/{id}/relatorio | `buscarRelatorio()` |
| GET | /api/especialidades/{id}/relatorio/historico | `buscarHistoricoRelatorio()` |
| POST | /api/chat | `ChatStore.enviar()` (com especialidade_id) |

---

## Alterações em Arquivos Existentes

| Arquivo | Alteração |
|---------|-----------|
| `src/App.vue` | Adicionar item "Especialidades" no nav com badge de perguntas pendentes |
| `src/router/index.js` | Adicionar rotas `/especialidades` e `/especialidades/:id` |
| `src/stores/chat.js` | Adicionar `especialidadeAtiva`, `ativarModoEspecialista()`, `desativarModoEspecialista()`, campos `fontes_citadas` e `nivel_confianca_topico` nas mensagens |
| `src/main.js` | Importar e registrar `useEspecialistaStore` se necessário para inicialização |
