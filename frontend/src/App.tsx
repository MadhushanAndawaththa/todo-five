import { useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { Toast } from './components/Toast'
import { useTasks } from './hooks/useTasks'
import { useDarkMode } from './hooks/useDarkMode'
import './index.css'

export default function App() {
  const { tasks, isLoading, error, totalIncomplete, newTaskIds, createTask, completeTask } = useTasks()
  const { isDark, toggle } = useDarkMode()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleCreateTask = async (title: string, description: string) => {
    await createTask(title, description)
    setToast({ message: 'Task created successfully', type: 'success' })
  }

  const handleCompleteTask = async (id: number) => {
    try {
      await completeTask(id)
    } catch {
      setToast({ message: 'Failed to complete task. Please try again.', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Tasks</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stay on top of what matters</p>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="mt-1 shrink-0 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-gray-800 p-2.5 text-slate-600 dark:text-slate-300
                       transition-all duration-200 hover:bg-slate-100 dark:hover:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isDark ? (
              /* Sun — shown in dark mode to switch to light */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              /* Moon — shown in light mode to switch to dark */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                   strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
        </header>

        {/* Two-column on desktop (lg+), stacked on mobile */}
        <div className="lg:grid lg:grid-cols-[minmax(300px,1fr)_minmax(400px,2fr)] lg:gap-8 lg:items-start">

          {/* LEFT: Create task form — sticky on desktop */}
          <aside className="mb-6 lg:mb-0 lg:sticky lg:top-8">
            <section className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                New Task
              </h2>
              <TaskForm onSubmit={handleCreateTask} />
            </section>
          </aside>

          {/* RIGHT: Task list */}
          <main>
            {(tasks.length > 0 || isLoading) && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Recent Tasks
                </h2>
                {tasks.length > 0 && (
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {totalIncomplete > tasks.length
                      ? `Showing ${tasks.length} of ${totalIncomplete}`
                      : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
                  </span>
                )}
              </div>
            )}

            {error ? (
              <p className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            ) : (
              <TaskList tasks={tasks} isLoading={isLoading} newTaskIds={newTaskIds} onComplete={handleCompleteTask} />
            )}
          </main>

        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        )}
      </div>
    </div>
  )
}
