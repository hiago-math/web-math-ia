# Tasks — Chat com Documentos — web-math-ia

## Task 1: Store
- [ ] 1.1 Adicionar `documentoAtivo`, `documentos` ao `src/stores/chat.js`
- [ ] 1.2 Implementar `uploadDocumento`, `selecionarDocumento`, `removerDocumento`, `buscarDocumentos`
- [ ] 1.3 Incluir `documento_id` no payload de cada mensagem enviada

## Task 2: Componentes
- [ ] 2.1 Criar `src/components/DocumentoBar.vue` — badge do documento ativo + botão remover
- [ ] 2.2 Criar `src/components/DocumentoUpload.vue` — modal com lista + upload drag-and-drop
- [ ] 2.3 Atualizar `ChatView.vue` para incluir os novos componentes
- [ ] 2.4 Atualizar placeholder do textarea quando documento ativo

## Task 3: Indicadores visuais
- [ ] 3.1 Badge "📄 [nome do arquivo]" no header quando documento ativo
- [ ] 3.2 Mensagens da IA com tag "Baseado no documento" quando RAG ativo
- [ ] 3.3 Loading "Indexando documento..." durante upload

## Task 4: Testes de UI
- [ ] 4.1 Upload de PDF exibe loading e depois badge
- [ ] 4.2 Mensagem enviada com documento ativo inclui documento_id
- [ ] 4.3 Remover documento limpa badge e volta ao modo normal
- [ ] 4.4 Trocar documento mantém histórico do chat
