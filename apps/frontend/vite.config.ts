/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, '../../domain/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/hooks/*.{test,spec}.{ts,tsx}'],
  },
});
