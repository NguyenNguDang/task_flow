import axios from 'axios';
import { LoginPayload, AuthResponse } from '../types/auth.types';
import {BACKEND_URL} from "../Constants";
import axiosClient from "../api";

export const loginService = async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/auth/login`,
        credentials
    );

    return response.data;
};

export const logoutService = async (): Promise<void> => {
    return axiosClient.post('/auth/logout');
};