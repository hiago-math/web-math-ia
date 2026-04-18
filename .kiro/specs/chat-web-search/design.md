# Design — Chat com Busca Web — web-math-ia

## Alterações no ChatView

```
ChatView
    ├── chat-toolbar (NOVO)
    │    ├── WebSearchToggle.vue   — toggle 🌐
    │    └── [futuro] outros toggles
    ├── chat-messages
    │    └── BubbleFontes.vue (NOVO) — fontes colapsáveis
    └── chat-input
         └── detecção de @url: prefix
```

## Alterações no Store do Chat

```javascript
// src/stores/chat.js — campos novos
const webSearchAtivo  = ref(false)
const autoSearchAtivo = ref(false)

// Detecção de URL no input
function extrairUrl(texto) {
    const match = texto.match(/^@url:(https?:\/\/\S+)\s*(.*)/)
    return match ? { url: match[1], mensagem: match[2] || texto } : null
}
```

## Componentes Novos

```
src/components/
    WebSearchToggle.vue   — botão toggle com estado visual
    BubbleFontes.vue      — lista colapsável de fontes com favicon
```

## Formato de Mensagem com Fontes

```javascript
// Mensagem da IA com fontes
{
  id: 123,
  role: 'assistant',
  texto: 'O dólar está cotado a R$ 5,20...',
  fontes: [
    { titulo: 'Cotação do Dólar', url: 'https://...', snippet: '...' }
  ]
}
```

## Detecção de @url:

```javascript
// No método enviar() do store
const urlMatch = texto.match(/^@url:(https?:\/\/\S+)\s*(.*)/)
if (urlMatch) {
    payload.url = urlMatch[1]
    payload.mensagem = urlMatch[2] || `Explique o conteúdo de ${urlMatch[1]}`
}
```
