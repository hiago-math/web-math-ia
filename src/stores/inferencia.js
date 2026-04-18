import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useInferenciaStore = defineStore('inferencia', () => {
    const resultado = ref(null)
    const loading = ref(false)
    const error = ref(null)

    async function executar(tarefaId, entrada) {
        loading.value = true
        error.value = null
        resultado.value = null
        try {
            const res = await api.post('/inferencia', { tarefa_id: tarefaId, entrada })
            resultado.value = res.data
        } catch (e) {
            error.value = e.error?.message || 'Erro ao executar inferência'
        } finally {
            loading.value = false
        }
    }

    function reset() { resultado.value = null; error.value = null }

    return { resultado, loading, error, executar, reset }
})
