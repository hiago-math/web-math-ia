<template>
  <section aria-label="Ensinar a IA">
    <h2>Ensinar — Tarefa {{ tarefaId }}</h2>
    <LicaoForm :tarefa-id="tarefaId" />
    <router-link to="/" class="btn-voltar">← Voltar às tarefas</router-link>
  </section>
</template>

<script setup>
import LicaoForm from '../components/LicaoForm.vue'
defineProps({ tarefaId: { type: String, required: true } })
</script>

<style scoped>
h2 { margin-bottom: 1.5rem; }
.btn-voltar { display: inline-block; margin-top: 1rem; color: #666; text-decoration: none; }
.btn-voltar:hover { color: #333; }
</style>
