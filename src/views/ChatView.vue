<template>
  <section class="chat-page" aria-label="Consultar a Entidade Arcana">

    <!-- Header -->
    <div class="chat-header">
      <div>
        <div class="rpg-title" style="margin-bottom:0.1rem">💬 Consultar Entidade</div>
        <div class="rpg-subtitle" style="margin-bottom:0">Aprende com cada interação aprovada</div>
      </div>
      <div class="chat-actions">
        <span class="souls-badge" title="Interações aprovadas para treino">
          ✦ {{ store.stats.interacoes_aprovadas }} almas
        </span>
        <button class="rpg-btn rpg-btn--primary" @click="treinar" :disabled="treinando">
          {{ treinando ? '⟳ Treinando...' : '🧠 Treinar' }}
        </button>
        <button class="rpg-btn rpg-btn--danger" @click="store.limpar()">Limpar</button>
      </div>
    </div>

    <!-- Seletor de modos estilo abas RPG -->
    <div class="modos-bar" role="tablist" aria-label="Modos da IA">
      <button
        v-for="(info, key) in store.modos"
        :key="key"
        class="modo-btn"
        :class="{ 'modo-btn--active': store.modoAtual === key }"
        @click="trocarModo(key)"
        role="tab"
        :aria-selected="store.modoAtual === key"
        :title="info.descricao"
      >
        {{ info.emoji }} {{ info.label }}
      </button>
    </div>

    <!-- Aviso -->
    <div v-if="aviso" class="rpg-alert" :class="`rpg-alert--${avisoTipo}`" role="status">
      {{ aviso }}
    </div>

    <!-- Área de mensagens -->
    <div class="chat-scroll" ref="messagesEl" role="log" aria-live="polite">

      <!-- Estado vazio -->
      <div v-if="!store.mensagens.length" class="chat-vazio">
        <div class="chat-vazio-icon">{{ modoAtual?.emoji || '🔮' }}</div>
        <div class="chat-vazio-nome">{{ modoAtual?.label || 'Entidade' }}</div>
        <div class="chat-vazio-desc">{{ modoAtual?.descricao || 'Consulte a entidade arcana.' }}</div>
        <div class="chat-vazio-hint">Use 👍 nas respostas para ensinar a entidade</div>
      </div>

      <!-- Mensagens -->
      <template v-for="msg in store.mensagens" :key="msg.id">
        <div class="msg-row" :class="`msg-row--${msg.role}`">

          <!-- Avatar -->
          <div class="msg-avatar">
            <span v-if="msg.role === 'user'">👤</span>
            <span v-else>🧠</span>
          </div>

          <!-- Balão -->
          <div class="msg-bubble" :class="`msg-bubble--${msg.role}`">
            <div v-if="msg.role === 'assistant' && msg.modo && msg.modo !== 'chat'" class="msg-modo">
              {{ store.modos[msg.modo]?.emoji }} {{ store.modos[msg.modo]?.label }}
            </div>
            <p class="msg-texto">{{ msg.texto }}</p>

            <!-- Feedback -->
            <div v-if="msg.role === 'assistant' && msg.interacao_id" class="msg-feedback">
              <button
                class="feedback-btn"
                :class="{ 'feedback-btn--active': msg.feedback === 'aprovado' }"
                @click="store.darFeedback(msg.id, true)"
                :disabled="msg.feedback !== null"
                aria-label="Boa resposta"
              >👍</button>
              <button
                class="feedback-btn"
                :class="{ 'feedback-btn--reject': msg.feedback === 'rejeitado' }"
                @click="store.darFeedback(msg.id, false)"
                :disabled="msg.feedback !== null"
                aria-label="Resposta ruim"
              >👎</button>
              <span v-if="msg.feedback" class="feedback-label">
                {{ msg.feedback === 'aprovado' ? '✦ Salvo para treino' : '✦ Registrado' }}
              </span>
            </div>
          </div>

        </div>
      </template>

      <!-- Digitando -->
      <div v-if="store.loading" class="msg-row msg-row--assistant">
        <div class="msg-avatar"><span>🧠</span></div>
        <div class="msg-bubble msg-bubble--assistant">
          <p class="typing"><span></span><span></span><span></span></p>
        </div>
      </div>

    </div>

    <!-- Input -->
    <form class="chat-input-area" @submit.prevent="enviar">
      <textarea
        v-model="texto"
        ref="inputEl"
        rows="2"
        class="rpg-textarea chat-textarea"
        :placeholder="placeholder"
        aria-label="Mensagem para a entidade"
        @keydown.enter.exact.prevent="enviar"
      ></textarea>
      <button
        type="submit"
        class="rpg-btn rpg-btn--primary chat-send-btn"
        :disabled="store.loading || !texto.trim()"
      >
        {{ store.loading ? '⟳' : '⚔ Enviar' }}
      </button>
    </form>

  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'

const store      = useChatStore()
const texto      = ref('')
const messagesEl = ref(null)
const inputEl    = ref(null)
const treinando  = ref(false)
const aviso      = ref('')
const avisoTipo  = ref('info')

