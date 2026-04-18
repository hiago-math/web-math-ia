<template>
  <article
    class="missao-card rpg-panel"
    :class="{ 'missao-card--concluida': tarefa.status === 'concluida' }"
    role="listitem"
    tabindex="0"
    :aria-label="`Missão: ${tarefa.nome}`"
  >
    <!-- Ícone de status no canto -->
    <div class="missao-status-icon">
      <span v-if="tarefa.status === 'concluida'" title="Concluída">✔</span>
      <span v-else title="Ativa">◈</span>
    </div>

    <!-- Nome da missão -->
    <h3 class="missao-nome">{{ tarefa.nome }}</h3>

    <!-- Descrição -->
    <p class="missao-desc">{{ tarefa.descricao }}</p>

    <hr class="rpg-divider" />

    <!-- Meta info estilo stats -->
    <div class="missao-stats">
      <div class="missao-stat">
        <span class="stat-label">Status</span>
        <span
          class="rpg-badge"
          :class="{
            'rpg-badge--done':    tarefa.status === 'concluida',
            'rpg-badge--active':  tarefa.status === 'ativa',
            'rpg-badge--pending': tarefa.status !== 'ativa' && tarefa.status !== 'concluida',
          }"
        >{{ tarefa.status }}</span>
      </div>
      <div class="missao-stat">
        <span class="stat-label">Lições</span>
        <span class="stat-value">{{ tarefa.total_licoes }}</span>
      </div>
    </div>

    <!-- Botão de ação -->
    <router-link
      :to="`/ensinar/${tarefa.id}`"
      class="rpg-btn rpg-btn--primary missao-btn"
      aria-label="`Ensinar missão ${tarefa.nome}`"
    >
      ⚔ Ensinar
    </router-link>
  </article>
</template>

<script setup>
defineProps({ tarefa: { type: Object, required: true } })
</script>

<style scoped>
.missao-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: default;
}

.missao-card:hover {
  border-color: var(--gold);
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.15);
}

.missao-card--concluida {
  border-color: #3a5a3a;
}

.missao-status-icon {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: var(--gold-dark);
  font-size: 0.85rem;
}

.missao-card--concluida .missao-status-icon {
  color: #60a060;
}

.missao-nome {
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  color: var(--gold-light);
  letter-spacing: 0.05em;
  padding-right: 1.5rem;
}

.missao-desc {
  font-size: 0.85rem;
  color: var(--text-dim);
  font-style: italic;
  line-height: 1.5;
  flex: 1;
}

.missao-stats {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.missao-stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-family: 'Cinzel', serif;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  text-transform: uppercase;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-bright);
}

.missao-btn {
  display: block;
  text-align: center;
  text-decoration: none;
  margin-top: 0.25rem;
}
</style>
