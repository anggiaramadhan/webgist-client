import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],

      // valid file extensions for components.
      extensions: ['vue'],

      // Glob patterns to match file names to be detected as components.
      // When specified, the `dirs` and `extensions` options will be ignored.
      globs: ['src/components/*.{vue}']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
