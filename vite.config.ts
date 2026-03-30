import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(({ mode }) => {
  const isFormWidget = process.env.WIDGET === 'form'
  const isProd = mode === 'production'

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isProd ? [cssInjectedByJsPlugin()] : []),
    ],
    build: {
      rollupOptions: {
        input: isProd
          ? (isFormWidget ? 'src/form-widget.tsx' : 'src/widget.tsx')
          : undefined,
        output: {
          entryFileNames: isFormWidget ? 'form-generator.js' : 'quiz-generator.js',
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
  }
})
