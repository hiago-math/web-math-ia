<template>
  <div v-if="resultado" class="rpg-panel inferencia-result" role="status" aria-live="polite">
    <div class="result-title">✦ Resposta do Oráculo</div>

    <div class="result-stat">
      <span class="rpg-label">Predição</span>
      <span class="result-value">{{ JSON.stringify(resultado.predicao) }}</span>
    </div>

    <hr class="rpg-divider" />

    <div class="result-stat">
      <span class="rpg-label">Confiança</span>
      <span class="result-confianca">{{ (resultado.confianca * 100).toFixed(1) }}%</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ resultado: { type: Object, default: null } })
</script>

<style scoped>
.inferencia-result {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-title {
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  color: var(--gold);
  text-transform: uppercase;
}

.result-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-value {
  font-family: monospace;
  font-size: 1rem;
  color: var(--text-bright);
  background: var(--bg-deep);
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--border);
}

.result-confianca {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #80c080;
}
</style>
