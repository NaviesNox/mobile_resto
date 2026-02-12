import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/authApi'
import { usersApi } from '@/api/usersApi'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const profile = ref(JSON.parse(localStorage.getItem('profile') || 'null'))

  const isLoggedIn = computed(() => !!token.value)

  const userRole = computed(() => {
    return (profile.value?.role || '').toLowerCase()
  })

  const isAdmin = computed(() => userRole.value === 'admin')
  const isManager = computed(() => userRole.value === 'manager')
  const isKasir = computed(() => userRole.value === 'kasir')
  const isPramusaji = computed(() => userRole.value === 'pramusaji')
  const isAdminOrManager = computed(() => isAdmin.value || isManager.value)

  async function login(username, password) {
    const data = await authApi.login(username, password)
    token.value = data.access_token
    localStorage.setItem('access_token', data.access_token)
    await fetchProfile()
  }

  async function fetchProfile() {
    try {
      const data = await usersApi.getProfile()
      profile.value = data
      localStorage.setItem('profile', JSON.stringify(data))
    } catch (err) {
      console.error('Gagal ambil profile:', err)
    }
  }

  function logout() {
    token.value = null
    profile.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('profile')
    router.push({ name: 'login' })
  }

  return {
    token,
    profile,
    isLoggedIn,
    userRole,
    isAdmin,
    isManager,
    isKasir,
    isPramusaji,
    isAdminOrManager,
    login,
    fetchProfile,
    logout,
  }
})
