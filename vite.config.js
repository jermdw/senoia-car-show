import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Honour PORT so the dev server can run alongside another instance.
  server: { port: Number(process.env.PORT) || 5173 },
})
