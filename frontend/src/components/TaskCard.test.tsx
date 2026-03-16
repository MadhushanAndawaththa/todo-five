import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskCard } from './TaskCard'
import type { Task } from '../types/Task'

const mockTask: Task = {
  id: 1,
  title: 'Buy groceries',
  description: 'Milk, eggs, and bread',
  completed: false,
  createdAt: '2026-03-16T10:00:00',
}

describe('TaskCard', () => {
  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)

    expect(screen.getByTestId('task-title')).toHaveTextContent('Buy groceries')
    expect(screen.getByTestId('task-description')).toHaveTextContent('Milk, eggs, and bread')
  })

  it('renders a Done button', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)

    expect(screen.getByTestId('done-button')).toBeInTheDocument()
    expect(screen.getByTestId('done-button')).toHaveTextContent('Done')
  })

  it('calls onComplete with task id when Done button is clicked', async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined)
    render(<TaskCard task={mockTask} onComplete={onComplete} />)

    await userEvent.click(screen.getByTestId('done-button'))

    expect(onComplete).toHaveBeenCalledWith(1)
  })

  it('has accessible aria-label on Done button', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />)

    expect(screen.getByRole('button', { name: /mark "buy groceries" as done/i })).toBeInTheDocument()
  })
})
