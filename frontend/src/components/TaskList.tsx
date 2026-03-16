import { TaskCard } from './TaskCard'
import type { Task } from '../types/Task'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  newTaskIds: Set<number>
  onComplete: (id: number) => Promise<void>
}

export function TaskList({ tasks, isLoading, newTaskIds, onComplete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-slate-100 dark:bg-gray-700 animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="py-16 text-center" data-testid="empty-state">
        <svg className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <path d="m9 14 2 2 4-4"/>
        </svg>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">All clear — add a task to get started</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3" data-testid="task-list">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskCard task={task} isNew={newTaskIds.has(task.id)} onComplete={onComplete} />
        </li>
      ))}
    </ul>
  )
}
