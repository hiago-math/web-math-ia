# Documento de Design

## Introdução

Este documento descreve o design técnico do **mathIA**, um sistema de IA interativa construído com Keras. O sistema é composto por três serviços containerizados (Frontend Vue.js, Camada Laravel, API Python) que se comunicam através de uma rede Docker compartilhada. O design aborda a arquitetura de cada camada, a infraestrutura Docker, e as decisões técnicas para atender aos requisitos definidos.

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                    mathia_network (Docker)                       │
│                                                                 │
│  ┌──────────────┐   ┌──────────────────┐   ┌────────────────┐  │
│  │ Frontend_Vue  │──▶│  Camada_Laravel   │──▶│   API_Python   │  │
│  │  (nginx:80)   │   │  (nginx:8000)     │   │ (gunicorn:5000)│  │
│  └──────────────┘   └──────────────────┘   └────────────────┘  │
│                            │                       │            │
│                            ▼                       ▼            │
│                     ┌────────────┐          ┌────────────┐      │
│                     │   MySQL    │          │  MongoDB/   │      │
│                     │  (3306)    │          │  MySQL      │      │
│                     └────────────┘          └────────────┘      │
│                                                                 │
│                     ┌────────────┐          ┌────────────┐      │
│                     │   Redis    │          │   Celery    │      │
│                     │  (6379)    │          │  Worker     │      │
│                     └────────────┘          └────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Decisões Técnicas

### Banco de Dados
- **Camada_Laravel**: MySQL — adequado para dados relacionais (usuários, tarefas, lições, sessões)
- **API_Python**: MongoDB — flexível para armazenar métricas de treinamento, histórico de progresso e dados de inferência com schemas variáveis
- **Filas Laravel**: Redis — utilizado como broker para Laravel Queues (Events/Jobs)
- **Filas Python**: Redis — utilizado como broker para Celery (Fila_Processamento)

### Framework e Bibliotecas
- **Frontend**: Vue.js 3 + Vite + Pinia (state management) + Vue Router + Chart.js (gráficos)
- **Laravel**: Laravel 11+ com Sanctum (autenticação por token) + Laravel Queues com Redis
- **Python**: FastAPI + Celery + Keras/TensorFlow + PyMongo

## Design dos Componentes

### 1. Estrutura de Diretórios do Projeto

