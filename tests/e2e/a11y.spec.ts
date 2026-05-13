import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BLOCKING_IMPACTS = ['serious', 'critical'] as const
type BlockingImpact = (typeof BLOCKING_IMPACTS)[number]

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('no serious or critical violations on the initial render', async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

  const blocking = violations.filter((v) => BLOCKING_IMPACTS.includes(v.impact as BlockingImpact))

  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
})

test('no serious or critical violations after adding several tarefas', async ({ page }) => {
  const input = page.getByLabel(/escreva abaixo uma tarefa/i)
  for (const text of ['One', 'Two', 'Three']) {
    await input.fill(text)
    await input.press('Enter')
  }

  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

  const blocking = violations.filter((v) => BLOCKING_IMPACTS.includes(v.impact as BlockingImpact))

  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
})
