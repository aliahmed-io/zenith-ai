import { test, expect } from '@playwright/test';

test.describe('AI Advisor Flows', () => {
  test('should redirect unauthenticated users from AI Advisor', async ({ page }) => {
    // Attempting to visit /stockadvisor without auth should redirect
    await page.goto('/stockadvisor');
    // Assuming the app redirects to /sign-in or /auth/sign-in
    await expect(page).toHaveURL(/.*sign-in/);
  });

  // Note: For a full E2E, we would mock the session or login first.
  // We'll add a simple test to check that the top navigation contains the Advisor link if reachable
  test('should load home page and have title', async ({ page }) => {
    await page.goto('/');
    // Depending on the exact title
    await expect(page).toHaveTitle(/Zenith/i);
  });
});
