import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'lista-de-tarefas:v1:tasks'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('seeds render on a fresh load', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 1' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 2' })).toBeVisible()
})

test('adds a tarefa via Enter and clears the input', async ({ page }) => {
  const input = page.getByLabel(/escreva abaixo uma tarefa/i)
  await input.fill('Test E2E task')
  await input.press('Enter')

  await expect(page.getByRole('button', { name: 'Excluir tarefa: Test E2E task' })).toBeVisible()
  await expect(input).toHaveValue('')
})

test('adds a tarefa via the Add button and clears the input', async ({ page }) => {
  const input = page.getByLabel(/escreva abaixo uma tarefa/i)
  const button = page.getByRole('button', { name: /adicionar/i })

  await expect(button).toBeDisabled()
  await input.fill('Button-added task')
  await expect(button).toBeEnabled()
  await button.click()

  await expect(
    page.getByRole('button', { name: 'Excluir tarefa: Button-added task' }),
  ).toBeVisible()
  await expect(input).toHaveValue('')
})

test('clicking a tarefa removes it after the animation delay', async ({ page }) => {
  const target = page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 1' })
  await target.click()
  await expect(target).toHaveCount(0, { timeout: 2_000 })
  await expect(page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 2' })).toBeVisible()
})

test('state persists across a full reload', async ({ page }) => {
  const input = page.getByLabel(/escreva abaixo uma tarefa/i)
  await input.fill('Persisted')
  await input.press('Enter')

  await page.reload()

  await expect(page.getByRole('button', { name: 'Excluir tarefa: Persisted' })).toBeVisible()
})

test('writes state under the versioned storage key', async ({ page }) => {
  const stored = await page.evaluate((k) => window.localStorage.getItem(k), STORAGE_KEY)
  expect(stored).not.toBeNull()
  expect(stored).toContain('Tarefa exemplo 1')
})

test('empty list state shows when everything is removed', async ({ page }) => {
  // remove both seeds
  await page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 1' }).click()
  await expect(page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 1' })).toHaveCount(
    0,
    { timeout: 2_000 },
  )
  await page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 2' }).click()
  await expect(page.getByText('Não há tarefas ainda.')).toBeVisible()
})
