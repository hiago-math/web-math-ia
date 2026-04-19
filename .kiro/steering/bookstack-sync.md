---
name: BookStack Sync - web-math-ia
description: Configuração de sincronização para web-math-ia no BookStack
inclusion: auto
---

# BookStack Sync - web-math-ia

Configuração de sincronização automática para o projeto **web-math-ia** (Vue.js/Node).

## 📚 Localização no BookStack

**Livro**: MATH.IA  
**Seção**: web-math-ia  
**URL**: http://bookstack.localhost/books/math-ia/page/web-math-ia

## 🔄 O que é Sincronizado

- ✅ Configuração MCP (`.kiro/settings/mcp.json`)
- ✅ Especificações de features/bugfixes
- ✅ Requirements, Design e Tasks de cada spec
- ✅ Guias de workflow (steering files)
- ✅ Status de tarefas

## 📋 Estrutura do Projeto

```
web-math-ia/
├── .kiro/
│   ├── settings/
│   │   └── mcp.json
│   ├── specs/
│   │   └── {feature-name}/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── .config.kiro
│   └── steering/
│       └── bookstack-sync.md
├── src/
├── docker/
└── Makefile
```

## 🔧 Configuração MCP

**Servidores**: node-tools, filesystem, git

```json
{
  "mcpServers": {
    "node-tools": { ... },
    "filesystem": { ... },
    "git": { ... }
  }
}
```

## 🚀 Hooks Ativos

- `sync-kiro-bookstack` - Monitora `.kiro/settings/mcp.json`
- `sync-design-bookstack` - Sincroniza design.md
- `sync-new-spec-bookstack` - Cria página para novo spec
- `sync-steering-bookstack` - Sincroniza steering files
- `sync-tasks-bookstack` - Sincroniza tasks.md
- `sync-requirements-bookstack` - Sincroniza requirements.md

## 📝 Notas

- Projeto: Vue.js/Node.js Frontend
- Framework: Vue 3 + Vite
- Padrão: Component-based architecture
- Integração: Conecta com api-math e api-math-ia
