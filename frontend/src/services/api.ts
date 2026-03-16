import type { Task, CreateTaskPayload } from '../types/Task'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error ?? `HTTP ${response.status}`)
  }

  // 204 No Content — return null safely
  if (response.status === 204) return null as T

  return response.json()
}

export const api = {
  getTasks: (): Promise<Task[]> =>
    request('/tasks'),

  createTask: (payload: CreateTaskPayload): Promise<Task> =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  completeTask: (id: number): Promise<Task> =>
    request(`/tasks/${id}/complete`, { method: 'PATCH' }),

  getTaskCount: (): Promise<number> =>
    request<{ count: number }>('/tasks/count').then(r => r.count),
}
