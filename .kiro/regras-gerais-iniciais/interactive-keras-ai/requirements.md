# Documento de Requisitos

## Introdução

**mathIA** — Sistema de IA interativa construído com Keras, onde usuários podem ensinar a IA através de uma interface web. O sistema permite que o usuário visualize tarefas de aprendizado, forneça lições à IA e acompanhe o progresso de evolução do modelo. A arquitetura é composta por três camadas, todas containerizadas com Docker e orquestradas via Docker_Compose:

- **Frontend**: Vue.js com estrutura modular e fácil manutenção
- **Camada PHP**: Laravel (última versão) com arquitetura DDD intermediária (DTOs, Repositories, Actions), camada de Events/Jobs para atividades assíncronas, estrutura flat (sem separação por pastas de domínio)
- **API Python**: API REST com Keras/TensorFlow, arquitetura DDD intermediária (DTOs, Repos, Actions), filas para processamento de treinamento em background
- **Banco de Dados**: MySQL ou MongoDB (a ser definido na fase de design conforme melhor adequação por camada); a API Python pode utilizar NoSQL ou MySQL

Todos os serviços são containerizados individualmente com Docker, possuem Makefiles próprios para setup e inicialização, e se comunicam através de uma rede Docker compartilhada chamada "mathia_network".

## Glossário

- **Sistema_IA**: O sistema completo de IA interativa, incluindo frontend, backend e modelo Keras
- **Modelo_Keras**: A rede neural construída com Keras que aprende através das interações do usuário
- **API_Python**: A API REST em Python responsável por gerenciar o modelo Keras, processar lições e retornar resultados. Utiliza arquitetura DDD intermediária (DTOs, Repos, Actions) e filas para processamento em background
- **Frontend_Vue**: A interface web construída em Vue.js com estrutura modular onde o usuário interage com o sistema
- **Camada_Laravel**: Camada intermediária em PHP/Laravel (última versão) que atua como orquestradora entre o Frontend_Vue e a API_Python. Utiliza arquitetura DDD intermediária com DTOs, Repositories e Actions em estrutura flat. Possui camada de Events e Jobs para atividades assíncronas
- **Tarefa_Aprendizado**: Uma unidade de ensino que o usuário deve completar para treinar o Modelo_Keras
- **Lição**: Conjunto de dados de entrada e saída esperada fornecidos pelo usuário para treinar o Modelo_Keras
- **Sessão_Treinamento**: Período em que o Modelo_Keras processa as lições fornecidas e atualiza seus pesos
- **Progresso_Modelo**: Métricas que indicam a evolução do Modelo_Keras (acurácia, perda, épocas treinadas)
- **Usuário**: Pessoa que interage com o Frontend_Vue para ensinar a IA
- **DTO**: Data Transfer Object — objeto utilizado para transferir dados entre camadas sem lógica de negócio
- **Repository**: Camada de abstração para acesso a dados (banco de dados)
- **Action**: Classe responsável por executar uma única ação de negócio
- **Event**: Evento disparado pelo sistema para comunicação assíncrona entre componentes
- **Job**: Tarefa assíncrona processada em background via fila
- **Fila_Processamento**: Sistema de filas utilizado pela API_Python e pela Camada_Laravel para processar tarefas em background (treinamento, notificações, etc.)
- **Docker**: Plataforma de containerização utilizada para empacotar cada serviço do mathIA com suas dependências
- **Docker_Compose**: Ferramenta de orquestração que define e executa os múltiplos containers do mathIA
- **Makefile**: Arquivo de automação presente em cada serviço contendo comandos para instalação de dependências e inicialização do serviço
- **Rede_Docker**: Rede Docker compartilhada ("mathia_network") que conecta todos os containers do mathIA permitindo comunicação entre serviços
- **Pasta_Docker**: Diretório "docker" presente em cada serviço contendo configurações específicas de infraestrutura (nginx, workers, etc.)

## Requisitos

### Requisito 1: Gerenciamento de Tarefas de Aprendizado

**User Story:** Como Usuário, eu quero visualizar uma lista de tarefas de aprendizado disponíveis, para que eu saiba o que preciso ensinar à IA.

#### Critérios de Aceitação

