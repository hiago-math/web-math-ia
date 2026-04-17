import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTarefasStore = defineStore('tarefas', () => {
    const tarefas = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function buscar() {
        loading.value = true
        error.value = null
        try {
            const res = await api.get('/api/tarefas')
            tarefas.value = res.data || []
        } catch (e) {
            error.value = e.error?.message || 'Erro ao carregar tarefas'
        } finally {
            loading.value = false
        }
    }

    return { tarefas, loading, error, buscar }
})
