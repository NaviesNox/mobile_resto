import api from './axios'

export const menuApi = {
  async getAll() {
    const res = await api.get('/menus/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/menus/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/menus/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.patch(`/menus/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/menus/${id}`)
    return res.data
  },
}
