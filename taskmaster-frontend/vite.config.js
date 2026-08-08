import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        //target: 'https://task-master-gateway.onrender.com',
        target: 'https://task-master-gateway-mh86.onrender.com',
        //target: 'http://host.docker.internal:8083',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})