import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
});


// Axios Interceptor: Response Method
AxiosInstance.interceptors.response.use(
    (response) => {
        // Can be modified response
        return response;
    },
    (error) => {
        // Handle response errors here
        return Promise.reject(error);
    }
);

export default AxiosInstance;