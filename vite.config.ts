import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: "/",  // ✅ FIX: era "/Brana/", causa problemas en Netlify

  plugins: [
    vue(),
    vueDevTools(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  server: {
    port: 5173,       // ✅ puerto fijo, siempre el mismo
    strictPort: true  // si está ocupado, falla en vez de cambiar
  }
})