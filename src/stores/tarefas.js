import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTarefasStore = defineStore('tarefas', () => {
    const tarefas = ref([])
    const loading = ref(false)
    const error   = ref(null)

    async function buscar() {
        loading.value = true
        error.value   = null
        try {
            // interceptor retorna response.data direto
            // backend retorna { status, data: [...], message }
            const res = await api.get('/tarefas')
            tarefas.value = res.data ?? res ?? []
        } catch (e) {
            error.value = e.error?.message || 'Erro ao carregar tarefas'
        } finally {
            loading.value = false
        }
    }

    async function criar(nome, descricao) {
        loading.value = true
        error.value   = null
        try {
            const res = await api.post('/tarefas', { nome, descricao })
            await buscar()
            return res
        } catch (e) {
            error.value = e.error?.message || 'Erro ao criar tarefa'
            throw e
        } finally {
            loading.value = false
        }
    }

    return { tarefas, loading, error, buscar, criar }
})
