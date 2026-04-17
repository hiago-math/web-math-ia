<template>
  <div v-if="resultado" class="inferencia-result" role="status" aria-live="polite">
    <h3>Resultado</h3>
    <div class="result-grid">
      <div class="result-item">
        <span class="label">Predição</span>
        <span class="value">{{ JSON.stringify(resultado.predicao) }}</span>
      </div>
      <div class="result-item">
        <span class="label">Confiança</span>
        <span class="value confianca">{{ (resultado.confianca * 100).toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ resultado: { type: Object, default: null } })
</script>

<style scoped>
.inferencia-result { background: #e8f5e9; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
.inferencia-result h3 { margin-bottom: 1rem; }
.result-grid { display: flex; gap: 2rem; }
.result-item .label { display: block; font-size: 0.75rem; color: #666; }
.result-item .value { font-size: 1.25rem; font-weight: bold; }
.confianca { color: #2e7d32; }
</style>
