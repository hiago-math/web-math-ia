# Regras de Negócio — web-math-ia (Vue.js)

## Domínio
Interface para o ciclo completo de ensino de IA:
criar tarefa → enviar lições → treinar → testar → conversar.

## Fluxo Principal do Usuário

### 1. Criar Tarefa
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
- Progresso acompanhado na ProgressoView

### 4. Testar (TestarView)
- Seleciona tarefa treinada
- Insere entrada JSON
- Visualiza predição e confiança (0-100%)

### 5. Chat (ChatView)
- Interface conversacional com a IA
- Seleciona tarefa no topo
- Digita entrada JSON (ex: `[1, 0, 1]`)
- IA responde com predição e barra de confiança colorida
- `Enter` envia mensagem
- Histórico da conversa mantido na sessão

## Regras de UI

### Validação de Formulários
- Campos JSON validados com `JSON.parse()` antes de enviar
- Erro exibido inline se JSON inválido
- Botões desabilitados durante loading

### Estados de Componentes
- `loading`: spinner visível, botão desabilitado
- `error`: mensagem de erro com botão "Tentar novamente"
- `sucesso`: feedback positivo, formulário limpo

### Chat
- Mensagens do usuário alinhadas à direita (fundo escuro)
- Respostas da IA alinhadas à esquerda (fundo branco)
- Barra de confiança: verde (≥75%), laranja (≥50%), vermelho (<50%)
- Animação de "digitando" enquanto aguarda resposta
- Scroll automático para última mensagem

## Acessibilidade
- Todos os formulários com `aria-label` e `aria-required`
- Mensagens de erro com `role="alert"` e `aria-live="assertive"`
- Listas de resultados com `role="list"` e `role="listitem"`
- Chat com `role="log"` e `aria-live="polite"`
- Navegação com `aria-label` descritivos

## Tratamento de Erros
- Erros de conexão: "Erro de conexão com o servidor"
- Modelo não treinado: mensagem específica da API
- JSON inválido: validado localmente antes de enviar
- Todos os erros exibidos via `ErrorMessage` component ou inline
