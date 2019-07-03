import axios from 'axios'

const backendURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''

export const api = axios.create({
    baseURL: backendURL
})

export function setJWT(jwt: string) {
    api.defaults.headers.common['Authorization'] = `Token ${jwt}`
}