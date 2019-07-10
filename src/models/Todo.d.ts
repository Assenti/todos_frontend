import { User } from '@/models/User'

export interface Todo {
    id: number
    value: string
    completed: boolean
    important: boolean
    userId: number
    createdAt: string
    updatedAt: string
    completeDate: string
    status: string
    performer: number
    firstname: string
    lastname: string  
}

export interface TodosResponse {
    todos?: Todo[]
}

export interface Detail {
    id: number      
	todoId: number
	content: string
}