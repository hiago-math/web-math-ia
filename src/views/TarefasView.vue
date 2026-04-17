<template>
  <section aria-label="Tarefas de aprendizado">
    <h2>Tarefas de Aprendizado</h2>
    <LoadingSpinner v-if="store.loading" />
    <ErrorMessage v-else-if="store.error" :message="store.error" @retry="store.buscar()" />
    <div v-else class="tarefas-grid" role="list">
      <TarefaCard v-for="tarefa in store.tarefas" :key="tarefa.id" :tarefa="tarefa" />
      <p v-if="!store.tarefas.length">Nenhuma tarefa disponível.</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTarefasStore } from '../stores/tarefas'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import TarefaCard from '../components/TarefaCard.vue'

const store = useTarefasStore()
onMounted(() => store.buscar())
</script>

<style scoped>
h2 { margin-bottom: 1.5rem; }
.tarefas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
</style>