```
mathIA/
├── docker-compose.yml
├── .env
├── Makefile                    # Makefile raiz (orquestra todos os serviços)
├── frontend/
│   ├── Makefile
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── nginx/
│   │       └── default.conf
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── router/
│       │   └── index.js
│       ├── stores/
│       │   ├── tarefas.js
│       │   ├── licoes.js
│       │   ├── progresso.js
│       │   └── inferencia.js
│       ├── components/
│       │   ├── LoadingSpinner.vue
│       │   ├── ErrorMessage.vue
│       │   ├── TarefaCard.vue
│       │   ├── LicaoForm.vue
│       │   ├── ProgressoChart.vue
│       │   └── InferenciaResult.vue
│       ├── views/
│       │   ├── TarefasView.vue
│       │   ├── EnsinarView.vue
│       │   ├── ProgressoView.vue
│       │   └── TestarView.vue
│       └── services/
│           └── api.js
├── laravel/
│   ├── Makefile
│   ├── docker/
│   │   ├── Dockerfile
│   │   ├── nginx/
│   │   │   └── default.conf
│   │   └── workers/
│   │       └── supervisor.conf
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── TarefaController.php
│   │   │   │   ├── LicaoController.php
│   │   │   │   ├── TreinamentoController.php
│   │   │   │   ├── ProgressoController.php
│   │   │   │   └── InferenciaController.php
│   │   │   ├── Requests/
│   │   │   │   ├── StoreLicaoRequest.php
│   │   │   │   ├── IniciarTreinamentoRequest.php
│   │   │   │   └── ExecutarInferenciaRequest.php
│   │   │   └── Middleware/
│   │   ├── DTOs/
│   │   │   ├── LicaoDTO.php
│   │   │   ├── TarefaDTO.php
│   │   │   ├── TreinamentoDTO.php
│   │   │   ├── ProgressoDTO.php
│   │   │   └── InferenciaDTO.php
│   │   ├── Repositories/
│   │   │   ├── TarefaRepository.php
│   │   │   ├── LicaoRepository.php
│   │   │   ├── ProgressoRepository.php
│   │   │   └── InferenciaRepository.php
│   │   ├── Actions/
│   │   │   ├── ListarTarefasAction.php
│   │   │   ├── EnviarLicaoAction.php
│   │   │   ├── IniciarTreinamentoAction.php
│   │   │   ├── ConsultarProgressoAction.php
│   │   │   └── ExecutarInferenciaAction.php
│   │   ├── Events/
│   │   │   ├── TreinamentoSolicitadoEvent.php
│   │   │   └── TreinamentoConcluidoEvent.php
│   │   ├── Jobs/
│   │   │   └── ProcessarTreinamentoJob.php
│   │   └── Services/
│   │       └── PythonApiService.php
│   └── routes/
│       └── api.php
└── python-api/
    ├── Makefile
    ├── docker/
    │   ├── Dockerfile
    │   ├── nginx/
    │   │   └── default.conf
    │   └── workers/
    │       └── celery.conf
    ├── requirements.txt
    ├── app/
    │   ├── main.py
    │   ├── config.py
    │   ├── controllers/
    │   │   ├── tarefa_controller.py
    │   │   ├── licao_controller.py
    │   │   ├── treinamento_controller.py
    │   │   ├── progresso_controller.py
    │   │   └── inferencia_controller.py
    │   ├── dtos/
    │   │   ├── tarefa_dto.py
    │   │   ├── licao_dto.py
    │   │   ├── treinamento_dto.py
    │   │   ├── progresso_dto.py
    │   │   └── inferencia_dto.py
    │   ├── repositories/
    │   │   ├── tarefa_repository.py
    │   │   ├── licao_repository.py
    │   │   ├── progresso_repository.py
    │   │   └── inferencia_repository.py
    │   ├── actions/
    │   │   ├── listar_tarefas_action.py
    │   │   ├── enviar_licao_action.py
    │   │   ├── iniciar_treinamento_action.py
    │   │   ├── consultar_progresso_action.py
    │   │   └── executar_inferencia_action.py
    │   ├── models/
    │   │   └── keras_model_manager.py
    │   └── tasks/
    │       └── treinamento_task.py
    └── models/                 # Diretório para modelos Keras salvos
        └── .gitkeep
```

### 2. Infraestrutura Docker (Requisito 10)

#### docker-compose.yml

```yaml
version: "3.8"

services:
  mathia-frontend:
    build:
      context: ./frontend
      dockerfile: docker/Dockerfile
    container_name: mathia-frontend
    ports:
      - "${FRONTEND_PORT:-3000}:80"
    networks:
      - mathia_network
    restart: unless-stopped
    depends_on:
      - mathia-laravel

  mathia-laravel:
    build:
      context: ./laravel
      dockerfile: docker/Dockerfile
    container_name: mathia-laravel
    ports:
      - "${LARAVEL_PORT:-8000}:80"
    networks:
      - mathia_network
    restart: unless-stopped
    depends_on:
      - mathia-mysql
      - mathia-redis
    env_file:
      - .env

  mathia-laravel-worker:
    build:
      context: ./laravel
      dockerfile: docker/Dockerfile
    container_name: mathia-laravel-worker
    command: php artisan queue:work redis --sleep=3 --tries=3
    networks:
      - mathia_network
    restart: unless-stopped
    depends_on:
      - mathia-mysql
      - mathia-redis
    env_file:
      - .env

  mathia-python-api:
    build:
      context: ./python-api
      dockerfile: docker/Dockerfile
    container_name: mathia-python-api
    networks:
      - mathia_network
    restart: unless-stopped
    depends_on:
      - mathia-mongodb
      - mathia-redis
    env_file:
      - .env
    volumes:
      - mathia-models:/app/models

  mathia-celery-worker:
    build:
      context: ./python-api
      dockerfile: docker/Dockerfile
    container_name: mathia-celery-worker
    command: celery -A app.tasks worker --loglevel=info
    networks:
      - mathia_network
    restart: unless-stopped
    depends_on:
      - mathia-mongodb
      - mathia-redis
    env_file:
      - .env
    volumes:
      - mathia-models:/app/models

  mathia-mysql:
    image: mysql:8.0
    container_name: mathia-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mathia-mysql-data:/var/lib/mysql
    networks:
      - mathia_network
    restart: unless-stopped

  mathia-mongodb:
    image: mongo:7
    container_name: mathia-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE}
    volumes:
      - mathia-mongo-data:/data/db
    networks:
      - mathia_network
    restart: unless-stopped

  mathia-redis:
    image: redis:7-alpine
    container_name: mathia-redis
    networks:
      - mathia_network
    restart: unless-stopped

networks:
  mathia_network:
    driver: bridge
    name: mathia_network

volumes:
  mathia-mysql-data:
  mathia-mongo-data:
  mathia-models:
```

