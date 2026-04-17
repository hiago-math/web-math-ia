<template>
  <div class="error-message" role="alert" aria-live="assertive">
    <p>{{ message }}</p>
    <button @click="$emit('retry')" aria-label="Tentar novamente">Tentar novamente</button>
  </div>
</template>

<script setup>
defineProps({ message: { type: String, default: 'Ocorreu um erro. Tente novamente.' } })
defineEmits(['retry'])
</script>

<style scoped>
.error-message { background: #fee; border: 1px solid #fcc; border-radius: 8px; padding: 1rem; text-align: center; }
.error-message p { color: #c33; margin-bottom: 0.5rem; }
.error-message button { background: #c33; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.error-message button:hover { background: #a22; }
</style>
