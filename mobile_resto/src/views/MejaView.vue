<script setup>
import { ref, onMounted, computed } from 'vue'
import { mejaApi } from '@/api/mejaApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()
const loading = ref(true)
const mejas = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const confirmRef = ref(null)
const filterStatus = ref('')

const form = ref({ kode_meja: '', kapasitas: 1, lokasi: '', status: 'tersedia' })

const filteredMejas = computed(() => {
  if (!filterStatus.value) return mejas.value
  return mejas.value.filter((m) => m.status === filterStatus.value)
})

const statusColor = (status) => {
  const map = {
    tersedia: 'bg-green-100 text-green-700 border-green-200',
    terisi: 'bg-red-100 text-red-700 border-red-200',
    kosong: 'bg-gray-100 text-gray-600 border-gray-200',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const statusIcon = (status) => {
  const map = { tersedia: 'fas fa-check-circle', terisi: 'fas fa-users', kosong: 'fas fa-minus-circle' }
  return map[status] || 'fas fa-circle'
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await mejaApi.getAll()
    mejas.value = Array.isArray(res) ? res : res.data || []
  } catch (err) {
    toast.error('Gagal memuat data meja')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = { kode_meja: '', kapasitas: 1, lokasi: '', status: 'tersedia' }
  editId.value = null
  isEdit.value = false
}

const openCreate = () => { resetForm(); showModal.value = true }

const openEdit = (meja) => {
  isEdit.value = true
  editId.value = meja.id
  form.value = { kode_meja: meja.kode_meja, kapasitas: meja.kapasitas, lokasi: meja.lokasi, status: meja.status }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    const payload = { ...form.value, kapasitas: Number(form.value.kapasitas) }
    if (isEdit.value) {
      await mejaApi.update(editId.value, payload)
      toast.success('Meja berhasil diperbarui')
    } else {
      await mejaApi.create(payload)
      toast.success('Meja berhasil ditambahkan')
    }
    showModal.value = false
    resetForm()
    await fetchData()
  } catch (err) {
    toast.error('Gagal menyimpan meja')
  }
}

const handleDelete = async (meja) => {
  const ok = await confirmRef.value.open('Hapus Meja', `Yakin ingin menghapus meja "${meja.kode_meja}"?`)
  if (!ok) return
  try {
    await mejaApi.remove(meja.id)
    toast.success('Meja berhasil dihapus')
    await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus meja')
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
        <div class="flex gap-2 flex-wrap">
          <button @click="filterStatus = ''" class="px-3 py-1.5 rounded-lg text-xs font-medium transition" :class="filterStatus === '' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'">Semua</button>
          <button @click="filterStatus = 'tersedia'" class="px-3 py-1.5 rounded-lg text-xs font-medium transition" :class="filterStatus === 'tersedia' ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'">Tersedia</button>
          <button @click="filterStatus = 'terisi'" class="px-3 py-1.5 rounded-lg text-xs font-medium transition" :class="filterStatus === 'terisi' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'">Terisi</button>
          <button @click="filterStatus = 'kosong'" class="px-3 py-1.5 rounded-lg text-xs font-medium transition" :class="filterStatus === 'kosong' ? 'bg-gray-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'">Kosong</button>
        </div>
        <button @click="openCreate" class="bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm flex items-center gap-2 justify-center">
          <i class="fas fa-plus"></i><span>Tambah Meja</span>
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <div v-for="meja in filteredMejas" :key="meja.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-bold text-gray-800">{{ meja.kode_meja }}</span>
            <span class="px-2 py-1 rounded-full text-xs font-medium capitalize" :class="statusColor(meja.status)">
              <i :class="statusIcon(meja.status)" class="mr-1"></i>{{ meja.status }}
            </span>
          </div>
          <div class="text-xs text-gray-500 space-y-1 mb-3">
            <p><i class="fas fa-users w-4"></i> Kapasitas: {{ meja.kapasitas }}</p>
            <p><i class="fas fa-map-marker-alt w-4"></i> {{ meja.lokasi }}</p>
          </div>
          <div class="flex gap-2 justify-end">
            <button @click="openEdit(meja)" class="text-blue-500 hover:text-blue-700 text-sm"><i class="fas fa-edit"></i></button>
            <button @click="handleDelete(meja)" class="text-red-400 hover:text-red-600 text-sm"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>

      <div v-if="filteredMejas.length === 0" class="text-center py-12 text-gray-400">
        <i class="fas fa-chair text-4xl mb-3"></i>
        <p>Belum ada data meja</p>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? 'Edit Meja' : 'Tambah Meja' }}</h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kode Meja</label>
                <input v-model="form.kode_meja" type="text" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                  <input v-model.number="form.kapasitas" type="number" min="1" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select v-model="form.status" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                    <option value="tersedia">Tersedia</option>
                    <option value="terisi">Terisi</option>
                    <option value="kosong">Kosong</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input v-model="form.lokasi" type="text" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
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
