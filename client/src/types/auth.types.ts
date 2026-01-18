export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}