#### Makefile por Serviço

Cada serviço possui um Makefile com os targets padrão:

```makefile
# Exemplo: laravel/Makefile
.PHONY: install run test

install:
	composer install
	cp .env.example .env
	php artisan key:generate

run:
	php artisan serve --host=0.0.0.0 --port=8000

test:
	php artisan test
```

```makefile
# Exemplo: python-api/Makefile
.PHONY: install run test

install:
	pip install -r requirements.txt

run:
	uvicorn app.main:app --host 0.0.0.0 --port 5000

test:
	pytest
```

```makefile
# Exemplo: frontend/Makefile
.PHONY: install run build

install:
	npm install

run:
	npm run dev

build:
	npm run build
```

#### Arquivo .env (raiz)

```env
# Portas externas
FRONTEND_PORT=3000
LARAVEL_PORT=8000

# MySQL (Camada_Laravel)
DB_ROOT_PASSWORD=secret
DB_DATABASE=mathia
DB_USERNAME=mathia_user
DB_PASSWORD=secret
DB_HOST=mathia-mysql
DB_PORT=3306

# MongoDB (API_Python)
MONGO_USERNAME=mathia_user
MONGO_PASSWORD=secret
MONGO_DATABASE=mathia
MONGO_HOST=mathia-mongodb
MONGO_PORT=27017

# Redis
REDIS_HOST=mathia-redis
REDIS_PORT=6379

# URLs internas
PYTHON_API_URL=http://mathia-python-api:5000
LARAVEL_API_URL=http://mathia-laravel:80
```

### 3. Frontend Vue.js (Requisitos 1, 4, 5, 9)

#### Roteamento

| Rota | View | Descrição |
|------|------|-----------|
| `/` | TarefasView | Lista de tarefas de aprendizado |
| `/ensinar/:tarefaId` | EnsinarView | Formulário de envio de lições |
| `/progresso` | ProgressoView | Gráficos de evolução do modelo |
| `/testar` | TestarView | Interface de teste/inferência |

#### Serviço de API (services/api.js)

Módulo centralizado para comunicação com a Camada_Laravel. Todas as requisições passam por este serviço que:
- Adiciona token de autenticação no header `Authorization: Bearer {token}`
- Trata erros de rede e exibe mensagem amigável via componente ErrorMessage
- Retorna dados no formato padronizado `{ status, data, error }`

#### Stores (Pinia)

- `tarefas.js` — estado e ações para listar/atualizar tarefas
- `licoes.js` — estado e ações para enviar lições
- `progresso.js` — estado e ações para consultar progresso do modelo
- `inferencia.js` — estado e ações para executar testes de inferência

### 4. Camada Laravel (Requisito 6)

#### Endpoints REST

| Método | Rota | Controller | Action |
|--------|------|------------|--------|
| GET | `/api/tarefas` | TarefaController@index | ListarTarefasAction |
| POST | `/api/licoes` | LicaoController@store | EnviarLicaoAction |
| POST | `/api/treinamento` | TreinamentoController@store | IniciarTreinamentoAction |
| GET | `/api/progresso` | ProgressoController@index | ConsultarProgressoAction |
| POST | `/api/inferencia` | InferenciaController@store | ExecutarInferenciaAction |

