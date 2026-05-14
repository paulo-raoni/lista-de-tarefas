import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AddTask from './AddTask'

describe('AddTask', () => {
  it('renders an input associated with its label', () => {
    render(<AddTask onAdd={() => {}} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('shows a translated placeholder', () => {
    render(<AddTask onAdd={() => {}} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)
    expect(input).toHaveAttribute('placeholder', 'Ex.: Comprar leite')
  })

  it('renders an Add submit button that is disabled while the input is empty', () => {
    render(<AddTask onAdd={() => {}} />)
    const button = screen.getByRole('button', { name: /adicionar/i })
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toBeDisabled()
  })

  it('enables the Add button once the input has non-whitespace content', async () => {
    const user = userEvent.setup()
    render(<AddTask onAdd={() => {}} />)
    const button = screen.getByRole('button', { name: /adicionar/i })
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)

    await user.type(input, '   ')
    expect(button).toBeDisabled()

    await user.type(input, 'hello')
    expect(button).toBeEnabled()
  })

  it('calls onAdd with trimmed content when the button is clicked', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddTask onAdd={onAdd} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)

    await user.type(input, '  buy milk  ')
    await user.click(screen.getByRole('button', { name: /adicionar/i }))

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith('buy milk')
  })

  it('still calls onAdd when submitting via Enter', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddTask onAdd={onAdd} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)

    await user.type(input, '  hello  ')
    await user.keyboard('{Enter}')

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith('hello')
  })

  it('does not call onAdd when input is empty or whitespace', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddTask onAdd={onAdd} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i)

    await user.type(input, '   ')
    await user.keyboard('{Enter}')

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('clears the input after a successful add via the button', async () => {
    const user = userEvent.setup()
    render(<AddTask onAdd={() => {}} />)
    const input = screen.getByLabelText(/escreva abaixo uma tarefa/i) as HTMLInputElement

    await user.type(input, 'task')
    await user.click(screen.getByRole('button', { name: /adicionar/i }))

    expect(input.value).toBe('')
  })
})
