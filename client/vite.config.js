import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    sourcemap: false,
  },
})
