import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-auth-68hj.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});
