# Spec: Chat com Busca Web — web-math-ia

## Objetivo
Permitir que o usuário ative busca na internet no chat para obter
informações atualizadas, com indicação visual das fontes usadas.

## Requirements

### REQ-1: Toggle de busca web
- [ ] Toggle 🌐 no chat para ativar/desativar busca web
- [ ] Estado persistido na sessão (não reseta ao trocar de modo)
- [ ] Indicador visual quando busca web está ativa

### REQ-2: Indicação de fontes
- [ ] Respostas com busca web exibem lista de fontes clicáveis
- [ ] Cada fonte: favicon + título + URL truncada
- [ ] Seção "Fontes" colapsável abaixo da resposta

### REQ-3: Busca manual
- [ ] Campo de busca rápida (fora do chat) para testar queries
- [ ] Exibe resultados brutos antes de enviar ao modelo

### REQ-4: Fetch de URL
- [ ] Usuário pode colar URL no chat com prefixo `@url:`
- [ ] Sistema faz fetch da página e usa como contexto
- [ ] Ex: `@url:https://exemplo.com me explica esse artigo`

## Critérios de Aceite
- Toggle ativo envia `web_search: true` no request
- Resposta com fontes exibe links clicáveis
- URL com prefixo `@url:` é detectada e processada automaticamente
