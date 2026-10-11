import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/[/\\]node_modules[/\\](?:react|react-dom)(?:[/\\]|$)/.test(id)) {
            return 'vendor-react'
          }
          if (/[/\\]node_modules[/\\]lucide-react(?:[/\\]|$)/.test(id)) {
            return 'vendor-icons'
          }
          if (/[/\\]node_modules[/\\]canvas-confetti(?:[/\\]|$)/.test(id)) {
            return 'vendor-confetti'
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
