import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    // Proxy API calls to the AI API server
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Hide source maps in production (clients can't see original code)
    sourcemap: false,
  },
  // Disable source maps in development preview too
  preview: {
    port: 3002,
    sourcemap: false,
    allowedHosts: true,
  },
})
