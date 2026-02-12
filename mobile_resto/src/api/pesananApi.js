import api from './axios'

export const pesananApi = {
  async getAll() {
    const res = await api.get('/pesanan/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/pesanan/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/pesanan/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/pesanan/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/pesanan/${id}`)
    return res.data
  },
  async buatPesanan(payload) {
    const res = await api.post('/pesanan/buat', payload)
    return res.data
  },
}
