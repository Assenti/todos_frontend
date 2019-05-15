import axios from 'axios'
import {
    UserSubmit,
    UserResponse,
    User
  } from '@/models/User'

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export function setJWT(jwt: string) {
    api.defaults.headers.common['Authorization'] = `Token ${jwt}`
}

export async function loginUser(user: UserSubmit): Promise<User> {
    const response = await api.post('/login', user)
    console.log(response.data)
    return (response.data as User)
}