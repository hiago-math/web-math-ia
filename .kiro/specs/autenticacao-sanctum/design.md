# Design Document — Autenticação com Sanctum (web-math-ia)

## Visão Geral

Este documento descreve a implementação técnica da autenticação no frontend **web-math-ia** (Vue.js 3 + Pinia + Vue Router + Axios). O frontend já possui o interceptor de request que injeta o token Bearer; esta feature adiciona a store de auth, as telas de login/registro, os guards de rota e o interceptor de resposta 401.

---

## Arquitetura

```
src/
├── stores/
│   └── auth.js                  ← Store Pinia (NOVO)
├── views/
│   ├── LoginView.vue            ← Tela de login (NOVO)
│   ├── RegisterView.vue         ← Tela de registro (NOVO)
│   └── [views existentes]
├── router/
│   └── index.js                 ← Atualizar: rotas + guards (MODIFICAR)
├── services/
│   └── api.js                   ← Adicionar interceptor 401 (MODIFICAR)
└── App.vue                      ← Adicionar nome do usuário + botão logout (MODIFICAR)
```

---

## Componentes

### 1. Store `auth` — `src/stores/auth.js`

Segue o padrão Composition API (igual às stores existentes como `chat.js`).

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
    const user  = ref(null)
    const token = ref(localStorage.getItem('mathia_token') || null)
    const error = ref(null)

    const isAuthenticated = computed(() => token.value !== null)

    async function login(email, password) {
        error.value = null
        const res = await api.post('/api/auth/login', { email, password })
        _setSession(res.data)
    }

    async function register(name, email, password) {
        error.value = null
        const res = await api.post('/api/auth/register', { name, email, password })
        _setSession(res.data)
    }

    async function logout() {
        try {
            await api.post('/api/auth/logout')
        } finally {
            _clearSession()
        }
    }

    async function fetchUser() {
        const res = await api.get('/api/auth/me')
        user.value = res.data.user
    }

    function _setSession(data) {
        token.value = data.token
        user.value  = data.user
        localStorage.setItem('mathia_token', data.token)
    }

    function _clearSession() {
        token.value = null
        user.value  = null
        localStorage.removeItem('mathia_token')
    }

    return { user, token, error, isAuthenticated, login, register, logout, fetchUser }
})
```

**Nota sobre erros:** As actions não capturam erros internamente — eles propagam para o componente chamador, que exibe a mensagem. O `error` state é usado apenas para erros que o componente não trata diretamente.

---

### 2. `LoginView.vue` — `src/views/LoginView.vue`

```vue
<template>
  <div class="auth-container">
    <h1>Entrar no mathIA</h1>
    <form @submit.prevent="handleLogin" novalidate>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input id="email" v-model="form.email" type="email" required autocomplete="email" />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" v-model="form.password" type="password" required autocomplete="current-password" />
      </div>
      <p v-if="errorMsg" class="error-msg" role="alert">{{ errorMsg }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
    <p>Não tem conta? <router-link to="/register">Registre-se</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const form     = ref({ email: '', password: '' })
const loading  = ref(false)
const errorMsg = ref('')

async function handleLogin() {
    loading.value  = true
    errorMsg.value = ''
    try {
        await authStore.login(form.value.email, form.value.password)
        router.push('/')
    } catch (e) {
        errorMsg.value = e.error?.message || 'Erro ao fazer login.'
    } finally {
        loading.value = false
    }
}
</script>
```

---

### 3. `RegisterView.vue` — `src/views/RegisterView.vue`

```vue
<template>
  <div class="auth-container">
    <h1>Criar conta no mathIA</h1>
    <form @submit.prevent="handleRegister" novalidate>
      <div class="form-group">
        <label for="name">Nome</label>
        <input id="name" v-model="form.name" type="text" required autocomplete="name" />
      </div>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input id="email" v-model="form.email" type="email" required autocomplete="email" />
      </div>
      <div class="form-group">
        <label for="password">Senha <small>(mínimo 8 caracteres)</small></label>
        <input id="password" v-model="form.password" type="password" required
               minlength="8" autocomplete="new-password" />
      </div>
      <div v-if="fieldErrors" class="field-errors" role="alert">
        <p v-for="(msgs, field) in fieldErrors" :key="field">
          <strong>{{ field }}:</strong> {{ msgs.join(', ') }}
        </p>
      </div>
      <p v-if="errorMsg" class="error-msg" role="alert">{{ errorMsg }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Criando conta...' : 'Criar conta' }}
      </button>
    </form>
    <p>Já tem conta? <router-link to="/login">Entrar</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const form        = ref({ name: '', email: '', password: '' })
const loading     = ref(false)
const errorMsg    = ref('')
const fieldErrors = ref(null)

async function handleRegister() {
    loading.value     = true
    errorMsg.value    = ''
    fieldErrors.value = null
    try {
        await authStore.register(form.value.name, form.value.email, form.value.password)
        router.push('/')
    } catch (e) {
        if (e.error && typeof e.error === 'object' && !e.error.message) {
            fieldErrors.value = e.error  // erros de validação por campo
        } else {
            errorMsg.value = e.error?.message || 'Erro ao criar conta.'
        }
    } finally {
        loading.value = false
    }
}
</script>
```

---

### 4. Atualização do Router — `src/router/index.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import TarefasView   from '../views/TarefasView.vue'
import EnsinarView   from '../views/EnsinarView.vue'
import ProgressoView from '../views/ProgressoView.vue'
import TestarView    from '../views/TestarView.vue'
import ChatView      from '../views/ChatView.vue'
import LoginView     from '../views/LoginView.vue'
import RegisterView  from '../views/RegisterView.vue'

const routes = [
    // Rotas protegidas
    { path: '/',                  name: 'tarefas',   component: TarefasView,   meta: { requiresAuth: true } },
    { path: '/ensinar/:tarefaId', name: 'ensinar',   component: EnsinarView,   meta: { requiresAuth: true }, props: true },
    { path: '/progresso',         name: 'progresso', component: ProgressoView, meta: { requiresAuth: true } },
    { path: '/testar',            name: 'testar',    component: TestarView,    meta: { requiresAuth: true } },
    { path: '/chat',              name: 'chat',      component: ChatView,      meta: { requiresAuth: true } },
    // Rotas públicas
    { path: '/login',    name: 'login',    component: LoginView,    meta: { requiresAuth: false } },
    { path: '/register', name: 'register', component: RegisterView, meta: { requiresAuth: false } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login' }
    }

    if (to.meta.requiresAuth === false && authStore.isAuthenticated) {
        return { name: 'tarefas' }
    }
})

export default router
```

**Nota:** O guard usa `useAuthStore()` dentro do `beforeEach` (não no topo do módulo) para garantir que o Pinia já esteja inicializado quando o guard for executado.

---

### 5. Atualização do `api.js` — Interceptor 401

Adicionar ao `src/services/api.js` existente:

```javascript
// Interceptor de resposta: tratar 401 globalmente
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Limpar sessão e redirecionar para login
            localStorage.removeItem('mathia_token')
            // Importar router dinamicamente para evitar dependência circular
            import('../router').then(({ default: router }) => {
                if (router.currentRoute.value.name !== 'login') {
                    router.push({ name: 'login' })
                }
            })
        }
        const data = error.response?.data || {}
        return Promise.reject({
            status: 'error',
            data: null,
            error: data.error || { message: 'Erro de conexão com o servidor' },
        })
    }
)
```

**Nota:** O import dinâmico do router evita dependência circular entre `api.js` e `router/index.js`. A store não é limpa diretamente aqui para evitar o mesmo problema — o guard de rota e a reinicialização da store ao navegar para `/login` cuidam disso.

---

### 6. Atualização do `App.vue`

Adicionar exibição do usuário e botão de logout na navbar:

```vue
<template>
  <div id="mathia-app">
    <nav role="navigation" aria-label="Navegação principal" class="main-nav">
      <div class="nav-brand">mathIA</div>
      <template v-if="authStore.isAuthenticated">
        <ul class="nav-links">
          <li><router-link to="/">Tarefas</router-link></li>
          <li><router-link to="/progresso">Progresso</router-link></li>
          <li><router-link to="/testar">Testar</router-link></li>
          <li><router-link to="/chat">Chat</router-link></li>
        </ul>
        <div class="nav-user">
          <span>{{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="btn-logout">Sair</button>
        </div>
      </template>
    </nav>
    <main role="main" class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
    await authStore.logout()
    router.push({ name: 'login' })
}
</script>
```

---

## Fluxo de Autenticação

```
Usuário acessa rota protegida
        ↓
Router Guard: isAuthenticated?
    ├── NÃO → redirect /login
    │         ↓
    │     LoginView: submete credenciais
    │         ↓
    │     authStore.login() → POST /api/auth/login
    │         ↓
    │     Sucesso: salva token no localStorage + estado
    │         ↓
    │     redirect /
    │
    └── SIM → renderiza componente
              ↓
          api.js injeta Bearer token em cada request
              ↓
          Se 401 → Interceptor_401 limpa token + redirect /login
```

---

## Propriedades de Correção

### Análise de Testabilidade dos Critérios de Aceitação

**Req 1 — Auth Store:**
- 1.1 Estado reativo exposto: **exemplo**
- 1.2 Inicialização lê localStorage: **propriedade** — para qualquer token no localStorage, a store deve inicializar `isAuthenticated` como true
- 1.3 login() armazena token: **exemplo**
- 1.4 register() armazena token: **exemplo**
- 1.5 logout() limpa token: **propriedade** — após logout, localStorage não deve conter `mathia_token` e `isAuthenticated` deve ser false
- 1.6 fetchUser() atualiza user: **exemplo**
- 1.7 Erros propagam: **exemplo**

**Req 2 — LoginView:**
- 2.1–2.6: **exemplos** (comportamento de UI)

**Req 3 — RegisterView:**
- 3.1–3.6: **exemplos** (comportamento de UI)

**Req 4 — Guards:**
- 4.1–4.5: **exemplos** (comportamento de navegação)

**Req 5 — Interceptor 401:**
- 5.1–5.3: **exemplos** (comportamento de interceptor)

**Req 6 — Navbar:**
- 6.1–6.4: **exemplos** (comportamento de UI)

---

### Propriedades de Teste (Vitest)

#### Propriedade 1: Inicialização da store lê localStorage

Para qualquer token armazenado no localStorage, a store deve inicializar com `isAuthenticated === true`.

```javascript
// tests/stores/auth.spec.js
it.each([
    '1|abc123',
    '2|xyz789token',
    'qualquer-string-de-token',
])('inicializa isAuthenticated=true quando localStorage tem token "%s"', (token) => {
    localStorage.setItem('mathia_token', token)
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBe(token)
    localStorage.removeItem('mathia_token')
})
```

#### Propriedade 2: Logout sempre limpa o estado

Após `logout()`, independente do resultado da API, o estado local deve ser limpo.

```javascript
it('logout limpa token e isAuthenticated independente da resposta da api', async () => {
    // Simular token existente
    localStorage.setItem('mathia_token', 'token-teste')
    const store = useAuthStore()
    store.token = 'token-teste'

    // Mesmo que a API falhe, o estado local deve ser limpo
    vi.spyOn(api, 'post').mockRejectedValueOnce(new Error('network error'))
    await store.logout().catch(() => {})

    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(localStorage.getItem('mathia_token')).toBeNull()
})
```
