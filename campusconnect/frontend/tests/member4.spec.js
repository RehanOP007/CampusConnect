import { test, expect } from '@playwright/test';

// Increase timeout for all tests
test.use({ timeout: 60000 });  // 60 seconds instead of 30

test.describe('Member 4 - Component 4: Analytics & Recommendations', () => {
  
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);  // 60 seconds for beforeEach
    await page.goto('http://localhost:5173/campusconnect/login', { timeout: 60000 });
    await page.waitForTimeout(2000);
    
    // Fill login form
    await page.fill('input[type="text"], input[name="username"], input[placeholder*="Username"]', 'admin');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"], button:has-text("Login")');
    await page.waitForTimeout(3000);
  });

  // ========== TEST 1 ==========
  test('01 - Analytics Dashboard should load successfully', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:5173/component4/analytics', { timeout: 60000 });
    await expect(page.locator('h1')).toContainText('Analytics Dashboard');
    await page.screenshot({ path: 'test-results/analytics-dashboard.png' });
  });

  // ========== TEST 2 ==========
  test('02 - Recommendations Page should load successfully', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:5173/component4/recommendations', { timeout: 60000 });
    await expect(page.locator('h1')).toContainText('Recommendations');
    await page.screenshot({ path: 'test-results/recommendations-page.png' });
  });

  // ========== TEST 3 ==========
  test('03 - Chatbot button should be visible', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:5173/component4/analytics', { timeout: 60000 });
    const chatButton = page.locator('button[class*="bottom-6 right-6"], button:has-text("💬")');
    await expect(chatButton).toBeVisible();
    await page.screenshot({ path: 'test-results/chatbot.png' });
  });

  // ========== TEST 4 ==========
  test('04 - Dark mode toggle should work', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('http://localhost:5173/component4/analytics', { timeout: 60000 });
    const themeBtn = page.locator('button:has-text("Dark"), button:has-text("Light")');
    await themeBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/dark-mode.png' });
  });
});