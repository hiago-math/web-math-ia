# Tasks — Autenticação com Sanctum (web-math-ia)

## Resumo

Implementação da autenticação no frontend Vue.js 3. Inclui store Pinia, telas de login e registro, guards de rota, interceptor 401 e atualização da navbar.

---

## Tasks

- [ ] 1. Criar store de autenticação
  - [ ] 1.1 Criar `src/stores/auth.js` com estado `user`, `token` (inicializado do `localStorage`), `error` e computed `isAuthenticated`
  - [ ] 1.2 Implementar action `login(email, password)` que chama `POST /api/auth/login`, salva token no `localStorage` e atualiza estado
  - [ ] 1.3 Implementar action `register(name, email, password)` que chama `POST /api/auth/register`, salva token no `localStorage` e atualiza estado
  - [ ] 1.4 Implementar action `logout()` que chama `POST /api/auth/logout` e, no bloco `finally`, remove token do `localStorage` e redefine `user` e `token` para null
  - [ ] 1.5 Implementar action `fetchUser()` que chama `GET /api/auth/me` e atualiza `user` no estado

- [ ] 2. Criar tela de Login
  - [ ] 2.1 Criar `src/views/LoginView.vue` com formulário contendo campos `email` (type="email") e `password` (type="password"), ambos required
  - [ ] 2.2 Implementar handler de submit que chama `authStore.login()`, redireciona para `/` em caso de sucesso e exibe mensagem de erro em caso de falha
  - [ ] 2.3 Desabilitar botão de submit e exibir texto "Entrando..." enquanto a requisição está em andamento
  - [ ] 2.4 Adicionar link para `/register` na tela de login

- [ ] 3. Criar tela de Registro
  - [ ] 3.1 Criar `src/views/RegisterView.vue` com formulário contendo campos `name` (type="text"), `email` (type="email") e `password` (type="password", minlength="8"), todos required
  - [ ] 3.2 Implementar handler de submit que chama `authStore.register()`, redireciona para `/` em caso de sucesso e exibe erros por campo (validação 422) ou mensagem geral em caso de falha
  - [ ] 3.3 Desabilitar botão de submit e exibir texto "Criando conta..." enquanto a requisição está em andamento
  - [ ] 3.4 Adicionar link para `/login` na tela de registro

- [ ] 4. Atualizar Vue Router com guards de rota
  - [ ] 4.1 Adicionar rotas `/login` (LoginView) e `/register` (RegisterView) com `meta: { requiresAuth: false }`
  - [ ] 4.2 Adicionar `meta: { requiresAuth: true }` a todas as rotas existentes: `/`, `/ensinar/:tarefaId`, `/progresso`, `/testar`, `/chat`
  - [ ] 4.3 Implementar `router.beforeEach` que redireciona para `/login` quando `requiresAuth: true` e `!authStore.isAuthenticated`
  - [ ] 4.4 Implementar no mesmo `beforeEach` o redirecionamento para `/` quando `requiresAuth: false` e `authStore.isAuthenticated`
  - [ ] 4.5 Garantir que `useAuthStore()` seja chamado dentro do `beforeEach` (não no topo do módulo) para evitar erro de Pinia não inicializado

- [ ] 5. Atualizar interceptor Axios para tratar 401
  - [ ] 5.1 Adicionar ao interceptor de resposta em `src/services/api.js` a detecção de `error.response?.status === 401`
  - [ ] 5.2 Quando 401 for detectado, remover `mathia_token` do `localStorage` e redirecionar para `/login` via import dinâmico do router (`import('../router')`)
  - [ ] 5.3 Garantir que o redirecionamento só ocorra se a rota atual não for `/login` (evitar loop)
  - [ ] 5.4 Manter o comportamento existente de rejeitar a Promise com `{ status, data, error }` para todos os erros

- [ ] 6. Atualizar `App.vue` com navbar autenticada
  - [ ] 6.1 Importar `useAuthStore` no `App.vue` e usar `v-if="authStore.isAuthenticated"` para exibir/ocultar links de navegação
  - [ ] 6.2 Exibir o nome do usuário (`authStore.user?.name`) na navbar quando autenticado
  - [ ] 6.3 Adicionar botão "Sair" que chama `authStore.logout()` e redireciona para `/login`

- [ ] 7. Instalar e configurar Vitest para testes (se não existir)
  - [ ] 7.1 Verificar se Vitest já está configurado no projeto; se não, instalar `vitest`, `@vue/test-utils` e `@pinia/testing` como devDependencies
  - [ ] 7.2 Criar `tests/stores/auth.spec.js` com testes de: inicialização com token no localStorage, `isAuthenticated` false sem token, `logout()` limpa estado mesmo com falha na API
  - [ ] 7.3 Criar `tests/views/LoginView.spec.js` com testes de: renderização do formulário, exibição de erro em credenciais inválidas, desabilitação do botão durante loading
  - [ ] 7.4 Criar `tests/router/guards.spec.js` com testes de: redirecionamento para `/login` sem auth, redirecionamento para `/` quando autenticado acessa `/login`
  - [ ] 7.5 Executar `npx vitest --run` e confirmar que todos os testes passam