1. WHEN o Usuário acessa a página principal, THE Frontend_Vue SHALL exibir a lista de Tarefas_Aprendizado com nome, descrição e status de conclusão
2. WHEN o Frontend_Vue solicita a lista de tarefas, THE Camada_Laravel SHALL encaminhar a requisição para a API_Python e retornar a resposta ao Frontend_Vue
3. THE API_Python SHALL retornar a lista de Tarefas_Aprendizado disponíveis no formato JSON contendo id, nome, descrição e status
4. WHEN uma Tarefa_Aprendizado é concluída, THE Frontend_Vue SHALL atualizar o status visual da tarefa para "concluída"
5. WHILE o Frontend_Vue carrega as Tarefas_Aprendizado, THE Frontend_Vue SHALL exibir um indicador de carregamento

### Requisito 2: Envio de Lições para a IA

**User Story:** Como Usuário, eu quero fornecer lições à IA com dados de entrada e saída esperada, para que o Modelo_Keras possa aprender com meus ensinamentos.

#### Critérios de Aceitação

1. WHEN o Usuário seleciona uma Tarefa_Aprendizado, THE Frontend_Vue SHALL exibir um formulário para inserir dados de entrada e a saída esperada
2. WHEN o Usuário submete uma Lição, THE Camada_Laravel SHALL validar os dados de entrada e saída esperada utilizando Form Requests do Laravel antes de encaminhar à API_Python
3. WHEN a Camada_Laravel recebe uma Lição válida, THE Camada_Laravel SHALL utilizar um DTO para transferir os dados da Lição para a Action responsável pelo envio à API_Python
4. WHEN a API_Python recebe uma Lição, THE API_Python SHALL validar os dados utilizando o DTO correspondente e armazenar a Lição via Repository associada à Tarefa_Aprendizado
5. IF os dados da Lição forem inválidos, THEN THE Camada_Laravel SHALL retornar uma mensagem de erro descritiva com o campo e motivo da falha
6. WHEN a Lição é armazenada com sucesso, THE API_Python SHALL retornar confirmação com o id da Lição criada

### Requisito 3: Treinamento do Modelo Keras

**User Story:** Como Usuário, eu quero que a IA processe as lições que eu forneci e melhore seu modelo, para que ela aprenda progressivamente.

#### Critérios de Aceitação

1. WHEN o Usuário solicita o treinamento, THE Camada_Laravel SHALL disparar um Event que enfileira um Job para iniciar a Sessão_Treinamento na API_Python
2. WHEN a API_Python recebe a solicitação de treinamento, THE API_Python SHALL enfileirar o processamento na Fila_Processamento para execução em background
3. WHILE uma Sessão_Treinamento está em andamento, THE API_Python SHALL reportar o progresso atual (época atual, perda, acurácia) via endpoint de status
4. WHEN a Sessão_Treinamento é concluída, THE API_Python SHALL salvar os pesos atualizados do Modelo_Keras em disco
5. IF uma Sessão_Treinamento falhar por dados insuficientes, THEN THE API_Python SHALL retornar uma mensagem indicando o número mínimo de Lições necessárias
6. WHEN a Sessão_Treinamento é concluída, THE API_Python SHALL registrar as métricas finais (acurácia, perda, número de épocas) no Progresso_Modelo via Repository

### Requisito 4: Visualização de Progresso do Modelo

**User Story:** Como Usuário, eu quero acompanhar o progresso de aprendizado da IA, para que eu possa ver como ela está evoluindo com meus ensinamentos.

#### Critérios de Aceitação

1. WHEN o Usuário acessa a página de progresso, THE Frontend_Vue SHALL exibir gráficos de evolução da acurácia e perda do Modelo_Keras ao longo das Sessões_Treinamento
2. THE API_Python SHALL retornar o histórico completo do Progresso_Modelo no formato JSON contendo timestamps, acurácia, perda e número de épocas por sessão
3. WHEN uma nova Sessão_Treinamento é concluída, THE Camada_Laravel SHALL disparar um Event para notificar o Frontend_Vue e atualizar os gráficos de progresso automaticamente
4. THE Frontend_Vue SHALL exibir o status atual do Modelo_Keras (número total de Lições processadas, última acurácia, total de Sessões_Treinamento realizadas)

### Requisito 5: Teste e Inferência do Modelo

