import { ApiErrorResponse } from "@/types/types";
import axios, { AxiosError, AxiosResponse } from "axios";

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});


AxiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error : AxiosError) => {
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data as ApiErrorResponse);
        }
        return Promise.reject(error);
    }
);


export default AxiosInstance;