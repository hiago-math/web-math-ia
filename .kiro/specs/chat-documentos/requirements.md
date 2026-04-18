# Spec: Chat com Documentos — web-math-ia

## Objetivo
Permitir que o usuário faça upload de documentos diretamente no chat e
converse com a IA sobre o conteúdo do documento.

## Requirements

### REQ-1: Upload de documento no chat
- [ ] Botão de anexo (📎) na interface do chat
- [ ] Aceitar: PDF, DOCX, TXT, MD
- [ ] Mostrar progresso de processamento ("Indexando documento...")
- [ ] Exibir nome do documento ativo no header do chat
- [ ] Botão para remover documento ativo (volta ao modo normal)

### REQ-2: Indicação visual de modo RAG
- [ ] Badge "📄 Documento ativo" quando há documento selecionado
- [ ] Mensagens da IA com indicador "Baseado em: [nome do arquivo]"
- [ ] Placeholder do input muda para "Pergunte sobre o documento..."

### REQ-3: Gestão de documentos
- [ ] Painel lateral ou modal com documentos indexados
- [ ] Trocar entre documentos sem perder histórico do chat
- [ ] Remover documento da lista

### REQ-4: Integração com store do chat
- [ ] `documentoAtivo` no store do chat
- [ ] Enviado como `documento_id` em cada request

## Critérios de Aceite
- Upload de PDF exibe "Indexando..." e depois "Pronto"
- Pergunta sobre conteúdo do PDF retorna resposta baseada no documento
- Remover documento volta ao chat normal sem perder histórico
