export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    avatarUrl?: string | undefined;
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}