import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        //target: 'https://task-master-gateway.onrender.com',
        target: 'http://localhost:8083',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})