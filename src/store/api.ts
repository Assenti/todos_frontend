import axios from 'axios'

const prodUrl = 'https://planner-restapi.herokuapp.com'
const backendURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : prodUrl

export const api = axios.create({
    baseURL: backendURL
})

export function setJWT(jwt: string) {
    api.defaults.headers.common['Authorization'] = `Token ${jwt}`
}