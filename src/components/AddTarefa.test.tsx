import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AddTarefa from './AddTarefa'

describe('AddTarefa', () => {
  it('renders an input associated with its label', () => {
    render(<AddTarefa onAdd={() => {}} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('calls onAdd with trimmed content when submitting via Enter', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddTarefa onAdd={onAdd} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)

    await user.type(input, '  hello  ')
    await user.keyboard('{Enter}')

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith('hello')
  })

  it('does not call onAdd when input is empty or whitespace-only', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddTarefa onAdd={onAdd} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)

    await user.type(input, '   ')
    await user.keyboard('{Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('clears the input after a successful add', async () => {
    const user = userEvent.setup()
    render(<AddTarefa onAdd={() => {}} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i) as HTMLInputElement

    await user.type(input, 'task')
    await user.keyboard('{Enter}')

    expect(input.value).toBe('')
  })
})
