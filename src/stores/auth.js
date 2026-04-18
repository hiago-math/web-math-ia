import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
    const token   = ref(localStorage.getItem('mathia_token') || null)
    const user    = ref(JSON.parse(localStorage.getItem('mathia_user') || 'null'))
    const loading = ref(false)
    const error   = ref(null)

    const isAuthenticated = computed(() => !!token.value)

    function setSession(data) {
        token.value = data.token
        user.value  = data.user
        localStorage.setItem('mathia_token', data.token)
        localStorage.setItem('mathia_user', JSON.stringify(data.user))
    }

    function clearSession() {
        token.value = null
        user.value  = null
        localStorage.removeItem('mathia_token')
        localStorage.removeItem('mathia_user')
    }

    async function login(username, password) {
        loading.value = true
        error.value   = null
        try {
            const res = await api.post('/auth/login', { username, password })
            setSession(res.data ?? res)
        } catch (e) {
            error.value = e.error?.message || 'Credenciais inválidas.'
            throw e
        } finally {
            loading.value = false
        }
    }

    async function register(name, username, password, password_confirmation) {
        loading.value = true
        error.value   = null
        try {
            const res = await api.post('/auth/register', { name, username, password, password_confirmation })
            setSession(res.data ?? res)
        } catch (e) {
            error.value = e.error?.message || 'Erro ao criar conta.'
            throw e
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await api.post('/auth/logout')
        } catch {}
        clearSession()
    }

    return { token, user, loading, error, isAuthenticated, login, register, logout }
})
