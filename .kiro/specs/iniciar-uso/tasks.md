# Tasks — Iniciar Uso — web-math-ia

## Task 1: Verificar ambiente
- [ ] `make dev` ou `make up` sem erros de build
- [ ] `http://mathia.localhost` abre sem erro
- [ ] Console do browser sem erros críticos
- [ ] Network tab: requisição para `/api/tarefas` retorna 200

## Task 2: Testar navegação
- [ ] `/` carrega TarefasView
- [ ] `/ensinar/:id` carrega EnsinarView com formulário
- [ ] `/progresso` carrega ProgressoView com seletor
- [ ] `/testar` carrega TestarView com seletor e formulário
- [ ] `/chat` carrega ChatView com seletor e input

## Task 3: Testar fluxo de ensino
- [ ] TarefasView exibe tarefas existentes
- [ ] Clicar "Ensinar" navega para `/ensinar/:id`
- [ ] Enviar lição com JSON válido → mensagem de sucesso
- [ ] Enviar lição com JSON inválido → mensagem de erro inline
- [ ] Formulário limpo após envio com sucesso

## Task 4: Testar chat
- [ ] Selecionar tarefa treinada no seletor
- [ ] Digitar `[1, 0]` e pressionar Enter → mensagem enviada
- [ ] Animação de "digitando" aparece durante loading
- [ ] Resposta da IA exibida com predição e barra de confiança
- [ ] Barra verde para confiança ≥ 75%
- [ ] Botão "Limpar" reseta o histórico

## Task 5: Testar estados de UI
- [ ] Loading spinner aparece durante carregamento de tarefas
- [ ] ErrorMessage aparece quando API está indisponível
- [ ] Botão "Tentar novamente" refaz a requisição
- [ ] Botões desabilitados durante loading