const modoAtual = computed(() => store.modos[store.modoAtual])

const placeholder = computed(() => {
  const p = {
    chat:      'Consulte a entidade arcana...',
    musica:    'Ex: Crie uma letra de sertanejo sobre saudade...',
    resumo:    'Cole aqui o texto que deseja resumir...',
    codigo:    'Ex: Como faço um loop em Python?',
    criativo:  'Ex: Escreva um poema sobre o mar ao entardecer...',
    professor: 'Ex: Explica o que é machine learning...',
  }
  return p[store.modoAtual] || 'Consulte a entidade arcana...'
})

async function enviar() {
  const t = texto.value.trim()
  if (!t || store.loading) return
  texto.value = ''
  await store.enviar(t)
}

function trocarModo(modo) {
  store.trocarModo(modo)
  store.limpar()
  inputEl.value?.focus()
}

async function treinar() {
  treinando.value = true
  aviso.value     = ''
  try {
    const res = await store.treinar()
    aviso.value    = `✦ Fine-tuning enfileirado com ${res.data?.total_aprovadas} interações aprovadas.`
    avisoTipo.value = 'success'
  } catch (e) {
    aviso.value    = `⚠ ${e.error?.message || 'Erro ao iniciar treinamento.'}`
    avisoTipo.value = 'error'
  } finally {
    treinando.value = false
    setTimeout(() => { aviso.value = '' }, 5000)
  }
}

async function scrollBottom() {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

watch(() => store.mensagens.length, scrollBottom)
watch(() => store.loading, scrollBottom)

onMounted(async () => {
  await Promise.all([store.buscarStats(), store.buscarModos()])
  inputEl.value?.focus()
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  min-height: 400px;
}

/* Header */
.chat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chat-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.souls-badge {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--gold);
  background: rgba(201, 168, 76, 0.08);
  border: 1px solid var(--gold-dark);
  padding: 0.3rem 0.75rem;
}

/* Modos */
.modos-bar {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-gold);
  padding-bottom: 0.5rem;
}

.modo-btn {
  padding: 0.35rem 0.85rem;
  background: transparent;
  color: var(--text-dim);
  border: 1px solid transparent;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  transition: all 0.15s;
  white-space: nowrap;
}

.modo-btn:hover {
  color: var(--gold-light);
  background: var(--bg-hover);
  border-color: var(--border-gold);
}

.modo-btn--active {
  color: var(--gold-light) !important;
  background: var(--bg-card) !important;
  border-color: var(--gold-dark) !important;
}

/* Scroll de mensagens */
.chat-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-deep);
  border: 1px solid var(--border-gold);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

/* Estado vazio */
.chat-vazio {
  margin: auto;
  text-align: center;
  color: var(--text-dim);
}

.chat-vazio-icon { font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.6; }
.chat-vazio-nome { font-family: 'Cinzel', serif; font-size: 0.9rem; color: var(--gold-dark); margin-bottom: 0.25rem; }
.chat-vazio-desc { font-size: 0.82rem; font-style: italic; margin-bottom: 0.5rem; }
.chat-vazio-hint { font-size: 0.72rem; color: var(--border-gold); }

/* Linhas de mensagem */
.msg-row {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
}

.msg-row--user      { flex-direction: row-reverse; }
.msg-row--assistant { flex-direction: row; }

.msg-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  clip-path: polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px);
}

.msg-bubble {
  max-width: 72%;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.msg-modo {
  font-family: 'Cinzel', serif;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--text-dim);
}

.msg-texto {
  padding: 0.65rem 0.9rem;
  line-height: 1.55;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}

.msg-bubble--user .msg-texto {
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid var(--gold-dark);
  color: var(--text-bright);
}

.msg-bubble--assistant .msg-texto {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-main);
}

/* Feedback */
.msg-feedback {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding-left: 0.25rem;
}

.feedback-btn {
  background: none;
  border: 1px solid var(--border);
  padding: 0.15rem 0.45rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.15s;
  color: var(--text-dim);
}

.feedback-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--border-gold);
}

.feedback-btn--active {
  background: rgba(42, 90, 42, 0.3) !important;
  border-color: #2a5a2a !important;
}

.feedback-btn--reject {
  background: rgba(90, 42, 42, 0.3) !important;
  border-color: #5a2a2a !important;
}

.feedback-btn:disabled { opacity: 0.4; cursor: default; }

.feedback-label {
  font-family: 'Cinzel', serif;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--text-dim);
}

/* Typing */
.typing {
  display: flex;
  gap: 5px;
  align-items: center;
  height: 1.2rem;
  margin: 0;
}

.typing span {
  width: 6px;
  height: 6px;
  background: var(--gold-dark);
  border-radius: 50%;
  animation: rpg-bounce 1.2s infinite;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes rpg-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-5px); opacity: 1; }
}

/* Input */
.chat-input-area {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.chat-textarea {
  flex: 1;
  resize: none;
  line-height: 1.4;
}

.chat-send-btn {
  white-space: nowrap;
  padding: 0.65rem 1.25rem;
  align-self: stretch;
}
</style>
