# Lista de Tarefas

> A todo list app that started in 2018 as a Create React App project and was modernized in 2026 with Vite, TypeScript, dark mode, i18n, and a full test suite.

[![CI](https://github.com/paulo-raoni/lista-de-tarefas/actions/workflows/ci.yml/badge.svg)](https://github.com/paulo-raoni/lista-de-tarefas/actions/workflows/ci.yml)
[![Deploy](https://github.com/paulo-raoni/lista-de-tarefas/actions/workflows/deploy.yml/badge.svg)](https://github.com/paulo-raoni/lista-de-tarefas/actions/workflows/deploy.yml)

**Live demo:** https://paulo-raoni.github.io/lista-de-tarefas/

## Features

- Add and remove todos with a smooth slide-out animation
- Persistence via `localStorage` (versioned key, graceful degradation when disabled)
- i18n with Portuguese (PT-BR) and English; language preference persisted
- Light / dark / system theme; system mode reacts live to OS changes
- WCAG AA contrast verified across both themes via axe-core in CI
- Keyboard accessible: every interaction reachable by Tab, Enter, Space, Escape
- Responsive layout

## Tech stack

- **Build:** Vite 5
- **Framework:** React 18 with hooks
- **Language:** TypeScript 5 (strict)
- **Styling:** CSS Modules + CSS custom properties for theming
- **i18n:** react-i18next
- **Testing:**
  - Vitest + React Testing Library (unit, jsdom)
  - Playwright + @axe-core/playwright (e2e + a11y)
- **CI/CD:** GitHub Actions (typecheck, lint, format, unit tests, build, e2e + a11y) and auto-deploy to GitHub Pages
- **Tooling:** ESLint 9 (flat config) + Prettier

## Local development

Requires Node 20.19 or newer (see `.nvmrc`).

```bash
npm ci
npm run dev          # http://localhost:5173
```

Other scripts:

```bash
npm run build           # production build
npm run preview         # serve the production build locally
npm run typecheck       # tsc --noEmit
npm run lint            # eslint
npm run format          # prettier write
npm run format:check    # prettier check
npm test                # unit tests (vitest)
npm run test:watch      # unit tests in watch mode
npm run test:coverage   # unit tests with v8 coverage
npm run test:e2e        # playwright (builds first via pretest:e2e)
```

## Project structure

```
src/
├── components/         # Functional components
├── hooks/              # Reusable hooks (useTodos, useLocalStorage)
├── i18n/               # react-i18next setup + translation catalogs
├── theme/              # Theme storage + useTheme hook
├── styles/global.css   # CSS variables for both themes
├── test/setup.ts       # Vitest setup (jest-dom, cleanup, i18n + theme reset)
├── App.tsx
└── main.tsx
tests/e2e/              # Playwright specs (smoke, a11y, i18n, theme)
.github/workflows/      # CI + Deploy
.nvmrc                  # Node 20.19
```

## Modernization journey

The 2026 modernization landed in 8 phases:

1. **CRA → Vite + TypeScript strict** — drop CRA's webpack 4 toolchain, gain a fast dev server.
2. **Functional + CSS Modules** — class components → hooks, drop styled-components and the Materialize CDN, fix the `deleteTarefa` reindexing bug, restore a11y.
3. **Unit tests** — Vitest + React Testing Library covering hooks and components.
4. **CI** — GitHub Actions running typecheck / lint / format / test / build on every PR.
5. **E2E + a11y** — Playwright smoke tests + axe-core a11y gate, zero serious/critical violations.
6. **i18n** — PT-BR + EN via react-i18next, accessible language switcher, persistence.
7. **Dark mode** — light / dark / system themes via CSS custom properties, anti-flash inline script, WCAG-AA contrast.
8. **Polish** — README, manifest, favicons, Open Graph + Twitter card meta, dynamic footer year.

A future Phase 9 will rename Portuguese identifiers throughout the codebase (file names, types, variables, translation keys) to English, with a one-time localStorage migration to avoid losing existing users' saved tasks.

## License

MIT.

Copyright © 2018–2026 Paulo Raoni Costa Bezerra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
