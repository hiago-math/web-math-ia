# Tasks — Interface de Massa de Aprendizado — web-math-ia

## Task 1: Store
- [ ] 1.1 Criar `src/stores/aprendizado.js` com estado, ações de upload, listagem, remoção e treinamento

## Task 2: Componentes
- [ ] 2.1 Criar `src/components/UploadZone.vue` — drag-and-drop com preview e relatório pós-upload
- [ ] 2.2 Criar `src/components/AprendizadoStats.vue` — cards de totais por status e modo
- [ ] 2.3 Criar `src/components/ExemplosTable.vue` — tabela paginada com filtros e busca
- [ ] 2.4 Criar `src/components/TreinamentoPanel.vue` — botão treinar + polling de status

## Task 3: View e Rota
- [ ] 3.1 Criar `src/views/AprendizadoView.vue` compondo os componentes
- [ ] 3.2 Adicionar rota `/aprendizado` no `src/router/index.js`
- [ ] 3.3 Adicionar link "Aprendizado" na nav do `App.vue`

## Task 4: Testes de UI
- [ ] 4.1 Upload de JSON exibe relatório correto
- [ ] 4.2 Filtro por modo funciona
- [ ] 4.3 Remoção de exemplo atualiza tabela
- [ ] 4.4 Botão treinar desabilitado quando < 5 exemplos pendentes
