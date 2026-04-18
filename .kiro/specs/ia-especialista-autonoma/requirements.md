# Spec: IA Especialista Autônoma — web-math-ia

## Objetivo

Prover uma tela de **Especialidades** onde o usuário cria domínios temáticos, adiciona fontes
(PDFs, URLs, YouTube), acompanha o progresso de aprendizado da IA, responde perguntas de
refinamento e conversa com a IA no modo especialista — tudo com feedback visual em tempo real
sobre o status de indexação e o nível de confiança por tópico.

## Glossário

- **Especialidade**: Domínio temático criado pelo usuário (ex: "Mercado Financeiro").
- **Fonte**: Recurso de conhecimento adicionado à especialidade (PDF, URL, YouTube).
- **Nível de Confiança**: Percentual (0–100%) que indica o domínio da IA sobre a especialidade.
- **Lacuna**: Tópico identificado como relevante mas ainda não suficientemente coberto.
- **Pergunta de Refinamento**: Pergunta gerada pela IA para o usuário direcionar o aprendizado.
- **Sessão de Estudo**: Execução autônoma de aprendizado disparada manualmente ou por agendamento.
- **Modo Especialista**: Modo de chat que usa o conhecimento acumulado de uma especialidade.
- **EspecialistaStore**: Store Pinia responsável pelo estado das especialidades no frontend.
- **ChatStore**: Store Pinia existente do chat, estendido para suportar modo especialista.

---

## Requirements

### Requirement 1: Tela de Especialidades — Listagem e Criação

**User Story:** Como usuário, quero ver todas as minhas especialidades em uma tela dedicada e criar novas, para que eu possa gerenciar os domínios de conhecimento da IA.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL expor rota `/especialidades` acessível pelo menu de navegação principal.
2. THE EspecialistaStore SHALL exibir cards para cada especialidade com: nome, descrição resumida, nível de confiança (barra de progresso), total de fontes, status (ativo/pausado/arquivado) e data de atualização.
3. WHEN não há especialidades cadastradas, THE EspecialistaStore SHALL exibir estado vazio com botão "Criar primeira especialidade".
4. THE EspecialistaStore SHALL exibir botão "Nova Especialidade" que abre modal com campos: nome (obrigatório) e descrição (obrigatório).
5. WHEN o usuário submete o formulário de criação, THE EspecialistaStore SHALL chamar `POST /api/especialidades`, exibir loading no botão e fechar o modal ao receber sucesso.
6. IF a API retornar erro de validação, THEN THE EspecialistaStore SHALL exibir mensagens de erro inline nos campos correspondentes sem fechar o modal.
7. THE EspecialistaStore SHALL permitir clicar em um card para navegar para a tela de detalhes da especialidade (`/especialidades/{id}`).

---

### Requirement 2: Tela de Detalhes da Especialidade

**User Story:** Como usuário, quero ver todos os detalhes de uma especialidade em uma tela dedicada, para que eu possa gerenciar fontes, acompanhar o progresso e interagir com a IA.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL exibir na tela de detalhes: nome, descrição, status, nível de confiança médio, total de fontes, total de conceitos e data de criação.
2. THE EspecialistaStore SHALL organizar a tela em abas: "Fontes", "Progresso", "Perguntas" e "Chat Especialista".
3. THE EspecialistaStore SHALL exibir botão "Estudar Agora" que dispara sessão de estudo manual via `POST /api/especialidades/{id}/estudar` com feedback de loading e confirmação de enfileiramento.
4. THE EspecialistaStore SHALL exibir botão de menu com opções: "Editar", "Pausar/Ativar" e "Arquivar".
5. WHEN o status da especialidade é "pausado", THE EspecialistaStore SHALL exibir badge visual de aviso e desabilitar o botão "Estudar Agora".

---

### Requirement 3: Gerenciamento de Fontes

**User Story:** Como usuário, quero adicionar e remover fontes de conhecimento de uma especialidade, para que eu possa controlar o que a IA aprende.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL exibir na aba "Fontes" a lista de fontes com: ícone por tipo, nome/URL, status de processamento, total de chunks e data de adição.
2. THE EspecialistaStore SHALL exibir botão "Adicionar Fonte" que abre modal com seletor de tipo: PDF 📄, URL 🌐, Vídeo YouTube 🎬, Canal YouTube 📺, Playlist YouTube 🎵.
3. WHEN o tipo "PDF" é selecionado, THE EspecialistaStore SHALL exibir campo de upload de arquivo com drag-and-drop e limite de 50 MB.
4. WHEN o tipo "URL", "Vídeo YouTube", "Canal YouTube" ou "Playlist YouTube" é selecionado, THE EspecialistaStore SHALL exibir campo de texto para inserção da URL.
5. WHEN uma fonte é adicionada com sucesso, THE EspecialistaStore SHALL exibir a fonte na lista com status "Processando..." e ícone de loading animado.
6. WHILE o status da fonte for "processando", THE EspecialistaStore SHALL atualizar o status via polling a cada 5 segundos em `GET /api/especialidades/{id}/fontes`.
7. WHEN o status da fonte muda para "indexado", THE EspecialistaStore SHALL exibir ícone de sucesso ✅ e o total de chunks gerados.
8. IF o status da fonte for "erro" ou "sem_transcricao", THEN THE EspecialistaStore SHALL exibir ícone de aviso ⚠️ com tooltip explicativo.
9. THE EspecialistaStore SHALL exibir botão de remoção em cada fonte que, ao ser confirmado, chama `DELETE /api/especialidades/{id}/fontes/{fonte_id}` e remove a fonte da lista.