**User Story:** Como Usuário, eu quero testar a IA com novos dados de entrada, para que eu possa verificar se ela aprendeu corretamente.

#### Critérios de Aceitação

1. WHEN o Usuário submete dados de entrada para teste, THE Camada_Laravel SHALL encaminhar a requisição para a API_Python via Action dedicada
2. WHEN a API_Python recebe dados de teste, THE API_Python SHALL executar inferência no Modelo_Keras e retornar a predição com o nível de confiança
3. WHEN o resultado da inferência é recebido, THE Frontend_Vue SHALL exibir a predição e o nível de confiança de forma clara
4. IF o Modelo_Keras não foi treinado para a Tarefa_Aprendizado solicitada, THEN THE API_Python SHALL retornar uma mensagem indicando que o modelo precisa ser treinado primeiro
5. THE API_Python SHALL registrar cada teste realizado com entrada, predição e confiança via Repository para análise posterior

### Requisito 6: Camada Laravel (PHP)

**User Story:** Como desenvolvedor, eu quero uma camada intermediária em Laravel com arquitetura DDD intermediária, para que eu possa orquestrar a comunicação entre frontend e API Python com lógica de negócio organizada.

#### Critérios de Aceitação

1. THE Camada_Laravel SHALL utilizar Laravel na última versão estável disponível
2. THE Camada_Laravel SHALL organizar o código em camadas separadas: DTOs, Repositories, Actions, Events, Jobs, Controllers e Form Requests em estrutura flat (sem separação por pastas de domínio)
3. THE Camada_Laravel SHALL utilizar DTOs para transferência de dados entre camadas internas
4. THE Camada_Laravel SHALL utilizar Repositories para abstração de acesso ao banco de dados (MySQL ou MongoDB)
5. THE Camada_Laravel SHALL utilizar Actions para encapsular cada operação de negócio em uma classe dedicada
6. THE Camada_Laravel SHALL utilizar Events e Jobs do Laravel para atividades assíncronas (disparo de treinamento, notificações de conclusão)
7. THE Camada_Laravel SHALL expor endpoints REST para todas as operações: listar tarefas, enviar lições, iniciar treinamento, consultar progresso e executar inferência
8. THE Camada_Laravel SHALL utilizar autenticação por token em todas as requisições
9. IF uma requisição não contiver um token válido, THEN THE Camada_Laravel SHALL retornar status HTTP 401 com mensagem de erro
10. THE Camada_Laravel SHALL retornar respostas no formato JSON com estrutura consistente contendo campos "status", "data" e "error"
11. IF um erro interno ocorrer, THEN THE Camada_Laravel SHALL retornar status HTTP 500 com mensagem genérica e registrar os detalhes do erro em log

### Requisito 7: API Python com Keras

**User Story:** Como desenvolvedor, eu quero uma API REST em Python bem estruturada com arquitetura DDD intermediária e filas, para que o processamento de treinamento ocorra em background de forma organizada.

#### Critérios de Aceitação

1. THE API_Python SHALL organizar o código em camadas separadas: DTOs, Repositories, Actions, Controllers e módulo de filas
2. THE API_Python SHALL utilizar DTOs para transferência de dados entre camadas internas
3. THE API_Python SHALL utilizar Repositories para abstração de acesso ao banco de dados (NoSQL ou MySQL)
4. THE API_Python SHALL utilizar Actions para encapsular cada operação de negócio em uma classe dedicada
5. THE API_Python SHALL utilizar filas (Fila_Processamento) para processar Sessões_Treinamento em background sem bloquear requisições HTTP
6. THE API_Python SHALL expor endpoints REST para todas as operações: listar tarefas, enviar lições, iniciar treinamento, consultar progresso e executar inferência
7. THE API_Python SHALL retornar respostas no formato JSON com estrutura consistente contendo campos "status", "data" e "error"
8. IF um erro interno ocorrer, THEN THE API_Python SHALL retornar status HTTP 500 com mensagem genérica e registrar os detalhes do erro em log

### Requisito 8: Serialização e Persistência do Modelo

**User Story:** Como Usuário, eu quero que o estado do Modelo_Keras seja salvo e restaurado, para que o aprendizado não seja perdido entre sessões.

#### Critérios de Aceitação

