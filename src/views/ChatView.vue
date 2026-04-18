<template>
  <section class="chat-page" aria-label="Chat com a IA">

    <!-- Header -->
    <div class="chat-header">
      <div class="chat-title">
        <h2>mathIA</h2>
        <span class="chat-subtitle">Aprende com suas interações</span>
      </div>
      <div class="chat-actions">
        <span class="stats-badge" title="Respostas aprovadas para treino">
          👍 {{ store.stats.interacoes_aprovadas }}
        </span>
        <button class="btn-treinar" @click="treinar" :disabled="treinando">
          {{ treinando ? 'Treinando...' : '🧠 Treinar' }}
        </button>
        <button class="btn-limpar" @click="store.limpar()">Limpar</button>
      </div>
    </div>

    <!-- Seletor de modos -->
    <div class="modos-bar" role="tablist" aria-label="Modos da IA">
      <button
        v-for="(info, key) in store.modos"
        :key="key"
        class="modo-btn"
        :class="{ active: store.modoAtual === key }"
        @click="trocarModo(key)"
        role="tab"
        :aria-selected="store.modoAtual === key"
        :title="info.descricao"
      >
        {{ info.emoji }} {{ info.label }}
      </button>
    </div>

    <!-- Aviso -->
    <div v-if="aviso" class="aviso" :class="avisoTipo" role="status">{{ aviso }}</div>

    <!-- Mensagens -->
    <div class="chat-messages" ref="messagesEl" role="log" aria-live="polite">

      <div v-if="!store.mensagens.length" class="chat-empty">
        <div class="chat-empty-icon">{{ modoAtual?.emoji || '🤖' }}</div>
        <p class="chat-empty-title">{{ modoAtual?.label || 'Chat' }}</p>
        <p class="chat-empty-desc">{{ modoAtual?.descricao || 'Pode falar comigo à vontade.' }}</p>
        <p class="chat-hint">Use 👍 nas respostas que gostar para me ensinar.</p>
      </div>

      <template v-for="msg in store.mensagens" :key="msg.id">
        <div class="chat-bubble" :class="msg.role">
          <div class="bubble-meta" v-if="msg.role === 'assistant' && msg.modo && msg.modo !== 'chat'">
            {{ store.modos[msg.modo]?.emoji }} {{ store.modos[msg.modo]?.label }}
          </div>
          <div class="bubble-content">
            <p class="bubble-text">{{ msg.texto }}</p>
          </div>
          <div v-if="msg.role === 'assistant' && msg.interacao_id" class="bubble-feedback">
            <button
              class="btn-feedback" :class="{ active: msg.feedback === 'aprovado' }"
              @click="store.darFeedback(msg.id, true)"
              :disabled="msg.feedback !== null"
              aria-label="Boa resposta"
            >👍</button>
            <button
              class="btn-feedback" :class="{ active: msg.feedback === 'rejeitado' }"
              @click="store.darFeedback(msg.id, false)"
              :disabled="msg.feedback !== null"
              aria-label="Resposta ruim"
            >👎</button>
            <span v-if="msg.feedback" class="feedback-label">
              {{ msg.feedback === 'aprovado' ? 'Salvo para treino!' : 'Feedback registrado' }}
            </span>
          </div>
        </div>
      </template>

      <div v-if="store.loading" class="chat-bubble assistant">
        <div class="bubble-content">
          <p class="typing"><span></span><span></span><span></span></p>
        </div>
      </div>

    </div>

    <!-- Input -->
    <form class="chat-input" @submit.prevent="enviar">
      <textarea
        v-model="texto"
        ref="inputEl"
        rows="2"
        :placeholder="placeholder"
        aria-label="Mensagem"
        @keydown.enter.exact.prevent="enviar"
      ></textarea>
      <button type="submit" :disabled="store.loading || !texto.trim()">
        {{ store.loading ? '...' : 'Enviar' }}
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
    chat:      'Digite sua mensagem...',
    musica:    'Ex: Crie uma letra de sertanejo sobre saudade...',
    resumo:    'Cole aqui o texto que deseja resumir...',
    codigo:    'Ex: Como faço um loop em Python?',
    criativo:  'Ex: Escreva um poema sobre o mar ao entardecer...',
    professor: 'Ex: Explica o que é machine learning...',
  }
  return p[store.modoAtual] || 'Digite sua mensagem...'
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
    aviso.value    = `✅ Fine-tuning enfileirado com ${res.data?.total_aprovadas} interações aprovadas.`
    avisoTipo.value = 'sucesso'
  } catch (e) {
    aviso.value    = `⚠️ ${e.error?.message || 'Erro ao iniciar treinamento.'}`
    avisoTipo.value = 'erro'
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
  height: calc(100vh - 120px);
  max-width: 800px;
  margin: 0 auto;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.chat-title h2    { font-size: 1.2rem; margin: 0; }
.chat-subtitle    { font-size: 0.75rem; color: #999; }
.chat-actions     { display: flex; align-items: center; gap: 0.5rem; }
.stats-badge      { font-size: 0.8rem; background: #e8f5e9; color: #2e7d32; padding: 0.3rem 0.6rem; border-radius: 20px; }
.btn-treinar      { padding: 0.4rem 0.8rem; background: #1a1a2e; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
.btn-treinar:hover { background: #16213e; }
.btn-treinar:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-limpar       { padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid #ddd; background: #fff; cursor: pointer; font-size: 0.85rem; }
.btn-limpar:hover { background: #f5f5f5; }

/* Modos */
.modos-bar {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.modo-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 0.82rem;
  transition: all 0.15s;
  white-space: nowrap;
}
.modo-btn:hover  { background: #f0f0f0; border-color: #bbb; }
.modo-btn.active { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }

/* Aviso */
.aviso        { padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 0.75rem; }
.aviso.sucesso { background: #e8f5e9; color: #2e7d32; }
.aviso.erro   { background: #fce4ec; color: #c62828; }
.aviso.info   { background: #e3f2fd; color: #1565c0; }

/* Mensagens */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}
.chat-empty       { text-align: center; color: #999; margin: auto; }
.chat-empty-icon  { font-size: 2.5rem; margin-bottom: 0.5rem; }
.chat-empty-title { font-size: 1rem; font-weight: 600; color: #555; margin-bottom: 0.25rem; }
.chat-empty-desc  { font-size: 0.85rem; color: #888; }
.chat-hint        { font-size: 0.75rem; margin-top: 0.5rem; color: #bbb; }

/* Bubbles */
.chat-bubble           { display: flex; flex-direction: column; max-width: 78%; gap: 0.25rem; }
.chat-bubble.user      { align-self: flex-end; }
.chat-bubble.assistant { align-self: flex-start; }
.bubble-meta           { font-size: 0.7rem; color: #999; padding-left: 0.25rem; }
.bubble-content        { padding: 0.75rem 1rem; border-radius: 12px; line-height: 1.55; }
.user .bubble-content      { background: #1a1a2e; color: #fff; border-bottom-right-radius: 4px; }
.assistant .bubble-content { background: #fff; border: 1px solid #e0e0e0; border-bottom-left-radius: 4px; color: #333; }
.bubble-text { margin: 0; white-space: pre-wrap; word-break: break-word; }

/* Feedback */
.bubble-feedback  { display: flex; align-items: center; gap: 0.4rem; padding-left: 0.25rem; }
.btn-feedback     { background: none; border: 1px solid #e0e0e0; border-radius: 6px; padding: 0.2rem 0.5rem; cursor: pointer; font-size: 0.9rem; transition: background 0.15s; }
.btn-feedback:hover:not(:disabled) { background: #f0f0f0; }
.btn-feedback.active  { background: #e8f5e9; border-color: #4caf50; }
.btn-feedback:disabled { opacity: 0.5; cursor: default; }
.feedback-label   { font-size: 0.72rem; color: #888; }

/* Typing */
.typing { display: flex; gap: 4px; align-items: center; height: 1.2rem; margin: 0; }
.typing span { width: 7px; height: 7px; background: #bbb; border-radius: 50%; animation: bounce 1.2s infinite; }
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }

/* Input */
.chat-input { display: flex; gap: 0.5rem; align-items: flex-end; }
.chat-input textarea { flex: 1; padding: 0.75rem; border: 1px solid #ccc; border-radius: 8px; font-family: inherit; font-size: 0.95rem; resize: none; line-height: 1.4; }
.chat-input textarea:focus { outline: none; border-color: #1a1a2e; }
.chat-input button { padding: 0.75rem 1.25rem; background: #1a1a2e; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; white-space: nowrap; }
.chat-input button:hover { background: #16213e; }
.chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
