export interface User {
    id: number
    firstname: string
    lastname: string
    email: string
    password: string
    createdAt: string
    token: string
}

export interface UserSubmit {
    email: string
    password: string
}

export interface UserResponse {
    user: User
}