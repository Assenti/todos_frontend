import { User } from '@/models/User'

export interface Todo {
    id: number
    value: string
    completed: number
    important: number
    userId: number
    createdAt: string
    updatedAt: string
    completeDate: string
    status: string
    performer: number
    firstname: string
    lastname: string  
}

export interface TodoType {
    name: string
    id?: number
    createdAt?: string
    userId?: number
}

export interface TodosResponse {
    todos?: Todo[]
}

export interface Detail {
    id: number      
	todoId: number
	content: string
}