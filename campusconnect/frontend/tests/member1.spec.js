import { test, expect } from '@playwright/test';

// Test 1: Faculty Creation
test('Admin should successfully add a new Faculty', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Login Flow
  await page.getByRole('button', { name: 'Login / Register' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to Entities
  await page.getByRole('button', { name: 'Entities' }).click();
  
  // Add Faculty
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.getByRole('textbox', { name: 'e.g. Faculty of Computing' }).fill('Business Faculty');
  await page.getByRole('button', { name: 'Save' }).click();

});

// Test 2: Degree Program Creation
test('Admin should successfully add a Degree Program to a faculty', async ({ page }) => {
  // Start from base URL
  await page.goto('http://localhost:5173/');
  
  // Login Flow via Landing Page
  await page.getByRole('button', { name: 'Login / Register' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigation
  await page.getByRole('button', { name: 'Entities' }).click();

  // Expand Faculty/Entity (Replacing the brittle locator with a more reliable one)
  // This looks for the chevron icon. If you have many, .first() or .nth() is used.
  await page.getByText('Programs0 registeredAdd').click();
  await page.waitForTimeout(2000);
  // Select Option and Add Degree
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('button', { name: 'Add' }).nth(1).click();
  await page.getByRole('textbox', { name: 'e.g. BSc IT' }).fill('BSc hons in SE');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);
});

test('Admin should successfully delete a Faculty', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Login / Register' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Entities' }).click();
  await page.getByText('Programs0 registeredAdd').click();
  await page.getByRole('combobox').selectOption('1');
  await page.waitForTimeout(2000);
  await page.locator('div:nth-child(2) > div:nth-child(2) > .flex > .p-1\\.5.rounded-lg.text-red-500').click();
  await page.getByRole('button', { name: 'Yes, Delete' }).click();
  await page.getByText('Program deleted.').click();
});

test('Student should successfully add a resource', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Login / Register' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('rehanp');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page.getByRole('textbox', { name: 'Enter your password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('.h-28.relative.bg-gradient-to-br.from-\\[\\#0EA5E9\\] > .absolute.inset-0 > rect').click();
  await page.getByRole('button', { name: 'Add Resource' }).click();
  await page.getByRole('textbox', { name: 'e.g. OOP Lecture Notes – Week' }).click();
  await page.getByRole('textbox', { name: 'e.g. OOP Lecture Notes – Week' }).fill('IP final papers');
  await page.getByRole('textbox', { name: 'https://files.example.com/' }).click();
  await page.getByRole('textbox', { name: 'https://files.example.com/' }).fill('www.papers.lk');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForTimeout(2000);
  await page.getByText('IP final papers').click();
});

test('Student should successfully delete a resource', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Login / Register' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('rehanp');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000);
  await page.locator('.h-28.relative.bg-gradient-to-br.from-\\[\\#0EA5E9\\] > .absolute.inset-0 > rect').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await page.getByRole('button', { name: 'Yes, Delete' }).click();
  await page.getByText('Resource deleted.').click();
});