# Requirements Document — Autenticação com Sanctum (web-math-ia)

## Introdução

O **web-math-ia** é a SPA Vue.js 3 do projeto mathIA. Atualmente não possui telas de autenticação nem proteção de rotas. Esta feature adiciona as telas de Login e Registro, a store Pinia `auth`, guards de rota no Vue Router e o tratamento de respostas 401 no Axios, integrando com os endpoints Sanctum do `api-math`.

## Glossário

- **Auth_Store**: Store Pinia (`useAuthStore`) que centraliza o estado de autenticação: `user`, `token` e `isAuthenticated`.
- **Token**: String Bearer retornada pelo `api-math` após login ou registro, armazenada no `localStorage` como `mathia_token`.
- **LoginView**: Componente Vue em `/login` com formulário de e-mail e senha.
- **RegisterView**: Componente Vue em `/register` com formulário de nome, e-mail e senha.
- **Router_Guard**: Função `beforeEach` do Vue Router que controla acesso a rotas protegidas e públicas.
- **Rota_Protegida**: Qualquer rota que exige autenticação (todas exceto `/login` e `/register`).
- **Rota_Pública**: Rotas `/login` e `/register`, acessíveis sem autenticação.
- **Interceptor_401**: Interceptor de resposta do Axios que redireciona para `/login` ao receber HTTP 401.
- **api**: Instância Axios configurada em `src/services/api.js`.

---

## Requisitos

### Requisito 1: Store de Autenticação (Pinia)

**User Story:** Como desenvolvedor, quero uma store centralizada de autenticação, para que qualquer componente possa acessar o estado do usuário logado e executar ações de auth.

#### Critérios de Aceitação

1. THE Auth_Store SHALL expor o estado reativo: `user` (objeto ou null), `token` (string ou null) e `isAuthenticated` (boolean derivado de `token !== null`).
2. WHEN a Auth_Store é inicializada, THE Auth_Store SHALL ler o Token do `localStorage` (chave `mathia_token`) e, se presente, definir `token` com esse valor.
3. WHEN a action `login(email, password)` é chamada com credenciais válidas, THE Auth_Store SHALL chamar `POST /api/auth/login`, armazenar o Token no `localStorage` e atualizar `user` e `token` no estado.
4. WHEN a action `register(name, email, password)` é chamada com dados válidos, THE Auth_Store SHALL chamar `POST /api/auth/register`, armazenar o Token no `localStorage` e atualizar `user` e `token` no estado.
5. WHEN a action `logout()` é chamada, THE Auth_Store SHALL chamar `POST /api/auth/logout`, remover o Token do `localStorage` e redefinir `user` e `token` para null.
6. WHEN a action `fetchUser()` é chamada com Token presente, THE Auth_Store SHALL chamar `GET /api/auth/me` e atualizar `user` no estado com os dados retornados.
7. IF qualquer action da Auth_Store receber um erro da api, THEN THE Auth_Store SHALL armazenar a mensagem de erro no estado `error` e relançar o erro para que o componente possa tratá-lo.

---

### Requisito 2: Tela de Login

**User Story:** Como usuário não autenticado, quero acessar uma tela de login, para que eu possa informar minhas credenciais e acessar o sistema.

#### Critérios de Aceitação

1. THE LoginView SHALL renderizar um formulário com campos `email` (type="email", required) e `password` (type="password", required) e um botão de submissão.
2. WHEN o formulário de login é submetido com dados válidos, THE LoginView SHALL chamar `authStore.login(email, password)` e, em caso de sucesso, redirecionar para `/`.
3. WHEN o formulário de login é submetido e a api retorna erro, THE LoginView SHALL exibir a mensagem de erro retornada pela api sem recarregar a página.
4. WHILE a requisição de login está em andamento, THE LoginView SHALL desabilitar o botão de submissão e exibir indicador de carregamento.
5. THE LoginView SHALL conter um link para `/register` para usuários sem conta.
6. WHEN um usuário já autenticado acessa `/login`, THE Router_Guard SHALL redirecionar para `/`.

---

### Requisito 3: Tela de Registro

**User Story:** Como novo usuário, quero acessar uma tela de registro, para que eu possa criar minha conta e começar a usar o mathIA.

#### Critérios de Aceitação

1. THE RegisterView SHALL renderizar um formulário com campos `name` (type="text", required), `email` (type="email", required) e `password` (type="password", required, mínimo 8 caracteres) e um botão de submissão.
2. WHEN o formulário de registro é submetido com dados válidos, THE RegisterView SHALL chamar `authStore.register(name, email, password)` e, em caso de sucesso, redirecionar para `/`.
3. WHEN o formulário de registro é submetido e a api retorna erro de validação, THE RegisterView SHALL exibir as mensagens de erro por campo retornadas pela api.
4. WHILE a requisição de registro está em andamento, THE RegisterView SHALL desabilitar o botão de submissão e exibir indicador de carregamento.
5. THE RegisterView SHALL conter um link para `/login` para usuários já cadastrados.
6. WHEN um usuário já autenticado acessa `/register`, THE Router_Guard SHALL redirecionar para `/`.

---

### Requisito 4: Guards de Rota

**User Story:** Como usuário não autenticado, quero ser redirecionado para o login ao tentar acessar rotas protegidas, para que o sistema proteja o conteúdo restrito.

#### Critérios de Aceitação

1. THE Router_Guard SHALL verificar `authStore.isAuthenticated` antes de cada navegação.
2. WHEN um usuário não autenticado tenta acessar uma Rota_Protegida, THE Router_Guard SHALL redirecionar para `/login`.
3. WHEN um usuário autenticado tenta acessar `/login` ou `/register`, THE Router_Guard SHALL redirecionar para `/`.
4. THE Sistema SHALL marcar todas as rotas existentes (`/`, `/ensinar/:tarefaId`, `/progresso`, `/testar`, `/chat`) como Rotas_Protegidas via meta `requiresAuth: true`.
5. THE Sistema SHALL marcar `/login` e `/register` como Rotas_Públicas via meta `requiresAuth: false`.

---

### Requisito 5: Tratamento de 401 no Axios

**User Story:** Como usuário com sessão expirada, quero ser redirecionado automaticamente para o login ao receber um erro 401, para que eu não fique preso em uma tela de erro.

#### Critérios de Aceitação

1. WHEN a api retorna HTTP 401 em qualquer requisição, THE Interceptor_401 SHALL limpar o Token do `localStorage`, redefinir o estado da Auth_Store e redirecionar para `/login`.
2. THE Interceptor_401 SHALL evitar redirecionamentos duplicados caso já esteja na rota `/login`.
3. THE api SHALL manter o comportamento atual de rejeitar a Promise com `{ status, data, error }` para erros não-401.

---

### Requisito 6: Exibição do Usuário Autenticado na Navegação

**User Story:** Como usuário autenticado, quero ver meu nome e um botão de logout na barra de navegação, para que eu saiba que estou logado e possa sair facilmente.

#### Critérios de Aceitação

1. WHILE o usuário está autenticado, THE App SHALL exibir o nome do usuário (`authStore.user.name`) na barra de navegação.
2. WHILE o usuário está autenticado, THE App SHALL exibir um botão "Sair" na barra de navegação.
3. WHEN o botão "Sair" é clicado, THE App SHALL chamar `authStore.logout()` e redirecionar para `/login`.
4. WHILE o usuário não está autenticado, THE App SHALL ocultar os links de navegação e o botão "Sair".
