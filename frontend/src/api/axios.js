import axios from 'axios'

const clientConfig = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Required for HTTP-only cookie auth to work cross-origin
  withCredentials: true,
}

export const publicAxios = axios.create(clientConfig)
export const privateAxios = axios.create(clientConfig)
export default publicAxios