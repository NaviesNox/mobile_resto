import api from './axios'

export const authApi = {
  async login(username, password) {
    const form = new URLSearchParams()
    form.append('username', username)
    form.append('password', password)
    const res = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return res.data
  },

  async register(payload) {
    const res = await api.post('/auth/register', payload)
    return res.data
  },
}
