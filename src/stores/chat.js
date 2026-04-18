import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useChatStore = defineStore('chat', () => {
    const mensagens  = ref([])
    const loading    = ref(false)
    const error      = ref(null)
    const sessaoId   = ref(null)
    const stats      = ref({ interacoes_aprovadas: 0 })
    const modoAtual  = ref('chat')
    const modos      = ref({})

    async function buscarModos() {
        try {
            const res = await api.get('/chat/modos')
            modos.value = res.data
        } catch {}
    }

    function adicionarMensagem(role, texto, interacao_id = null, modo = null) {
        mensagens.value.push({
            id: Date.now(),
            role,
            texto,
            interacao_id,
            modo,
            feedback: null,
        })
    }

    async function enviar(texto) {
        if (!texto.trim() || loading.value) return

        adicionarMensagem('user', texto)
        loading.value = true
        error.value   = null

        const historico = mensagens.value
            .slice(0, -1)
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, texto: m.texto }))

        try {
            const payload = {
                mensagem:  texto,
                historico,
                modo:      modoAtual.value,
            }
            if (sessaoId.value) payload.sessao_id = sessaoId.value

            const res = await api.post('/chat', payload)

            sessaoId.value = res.data.sessao_id
            adicionarMensagem('assistant', res.data.resposta, res.data.interacao_id, res.data.modo)
        } catch (e) {
            const msg = e.error?.message || 'Erro ao gerar resposta.'
            adicionarMensagem('assistant', `⚠️ ${msg}`)
            error.value = msg
        } finally {
            loading.value = false
        }
    }

    async function darFeedback(mensagemId, aprovado) {
        const msg = mensagens.value.find(m => m.id === mensagemId)
        if (!msg?.interacao_id) return
        try {
            await api.post('/chat/feedback', {
                interacao_id: msg.interacao_id,
                aprovado,
            })
            msg.feedback = aprovado ? 'aprovado' : 'rejeitado'
            await buscarStats()
        } catch (e) {
            console.error('Erro ao registrar feedback:', e)
        }
    }

    async function treinar() {
        const res = await api.post('/chat/treinar')
        return res
    }

    async function buscarStats() {
        try {
            const res = await api.get('/chat/stats')
            stats.value = res.data
        } catch {}
    }

    function trocarModo(novoModo) {
        modoAtual.value = novoModo
        sessaoId.value  = null  // nova sessão ao trocar de modo
    }

    function limpar() {
        mensagens.value = []
        sessaoId.value  = null
        error.value     = null
    }

    return {
        mensagens, loading, error, sessaoId, stats, modoAtual, modos,
        enviar, darFeedback, treinar, buscarStats, buscarModos, trocarModo, limpar,
    }
})
