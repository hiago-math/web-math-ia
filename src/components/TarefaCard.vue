<template>
  <article class="tarefa-card" :class="{ concluida: tarefa.status === 'concluida' }" role="listitem" tabindex="0" :aria-label="`Tarefa: ${tarefa.nome}`">
    <h3>{{ tarefa.nome }}</h3>
    <p>{{ tarefa.descricao }}</p>
    <div class="tarefa-meta">
      <span class="status" :aria-label="`Status: ${tarefa.status}`">{{ tarefa.status }}</span>
      <span class="licoes">{{ tarefa.total_licoes }} lições</span>
    </div>
    <router-link :to="`/ensinar/${tarefa.id}`" class="btn-ensinar" aria-label="Ensinar esta tarefa">Ensinar</router-link>
  </article>
</template>

<script setup>
defineProps({ tarefa: { type: Object, required: true } })
</script>

<style scoped>
.tarefa-card { background: #fff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s; }
.tarefa-card:hover { transform: translateY(-2px); }
.tarefa-card.concluida { border-left: 4px solid #4caf50; }
.tarefa-card h3 { margin-bottom: 0.5rem; }
.tarefa-card p { color: #666; margin-bottom: 1rem; }
.tarefa-meta { display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.875rem; }
.status { padding: 0.25rem 0.5rem; border-radius: 4px; background: #e3f2fd; color: #1565c0; }
.concluida .status { background: #e8f5e9; color: #2e7d32; }
.btn-ensinar { display: inline-block; background: #1a1a2e; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; text-decoration: none; }
.btn-ensinar:hover { background: #16213e; }
</style>
