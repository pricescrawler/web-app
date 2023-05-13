import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@assets': path.resolve('./src/assets'),
      '@components': path.resolve('./src/components'),
      '@pages': path.resolve('./src/pages'),
      '@services': path.resolve('./src/services'),
      '@styles': path.resolve('./src/styles')
    }
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    testMatch: ['./tests/**/*.test.jsx']
  }
});
