# Tasks — Chat com Busca Web — web-math-ia

## Task 1: Store
- [ ] 1.1 Adicionar `webSearchAtivo`, `autoSearchAtivo` ao `src/stores/chat.js`
- [ ] 1.2 Incluir `web_search`, `auto_search`, `url` no payload quando aplicável
- [ ] 1.3 Implementar detecção de prefixo `@url:` no método `enviar()`
- [ ] 1.4 Salvar `fontes` nas mensagens da IA quando retornadas pela API

## Task 2: Componentes
- [ ] 2.1 Criar `src/components/WebSearchToggle.vue` — toggle com ícone 🌐 e estado visual
- [ ] 2.2 Criar `src/components/BubbleFontes.vue` — lista colapsável de fontes com favicon e URL
- [ ] 2.3 Atualizar `ChatView.vue` para incluir toolbar com toggle
- [ ] 2.4 Atualizar bubble de mensagem da IA para exibir `BubbleFontes` quando há fontes

## Task 3: Integração
- [ ] 3.1 Toggle ativo muda visual do botão e envia `web_search: true`
- [ ] 3.2 Mensagem com `@url:` extrai URL e envia no campo correto
- [ ] 3.3 Resposta com fontes exibe seção colapsável "Fontes consultadas"

## Task 4: Testes de UI
- [ ] 4.1 Toggle ativo exibe indicador visual e envia parâmetro correto
- [ ] 4.2 Resposta com fontes exibe links clicáveis
- [ ] 4.3 `@url:https://exemplo.com` é detectado e processado
- [ ] 4.4 Toggle desativado não envia web_search no payload
