import axios from 'axios'
import { User, UserSubmit, UserResponse } from '@/models/User';

export const AuthApi = axios.create({
    baseURL: 'http://localhost:3010/api'
})

export function setJWT(jwt: string) {
    AuthApi.defaults.headers.common['Authorization'] = `Token ${jwt}`
}

export function clearJWT() {
    delete AuthApi.defaults.headers.common['Authorization']
}

export async function loginUser(credentials: UserSubmit): Promise<User> {
    const response = await AuthApi.post('/login', {
        credentials
    })
    return (response.data as UserResponse).user
}