import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true, // allows network access
    port: 5173,
    allowedHosts: [
      'ebharatsec.in',
      'www.ebharatsec.in',
      '31.97.237.71' // optional, if accessing via IP
    ]
  }
})
