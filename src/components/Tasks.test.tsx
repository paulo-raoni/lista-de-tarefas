import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Tasks from './Tasks'

const sample = [
  { id: 'a', content: 'first' },
  { id: 'b', content: 'second' },
]

describe('Tasks', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the empty state when there are no tasks', () => {
    render(<Tasks tasks={[]} onRemove={() => {}} />)
    expect(screen.getByText('Não há tarefas ainda.')).toBeInTheDocument()
  })

  it('renders items as a list of buttons with descriptive aria-labels', () => {
    render(<Tasks tasks={sample} onRemove={() => {}} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Excluir tarefa: first' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excluir tarefa: second' })).toBeInTheDocument()
  })

  it('calls onRemove only after the animation delay', () => {
    const onRemove = vi.fn()
    render(<Tasks tasks={sample} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Excluir tarefa: first' }))
    expect(onRemove).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(onRemove).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onRemove).toHaveBeenCalledWith('a')
  })

  it('guards against double-clicks scheduling two removals', () => {
    const onRemove = vi.fn()
    render(<Tasks tasks={sample} onRemove={onRemove} />)
    const btn = screen.getByRole('button', { name: 'Excluir tarefa: first' })

    fireEvent.click(btn)
    fireEvent.click(btn)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('clears pending timeouts on unmount', () => {
    const onRemove = vi.fn()
    const { unmount } = render(<Tasks tasks={sample} onRemove={onRemove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Excluir tarefa: first' }))
    unmount()
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onRemove).not.toHaveBeenCalled()
  })
})
