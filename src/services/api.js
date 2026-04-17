import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
})

// Interceptor: adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('mathia_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor: padronizar resposta
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const data = error.response?.data || {}
        return Promise.reject({
            status: 'error',
            data: null,
            error: data.error || { message: 'Erro de conexão com o servidor' },
        })
    }
)

export default api
