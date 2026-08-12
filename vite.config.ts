import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/bnm': {
        target: 'https://api.bnm.gov.my',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bnm/, '/public'),
        headers: {
          Accept: 'application/vnd.BNM.API.v1+json',
        },
      },
    },
  },
})
