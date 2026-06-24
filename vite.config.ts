import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        parserOpts: {
          plugins: [
            "decorators-legacy",
          ]
        },
      }
    }),
  ],
  build: {
    outDir: '../dist/frontend'
  }
})
