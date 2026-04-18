# Design — Interface de Massa de Aprendizado — web-math-ia

## Arquitetura

```
AprendizadoView (/aprendizado)
    ├── UploadZone.vue          — drag-and-drop + relatório
    ├── AprendizadoStats.vue    — cards de totais
    ├── ExemplosTable.vue       — tabela paginada com filtros
    └── TreinamentoPanel.vue    — botão treinar + histórico
```

## Store

```javascript
// src/stores/aprendizado.js
{
  stats: { pendentes, usados, por_modo: {} },
  exemplos: [],
  total: 0,
  pagina: 1,
  filtros: { modo: '', status: '', busca: '' },
  loading: false,
  uploadResult: null,  // { total, validos, invalidos, duplicados }
  treinando: false,
}
```

## Rotas da API consumidas

| Método | Rota | Uso |
|--------|------|-----|
| POST | /api/aprendizado/upload | Upload de arquivo |
| GET | /api/aprendizado/stats | Estatísticas |
| GET | /api/aprendizado/exemplos | Listar com paginação |
| DELETE | /api/aprendizado/exemplos/{id} | Remover exemplo |
| DELETE | /api/aprendizado/limpar | Limpar pendentes |
| POST | /api/aprendizado/treinar | Iniciar treinamento |
| GET | /api/aprendizado/template/{formato} | Baixar template |

## Rota do Frontend

```javascript
{ path: '/aprendizado', name: 'aprendizado', component: AprendizadoView }
```

## Componente UploadZone

```vue
<!-- Drag-and-drop com preview do arquivo -->
<!-- Após upload: exibe relatório em cards -->
<!-- { total: 50, validos: 48, invalidos: 1, duplicados: 1 } -->
```
