import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,   // ✅ enables describe, it, expect globally
    environment: 'jsdom'
  }
});