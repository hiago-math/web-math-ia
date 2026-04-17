import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useLicoesStore = defineStore('licoes', () => {
    const loading = ref(false)
    const error = ref(null)
    const sucesso = ref(false)

    async function enviar(tarefaId, entrada, saidaEsperada) {
        loading.value = true
        error.value = null
        sucesso.value = false
        try {
            await api.post('/api/licoes', { tarefa_id: tarefaId, entrada, saida_esperada: saidaEsperada })
            sucesso.value = true
        } catch (e) {
            error.value = e.error?.message || 'Erro ao enviar lição'
        } finally {
            loading.value = false
        }
    }

    function reset() { error.value = null; sucesso.value = false }

    return { loading, error, sucesso, enviar, reset }
})
