export interface User {
    id: number
    firstname: string
    lastname: string
    email: string
    createdAt: string
    password: string
    token: string,
    avatar: string
}

export interface UserSubmit {
    email: string
    password: string,
    remember: boolean
}

export interface UserResponse {
    user: User
}