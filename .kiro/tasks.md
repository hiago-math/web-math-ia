# Plano de Implementação: mathIA — Frontend Vue.js

## Visão Geral

Implementação do Frontend_Vue com Vue.js 3, Vite, Pinia, Vue Router e Chart.js. O frontend se comunica exclusivamente com a Camada_Laravel e oferece interface responsiva e acessível para interação com a IA.

## Tarefas

- [x] 1. Inicializar projeto Vue.js e configurar dependências
  - [x] 1.1 Criar projeto com Vite + Vue 3
    - Executar scaffold do projeto com `npm create vite@latest` (template vue)
    - Instalar dependências: `pinia`, `vue-router`, `chart.js`, `vue-chartjs`, `axios`
    - Configurar `vite.config.js` com proxy para a Camada_Laravel em desenvolvimento
    - _Requisitos: 9.2_

  - [x] 1.2 Criar `package.json` com scripts: `dev`, `build`, `preview`
    - _Requisitos: 9.2_

- [x] 2. Configurar roteamento e layout principal
  - [x] 2.1 Criar `src/router/index.js` com as rotas definidas no design
    - `/` → TarefasView
    - `/ensinar/:tarefaId` → EnsinarView
    - `/progresso` → ProgressoView
    - `/testar` → TestarView
    - _Requisitos: 9.3_

  - [x] 2.2 Criar `src/App.vue` com layout principal e navegação entre seções
    - Navegação clara entre: Tarefas, Ensinar, Progresso, Testar
    - Layout responsivo (largura mínima 320px)
    - Atributos ARIA na navegação e suporte a navegação por teclado
    - _Requisitos: 9.1, 9.3, 9.6_

- [x] 3. Implementar serviço de API e componentes base
  - [x] 3.1 Criar `src/services/api.js` — módulo centralizado de comunicação com a Camada_Laravel
    - Configurar axios com base URL da Camada_Laravel
    - Adicionar token de autenticação no header `Authorization: Bearer {token}`
    - Tratar erros de rede e retornar formato padronizado `{ status, data, error }`
    - _Requisitos: 9.7, 6.8_

  - [x] 3.2 Criar componente `src/components/LoadingSpinner.vue`
    - Indicador de carregamento reutilizável com atributos ARIA
    - _Requisitos: 1.5, 9.6_

  - [x] 3.3 Criar componente `src/components/ErrorMessage.vue`
    - Mensagem de erro amigável com botão "Tentar novamente"
    - Atributos ARIA para acessibilidade
    - _Requisitos: 9.5, 9.6_

- [x] 4. Implementar módulo de Tarefas de Aprendizado
  - [x] 4.1 Criar store `src/stores/tarefas.js` (Pinia)
    - Estado: lista de tarefas, loading, error
    - Ação: buscar tarefas via `api.js`
    - _Requisitos: 1.1, 1.2_

  - [x] 4.2 Criar componente `src/components/TarefaCard.vue`
    - Exibir nome, descrição e status de conclusão da tarefa
    - Atualizar status visual quando tarefa é concluída
    - Atributos ARIA e suporte a teclado
    - _Requisitos: 1.1, 1.4, 9.6_

  - [x] 4.3 Criar view `src/views/TarefasView.vue`
    - Listar TarefaCards com LoadingSpinner durante carregamento
    - Exibir ErrorMessage em caso de falha
    - _Requisitos: 1.1, 1.5, 9.5_

  - [ ]* 4.4 Escrever testes unitários para TarefasView e TarefaCard
    - Testar renderização da lista de tarefas
    - Testar estado de loading e erro
    - _Requisitos: 1.1, 1.4, 1.5_

- [x] 5. Implementar módulo de Envio de Lições
  - [x] 5.1 Criar store `src/stores/licoes.js` (Pinia)
    - Estado: lição atual, loading, error, sucesso
    - Ação: enviar lição via `api.js`
    - _Requisitos: 2.1_

  - [x] 5.2 Criar componente `src/components/LicaoForm.vue`
    - Formulário com campos de entrada e saída esperada
    - Validação client-side dos campos obrigatórios
    - Feedback visual do resultado em até 300ms após resposta da API
    - Exibir mensagens de erro descritivas retornadas pela API
    - Atributos ARIA e labels acessíveis
    - _Requisitos: 2.1, 2.5, 9.4, 9.6_

  - [x] 5.3 Criar view `src/views/EnsinarView.vue`
    - Receber `tarefaId` via route params
    - Renderizar LicaoForm com contexto da tarefa
    - _Requisitos: 2.1_

  - [ ]* 5.4 Escrever testes unitários para LicaoForm e EnsinarView
    - Testar validação de formulário
    - Testar envio e feedback de sucesso/erro
    - _Requisitos: 2.1, 2.5_

- [x] 6. Implementar módulo de Progresso do Modelo
  - [x] 6.1 Criar store `src/stores/progresso.js` (Pinia)
    - Estado: histórico de progresso, loading, error
    - Ação: buscar progresso via `api.js`
    - _Requisitos: 4.1_

  - [x] 6.2 Criar componente `src/components/ProgressoChart.vue`
    - Gráficos de evolução de acurácia e perda usando Chart.js
    - Exibir status atual: total de lições, última acurácia, total de sessões
    - Atributos ARIA para acessibilidade dos gráficos
    - _Requisitos: 4.1, 4.4, 9.6_

  - [x] 6.3 Criar view `src/views/ProgressoView.vue`
    - Renderizar ProgressoChart com dados do store
    - LoadingSpinner e ErrorMessage
    - _Requisitos: 4.1, 4.3_

  - [ ]* 6.4 Escrever testes unitários para ProgressoChart e ProgressoView
    - Testar renderização dos gráficos com dados mock
    - _Requisitos: 4.1, 4.4_

- [x] 7. Implementar módulo de Teste/Inferência
  - [x] 7.1 Criar store `src/stores/inferencia.js` (Pinia)
    - Estado: resultado da inferência, loading, error
    - Ação: executar inferência via `api.js`
    - _Requisitos: 5.1_

  - [x] 7.2 Criar componente `src/components/InferenciaResult.vue`
    - Exibir predição e nível de confiança de forma clara
    - Mensagem quando modelo não está treinado
    - Atributos ARIA
    - _Requisitos: 5.3, 5.4, 9.6_

  - [x] 7.3 Criar view `src/views/TestarView.vue`
    - Formulário de entrada para teste
    - Renderizar InferenciaResult com resultado
    - Feedback visual em até 300ms após resposta
    - _Requisitos: 5.1, 5.3, 9.4_

  - [ ]* 7.4 Escrever testes unitários para TestarView e InferenciaResult
    - Testar exibição de predição e confiança
    - Testar mensagem de modelo não treinado
    - _Requisitos: 5.3, 5.4_

- [x] 8. Checkpoint — Validar frontend completo
  - Garantir que todos os componentes, views, stores e rotas estão integrados
  - Verificar responsividade e acessibilidade
  - Perguntar ao usuário se há dúvidas

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- O Frontend_Vue se comunica exclusivamente com a Camada_Laravel (Requisito 9.7)
- Todos os componentes devem ter atributos ARIA apropriados (Requisito 9.6)