#### Fluxo de Requisição

```
Request → Middleware (Auth) → FormRequest (Validação) → Controller → Action → DTO → PythonApiService → Response
```

#### PythonApiService

Classe de serviço que encapsula a comunicação HTTP com a API_Python:
- Utiliza `Http::` facade do Laravel
- URL base configurada via variável de ambiente `PYTHON_API_URL`
- Trata timeouts e erros de conexão
- Retorna DTOs tipados

#### Fluxo Assíncrono (Treinamento)

```
Controller → IniciarTreinamentoAction → dispatch(TreinamentoSolicitadoEvent)
  → ProcessarTreinamentoJob (via Redis Queue)
    → PythonApiService::iniciarTreinamento()
      → Polling de status ou webhook de conclusão
        → dispatch(TreinamentoConcluidoEvent)
          → Broadcasting para Frontend via WebSocket/SSE
```

### 5. API Python com Keras (Requisitos 7, 8)

#### Endpoints REST (FastAPI)

| Método | Rota | Controller | Action |
|--------|------|------------|--------|
| GET | `/api/tarefas` | tarefa_controller | listar_tarefas_action |
| POST | `/api/licoes` | licao_controller | enviar_licao_action |
| POST | `/api/treinamento` | treinamento_controller | iniciar_treinamento_action |
| GET | `/api/progresso` | progresso_controller | consultar_progresso_action |
| GET | `/api/treinamento/{id}/status` | treinamento_controller | status_treinamento |
| POST | `/api/inferencia` | inferencia_controller | executar_inferencia_action |

#### KerasModelManager

Classe responsável por gerenciar o ciclo de vida do Modelo_Keras:

```python
class KerasModelManager:
    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        self.model = None

    def carregar_ou_criar(self) -> keras.Model:
        """Carrega modelo do disco ou cria novo com arquitetura padrão"""

    def salvar(self, model: keras.Model) -> str:
        """Serializa modelo em formato SavedModel"""

    def treinar(self, model: keras.Model, dados: list, config: dict) -> dict:
        """Executa treinamento e retorna métricas"""

    def inferir(self, model: keras.Model, entrada: dict) -> dict:
        """Executa inferência e retorna predição com confiança"""
```

#### Celery Tasks (Fila_Processamento)

```python
@celery_app.task(bind=True)
def executar_treinamento(self, sessao_id: str, tarefa_id: str):
    """
    Task assíncrona que:
    1. Carrega lições da tarefa via Repository
    2. Carrega modelo atual via KerasModelManager
    3. Executa treinamento com callbacks de progresso
    4. Salva modelo atualizado
    5. Registra métricas no Progresso_Modelo via Repository
    """
```

#### Serialização Round-Trip (Requisito 8.3)

O KerasModelManager garante a propriedade round-trip:
- `salvar(modelo)` → arquivo em disco (formato SavedModel)
- `carregar(arquivo)` → modelo em memória
- `salvar(carregar(arquivo))` → arquivo equivalente ao original
- Verificação: pesos e arquitetura do modelo carregado devem ser idênticos ao original

### 6. Formato de Resposta Padronizado

Todas as APIs (Laravel e Python) retornam respostas no formato:

```json
{
  "status": "success" | "error",
  "data": { ... } | null,
  "error": null | { "message": "...", "fields": { ... } }
}
```

### 7. Autenticação

- Laravel Sanctum gera tokens de API para autenticação
- Todas as requisições do Frontend_Vue incluem `Authorization: Bearer {token}`
- A comunicação Laravel → API_Python utiliza token de serviço interno configurado via variável de ambiente


## Propriedades de Corretude

### Propriedade 1: Consistência de Resposta JSON (Requisitos 6.10, 7.7)

**Tipo:** Invariante

Toda resposta HTTP da Camada_Laravel e da API_Python deve conter os campos obrigatórios "status", "data" e "error". Para qualquer input válido ou inválido, a estrutura da resposta permanece consistente.

- Para respostas de sucesso: `status == "success"`, `data != null`, `error == null`
- Para respostas de erro: `status == "error"`, `data == null`, `error != null`

