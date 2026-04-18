# Tasks — IA Especialista Autônoma — web-math-ia

## Task 1: Store de Especialidades

- [ ] 1.1 Criar `src/stores/especialista.js` com estado: `especialidades`, `especialidadeAtual`, `fontes`, `perguntas`, `relatorio`, `sessoes`, `loading`, `loadingFontes`, `error`, `pollingInterval`
- [ ] 1.2 Implementar computed `totalPerguntasPendentes` que soma perguntas pendentes de todas as especialidades
- [ ] 1.3 Implementar ações de especialidades: `buscarEspecialidades()`, `buscarEspecialidade(id)`, `criarEspecialidade(dados)`, `atualizarEspecialidade(id, dados)`, `removerEspecialidade(id)`
- [ ] 1.4 Implementar ações de fontes: `buscarFontes(especialidadeId)`, `adicionarFonte(especialidadeId, dados)`, `removerFonte(especialidadeId, fonteId)`
- [ ] 1.5 Implementar `iniciarPollingFontes(especialidadeId)` com `setInterval` de 5 segundos e `pararPollingFontes()` com `clearInterval`
- [ ] 1.6 Implementar ações de perguntas: `buscarPerguntas(especialidadeId)`, `responderPergunta(especialidadeId, perguntaId, resposta)`
- [ ] 1.7 Implementar ações de sessão e relatório: `dispararSessaoEstudo(especialidadeId)`, `buscarSessoes(especialidadeId)`, `buscarRelatorio(especialidadeId)`, `buscarHistoricoRelatorio(especialidadeId)`

## Task 2: Extensão do ChatStore

- [ ] 2.1 Adicionar `especialidadeAtiva` (ref null) ao `src/stores/chat.js`
- [ ] 2.2 Implementar `ativarModoEspecialista(especialidade)` que define `especialidadeAtiva` e reseta `sessaoId`
- [ ] 2.3 Implementar `desativarModoEspecialista()` que limpa `especialidadeAtiva` e `sessaoId`
- [ ] 2.4 Atualizar método `enviar()` para incluir `especialidade_id` no payload quando `especialidadeAtiva` estiver definido
- [ ] 2.5 Atualizar `adicionarMensagem()` para aceitar e armazenar campos `fontes_citadas` e `nivel_confianca_topico`
- [ ] 2.6 Atualizar bloco de sucesso em `enviar()` para extrair `fontes_citadas` e `nivel_confianca_topico` da resposta da API

## Task 3: Roteamento

- [ ] 3.1 Adicionar rota `/especialidades` com componente `EspecialidadesView` no `src/router/index.js`
- [ ] 3.2 Adicionar rota `/especialidades/:id` com componente `EspecialidadeDetalheView` e `props: true`

## Task 4: Componentes Utilitários

- [ ] 4.1 Criar `src/components/especialista/ConfiancaGauge.vue` — gauge circular SVG com gradiente vermelho/amarelo/verde, prop `valor` (0-100) e prop `tamanho` ('sm'|'md'|'lg')
- [ ] 4.2 Criar `src/components/especialista/ConfiancaBadge.vue` — badge colorido com nível de confiança, prop `nivel` (0-100)
- [ ] 4.3 Criar `src/components/especialista/FontesCitadas.vue` — seção colapsável de fontes citadas, prop `fontes` (array)
- [ ] 4.4 Criar `src/components/especialista/FonteCard.vue` — card de fonte com ícone por tipo e status animado (spinner para "processando", ✅ para "indexado", ⚠️ para "sem_transcricao", ❌ para "erro")

## Task 5: Modais

- [ ] 5.1 Criar `src/components/especialista/CriarEspecialidadeModal.vue` — modal com campos nome e descrição, validação inline, loading no botão de submit
- [ ] 5.2 Criar `src/components/especialista/AdicionarFonteModal.vue` — seletor de tipo (pdf/url/youtube_video/youtube_canal/youtube_playlist), campos dinâmicos por tipo, drag-and-drop para PDF com limite de 50 MB, validação de URL

## Task 6: Tela de Listagem

- [ ] 6.1 Criar `src/views/EspecialidadesView.vue` com grid de cards, botão "Nova Especialidade" e estado vazio
- [ ] 6.2 Criar `src/components/especialista/EspecialidadeCard.vue` — card com nome, descrição truncada, `ConfiancaGauge` pequeno, badge de status, total de fontes, botões "Ver detalhes" e "Conversar"
- [ ] 6.3 Integrar `CriarEspecialidadeModal` na `EspecialidadesView`
- [ ] 6.4 Chamar `buscarEspecialidades()` no `onMounted` da view

