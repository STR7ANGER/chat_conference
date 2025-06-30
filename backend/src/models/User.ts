export interface User {
    id: string;
    email: string;
    password_hash: string;
    full_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserData {
    email: string;
    password: string;
    full_name?: string;
}

export interface LoginUserData {
    email: string;
    password: string;
}