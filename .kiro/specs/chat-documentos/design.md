# Design — Chat com Documentos — web-math-ia

## Alterações no ChatView

```
ChatView
    ├── [NOVO] DocumentoBar.vue     — badge do documento ativo + botão remover
    ├── [NOVO] DocumentoUpload.vue  — botão 📎 + modal de upload/seleção
    ├── chat-messages               — mensagens com indicador de fonte
    └── chat-input                  — placeholder dinâmico
```

## Alterações no Store do Chat

```javascript
// src/stores/chat.js — campos novos
const documentoAtivo = ref(null)  // { id, nome }
const documentos     = ref([])    // lista de documentos indexados

async function uploadDocumento(arquivo) { ... }
async function selecionarDocumento(doc) { ... }
async function removerDocumento(id) { ... }
async function buscarDocumentos() { ... }
```

## Rotas da API consumidas

| Método | Rota | Uso |
|--------|------|-----|
| POST | /api/documentos/upload | Upload e indexação |
| GET | /api/documentos | Listar documentos |
| DELETE | /api/documentos/{id} | Remover documento |

## Fluxo de Upload

```
Usuário clica 📎
    → Abre modal com lista de documentos + botão de upload
    → Seleciona arquivo → POST /api/documentos/upload
    → Loading "Indexando documento..."
    → Sucesso → documentoAtivo = { id, nome }
    → Badge aparece no header do chat
    → Próximas mensagens incluem documento_id
```
