<template>
  <section aria-label="Testar a IA">
    <h2>Testar a IA</h2>
    <div class="tarefa-select">
      <label for="tarefa">Tarefa:</label>
      <select id="tarefa" v-model="tarefaId" aria-label="Selecionar tarefa">
        <option v-for="t in tarefasStore.tarefas" :key="t.id" :value="t.id">{{ t.nome }}</option>
      </select>
    </div>
    <form @submit.prevent="testar" class="test-form" aria-label="Formulário de teste">
      <label for="entrada">Dados de Entrada (JSON)</label>
      <textarea id="entrada" v-model="entrada" required rows="3" placeholder='[1, 0, 1, 0]'></textarea>
      <button type="submit" :disabled="store.loading">{{ store.loading ? 'Testando...' : 'Testar' }}</button>
    </form>
    <div v-if="store.error" class="form-error" role="alert">{{ store.error }}</div>
    <InferenciaResult :resultado="store.resultado" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInferenciaStore } from '../stores/inferencia'
import { useTarefasStore } from '../stores/tarefas'
import InferenciaResult from '../components/InferenciaResult.vue'

const store = useInferenciaStore()
const tarefasStore = useTarefasStore()
const tarefaId = ref('')
const entrada = ref('')

async function testar() {
  try {
    const e = JSON.parse(entrada.value)
    await store.executar(tarefaId.value, e)
  } catch { store.error = 'JSON inválido no campo de entrada' }
}
onMounted(async () => {
  if (!tarefasStore.tarefas.length) await tarefasStore.buscar()
  if (tarefasStore.tarefas.length) tarefaId.value = tarefasStore.tarefas[0].id
})
</script>

<style scoped>
h2 { margin-bottom: 1.5rem; }
.tarefa-select { margin-bottom: 1rem; }
.tarefa-select select { padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
.test-form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 600px; }
.test-form textarea { padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-family: monospace; }
.test-form button { background: #1a1a2e; color: #fff; border: none; padding: 0.75rem; border-radius: 4px; cursor: pointer; }
.test-form button:hover { background: #16213e; }
.test-form button:disabled { opacity: 0.6; cursor: not-allowed; }
.form-error { color: #c33; margin-top: 0.5rem; }
</style>
