import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8082',
    headless: true,
  },

  webServer: {
    command: 'cross-env CI=1 npx expo start --web --port 8082',
    url: 'http://localhost:8082',
    timeout: 120000,
    reuseExistingServer: true,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report' }]
  ],
});