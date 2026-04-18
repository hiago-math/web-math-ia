import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    watch: {
      usePolling: true, // necessário para detectar mudanças dentro do Docker
    },
    proxy: {
      '/api': {
        target: 'http://mathia-api:80',
        changeOrigin: true,
      },
    },
  },
})
