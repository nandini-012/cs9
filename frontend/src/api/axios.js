import axios from 'axios'

const clientConfig = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
}

export const publicAxios = axios.create(clientConfig)
export const privateAxios = axios.create(clientConfig)

privateAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
