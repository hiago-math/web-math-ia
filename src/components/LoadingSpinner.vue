<template>
  <div class="rpg-spinner" role="status" aria-live="polite" aria-label="Carregando">
    Consultando o grimório...
    <span class="sr-only">Carregando...</span>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
}
</style>
