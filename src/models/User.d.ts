export interface User {
    firstname: string
    lastname: string
    email: string
    password: string
    age?: number
    token: string
}

export interface UserSubmit {
    email: string
    password: string
}

export interface UserResponse {
    user: User
}