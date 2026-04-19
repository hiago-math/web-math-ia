---
inclusion: auto
---

# math.IA - Documentação Centralizada

## Contexto: Você está trabalhando na frente **web-math-ia** (Vue.js)

Esta é a interface web do projeto math.IA, responsável pela experiência do usuário e integração com as APIs.

### Antes de Executar Qualquer Tarefa

1. **Consulte a documentação do BookStack**: Livro `math.IA`, página `web-math-ia`
2. **Revise as regras de negócio** neste diretório: `regras-de-negocio.md`
3. **Verifique a visão técnica**: `visao-tecnica.md`
4. **Considere o contexto das outras frentes**:
   - `api-math` (PHP/Laravel) - API REST tradicional
   - `api-math-ia` (Python/FastAPI) - IA e ML

### Estrutura de Configuração

```
web-math-ia/.kiro/
├── specs/              # Especificações de features e bugfixes
├── steering/           # Diretrizes e padrões (este arquivo)
├── settings/           # Configurações MCP
├── hooks.json          # Automações
└── tasks.md            # Tarefas globais
```

### Hooks Configurados

- **Consultar Documentação**: Antes de qualquer ação, consulta BookStack
- **Sincronizar para BookStack**: Mudanças em specs são sincronizadas automaticamente
- **Sincronizar Steering**: Atualizações de diretrizes são sincronizadas

### Fluxo de Trabalho

1. Crie specs em `.kiro/specs/{feature-name}/`
2. Documente requirements, design e tasks
3. Hooks sincronizam automaticamente para BookStack
4. Execute tarefas conforme documentado

---

**Frente**: web-math-ia (Vue.js)  
**Última atualização**: 2026-04-18
