<script setup>
import { ref, onMounted } from 'vue'
import { stokApi } from '@/api/stokApi'
import { menuApi } from '@/api/menuApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()
const loading = ref(true)
const stokList = ref([])
const menus = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const confirmRef = ref(null)

const form = ref({ id_menu: '', jumlah_porsi: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    const [sRes, mRes] = await Promise.all([stokApi.getAll(), menuApi.getAll()])
    stokList.value = Array.isArray(sRes) ? sRes : sRes.data || []
    menus.value = Array.isArray(mRes) ? mRes : mRes.data || []
  } catch (err) {
    toast.error('Gagal memuat data stok')
  } finally {
    loading.value = false
  }
}

const getMenuName = (id) => menus.value.find((m) => m.id === id)?.nama_menu || '-'

const resetForm = () => { form.value = { id_menu: '', jumlah_porsi: 0 }; editId.value = null; isEdit.value = false }
const openCreate = () => { resetForm(); showModal.value = true }

const openEdit = (s) => {
  isEdit.value = true; editId.value = s.id
  form.value = { id_menu: s.id_menu, jumlah_porsi: s.jumlah_porsi }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    const payload = { id_menu: Number(form.value.id_menu), jumlah_porsi: Number(form.value.jumlah_porsi) }
    if (isEdit.value) {
      await stokApi.update(editId.value, payload)
      toast.success('Stok berhasil diperbarui')
    } else {
      await stokApi.create(payload)
      toast.success('Stok berhasil ditambahkan')
    }
    showModal.value = false; resetForm(); await fetchData()
  } catch (err) {
    toast.error('Gagal menyimpan stok')
  }
}

const handleDelete = async (s) => {
  const ok = await confirmRef.value.open('Hapus Update Stok', `Yakin ingin menghapus update stok ini?`)
  if (!ok) return
  try {
    await stokApi.remove(s.id); toast.success('Berhasil dihapus'); await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus')
  }
}

onMounted(fetchData)
</script>

<template>
  <MainLayout>
    <ConfirmDialog ref="confirmRef" />
    <LoadingSpinner :loading="loading" />

    <div v-if="!loading" class="space-y-4">
      <div class="flex justify-end">
        <button @click="openCreate" class="bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm flex items-center gap-2">
          <i class="fas fa-plus"></i><span>Update Stok</span>
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">No</th>
                <th class="px-4 py-3 text-left">Menu</th>
                <th class="px-4 py-3 text-left">Jumlah Porsi</th>
                <th class="px-4 py-3 text-left">Tanggal Update</th>
                <th class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(s, i) in stokList" :key="s.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-500">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium text-gray-800">{{ s.menu?.nama_menu || getMenuName(s.id_menu) }}</td>
                <td class="px-4 py-3">{{ s.jumlah_porsi }}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ new Date(s.tanggal_update).toLocaleString('id-ID') }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button @click="openEdit(s)" class="text-blue-500 hover:text-blue-700"><i class="fas fa-edit"></i></button>
                    <button @click="handleDelete(s)" class="text-red-400 hover:text-red-600"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr v-if="stokList.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-400">Belum ada update stok</td>
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
          <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? 'Edit Stok' : 'Tambah Update Stok' }}</h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Menu</label>
                <select v-model="form.id_menu" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="" disabled>Pilih Menu</option>
                  <option v-for="m in menus" :key="m.id" :value="m.id">{{ m.nama_menu }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Porsi</label>
                <input v-model.number="form.jumlah_porsi" type="number" min="0" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
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
