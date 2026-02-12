<script setup>
import { ref, onMounted } from 'vue'
import { usersApi } from '@/api/usersApi'
import { karyawanApi } from '@/api/karyawanApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()
const loading = ref(true)
const usersList = ref([])
const karyawanList = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const confirmRef = ref(null)
const search = ref('')

const form = ref({
  username: '',
  password: '',
  email: '',
  role: 'pramusaji',
  status: 'active',
  id_karyawan: '',
})

const filteredUsers = () => {
  if (!search.value) return usersList.value
  const q = search.value.toLowerCase()
  return usersList.value.filter((u) => u.username.toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
}

const fetchData = async () => {
  loading.value = true
  try {
    const [uRes, kRes] = await Promise.all([usersApi.getAll(), karyawanApi.getAll()])
    usersList.value = Array.isArray(uRes) ? uRes : uRes.data || []
    karyawanList.value = Array.isArray(kRes) ? kRes : kRes.data || []
  } catch (err) {
    toast.error('Gagal memuat data users')
  } finally {
    loading.value = false
  }
}

const roleColor = (role) => {
  const m = { admin: 'bg-red-100 text-red-700', manager: 'bg-purple-100 text-purple-700', kasir: 'bg-blue-100 text-blue-700', pramusaji: 'bg-green-100 text-green-700' }
  return m[role] || 'bg-gray-100 text-gray-700'
}

const resetForm = () => {
  form.value = { username: '', password: '', email: '', role: 'pramusaji', status: 'active', id_karyawan: '' }
  editId.value = null; isEdit.value = false
}

const openCreate = () => { resetForm(); showModal.value = true }

const openEdit = (u) => {
  isEdit.value = true; editId.value = u.id
  form.value = { username: u.username, password: '', email: u.email || '', role: u.role, status: u.status || 'active', id_karyawan: u.id_karyawan || '' }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    const payload = { ...form.value }
    if (payload.id_karyawan) payload.id_karyawan = Number(payload.id_karyawan)
    else delete payload.id_karyawan

    if (isEdit.value) {
      if (!payload.password) delete payload.password
      await usersApi.update(editId.value, payload)
      toast.success('User berhasil diperbarui')
    } else {
      await usersApi.create(payload)
      toast.success('User berhasil ditambahkan')
    }
    showModal.value = false; resetForm(); await fetchData()
  } catch (err) {
    toast.error('Gagal menyimpan user')
    console.error(err)
  }
}

const handleDelete = async (u) => {
  const ok = await confirmRef.value.open('Hapus User', `Yakin ingin menghapus user "${u.username}"?`)
  if (!ok) return
  try {
    await usersApi.remove(u.id); toast.success('User berhasil dihapus'); await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus user')
  }
}

onMounted(fetchData)
</script>

<template>
  <MainLayout>
    <ConfirmDialog ref="confirmRef" />
    <LoadingSpinner :loading="loading" />

    <div v-if="!loading" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="relative flex-1 max-w-md">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input v-model="search" type="text" placeholder="Cari user..." class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
        </div>
        <button @click="openCreate" class="bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm flex items-center gap-2 justify-center">
          <i class="fas fa-plus"></i><span>Tambah User</span>
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Username</th>
                <th class="px-4 py-3 text-left">Email</th>
                <th class="px-4 py-3 text-left">Role</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Karyawan</th>
                <th class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="u in filteredUsers()" :key="u.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">{{ u.username }}</td>
                <td class="px-4 py-3 text-gray-500">{{ u.email || '-' }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium capitalize" :class="roleColor(u.role)">{{ u.role }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium" :class="u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">{{ u.status || 'active' }}</span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ u.karyawan?.nama_karyawan || '-' }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button @click="openEdit(u)" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                    <button @click="handleDelete(u)" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers().length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">Belum ada data user</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? 'Edit User' : 'Tambah User' }}</h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input v-model="form.username" type="text" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ isEdit ? 'Password (kosongkan jika tidak diubah)' : 'Password' }}</label>
                <input v-model="form.password" type="password" :required="!isEdit" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select v-model="form.role" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="kasir">Kasir</option>
                    <option value="pramusaji">Pramusaji</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select v-model="form.status" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Link Karyawan (Opsional)</label>
                <select v-model="form.id_karyawan" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="">-- Tidak ada --</option>
                  <option v-for="k in karyawanList" :key="k.id" :value="k.id">{{ k.nama_karyawan }}</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="showModal = false" class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition">Batal</button>
                <button type="submit" class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition">{{ isEdit ? 'Simpan' : 'Tambah' }}</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </MainLayout>
</template>
