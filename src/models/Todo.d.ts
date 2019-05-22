import { User } from '@/models/User'

export interface Todo {
    ID: number
    Value: string
    Completed: boolean
    Important: boolean
    UserID: number
    CreatedAt: string
    UpdatedAt: string 
}

export interface TodosResponse {
    todos?: Todo[]
}