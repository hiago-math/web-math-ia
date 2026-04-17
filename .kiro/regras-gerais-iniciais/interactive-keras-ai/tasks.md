# Plano de Implementação: mathIA — Infraestrutura e Orquestração

## Visão Geral

Este arquivo contém as tarefas de infraestrutura, Docker, configuração de ambiente e orquestração geral do projeto mathIA. As tarefas de implementação específicas de cada serviço estão nos respectivos diretórios:

- `frontend/.kiro/tasks.md` — Tarefas do Frontend Vue.js
- `laravel/.kiro/tasks.md` — Tarefas da Camada Laravel
- `python-api/.kiro/tasks.md` — Tarefas da API Python + Keras

## Tarefas

- [x] 1. Criar estrutura raiz do projeto e arquivo .env
  - [x] 1.1 Criar arquivo `.env` na raiz com todas as variáveis de ambiente
    - Portas externas (FRONTEND_PORT, LARAVEL_PORT)
    - Credenciais MySQL (DB_ROOT_PASSWORD, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT)
    - Credenciais MongoDB (MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE, MONGO_HOST, MONGO_PORT)
    - Configuração Redis (REDIS_HOST, REDIS_PORT)
    - URLs internas (PYTHON_API_URL, LARAVEL_API_URL)
    - _Requisitos: 10.11_

  - [x] 1.2 Criar arquivo `.env.example` com valores placeholder para documentação
    - _Requisitos: 10.11_

- [x] 2. Criar docker-compose.yml
  - [x] 2.1 Definir serviço `mathia-frontend` com build context, portas, rede e dependência do Laravel
    - _Requisitos: 10.1, 10.4, 10.8, 10.12_

  - [x] 2.2 Definir serviço `mathia-laravel` com build context, portas, rede, env_file e dependências (MySQL, Redis)
    - _Requisitos: 10.1, 10.5, 10.8_

  - [x] 2.3 Definir serviço `mathia-laravel-worker` para processamento de filas Laravel
    - Comando: `php artisan queue:work redis --sleep=3 --tries=3`
    - _Requisitos: 10.5, 6.6_

  - [x] 2.4 Definir serviço `mathia-python-api` com build context, rede, env_file, volume de modelos e dependências (MongoDB, Redis)
    - _Requisitos: 10.1, 10.6, 10.8_

  - [x] 2.5 Definir serviço `mathia-celery-worker` para processamento de filas Celery
    - Comando: `celery -A app.tasks worker --loglevel=info`
    - _Requisitos: 10.6, 7.5_

  - [x] 2.6 Definir serviços de banco de dados (mathia-mysql, mathia-mongodb) e Redis (mathia-redis)
    - MySQL 8.0 com volumes persistentes
    - MongoDB 7 com volumes persistentes
    - Redis 7-alpine
    - _Requisitos: 10.2, 10.9_

  - [x] 2.7 Definir rede `mathia_network` (bridge) e volumes nomeados (mathia-mysql-data, mathia-mongo-data, mathia-models)
    - _Requisitos: 10.3, 10.9_

  - [x] 2.8 Configurar política de restart `unless-stopped` em todos os serviços
    - _Requisitos: 10.10_

  - [x] 2.9 Garantir que apenas portas do Frontend e Laravel são expostas externamente
    - _Requisitos: 10.12_

- [x] 3. Criar Dockerfiles por serviço
  - [x] 3.1 Criar `frontend/docker/Dockerfile` — build multi-stage (node para build, nginx para servir)
    - _Requisitos: 10.1, 10.4_

  - [x] 3.2 Criar `frontend/docker/nginx/default.conf` — servir SPA e proxy reverso para Laravel
    - _Requisitos: 10.4_

  - [x] 3.3 Criar `laravel/docker/Dockerfile` — PHP-FPM + nginx + extensões necessárias
    - _Requisitos: 10.1, 10.5_

  - [x] 3.4 Criar `laravel/docker/nginx/default.conf` — configuração nginx para Laravel
    - _Requisitos: 10.5_

  - [x] 3.5 Criar `laravel/docker/workers/supervisor.conf` — supervisor para queue workers
    - _Requisitos: 10.5_

  - [x] 3.6 Criar `python-api/docker/Dockerfile` — Python + gunicorn + dependências Keras/TensorFlow
    - _Requisitos: 10.1, 10.6_

  - [x] 3.7 Criar `python-api/docker/nginx/default.conf` — proxy reverso para gunicorn
    - _Requisitos: 10.6_

  - [x] 3.8 Criar `python-api/docker/workers/celery.conf` — configuração supervisor para Celery worker
    - _Requisitos: 10.6_

- [x] 4. Criar Makefiles por serviço e Makefile raiz
  - [x] 4.1 Criar `Makefile` raiz com targets: `up`, `down`, `build`, `logs`, `restart`
    - _Requisitos: 10.7, 10.8_

  - [x] 4.2 Criar `frontend/Makefile` com targets: `install`, `run`, `build`
    - _Requisitos: 10.7_

  - [x] 4.3 Criar `laravel/Makefile` com targets: `install`, `run`, `test`
    - _Requisitos: 10.7_

  - [x] 4.4 Criar `python-api/Makefile` com targets: `install`, `run`, `test`
    - _Requisitos: 10.7_

- [x] 5. Checkpoint — Validar infraestrutura Docker
  - Garantir que todos os Dockerfiles, docker-compose.yml, .env e Makefiles estão corretos
  - Perguntar ao usuário se há dúvidas antes de prosseguir

- [ ]* 5.1 Escrever teste property-based para idempotência de containers Docker
  - **Propriedade 8: Idempotência de Containers Docker**
  - **Valida: Requisito 10.8**

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- As tarefas de implementação de cada serviço estão nos respectivos `{serviço}/.kiro/tasks.md`
