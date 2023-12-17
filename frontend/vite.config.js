import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {},

  define: {
    VITE_SERVER_URL: process.env.VITE_SERVER_URL
  }
})
