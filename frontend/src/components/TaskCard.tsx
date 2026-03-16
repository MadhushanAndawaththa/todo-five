import { useState } from 'react'
import type { Task } from '../types/Task'

interface TaskCardProps {
  task: Task
  isNew?: boolean
  onComplete: (id: number) => Promise<void>
}

export function TaskCard({ task, isNew = false, onComplete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    setIsDismissed(true)
    await new Promise(resolve => setTimeout(resolve, 280))
    await onComplete(task.id)
  }

  return (
    <div
      className={`group rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-gray-800 p-4 shadow-sm
                  transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer select-none
                  ${isDismissed ? 'animate-fade-out' : isNew ? 'animate-slide-in' : ''}`}
      data-testid={`task-card-${task.id}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-gray-100 truncate text-sm"
              title={task.title}
              data-testid="task-title">
            {task.title}
          </h3>
          <p
            className={`mt-0.5 text-xs text-slate-500 dark:text-slate-400 ${isExpanded ? '' : 'truncate'}`}
            data-testid="task-description"
          >
            {task.description}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleComplete(); }}
          disabled={isCompleting}
          className="shrink-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-gray-700 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300
                     transition-all duration-200
                     hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700
                     dark:hover:border-emerald-500 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400
                     focus:outline-none focus:ring-2 focus:ring-emerald-400
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Mark "${task.title}" as done`}
          data-testid="done-button"
        >
          {isCompleting ? '✓' : 'Done'}
        </button>
      </div>
    </div>
  )
}
