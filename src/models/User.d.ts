export interface User {
    ID: number
    Firstname: string
    Lastname: string
    Email: string
    CreatedAt: string
    Password: string
    token: string,
    Avatar: string
}

export interface UserSubmit {
    email: string
    password: string
}

export interface UserResponse {
    user: User
}