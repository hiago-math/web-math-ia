# Spec: Interface de Massa de Aprendizado — web-math-ia

## Objetivo
Tela dedicada para o usuário gerenciar a massa de dados de treinamento da IA:
fazer upload de arquivos, visualizar exemplos, remover dados e iniciar treinamento.

## Requirements

### REQ-1: Upload de arquivos
- [ ] Área de drag-and-drop para upload de arquivos
- [ ] Aceitar: `.json`, `.jsonl`, `.csv`, `.txt`
- [ ] Mostrar progresso do upload
- [ ] Exibir relatório após processamento: total, válidos, inválidos, duplicados
- [ ] Botão para baixar template de cada formato

### REQ-2: Visualização da massa
- [ ] Tabela paginada com exemplos: pergunta (truncada), modo, fonte, status
- [ ] Filtros: por modo, por status (pendente/usado), por fonte
- [ ] Busca por texto na pergunta
- [ ] Botão de remover por linha

### REQ-3: Estatísticas
- [ ] Cards com totais: pendentes, usados, total por modo
- [ ] Indicador visual de "pronto para treinar" (≥5 exemplos pendentes)

### REQ-4: Treinamento
- [ ] Botão "Treinar com massa de dados"
- [ ] Confirmação antes de iniciar
- [ ] Feedback de progresso (polling do status Celery)
- [ ] Histórico de sessões de treinamento

## Critérios de Aceite
- Upload de arquivo com 100 exemplos exibe relatório correto
- Tabela pagina corretamente com muitos exemplos
- Treinamento iniciado aparece como "em andamento"
