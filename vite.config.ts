import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Cambiado a Babel
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Configuración del compilador
const ReactCompilerConfig = {};

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 700, // opcional: solo cambia el umbral de warning
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        },
      },
    },
  },
})