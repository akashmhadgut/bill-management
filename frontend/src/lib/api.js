import axios from 'axios'

// default to the deployed backend; can be overridden with .env VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE || 'https://bill-management-zmka.onrender.com'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to attach token when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
