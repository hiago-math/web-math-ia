<template>
  <section aria-label="Ensinar a IA">

    <div class="rpg-title">📖 Ensinar — Missão {{ tarefaId }}</div>
    <div class="rpg-subtitle">Forneça exemplos para treinar a entidade arcana</div>

    <div class="ensinar-layout">

      <!-- Formulário de lição -->
      <div class="rpg-panel ensinar-panel">
        <LicaoForm :tarefa-id="tarefaId" />
      </div>

      <!-- Dica lateral -->
      <div class="rpg-panel dica-panel">
        <div class="dica-title">📜 Instruções</div>
        <ul class="dica-list">
          <li>Insira os dados de entrada em formato JSON</li>
          <li>Defina a saída esperada correspondente</li>
          <li>Cada lição fortalece a entidade arcana</li>
          <li>Quanto mais lições, maior a precisão</li>
        </ul>
      </div>

    </div>

    <router-link to="/" class="rpg-btn" style="display:inline-block; margin-top:1.5rem; text-decoration:none;">
      ← Voltar às Missões
    </router-link>

  </section>
</template>

<script setup>
import LicaoForm from '../components/LicaoForm.vue'
defineProps({ tarefaId: { type: String, required: true } })
</script>

<style scoped>
.ensinar-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.25rem;
  align-items: start;
}

.ensinar-panel { flex: 1; }

.dica-panel {
  background: rgba(201, 168, 76, 0.04);
}

.dica-title {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--gold);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.dica-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dica-list li {
  font-size: 0.82rem;
  color: var(--text-dim);
  font-style: italic;
  padding-left: 1rem;
  position: relative;
}

.dica-list li::before {
  content: '✦';
  position: absolute;
  left: 0;
  color: var(--gold-dark);
  font-size: 0.6rem;
  top: 0.2rem;
}

@media (max-width: 700px) {
  .ensinar-layout { grid-template-columns: 1fr; }
}
</style>
