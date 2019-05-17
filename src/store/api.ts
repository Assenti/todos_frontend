import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

export function setJWT(jwt: string) {
    api.defaults.headers.common['Authorization'] = `Token ${jwt}`
}