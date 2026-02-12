import api from './axios'

export const kategoriApi = {
  async getAll() {
    const res = await api.get('/kategori_menu/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/kategori_menu/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/kategori_menu/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/kategori_menu/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/kategori_menu/${id}`)
    return res.data
  },
}
