<script setup>
import { ref, onMounted } from 'vue'
import { usersApi } from '@/api/usersApi'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const auth = useAuthStore()
const toast = useToastStore()
const loading = ref(true)
const isEditing = ref(false)

const profile = ref(null)
const form = ref({ username: '', email: '' })
const passwordForm = ref({ password: '' })
const showPasswordForm = ref(false)

const fetchProfile = async () => {
  loading.value = true
  try {
    const data = await usersApi.getProfile()
    profile.value = data
    form.value = { username: data.username, email: data.email || '' }
  } catch (err) {
    toast.error('Gagal memuat profil')
  } finally {
    loading.value = false
  }
}

const handleUpdateProfile = async () => {
  try {
    await usersApi.updateProfile(form.value)
    toast.success('Profil berhasil diperbarui')
    isEditing.value = false
    await auth.fetchProfile()
    await fetchProfile()
  } catch (err) {
    toast.error('Gagal memperbarui profil')
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.value.password) { toast.warning('Password tidak boleh kosong'); return }
  try {
    await usersApi.updateProfile({ password: passwordForm.value.password })
    toast.success('Password berhasil diubah')
    passwordForm.value.password = ''
    showPasswordForm.value = false
  } catch (err) {
    toast.error('Gagal mengubah password')
  }
}

const handleLogout = () => {
  auth.logout()
}

onMounted(fetchProfile)
</script>

<template>
  <MainLayout>
    <LoadingSpinner :loading="loading" />

    <div v-if="!loading && profile" class="max-w-lg mx-auto space-y-4">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl font-bold mx-auto mb-4">
          {{ profile.username?.charAt(0).toUpperCase() }}
        </div>
        <h2 class="text-xl font-bold text-gray-800">{{ profile.username }}</h2>
        <p class="text-gray-500 text-sm">{{ profile.email || 'Email belum diatur' }}</p>
        <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize bg-red-100 text-red-700">{{ profile.role }}</span>
      </div>

      <!-- Edit Profile -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Informasi Profil</h3>
          <button @click="isEditing = !isEditing" class="text-red-500 text-sm font-medium hover:text-red-600">
            {{ isEditing ? 'Batal' : 'Edit' }}
          </button>
        </div>

        <form v-if="isEditing" @submit.prevent="handleUpdateProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input v-model="form.username" type="text" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
          </div>
          <button type="submit" class="w-full px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition">Simpan</button>
        </form>

        <div v-else class="space-y-3">
          <div class="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span class="text-gray-500">Username</span>
            <span class="font-medium text-gray-800">{{ profile.username }}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span class="text-gray-500">Email</span>
            <span class="font-medium text-gray-800">{{ profile.email || '-' }}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span class="text-gray-500">Role</span>
            <span class="font-medium text-gray-800 capitalize">{{ profile.role }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Status</span>
            <span class="font-medium text-gray-800 capitalize">{{ profile.status || 'active' }}</span>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <button @click="showPasswordForm = !showPasswordForm" class="flex items-center justify-between w-full">
          <h3 class="font-bold text-gray-800">Ubah Password</h3>
          <i :class="showPasswordForm ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-gray-400"></i>
        </button>
        <form v-if="showPasswordForm" @submit.prevent="handleChangePassword" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input v-model="passwordForm.password" type="password" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
          </div>
          <button type="submit" class="w-full px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition">Ubah Password</button>
        </form>
      </div>

      <!-- Logout -->
      <button @click="handleLogout" class="w-full px-4 py-3 bg-white border border-red-200 text-red-500 rounded-2xl hover:bg-red-50 font-medium transition flex items-center justify-center gap-2">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  </MainLayout>
</template>
