import axios from 'axios'
import { User, UserSubmit, UserResponse } from '@/models/User'
import { TodosResponse } from '@/models/Todo'

export const Api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export function setJWT(jwt: string) {
    Api.defaults.headers.common['Authorization'] = `Token ${jwt}`
}

export function clearJWT() {
    delete Api.defaults.headers.common['Authorization']
}

export async function loginUser(userSubmit: UserSubmit): Promise<User> {
    const response = await Api.post('/login', userSubmit)
    console.log(response)
    return (response.data as UserResponse).user
}

export async function getUserTodos(user: User): Promise<TodosResponse> {
    const response = await Api.get(`/todos?id=${user.id}`)
    return response.data as TodosResponse
}