## Task 7: Tela de Detalhes — Estrutura

- [ ] 7.1 Criar `src/views/EspecialidadeDetalheView.vue` com layout de abas (Fontes | Progresso | Perguntas | Chat Especialista)
- [ ] 7.2 Criar `src/components/especialista/EspecialidadeHeader.vue` — nome, status, `ConfiancaGauge` médio, botão "Estudar Agora" com loading, menu de ações (Editar/Pausar/Arquivar)
- [ ] 7.3 Implementar navegação entre abas com estado de aba ativa persistido na URL via query param `?aba=fontes`

## Task 8: Aba Fontes

- [ ] 8.1 Criar `src/components/especialista/FontesTab.vue` com lista de `FonteCard` e botão "Adicionar Fonte"
- [ ] 8.2 Integrar `AdicionarFonteModal` na `FontesTab`
- [ ] 8.3 Iniciar polling de fontes ao montar a aba e parar ao desmontar (usar `onMounted`/`onUnmounted`)
- [ ] 8.4 Parar polling automaticamente quando todas as fontes estiverem em estado final (indexado/erro/sem_transcricao)

## Task 9: Aba Progresso

- [ ] 9.1 Criar `src/components/especialista/ProgressoTab.vue` com `ConfiancaGauge` grande, listas de conceitos e lacunas, gráfico e histórico de sessões
- [ ] 9.2 Criar `src/components/especialista/ConceitosLista.vue` — duas colunas: top 10 dominados (barra verde) e top 10 lacunas (barra vermelha com ícone de alerta)
- [ ] 9.3 Criar `src/components/especialista/SessoesHistorico.vue` — tabela com data, tipo, fontes novas, conceitos atualizados, status e indicador de progresso para sessão em execução
- [ ] 9.4 Reutilizar `src/components/ProgressoChart.vue` existente para o gráfico de linha semanal, adaptando os dados do `buscarHistoricoRelatorio()`

## Task 10: Aba Perguntas

- [ ] 10.1 Criar `src/components/especialista/PerguntasTab.vue` com lista de perguntas pendentes e seção colapsável de respondidas
- [ ] 10.2 Criar `src/components/especialista/PerguntaCard.vue` — pergunta, contexto em itálico, textarea para resposta e botão "Responder" com loading
- [ ] 10.3 Exibir badge com contador no título da aba quando houver perguntas pendentes
- [ ] 10.4 Exibir estado vazio com mensagem explicativa quando não há perguntas pendentes

## Task 11: Aba Chat Especialista

- [ ] 11.1 Criar `src/components/especialista/ChatEspecialistaTab.vue` que ativa o modo especialista no `ChatStore` ao montar e desativa ao desmontar
- [ ] 11.2 Implementar interface de chat completa (reutilizando lógica do `ChatView.vue`) com header mostrando nome da especialidade e nível de confiança médio
- [ ] 11.3 Exibir `ConfiancaBadge` e aviso de conhecimento limitado abaixo de cada resposta da IA quando `nivel_confianca_topico` estiver presente
- [ ] 11.4 Exibir `FontesCitadas` abaixo de cada resposta da IA quando `fontes_citadas` não estiver vazio

## Task 12: Integração Global

- [ ] 12.1 Adicionar item "Especialidades" no nav do `src/App.vue` com badge numérico de perguntas pendentes
- [ ] 12.2 Inicializar `useEspecialistaStore` no `src/App.vue` e chamar `buscarEspecialidades()` para carregar contagem de perguntas pendentes
- [ ] 12.3 Configurar atualização periódica da contagem de perguntas a cada 5 minutos no `App.vue`

## Task 13: Testes de UI

- [ ] 13.1 Criar especialidade via modal e verificar que aparece na listagem com status "ativo"
- [ ] 13.2 Adicionar vídeo YouTube e verificar polling: status "processando" → "indexado" com total de chunks
- [ ] 13.3 Adicionar PDF via drag-and-drop e verificar upload e indexação
- [ ] 13.4 Responder pergunta de refinamento e verificar que é movida para histórico de respondidas
- [ ] 13.5 Chat especialista envia `especialidade_id` no payload e exibe fontes citadas e badge de confiança
- [ ] 13.6 Badge de perguntas pendentes no menu atualiza quando nova pergunta é gerada
- [ ] 13.7 Botão "Estudar Agora" exibe loading e confirmação de enfileiramento
- [ ] 13.8 Remover especialidade remove da listagem sem recarregar a página
