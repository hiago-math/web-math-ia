<template>
  <section aria-label="Invocar a IA">

    <div class="rpg-title">🔮 Invocar Entidade</div>
    <div class="rpg-subtitle">Execute uma inferência e observe o oráculo responder</div>

    <div class="invocar-layout">

      <!-- Formulário -->
      <div class="rpg-panel invocar-form-panel">

        <div class="form-group">
          <label class="rpg-label" for="tarefa">Missão</label>
          <select id="tarefa" v-model="tarefaId" class="rpg-select" aria-label="Selecionar tarefa">
            <option v-for="t in tarefasStore.tarefas" :key="t.id" :value="t.id">{{ t.nome }}</option>
          </select>
        </div>

        <form @submit.prevent="testar" class="invocar-form" aria-label="Formulário de invocação">
          <div class="form-group">
            <label class="rpg-label" for="entrada">Dados de Entrada (JSON)</label>
            <textarea
              id="entrada"
              v-model="entrada"
              required
              rows="4"
              class="rpg-textarea"
              placeholder='[1, 0, 1, 0]'
            ></textarea>
          </div>

          <div v-if="store.error" class="rpg-alert rpg-alert--error" role="alert">
            ⚠ {{ store.error }}
          </div>

          <button type="submit" class="rpg-btn rpg-btn--primary" :disabled="store.loading">
            {{ store.loading ? '⟳ Invocando...' : '🔮 Invocar' }}
          </button>
        </form>
      </div>

      <!-- Resultado -->
      <div class="resultado-panel">
        <div v-if="!store.resultado && !store.loading" class="rpg-panel resultado-vazio">
          <div class="rpg-empty">
            <div class="rpg-empty-icon">🔮</div>
            <p>O oráculo aguarda sua consulta...</p>
          </div>
        </div>

        <div v-if="store.resultado" class="rpg-panel resultado-card">
          <div class="resultado-title">✦ Resposta do Oráculo</div>

          <div class="resultado-stat">
            <span class="resultado-label">Predição</span>
            <span class="resultado-value">{{ JSON.stringify(store.resultado.predicao) }}</span>
          </div>

          <hr class="rpg-divider" />

          <div class="resultado-stat">
            <span class="resultado-label">Confiança</span>
            <div class="confianca-bar-wrap">
              <div class="confianca-bar">
                <div
                  class="confianca-fill"
                  :style="{ width: (store.resultado.confianca * 100) + '%' }"
                  :class="{
                    'confianca-fill--high':   store.resultado.confianca >= 0.7,
                    'confianca-fill--medium': store.resultado.confianca >= 0.4 && store.resultado.confianca < 0.7,
                    'confianca-fill--low':    store.resultado.confianca < 0.4,
                  }"
                ></div>
              </div>
              <span class="confianca-pct">{{ (store.resultado.confianca * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInferenciaStore } from '../stores/inferencia'
import { useTarefasStore } from '../stores/tarefas'

const store = useInferenciaStore()
const tarefasStore = useTarefasStore()
const tarefaId = ref('')
const entrada = ref('')

async function testar() {
  try {
    const e = JSON.parse(entrada.value)
    await store.executar(tarefaId.value, e)
  } catch {
    store.error = 'JSON inválido no campo de entrada'
  }
}

onMounted(async () => {
  if (!tarefasStore.tarefas.length) await tarefasStore.buscar()
  if (tarefasStore.tarefas.length) tarefaId.value = tarefasStore.tarefas[0].id
})
</script>

<style scoped>
.invocar-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}

.invocar-form-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invocar-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Resultado */
.resultado-vazio {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resultado-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resultado-title {
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.resultado-stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.resultado-label {
  font-family: 'Cinzel', serif;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.resultado-value {
  font-size: 1.1rem;
  color: var(--text-bright);
  font-family: monospace;
  background: var(--bg-deep);
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--border);
}

/* Barra de confiança */
.confianca-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.confianca-bar {
  flex: 1;
  height: 8px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  overflow: hidden;
}

.confianca-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.confianca-fill--high   { background: linear-gradient(to right, #2a5a2a, #80c080); }
.confianca-fill--medium { background: linear-gradient(to right, #5a5a2a, #c0c080); }
.confianca-fill--low    { background: linear-gradient(to right, #5a2a2a, #c08080); }

.confianca-pct {
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  color: var(--text-bright);
  min-width: 3.5rem;
  text-align: right;
}

@media (max-width: 700px) {
  .invocar-layout { grid-template-columns: 1fr; }
}
</style>