### Propriedade 2: Validação de Lições (Requisitos 2.2, 2.4, 2.5)

**Tipo:** Propriedade Metamórfica

Para qualquer conjunto de dados de entrada gerado:
- Dados válidos (com campos obrigatórios preenchidos corretamente) devem ser aceitos e persistidos
- Dados inválidos (campos ausentes, tipos incorretos) devem ser rejeitados com mensagem descritiva
- `len(lições_rejeitadas) + len(lições_aceitas) == len(lições_submetidas)`

### Propriedade 3: Round-Trip de Serialização do Modelo Keras (Requisito 8.3)

**Tipo:** Round-Trip

Para qualquer Modelo_Keras treinado:
- `carregar(salvar(modelo))` deve produzir um modelo com pesos equivalentes ao original
- `inferir(carregar(salvar(modelo)), entrada) == inferir(modelo, entrada)` para qualquer entrada válida
- A arquitetura (camadas, configuração) do modelo carregado deve ser idêntica à do modelo original

### Propriedade 4: Autenticação por Token (Requisitos 6.8, 6.9)

**Tipo:** Condição de Erro

Para qualquer requisição gerada aleatoriamente:
- Requisições sem header `Authorization` devem retornar HTTP 401
- Requisições com token inválido/expirado devem retornar HTTP 401
- Requisições com token válido devem ser processadas normalmente (HTTP 2xx ou 4xx por validação de dados, nunca 401)

### Propriedade 5: Persistência de Lições via Repository (Requisito 2.4)

**Tipo:** Round-Trip

Para qualquer Lição válida submetida:
- `buscar(armazenar(lição).id)` deve retornar uma lição com dados equivalentes à original
- Os campos `entrada`, `saída_esperada` e `tarefa_id` devem ser preservados após persistência

### Propriedade 6: Inferência Retorna Confiança Válida (Requisito 5.2)

**Tipo:** Invariante

Para qualquer entrada válida submetida para inferência:
- O nível de confiança retornado deve estar no intervalo [0.0, 1.0]
- A predição deve ser não-nula quando o modelo está treinado
- O formato da resposta deve conter `predicao` e `confianca`

### Propriedade 7: Progresso do Modelo Contém Campos Obrigatórios (Requisito 4.2)

**Tipo:** Invariante

Para qualquer consulta ao histórico de progresso:
- Cada registro deve conter `timestamp`, `acuracia`, `perda` e `epocas`
- `acuracia` deve estar no intervalo [0.0, 1.0]
- `perda` deve ser um valor numérico >= 0
- `epocas` deve ser um inteiro positivo
- Os registros devem estar ordenados por `timestamp` crescente

### Propriedade 8: Idempotência de Containers Docker (Requisito 10.8)

**Tipo:** Idempotência

Executar `docker-compose up` múltiplas vezes deve produzir o mesmo estado final:
- Todos os containers devem estar em execução
- A rede `mathia_network` deve existir e conectar todos os containers
- Os volumes devem preservar dados entre reinicializações

### Propriedade 9: Registro de Testes de Inferência (Requisito 5.5)

**Tipo:** Round-Trip

Para qualquer teste de inferência executado:
- `buscar_teste(executar_teste(entrada).id)` deve retornar um registro com `entrada`, `predicao` e `confianca` preservados
- O número total de registros de teste deve incrementar em 1 após cada execução

## Considerações de Teste

### Testes Property-Based (Recomendados)
- Propriedades 1-7 e 9 são adequadas para testes property-based com geração aleatória de inputs
- Utilizar Hypothesis (Python) e Pest com faker (Laravel) para geração de dados

### Testes de Integração (Recomendados)
- Propriedade 8 (Docker) deve ser testada como integração com 1-2 execuções
- Comunicação entre serviços via rede Docker
- Fluxo completo: Frontend → Laravel → Python → Keras → resposta

### Testes que NÃO são Property-Based
- Verificação de existência de Dockerfiles, Makefiles e configurações (testes de estrutura)
- Testes de UI/componentes Vue.js (testes de snapshot/exemplo)
- Verificação de acessibilidade ARIA (testes de exemplo com ferramentas específicas)
