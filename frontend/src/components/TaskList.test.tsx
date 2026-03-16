import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TaskList } from './TaskList'
import type { Task } from '../types/Task'

const mockTasks: Task[] = [
  { id: 1, title: 'Task One', description: 'First task', completed: false, createdAt: '2026-03-16T10:00:00' },
  { id: 2, title: 'Task Two', description: 'Second task', completed: false, createdAt: '2026-03-16T09:00:00' },
]

describe('TaskList', () => {
  it('shows loading skeleton when isLoading is true', () => {
    const { container } = render(
      <TaskList tasks={[]} isLoading={true} newTaskIds={new Set()} onComplete={vi.fn()} />
    )
    // Skeleton divs have animate-pulse class
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('shows empty state when no tasks and not loading', () => {
    render(<TaskList tasks={[]} isLoading={false} newTaskIds={new Set()} onComplete={vi.fn()} />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders all provided tasks', () => {
    render(<TaskList tasks={mockTasks} isLoading={false} newTaskIds={new Set()} onComplete={vi.fn()} />)

    expect(screen.getByTestId('task-list')).toBeInTheDocument()
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
  })

  it('does not show empty state when tasks are present', () => {
    render(<TaskList tasks={mockTasks} isLoading={false} newTaskIds={new Set()} onComplete={vi.fn()} />)

    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
  })
})
