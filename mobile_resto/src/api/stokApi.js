import api from './axios'

export const stokApi = {
  async getAll() {
    const res = await api.get('/update_stok_harian/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/update_stok_harian/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/update_stok_harian/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/update_stok_harian/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/update_stok_harian/${id}`)
    return res.data
  },
}
