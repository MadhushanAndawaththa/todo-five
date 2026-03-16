import { useState, type FormEvent } from 'react'

interface TaskFormProps {
  onSubmit: (title: string, description: string) => Promise<void>
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = title.trim().length > 0 && description.trim().length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(title.trim(), description.trim())
      setTitle('')
      setDescription('')
    } catch {
      setError('Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="task-form">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={255}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500
                     transition-shadow duration-200
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     disabled:opacity-50"
          disabled={isSubmitting}
          data-testid="title-input"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={3}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-slate-900 dark:text-gray-100 placeholder-slate-400 dark:placeholder-slate-500
                     transition-shadow duration-200 resize-none
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     disabled:opacity-50"
          disabled={isSubmitting}
          data-testid="description-input"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white
                   transition-all duration-200
                   hover:bg-indigo-700 hover:scale-[1.01]
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        data-testid="submit-button"
      >
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}
