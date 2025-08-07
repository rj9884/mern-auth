import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-auth-68hj.onrender.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
