import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should render the sign in page', async ({ page }) => {
    await page.goto('/sign-in');
    // Ensure the Sign In text or button is visible
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should render the sign up page', async ({ page }) => {
    await page.goto('/sign-up');
    // Ensure the Sign Up text or button is visible
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });
});
