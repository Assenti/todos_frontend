import { User } from '@/models/User'

export interface Todo {
    title: string
    completed: boolean
    important: boolean
    user: User
}

export interface TodosResponse {
    todos?: Todo[]
    todosCount: number
}