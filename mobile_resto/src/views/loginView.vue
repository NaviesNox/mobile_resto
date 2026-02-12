<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    toast.warning('Username dan password harus diisi')
    return
  }
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    toast.success('Login berhasil!')
    router.push({ name: 'dashboard' })
  } catch (err) {
    console.error(err)
    toast.error('Username atau password salah')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-white">
    <!-- Sisi Kiri - Gambar -->
    <div class="hidden md:flex w-1/2 bg-gray-200 items-center justify-center overflow-hidden">
      <img
        src="@/assets/img/resto-image.png"
        alt="Resto"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Mobile header -->
    <div class="md:hidden bg-red-500 p-8 text-white text-center">
      <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-utensils text-3xl"></i>
      </div>
      <h1 class="text-2xl font-bold">RestoApp</h1>
      <p class="text-red-100 text-sm mt-1">Restaurant Management System</p>
    </div>

    <!-- Sisi Kanan - Form Login -->
    <div class="flex-1 flex items-center justify-center p-6 md:p-8 bg-white">
      <form @submit.prevent="handleLogin" class="w-full max-w-sm">
        <div class="hidden md:block mb-8 text-center">
          <div class="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-utensils text-2xl text-white"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Login RestoApp</h2>
          <p class="text-gray-500 text-sm mt-1">Masuk ke akun Anda</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div class="relative">
            <i class="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="username"
              type="text"
              placeholder="Masukkan username"
              autocomplete="username"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <i class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan password"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <div v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{{ loading ? 'Memproses...' : 'Login' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

