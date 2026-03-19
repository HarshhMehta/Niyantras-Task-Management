import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

const api = axios.create({
  baseURL: BASE_URL,
})

export const getUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
export const getTodos = () => api.get('/todos')
export const getPosts = () => api.get('/posts')
export const getComments = (postId) => api.get(`/comments?postId=${postId}`)
export const getAllComments = () => api.get('/comments')
export default api