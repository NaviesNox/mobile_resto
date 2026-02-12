<script setup>
import { ref, onMounted } from 'vue'
import { karyawanApi } from '@/api/karyawanApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()
const loading = ref(true)
const karyawanList = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const confirmRef = ref(null)
const search = ref('')

const form = ref({ nama_karyawan: '', no_hp: '', alamat: '' })

const filteredKaryawan = () => {
  if (!search.value) return karyawanList.value
  const q = search.value.toLowerCase()
  return karyawanList.value.filter((k) => k.nama_karyawan.toLowerCase().includes(q) || k.no_hp.includes(q))
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await karyawanApi.getAll()
    karyawanList.value = Array.isArray(res) ? res : res.data || []
  } catch (err) {
    toast.error('Gagal memuat data karyawan')
  } finally {
    loading.value = false
  }
}

const resetForm = () => { form.value = { nama_karyawan: '', no_hp: '', alamat: '' }; editId.value = null; isEdit.value = false }
const openCreate = () => { resetForm(); showModal.value = true }

const openEdit = (k) => {
  isEdit.value = true; editId.value = k.id
  form.value = { nama_karyawan: k.nama_karyawan, no_hp: k.no_hp, alamat: k.alamat }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await karyawanApi.update(editId.value, form.value)
      toast.success('Data karyawan berhasil diperbarui')
    } else {
      await karyawanApi.create(form.value)
      toast.success('Karyawan berhasil ditambahkan')
    }
    showModal.value = false; resetForm(); await fetchData()
  } catch (err) {
    toast.error('Gagal menyimpan data karyawan')
  }
}

const handleDelete = async (k) => {
  const ok = await confirmRef.value.open('Hapus Karyawan', `Yakin ingin menghapus "${k.nama_karyawan}"?`)
  if (!ok) return
  try {
    await karyawanApi.remove(k.id); toast.success('Karyawan berhasil dihapus'); await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus karyawan')
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
          <input v-model="search" type="text" placeholder="Cari karyawan..." class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
        </div>
        <button @click="openCreate" class="bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm flex items-center gap-2 justify-center">
          <i class="fas fa-plus"></i><span>Tambah Karyawan</span>
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">No</th>
                <th class="px-4 py-3 text-left">Nama</th>
                <th class="px-4 py-3 text-left">No HP</th>
                <th class="px-4 py-3 text-left">Alamat</th>
                <th class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(k, i) in filteredKaryawan()" :key="k.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-500">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium text-gray-800">{{ k.nama_karyawan }}</td>
                <td class="px-4 py-3">{{ k.no_hp }}</td>
                <td class="px-4 py-3 text-gray-500 max-w-[200px] truncate">{{ k.alamat }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button @click="openEdit(k)" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                    <button @click="handleDelete(k)" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredKaryawan().length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-400">Belum ada data karyawan</td>
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
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? 'Edit Karyawan' : 'Tambah Karyawan' }}</h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Karyawan</label>
                <input v-model="form.nama_karyawan" type="text" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No HP</label>
                <input v-model="form.no_hp" type="text" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea v-model="form.alamat" rows="3" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"></textarea>
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
