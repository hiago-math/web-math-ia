# Regras de Negócio — web-math-ia (Vue.js)

## Domínio
Interface com tema visual RPG/grimório para o ciclo completo de ensino de IA:
criar tarefa → enviar lições → treinar → testar → conversar com o LLM.

## Tema Visual (RPG Grimório)
- Paleta escura com dourado (`--gold: #c9a84c`) sobre fundo quase preto (`--bg-deep: #0d0b08`)
- Fontes: `Cinzel Decorative` (títulos), `Cinzel` (labels/menus), `IM Fell English` (corpo)
- Terminologia RPG: Tarefas = "Missões", Progresso = "Atributos", Testar = "Invocar", Chat = "Consultar"
- Sidebar estilo "Painel do Personagem" com avatar, menu e stats rápidos
- Componentes com bordas octagonais (`clip-path`), cantos ornamentais e divisores com `✦`

## Fluxo Principal do Usuário

### 1. Criar Tarefa (Missão)
- Usuário define nome e descrição do problema a ser aprendido
- Tarefa criada via `POST /api/tarefas`
- Aparece na lista da TarefasView com status `pendente`

### 2. Ensinar (Enviar Lições)
- Usuário acessa `/ensinar/:tarefaId`
- Preenche `entrada` e `saida_esperada` em formato JSON
- Mínimo de 2 lições necessárias para habilitar treinamento
- Exemplos válidos:
  - Entrada: `[1, 0]` → Saída: `[1]`
  - Entrada: `[0, 0]` → Saída: `[0]`

### 3. Treinar
- Disponível após 2+ lições cadastradas
- Parâmetros: `epocas` (default 10) e `batch_size` (default 32)
- Processo assíncrono — retorna `sessao_id` imediatamente
- Progresso acompanhado na ProgressoView ("Atributos")

### 4. Testar / Invocar (TestarView)
- Seleciona tarefa treinada
- Insere entrada JSON
- Visualiza predição e confiança (0–100%)

### 5. Chat / Consultar (ChatView)
- Interface conversacional com o LLM (Qwen2.5)
- Seletor de modos em abas: 💬 Chat, 🎵 Música, 📄 Resumo, 💻 Código, ✍️ Criativo, 🎓 Professor
- Digita mensagem de texto livre (não JSON)
- `Enter` envia mensagem; `Shift+Enter` quebra linha
- Histórico da conversa mantido na sessão (limpo ao trocar de modo)
- Feedback por mensagem: 👍 (aprova para treino) / 👎 (rejeita)
- Badge "✦ N almas" exibe total de interações aprovadas
- Botão "🧠 Treinar" enfileira fine-tuning com interações aprovadas (mínimo 5)

## Regras de UI

### Validação de Formulários
- Campos JSON validados com `JSON.parse()` antes de enviar
- Erro exibido inline se JSON inválido
- Botões desabilitados durante loading

### Estados de Componentes
- `loading`: spinner `⟳` visível, botão desabilitado
- `error`: alerta `.rpg-alert--error` com mensagem
- `sucesso`: alerta `.rpg-alert--success`, formulário limpo

### Chat
- Mensagens do usuário: alinhadas à direita, fundo dourado sutil
- Respostas da IA: alinhadas à esquerda, fundo `--bg-card`
- Animação de "digitando" (3 pontos pulsantes) enquanto aguarda resposta
- Scroll automático para última mensagem
- Feedback desabilitado após primeira interação por mensagem

## Acessibilidade
- Todos os formulários com `aria-label` e `aria-required`
- Mensagens de erro com `role="alert"` e `aria-live="assertive"`
- Listas de resultados com `role="list"` e `role="listitem"`
- Chat com `role="log"` e `aria-live="polite"`
- Seletor de modos com `role="tablist"` e `role="tab"` + `aria-selected`
- Navegação com `aria-label` descritivos

## Tratamento de Erros
- Erros de conexão: "Erro de conexão com o servidor"
- Modelo não treinado: mensagem específica da API
- JSON inválido: validado localmente antes de enviar
- Todos os erros exibidos via `.rpg-alert` ou `ErrorMessage` component
