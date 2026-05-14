import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BLOCKING_IMPACTS = ['serious', 'critical'] as const
type BlockingImpact = (typeof BLOCKING_IMPACTS)[number]

async function gotoFreshWithTheme(page: import('@playwright/test').Page, theme: 'light' | 'dark') {
  await page.addInitScript((t) => {
    window.localStorage.setItem('lista-de-tarefas:v1:theme', t)
    window.localStorage.removeItem('lista-de-tarefas:v1:tarefas')
  }, theme)
  await page.goto('/')
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`a11y — ${theme}`, () => {
    test(`no serious or critical violations on the initial render (${theme})`, async ({ page }) => {
      await gotoFreshWithTheme(page, theme)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const blocking = violations.filter((v) =>
        BLOCKING_IMPACTS.includes(v.impact as BlockingImpact),
      )
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
    })

    test(`no serious or critical violations after adding several tarefas (${theme})`, async ({
      page,
    }) => {
      await gotoFreshWithTheme(page, theme)

      const input = page.getByLabel(/escreva abaixo uma tarefa|type a todo below/i)
      for (const text of ['One', 'Two', 'Three']) {
        await input.fill(text)
        await input.press('Enter')
      }

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const blocking = violations.filter((v) =>
        BLOCKING_IMPACTS.includes(v.impact as BlockingImpact),
      )
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
    })

    test(`no serious or critical violations with a focused tarefa (${theme})`, async ({ page }) => {
      await gotoFreshWithTheme(page, theme)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

      // Focus the first task button — triggers :focus-within on the <li>,
      // which applies the same hover background + paired text color.
      await page.getByRole('button', { name: 'Excluir tarefa: Tarefa exemplo 1' }).focus()

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      const blocking = violations.filter((v) =>
        BLOCKING_IMPACTS.includes(v.impact as BlockingImpact),
      )
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
    })
  })
}
