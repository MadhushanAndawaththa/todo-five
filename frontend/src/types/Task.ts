export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: string
}

export interface CreateTaskPayload {
  title: string
  description: string
}
