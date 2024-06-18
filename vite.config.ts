import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from "vite-plugin-babel-macros"

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
    // macrosPlugin()
  ],
  build: {
    outDir: '../dist/frontend'
  }
})
