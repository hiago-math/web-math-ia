import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useProgressoStore = defineStore('progresso', () => {
    const historico = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function buscar(tarefaId) {
        loading.value = true
        error.value = null
        try {
            const res = await api.get('/progresso', { params: { tarefa_id: tarefaId } })
            historico.value = res.data || []
        } catch (e) {
            error.value = e.error?.message || 'Erro ao carregar progresso'
        } finally {
            loading.value = false
        }
    }

    return { historico, loading, error, buscar }
})