---

### Requirement 4: Painel de Progresso

**User Story:** Como usuário, quero visualizar o progresso de aprendizado da IA sobre a especialidade, para que eu possa entender o que ela já domina e o que ainda precisa aprender.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL exibir na aba "Progresso": nível de confiança médio (gauge circular), top 10 conceitos dominados com barra de confiança, top 10 lacunas prioritárias com indicador de prioridade.
2. THE EspecialistaStore SHALL exibir gráfico de linha com evolução semanal de: fontes adicionadas, conceitos descobertos e nível de confiança médio.
3. THE EspecialistaStore SHALL exibir histórico de sessões de estudo com: data, tipo (agendada/manual), fontes novas, conceitos atualizados e status.
4. WHEN uma sessão de estudo está em execução, THE EspecialistaStore SHALL exibir indicador de progresso com a etapa atual ("Indexando fontes...", "Pesquisando na web...", "Gerando perguntas...").
5. THE EspecialistaStore SHALL exibir botão "Atualizar" que recarrega os dados do relatório via `GET /api/especialidades/{id}/relatorio`.

---

### Requirement 5: Perguntas de Refinamento

**User Story:** Como usuário, quero responder perguntas que a IA faz sobre o foco da especialidade, para que eu possa direcionar o aprendizado de forma precisa.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL exibir na aba "Perguntas" a lista de perguntas pendentes com: texto da pergunta, contexto explicativo e campo de resposta livre.
2. WHEN não há perguntas pendentes, THE EspecialistaStore SHALL exibir mensagem "Nenhuma pergunta pendente. A IA fará perguntas após indexar mais fontes."
3. WHEN o usuário submete uma resposta, THE EspecialistaStore SHALL chamar `POST /api/especialidades/{id}/perguntas/{pid}/resposta`, exibir loading e marcar a pergunta como respondida na lista.
4. THE EspecialistaStore SHALL exibir badge com contador de perguntas pendentes no item de aba "Perguntas" quando houver perguntas não respondidas.
5. THE EspecialistaStore SHALL exibir histórico de perguntas já respondidas em seção colapsável abaixo das pendentes.

---

### Requirement 6: Chat no Modo Especialista

**User Story:** Como usuário, quero conversar com a IA usando o conhecimento acumulado de uma especialidade, para que as respostas sejam aprofundadas e citem as fontes estudadas.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL exibir na aba "Chat Especialista" uma interface de chat completa integrada ao `ChatStore` existente com `especialidade_id` pré-configurado.
2. WHEN o usuário envia uma mensagem no chat especialista, THE ChatStore SHALL incluir `especialidade_id` no payload enviado à API.
3. WHEN a resposta da IA inclui `fontes_citadas`, THE EspecialistaStore SHALL exibir seção "Fontes consultadas" abaixo da resposta com links clicáveis para cada fonte.
4. WHEN a resposta da IA inclui `nivel_confianca_topico`, THE EspecialistaStore SHALL exibir badge colorido: verde (≥70%), amarelo (30–69%), vermelho (<30%).
5. WHEN o `nivel_confianca_topico` for inferior a 30%, THE EspecialistaStore SHALL exibir aviso "⚠️ Conhecimento limitado sobre este tópico" abaixo do badge.
6. THE EspecialistaStore SHALL exibir no header do chat o nome da especialidade ativa e o nível de confiança médio.

---

### Requirement 7: Navegação e Integração Global

**User Story:** Como usuário, quero acessar as especialidades pelo menu principal e ver indicadores de atividade, para que eu possa monitorar o aprendizado da IA de qualquer tela.

#### Acceptance Criteria

1. THE EspecialistaStore SHALL adicionar item "Especialidades" no menu de navegação principal do `App.vue`.
2. WHEN há perguntas pendentes em qualquer especialidade, THE EspecialistaStore SHALL exibir badge numérico no item "Especialidades" do menu.
3. THE EspecialistaStore SHALL carregar a contagem de perguntas pendentes ao inicializar a aplicação via `GET /api/especialidades` e atualizar a cada 5 minutos.
4. THE EspecialistaStore SHALL permitir acessar o chat especialista de uma especialidade diretamente pelo card na listagem via botão "Conversar".

---

## Critérios de Aceite Globais

- Tela de listagem carrega em menos de 2 segundos com até 20 especialidades.
- Upload de PDF de 10 MB exibe progresso e confirma indexação sem recarregar a página.
- Polling de status de fonte não causa degradação visual ou flickering na interface.
- Chat especialista exibe fontes citadas e nível de confiança em todas as respostas.
- Interface funciona corretamente em telas a partir de 320px de largura.
