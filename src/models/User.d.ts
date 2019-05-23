export interface User {
    ID: number
    Firstname: string
    Lastname: string
    Email: string
    CreatedAt: string
    Password: string
    // token: string
}

export interface UserSubmit {
    email: string
    password: string
}

export interface UserResponse {
    user: User
}