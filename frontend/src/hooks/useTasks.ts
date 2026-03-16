import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../services/api'
import type { Task } from '../types/Task'

interface UseTasksReturn {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  totalIncomplete: number
  newTaskIds: Set<number>
  createTask: (title: string, description: string) => Promise<void>
  completeTask: (id: number) => Promise<void>
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalIncomplete, setTotalIncomplete] = useState(0)
  const [newTaskIds, setNewTaskIds] = useState<Set<number>>(new Set())

  const prevTaskIdsRef = useRef<Set<number> | null>(null)

  // Clear new-task markers after slide-in animation completes
  useEffect(() => {
    if (newTaskIds.size > 0) {
      const timer = setTimeout(() => setNewTaskIds(new Set()), 400)
      return () => clearTimeout(timer)
    }
  }, [newTaskIds])

  const fetchTasks = useCallback(async () => {
    try {
      const [data, count] = await Promise.all([api.getTasks(), api.getTaskCount()])

      // Mark newly-appearing tasks for slide-in animation (skip initial load)
      if (prevTaskIdsRef.current !== null) {
        const incoming = data.filter(t => !prevTaskIdsRef.current!.has(t.id)).map(t => t.id)
        if (incoming.length > 0) setNewTaskIds(new Set(incoming))
      }

      prevTaskIdsRef.current = new Set(data.map(t => t.id))
      setTasks(data)
      setTotalIncomplete(count)
    } catch {
      setError('Failed to load tasks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (title: string, description: string) => {
    const newTask = await api.createTask({ title, description })
    setTasks(prev => [newTask, ...prev].slice(0, 5))
    setTotalIncomplete(prev => prev + 1)
    setNewTaskIds(new Set([newTask.id]))
    prevTaskIdsRef.current = new Set([newTask.id, ...(prevTaskIdsRef.current ?? [])])
  }

  const completeTask = async (id: number) => {
    const prevTasks = tasks
    setTasks(prev => prev.filter(t => t.id !== id))
    setTotalIncomplete(prev => Math.max(0, prev - 1))
    try {
      await api.completeTask(id)
      await fetchTasks()
    } catch {
      setTasks(prevTasks)
      setTotalIncomplete(prev => prev + 1)
      throw new Error('Failed to complete task')
    }
  }

  return { tasks, isLoading, error, totalIncomplete, newTaskIds, createTask, completeTask }
}
