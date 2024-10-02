import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  // You may already have this

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // This is the alias configuration
    },
  },
});
