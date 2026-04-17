<template>
  <section aria-label="Progresso do modelo">
    <h2>Progresso do Modelo</h2>
    <div class="tarefa-select">
      <label for="tarefa">Selecione a tarefa:</label>
      <select id="tarefa" v-model="tarefaId" @change="carregar" aria-label="Selecionar tarefa">
        <option v-for="t in tarefasStore.tarefas" :key="t.id" :value="t.id">{{ t.nome }}</option>
      </select>
    </div>
    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" @retry="carregar" />
    <ProgressoChart v-else :historico="store.historico" />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProgressoStore } from '../stores/progresso'
import { useTarefasStore } from '../stores/tarefas'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import ProgressoChart from '../components/ProgressoChart.vue'

const store = useProgressoStore()
const tarefasStore = useTarefasStore()
const tarefaId = ref('')

function carregar() { if (tarefaId.value) store.buscar(tarefaId.value) }
onMounted(async () => {
  if (!tarefasStore.tarefas.length) await tarefasStore.buscar()
  if (tarefasStore.tarefas.length) { tarefaId.value = tarefasStore.tarefas[0].id; carregar() }
})
</script>

<style scoped>
h2 { margin-bottom: 1.5rem; }
.tarefa-select { margin-bottom: 1.5rem; }
.tarefa-select label { margin-right: 0.5rem; }
.tarefa-select select { padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
</style>
