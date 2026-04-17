<template>
  <div class="loading-spinner" role="status" aria-live="polite" aria-label="Carregando">
    <div class="spinner"></div>
    <span class="sr-only">Carregando...</span>
  </div>
</template>

<style scoped>
.loading-spinner { display: flex; justify-content: center; padding: 2rem; }
.spinner { width: 40px; height: 40px; border: 4px solid #e0e0e0; border-top-color: #1a1a2e; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
</style>
