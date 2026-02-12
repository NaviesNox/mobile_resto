import api from './axios'

export const usersApi = {
  async getAll() {
    const res = await api.get('/users/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/users/', payload)
    return res.data
  },
  async getProfile() {
    const res = await api.get('/users/profile/')
    return res.data
  },
  async updateProfile(payload) {
    const res = await api.patch('/users/profile/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/users/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.patch(`/users/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },
}
