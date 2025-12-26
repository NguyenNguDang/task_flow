import axios from 'axios';
import { BACKEND_URL } from 'Constants';

const axiosClient = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response.data, // Trả về data trực tiếp cho gọn
    (error) => {
        // Handle lỗi chung ở đây
        return Promise.reject(error);
    }
);

export default axiosClient;