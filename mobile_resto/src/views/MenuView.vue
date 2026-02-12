<script setup>
import { ref, onMounted } from 'vue'
import { menuApi } from '@/api/menuApi'
import { kategoriApi } from '@/api/kategoriApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()

const loading = ref(true)
const menus = ref([])
const kategoris = ref([])
const search = ref('')
const showModal = ref(false)
const isEdit = ref(false)
const confirmRef = ref(null)

const form = ref({
  nama_menu: '',
  harga: 0,
  stok: 0,
  id_kategori_menu: '',
  deskripsi: '',
})

const editId = ref(null)

const filteredMenus = () => {
  if (!search.value) return menus.value
  const q = search.value.toLowerCase()
  return menus.value.filter(
    (m) =>
      m.nama_menu.toLowerCase().includes(q) ||
      (m.kategori_obj?.nama_kategori || '').toLowerCase().includes(q),
  )
}

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}

const fetchData = async () => {
  loading.value = true
  try {
    const [mRes, kRes] = await Promise.all([menuApi.getAll(), kategoriApi.getAll()])
    menus.value = Array.isArray(mRes) ? mRes : mRes.data || []
    kategoris.value = Array.isArray(kRes) ? kRes : kRes.data || []
  } catch (err) {
    toast.error('Gagal memuat data menu')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = { nama_menu: '', harga: 0, stok: 0, id_kategori_menu: '', deskripsi: '' }
  editId.value = null
  isEdit.value = false
}

const openCreate = () => {
  resetForm()
  showModal.value = true
}

const openEdit = (menu) => {
  isEdit.value = true
  editId.value = menu.id
  form.value = {
    nama_menu: menu.nama_menu,
    harga: menu.harga,
    stok: menu.stok,
    id_kategori_menu: menu.id_kategori_menu,
    deskripsi: menu.deskripsi || '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  try {
    const payload = {
      ...form.value,
      harga: Number(form.value.harga),
      stok: Number(form.value.stok),
      id_kategori_menu: Number(form.value.id_kategori_menu),
    }
    if (isEdit.value) {
      await menuApi.update(editId.value, payload)
      toast.success('Menu berhasil diperbarui')
    } else {
      await menuApi.create(payload)
      toast.success('Menu berhasil ditambahkan')
    }
    showModal.value = false
    resetForm()
    await fetchData()
  } catch (err) {
    toast.error('Gagal menyimpan menu')
    console.error(err)
  }
}

const handleDelete = async (menu) => {
  const ok = await confirmRef.value.open('Hapus Menu', `Yakin ingin menghapus "${menu.nama_menu}"?`)
  if (!ok) return
  try {
    await menuApi.remove(menu.id)
    toast.success('Menu berhasil dihapus')
    await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus menu')
    console.error(err)
  }
}

onMounted(fetchData)
</script>

<template>
  <MainLayout>
    <ConfirmDialog ref="confirmRef" />
    <LoadingSpinner :loading="loading" />

    <div v-if="!loading" class="space-y-4">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="relative flex-1 max-w-md">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Cari menu..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          />
        </div>
        <button
          @click="openCreate"
          class="bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm flex items-center gap-2 justify-center"
        >
          <i class="fas fa-plus"></i>
          <span>Tambah Menu</span>
        </button>
      </div>

      <!-- Card Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="menu in filteredMenus()"
          :key="menu.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
        >
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-bold text-gray-800">{{ menu.nama_menu }}</h3>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {{ menu.kategori_obj?.nama_kategori || '-' }}
                </span>
              </div>
              <span class="text-red-500 font-bold text-sm whitespace-nowrap">{{ formatRupiah(menu.harga) }}</span>
            </div>
            <p class="text-gray-500 text-xs mb-3 line-clamp-2">{{ menu.deskripsi || 'Tidak ada deskripsi' }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs" :class="menu.stok > 0 ? 'text-green-600' : 'text-red-500'">
                <i class="fas fa-box mr-1"></i>Stok: {{ menu.stok }}
              </span>
              <div class="flex gap-2">
                <button @click="openEdit(menu)" class="text-blue-500 hover:text-blue-700 text-sm" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="handleDelete(menu)" class="text-red-400 hover:text-red-600 text-sm" title="Hapus">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMenus().length === 0" class="text-center py-12 text-gray-400">
        <i class="fas fa-utensils text-4xl mb-3"></i>
        <p>Belum ada data menu</p>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? 'Edit Menu' : 'Tambah Menu' }}</h3>
              <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
                <input v-model="form.nama_menu" type="text" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input v-model.number="form.harga" type="number" min="0" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input v-model.number="form.stok" type="number" min="0" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select v-model="form.id_kategori_menu" required class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                  <option value="" disabled>Pilih Kategori</option>
                  <option v-for="k in kategoris" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea v-model="form.deskripsi" rows="3" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"></textarea>
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
