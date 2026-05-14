import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'lista-de-tarefas:v1:theme'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('defaults to system theme and applies a resolved theme on <html>', async ({ page }) => {
  const theme = await page.locator('html').getAttribute('data-theme')
  expect(['light', 'dark']).toContain(theme)
})

test('switching to dark applies data-theme=dark and persists', async ({ page }) => {
  await page.getByRole('button', { name: /tema|theme/i }).click()
  await page.getByRole('button', { name: /escuro|dark/i }).click()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  const stored = await page.evaluate((k) => window.localStorage.getItem(k), STORAGE_KEY)
  expect(stored).toBe('dark')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('switching to light works the same way', async ({ page }) => {
  await page.getByRole('button', { name: /tema|theme/i }).click()
  await page.getByRole('button', { name: /claro|light/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
