import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // ✅ YEH important hai
    sourcemap: false
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://scheduleeventbackend.onrender.com',
        changeOrigin: true
      }
    }
  }
})