1. WHEN uma Sessão_Treinamento é concluída, THE API_Python SHALL serializar o Modelo_Keras completo (arquitetura + pesos) em formato HDF5 ou SavedModel
2. WHEN a API_Python é iniciada, THE API_Python SHALL carregar o último Modelo_Keras salvo do disco
3. THE API_Python SHALL formatar o Modelo_Keras serializado de volta para um objeto carregável em memória (round-trip: salvar → carregar → salvar SHALL produzir modelos equivalentes)
4. IF o arquivo do Modelo_Keras estiver corrompido ou ausente, THEN THE API_Python SHALL criar um novo Modelo_Keras com a arquitetura padrão e registrar um aviso em log

### Requisito 9: Interface Frontend em Vue.js

**User Story:** Como Usuário, eu quero uma interface web modular, intuitiva e responsiva, para que eu possa interagir com a IA de forma agradável em qualquer dispositivo.

#### Critérios de Aceitação

1. THE Frontend_Vue SHALL ser responsivo e funcionar em telas com largura mínima de 320px
2. THE Frontend_Vue SHALL utilizar estrutura modular com componentes reutilizáveis organizados para fácil manutenção
3. THE Frontend_Vue SHALL exibir navegação clara entre as seções: Tarefas, Ensinar, Progresso e Testar
4. WHEN o Usuário realiza uma ação (enviar lição, iniciar treinamento, testar), THE Frontend_Vue SHALL exibir feedback visual do resultado em até 300ms após receber a resposta da API
5. IF a comunicação com a Camada_Laravel falhar, THEN THE Frontend_Vue SHALL exibir uma mensagem de erro amigável com opção de tentar novamente
6. THE Frontend_Vue SHALL utilizar componentes acessíveis com atributos ARIA apropriados e suporte a navegação por teclado
7. THE Frontend_Vue SHALL comunicar-se exclusivamente com a Camada_Laravel (o Frontend_Vue não acessa a API_Python diretamente)

### Requisito 10: Infraestrutura Docker e Containerização

**User Story:** Como desenvolvedor, eu quero que todos os serviços do mathIA sejam containerizados com Docker e orquestrados via Docker Compose, para que o ambiente de desenvolvimento e produção seja reproduzível e fácil de configurar.

#### Critérios de Aceitação

1. THE Sistema_IA SHALL containerizar cada serviço (Frontend_Vue, Camada_Laravel, API_Python) em containers Docker independentes com Dockerfiles dedicados localizados dentro da Pasta_Docker de cada serviço
2. THE Sistema_IA SHALL fornecer um arquivo Docker_Compose na raiz do projeto que orquestra todos os containers incluindo serviços de banco de dados
3. THE Sistema_IA SHALL configurar uma Rede_Docker compartilhada chamada "mathia_network" que conecta todos os containers (Frontend_Vue, Camada_Laravel, API_Python, banco de dados)
4. THE Frontend_Vue SHALL possuir uma Pasta_Docker contendo o Dockerfile, configuração de nginx para servir a aplicação e fazer proxy reverso para a Camada_Laravel
5. THE Camada_Laravel SHALL possuir uma Pasta_Docker contendo o Dockerfile, configurações de nginx e workers para processamento de filas
6. THE API_Python SHALL possuir uma Pasta_Docker contendo o Dockerfile, configurações de nginx/gunicorn e workers para a Fila_Processamento
7. THE Sistema_IA SHALL fornecer um Makefile em cada serviço contendo comandos "make install" para instalação de dependências e "make run" para inicialização do serviço
8. WHEN o desenvolvedor executa "docker-compose up" na raiz do projeto, THE Docker_Compose SHALL iniciar todos os serviços do mathIA conectados à Rede_Docker compartilhada
9. THE Docker_Compose SHALL utilizar o prefixo "mathia" para nomeação de containers e volumes
10. IF um container falhar durante a inicialização, THEN THE Docker_Compose SHALL reiniciar o container automaticamente com política de restart "unless-stopped"
11. THE Sistema_IA SHALL utilizar variáveis de ambiente via arquivo .env para configuração de portas, credenciais de banco de dados e URLs de serviços internos
12. THE Docker_Compose SHALL expor apenas as portas necessárias para acesso externo (porta do Frontend_Vue e porta da Camada_Laravel) mantendo os demais serviços acessíveis apenas via Rede_Docker interna
