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
        target: 'https://tours.mogulafric.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
       //Image Uploads
      '/uploads': {
        target: 'https://tours.mogulafric.com',
        changeOrigin: true,
      }
    }
  },
    define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://tours.mogulafric.com/api'),
  }
})