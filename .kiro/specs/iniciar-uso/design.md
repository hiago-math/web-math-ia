# Design — Iniciar Uso — web-math-ia

## Fluxo de Inicialização

### Desenvolvimento (hot-reload)
```bash
cd web-math-ia
make dev
# Acesso: http://mathia.localhost
# Vite HMR ativo — alterações refletem instantaneamente
```

### Produção (build estático)
```bash
cd web-math-ia
make up
# Build multi-stage: Node (build) → Nginx (serve)
# Acesso: http://mathia.localhost
```

## Pré-requisitos
- `api-math` rodando em `http://mathia-api.localhost`
- `api-math-ia` rodando em `http://mathia-python-api:5000` (interno)
- Traefik ativo na rede `fintools`
- Entrada no hosts do Windows:
  ```
  127.0.0.1 mathia.localhost
  127.0.0.1 mathia-api.localhost
  127.0.0.1 mathia-ia.localhost
  ```

## Fluxo Completo pelo Frontend

### 1. Criar tarefa (via curl ou futura UI)
```bash
curl -X POST http://mathia-api.localhost/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"nome":"XOR","descricao":"Aprender XOR"}'
```

### 2. Ensinar
- Acessar `http://mathia.localhost`
- Clicar em "Ensinar" na tarefa criada
- Inserir `[0,0]` e `[0]`, enviar
- Repetir para `[0,1]→[1]`, `[1,0]→[1]`, `[1,1]→[0]`

### 3. Treinar (via curl)
```bash
curl -X POST http://mathia-api.localhost/api/treinamento \
  -H "Content-Type: application/json" \
  -d '{"tarefa_id":"ID","epocas":50}'
```

### 4. Acompanhar progresso
- Acessar `/progresso`, selecionar a tarefa
- Gráfico exibe acurácia e perda por sessão

### 5. Testar
- Acessar `/testar`, selecionar tarefa
- Inserir `[1, 0]`, clicar Testar
- Ver predição e confiança

### 6. Chat
- Acessar `/chat`, selecionar tarefa
- Digitar `[1, 0]` e pressionar Enter
- IA responde com predição e barra de confiança

## Troubleshooting
| Problema | Causa | Solução |
|----------|-------|---------|
| Tarefas não carregam | API inacessível ou CORS | Verificar `VITE_API_URL` e se api-math está up |
| Chat sem resposta | Modelo não treinado | Treinar a tarefa primeiro |
| 404 em mathia.localhost | Traefik não detectou container | `docker compose down && make up` |
| HMR não funciona | `usePolling` desativado | Verificar `vite.config.js` |
