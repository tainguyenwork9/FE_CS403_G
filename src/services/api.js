import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export function getApiErrorMessage(error, fallbackMessage) {
    return error.response?.data?.message || error.message || fallbackMessage
}

export default api