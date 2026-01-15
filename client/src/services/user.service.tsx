import axiosClient from "../api";
import { User } from "../types";

export const userService = {
    getMe: () => {
        return axiosClient.get<User>('/user/me');
    },

    updateProfile: (data: FormData) => {
        return axiosClient.put<User>('/user/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};