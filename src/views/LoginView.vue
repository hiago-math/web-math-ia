<template>
  <div class="login-page">
    <div class="bg-texture"></div>

    <div class="login-container">

      <!-- Logo / título -->
      <div class="login-header">
        <div class="login-portrait">🧠</div>
        <h1 class="login-title">mathIA</h1>
        <p class="login-subtitle">Entidade Arcana de Aprendizado</p>
      </div>

      <!-- Abas -->
      <div class="login-tabs">
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': modo === 'login' }"
          @click="modo = 'login'; store.error = null"
        >⚔ Entrar</button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': modo === 'register' }"
          @click="modo = 'register'; store.error = null"
        >✦ Criar Conta</button>
      </div>

      <!-- Formulário de Login -->
      <form v-if="modo === 'login'" @submit.prevent="onLogin" class="login-form" aria-label="Formulário de login">
        <div class="form-group">
          <label class="rpg-label" for="username">Usuário</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="rpg-input"
            placeholder="seu_usuario"
            required
            autocomplete="username"
            aria-required="true"
          />
        </div>

        <div class="form-group">
          <label class="rpg-label" for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="rpg-input"
            placeholder="••••••"
            required
            autocomplete="current-password"
            aria-required="true"
          />
        </div>

        <div v-if="store.error" class="rpg-alert rpg-alert--error" role="alert">
          ⚠ {{ store.error }}
        </div>

        <button type="submit" class="rpg-btn rpg-btn--primary login-btn" :disabled="store.loading">
          {{ store.loading ? '⟳ Invocando...' : '⚔ Entrar no Grimório' }}
        </button>
      </form>

      <!-- Formulário de Registro -->
      <form v-else @submit.prevent="onRegister" class="login-form" aria-label="Formulário de registro">
        <div class="form-group">
          <label class="rpg-label" for="reg-name">Nome</label>
          <input
            id="reg-name"
            v-model="name"
            type="text"
            class="rpg-input"
            placeholder="Seu nome"
            required
            aria-required="true"
          />
        </div>

        <div class="form-group">
          <label class="rpg-label" for="reg-username">Usuário</label>
          <input
            id="reg-username"
            v-model="username"
            type="text"
            class="rpg-input"
            placeholder="seu_usuario"
            required
            autocomplete="username"
            aria-required="true"
          />
        </div>

        <div class="form-group">
          <label class="rpg-label" for="reg-password">Senha</label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            class="rpg-input"
            placeholder="mínimo 6 caracteres"
            required
            autocomplete="new-password"
            aria-required="true"
          />
        </div>

        <div class="form-group">
          <label class="rpg-label" for="reg-confirm">Confirmar Senha</label>
          <input
            id="reg-confirm"
            v-model="passwordConfirm"
            type="password"
            class="rpg-input"
            placeholder="••••••"
            required
            autocomplete="new-password"
            aria-required="true"
          />
        </div>

        <div v-if="store.error" class="rpg-alert rpg-alert--error" role="alert">
          ⚠ {{ store.error }}
        </div>

        <button type="submit" class="rpg-btn rpg-btn--primary login-btn" :disabled="store.loading">
          {{ store.loading ? '⟳ Criando...' : '✦ Criar Conta' }}
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const store         = useAuthStore()
const router        = useRouter()
const modo          = ref('login')
const name          = ref('')
const username      = ref('')
const password      = ref('')
const passwordConfirm = ref('')

async function onLogin() {
    try {
        await store.login(username.value, password.value)
        router.push('/')
    } catch {}
}

async function onRegister() {
    try {
        await store.register(name.value, username.value, password.value, passwordConfirm.value)
        router.push('/')
    } catch {}
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-deep);
    position: relative;
}

.login-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 400px;
    padding: 1rem;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-portrait {
    font-size: 3rem;
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--gold);
    background: var(--bg-card);
    clip-path: polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px);
    box-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
}

.login-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.8rem;
    color: var(--gold-light);
    letter-spacing: 0.15em;
    text-shadow: 0 0 15px rgba(201, 168, 76, 0.4);
    margin-bottom: 0.25rem;
}

.login-subtitle {
    font-size: 0.8rem;
    color: var(--text-dim);
    font-style: italic;
}

/* Abas */
.login-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-gold);
    margin-bottom: 1.5rem;
}

.tab-btn {
    flex: 1;
    padding: 0.6rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-dim);
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: -1px;
}

.tab-btn:hover { color: var(--gold-light); }

.tab-btn--active {
    color: var(--gold-light);
    border-bottom-color: var(--gold);
}

/* Formulário */
.login-form {
    background: var(--bg-panel);
    border: 1px solid var(--border-gold);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
}

.login-form::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid rgba(201, 168, 76, 0.08);
    pointer-events: none;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.login-btn {
    width: 100%;
    padding: 0.7rem;
    font-size: 0.82rem;
    margin-top: 0.25rem;
}
</style>
