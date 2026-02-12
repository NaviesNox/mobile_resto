import api from './axios'

export const mejaApi = {
  async getAll() {
    const res = await api.get('/mejas/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/mejas/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/mejas/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.patch(`/mejas/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/mejas/${id}`)
    return res.data
  },
}
