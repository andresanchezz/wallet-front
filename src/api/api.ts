import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const WalletApi = () => {
    const api = axios.create({
        baseURL: "http://10.0.2.2:3000",
    });

    api.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = "";

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                console.error("Token inválido o expirado");
            }
            return Promise.reject(error);
        }
    );

    return api;
};
