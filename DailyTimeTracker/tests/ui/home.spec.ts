import { test, expect } from '@playwright/test';

test('Home page loads correctly', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('home-title')).toBeVisible();
  await expect(page.getByTestId('start-button')).toBeVisible();
});

test('Edit page works', async ({ page }) => {
  await page.goto('/edit');

  await expect(page.getByTestId('edit-title')).toBeVisible();

  await page.fill('[data-testid="name-input"]', 'Test Task');
  await page.click('[data-testid="save-button"]');

  await expect(page.getByText('Saved')).toBeVisible();
});