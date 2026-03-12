import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'production' ? [cssInjectedByJsPlugin()] : []),
  ],
  build: {
    rollupOptions: {
      input: mode === 'production' ? 'src/widget.tsx' : undefined,
      output: {
        entryFileNames: 'quiz-generator.js',
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    target: 'es2020',
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
}))
