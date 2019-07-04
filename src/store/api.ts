import axios from 'axios'

const prodUrl = 'https://planner-restapi.herokuapp.com'
const devUrl = 'http://localhost:3000'
const backendURL = process.env.NODE_ENV === 'development' ? devUrl : prodUrl

export const api = axios.create({
    baseURL: backendURL,
    // withCredentials: true,
    // headers: {
    //     'Access-Control-Allow-Credentials': true
    // }
})

export function setJWT(jwt: string) {
    api.defaults.headers.common['Authorization'] = `Token ${jwt}`
}