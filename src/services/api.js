import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
})

// Interceptor (sau này dùng auth rất tiện)
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API error:", err)
    return Promise.reject(err)
  }
)

export default api
