<template>
  <form @submit.prevent="onSubmit" class="licao-form" aria-label="Formulário de lição">
    <div class="form-group">
      <label for="entrada">Dados de Entrada (JSON)</label>
      <textarea id="entrada" v-model="entrada" required rows="4" aria-required="true" placeholder='[1, 0, 1, 0]'></textarea>
    </div>
    <div class="form-group">
      <label for="saida">Saída Esperada (JSON)</label>
      <textarea id="saida" v-model="saidaEsperada" required rows="4" aria-required="true" placeholder='[1]'></textarea>
    </div>
    <div v-if="store.error" class="form-error" role="alert">{{ store.error }}</div>
    <div v-if="store.sucesso" class="form-success" role="status">Lição enviada com sucesso!</div>
    <button type="submit" :disabled="store.loading">{{ store.loading ? 'Enviando...' : 'Enviar Lição' }}</button>
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
  } catch { store.error = 'JSON inválido nos campos de entrada ou saída' }
}
</script>
