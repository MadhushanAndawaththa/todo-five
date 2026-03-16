import { useEffect, useRef, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const stay = setTimeout(() => setIsLeaving(true), 3000)
    const remove = setTimeout(() => onDismissRef.current(), 3300)
    return () => {
      clearTimeout(stay)
      clearTimeout(remove)
    }
  }, [])

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg
                  ${isLeaving ? 'animate-fade-out' : 'animate-slide-in'}
                  ${type === 'success'
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
      role="status"
    >
      <span aria-hidden="true">{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  )
}
