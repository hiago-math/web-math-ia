<template>
  <form @submit.prevent="onSubmit" class="licao-form" aria-label="Formulário de lição">

    <div class="form-group">
      <label class="rpg-label" for="entrada">Dados de Entrada (JSON)</label>
      <textarea
        id="entrada"
        v-model="entrada"
        required
        rows="4"
        class="rpg-textarea"
        aria-required="true"
        placeholder='[1, 0, 1, 0]'
      ></textarea>
    </div>

    <div class="form-group">
      <label class="rpg-label" for="saida">Saída Esperada (JSON)</label>
      <textarea
        id="saida"
        v-model="saidaEsperada"
        required
        rows="4"
        class="rpg-textarea"
        aria-required="true"
        placeholder='[1]'
      ></textarea>
    </div>

    <div v-if="store.error" class="rpg-alert rpg-alert--error" role="alert">
      ⚠ {{ store.error }}
    </div>

    <div v-if="store.sucesso" class="rpg-alert rpg-alert--success" role="status">
      ✔ Lição registrada no grimório com sucesso!
    </div>

    <button type="submit" class="rpg-btn rpg-btn--primary" :disabled="store.loading">
      {{ store.loading ? '⟳ Registrando...' : '📖 Registrar Lição' }}
    </button>

  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useLicoesStore } from '../stores/licoes'

const props = defineProps({ tarefaId: { type: String, required: true } })
const store = useLicoesStore()
const entrada = ref('')
const saidaEsperada = ref('')

async function onSubmit() {
  try {
    const e = JSON.parse(entrada.value)
    const s = JSON.parse(saidaEsperada.value)
    await store.enviar(props.tarefaId, e, s)
    if (store.sucesso) { entrada.value = ''; saidaEsperada.value = '' }
  } catch {
    store.error = 'JSON inválido nos campos de entrada ou saída'
  }
}
</script>

<style scoped>
.licao-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
</style>
