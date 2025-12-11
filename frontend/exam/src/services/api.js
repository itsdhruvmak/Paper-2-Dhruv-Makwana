import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://paper-2-dhruv-makwana.onrender.com/api"
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("refreshToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api;
