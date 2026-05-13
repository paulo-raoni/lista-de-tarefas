import { test, expect } from '@playwright/test'

const LANG_STORAGE_KEY = 'lista-de-tarefas:v1:lang'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('defaults to PT-BR strings on first load', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lista de Tarefas App')
  await expect(page.getByLabel(/escreva abaixo uma tarefa/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /idioma/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})

test('opening the switcher reveals both languages and marks PT-BR as current', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /idioma/i })
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  const ptOption = page.getByRole('button', { name: 'Português (Brasil)' })
  const enOption = page.getByRole('button', { name: 'English' })
  await expect(ptOption).toBeVisible()
  await expect(enOption).toBeVisible()
  await expect(ptOption).toHaveAttribute('aria-current', 'true')
})

test('switching to EN updates UI strings live and closes the panel', async ({ page }) => {
  await page.getByRole('button', { name: /idioma/i }).click()
  await page.getByRole('button', { name: 'English' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Todo List App')
  await expect(page.getByLabel(/type a todo below/i)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Delete todo: Tarefa exemplo 1' })).toBeVisible()
  await expect(page.getByRole('button', { name: /language/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})

test('language preference persists across reloads and sets <html lang>', async ({ page }) => {
  await page.getByRole('button', { name: /idioma/i }).click()
  await page.getByRole('button', { name: 'English' }).click()

  const lang = await page.evaluate((k) => window.localStorage.getItem(k), LANG_STORAGE_KEY)
  expect(lang).toBe('en')

  await page.reload()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Todo List App')
})

test('clicking outside the panel closes it', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /idioma/i })
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  await page.getByRole('heading', { level: 1 }).click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})
