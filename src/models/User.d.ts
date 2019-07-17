export interface User {
    id: number
    firstname: string
    lastname: string
    email: string
    createdAt: string
    password: string
    token: string
    avatar: string
    lastLoggedOn?: string
}

export interface Performer {
    id: number
    firstname: string
    lastname: string
    email: string
    avatar: string
}

export interface UserSubmit {
    Email: string
    Password: string,
    Remember: boolean
}

export interface UserResponse {
    user: User
}