// /src/Utils/api-client.js
import axios from "axios"

export const api = axios.create({
    baseURL: "/", // opsional, kalau backend pakai prefix
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
})

// Bisa tambahin interceptor global
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // misal redirect login
//     }
//     return Promise.reject(error)
//   }
// )
