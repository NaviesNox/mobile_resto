import api from './axios'

export const karyawanApi = {
  async getAll() {
    const res = await api.get('/karyawan/')
    return res.data
  },
  async create(payload) {
    const res = await api.post('/karyawan/', payload)
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/karyawan/${id}`)
    return res.data
  },
  async update(id, payload) {
    const res = await api.patch(`/karyawan/${id}`, payload)
    return res.data
  },
  async remove(id) {
    const res = await api.delete(`/karyawan/${id}`)
    return res.data
  },
}
