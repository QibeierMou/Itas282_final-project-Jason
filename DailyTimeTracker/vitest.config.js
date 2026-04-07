import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@testing-library/react-native': path.resolve(
        __dirname,
        '../node_modules/@testing-library/react-native'
      ),
    },
  },
});