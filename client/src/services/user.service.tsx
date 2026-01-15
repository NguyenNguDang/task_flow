import axiosClient from "../api";
import { User } from "../types";

export const userService = {
    getMe: () => {
        return axiosClient.get<User>('/users/me');
    },

    updateProfile: (data: FormData) => {
        return axiosClient.put<User>('/users/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};