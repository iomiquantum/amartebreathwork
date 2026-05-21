import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('@supabase/supabase-js')) return 'vendor-supabase'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('clsx') || id.includes('tailwind-merge')) return 'vendor-utils'
          }
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
