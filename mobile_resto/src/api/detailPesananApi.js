import api from './axios'

export const detailPesananApi = {
  async getAll() {
    const res = await api.get('/detail-pesanan/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/detail-pesanan/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/detail-pesanan/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/detail-pesanan/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/detail-pesanan/${id}`)
    return res.data
  },
}
