import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://scheduleeventbackend.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimize for production
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Base URL - important for Vercel
  base: '/',
  // Define environment variables that should be exposed to client
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://scheduleeventbackend.onrender.com')
  }
})