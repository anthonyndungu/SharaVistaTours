import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    //tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://76684c68eb49a1af-129-222-147-35.serveousercontent.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
       //Image Uploads
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})