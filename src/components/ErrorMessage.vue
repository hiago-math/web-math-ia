<template>
  <div class="rpg-alert rpg-alert--error" role="alert" aria-live="assertive">
    <span>⚠ {{ message }}</span>
    <button class="rpg-btn rpg-btn--danger" @click="$emit('retry')" aria-label="Tentar novamente" style="margin-left:1rem">
      Tentar novamente
    </button>
  </div>
</template>

<script setup>
defineProps({ message: { type: String, default: 'Ocorreu um erro. Tente novamente.' } })
defineEmits(['retry'])
</script>
