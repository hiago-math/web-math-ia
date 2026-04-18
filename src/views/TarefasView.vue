<template>
  <section aria-label="Missões de Aprendizado">

    <div class="rpg-title">⚔️ Missões Disponíveis</div>
    <div class="rpg-subtitle">Selecione uma missão para treinar a entidade arcana</div>

    <div v-if="store.loading" class="rpg-spinner">Consultando o grimório...</div>

    <div v-else-if="store.error" class="rpg-alert rpg-alert--error" role="alert">
      ⚠ {{ store.error }}
      <button class="rpg-btn rpg-btn--danger" style="margin-left:1rem" @click="store.buscar()">Tentar novamente</button>
    </div>

    <div v-else>
      <div v-if="!store.tarefas.length" class="rpg-empty">
        <div class="rpg-empty-icon">📜</div>
        <p>Nenhuma missão encontrada no grimório.</p>
      </div>

      <div v-else class="missoes-grid" role="list">
        <TarefaCard
          v-for="tarefa in store.tarefas"
          :key="tarefa.id"
          :tarefa="tarefa"
        />
      </div>
    </div>

  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTarefasStore } from '../stores/tarefas'
import TarefaCard from '../components/TarefaCard.vue'

const store = useTarefasStore()
onMounted(() => store.buscar())
</script>

<style scoped>
.missoes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
</style>
