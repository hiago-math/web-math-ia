# Spec: Iniciar Uso — web-math-ia

## Objetivo
Garantir que o frontend esteja funcional, com todas as views operacionais
e integração com a API Laravel funcionando end-to-end.

## Requirements

### REQ-1: Ambiente operacional
- [ ] Container `mathia-frontend` rodando via `make up` (prod) ou `make dev` (dev)
- [ ] Acessível em `http://mathia.localhost`
- [ ] `VITE_API_URL=http://mathia-api.localhost/api` configurado no `.env`

### REQ-2: Navegação
- [ ] `/` exibe lista de tarefas (ou estado vazio)
- [ ] `/ensinar/:tarefaId` exibe formulário de lição
- [ ] `/progresso` exibe gráfico de evolução
- [ ] `/testar` exibe formulário de inferência
- [ ] `/chat` exibe interface de chat

### REQ-3: Fluxo de ensino
- [ ] TarefasView carrega tarefas da API ao montar
- [ ] EnsinarView aceita JSON válido nos campos
- [ ] EnsinarView exibe erro para JSON inválido
- [ ] EnsinarView exibe sucesso após envio

### REQ-4: Chat
- [ ] Seletor de tarefa funcional
- [ ] Mensagem enviada com Enter ou botão
- [ ] Resposta da IA exibida com predição e confiança
- [ ] Barra de confiança colorida (verde/laranja/vermelho)
- [ ] Botão limpar reseta conversa

### REQ-5: Estados de UI
- [ ] Loading spinner durante requisições
- [ ] Mensagem de erro com botão "Tentar novamente"
- [ ] Botões desabilitados durante loading

## Critérios de Aceite
- Navegar por todas as rotas sem erro de console
- Completar fluxo: ver tarefas → ensinar → testar → chat
- Chat responde com predição após tarefa treinada
