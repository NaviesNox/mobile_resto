import api from './axios'

export const transaksiApi = {
  async getAll() {
    const res = await api.get('/transaksi/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/transaksi/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/transaksi/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/transaksi/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/transaksi/${id}`)
    return res.data
  },
}
