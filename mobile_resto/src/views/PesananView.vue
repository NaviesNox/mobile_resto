<script setup>
import { ref, onMounted, computed } from 'vue'
import { pesananApi } from '@/api/pesananApi'
import { detailPesananApi } from '@/api/detailPesananApi'
import { menuApi } from '@/api/menuApi'
import { mejaApi } from '@/api/mejaApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()
const loading = ref(true)
const pesananList = ref([])
const menus = ref([])
const mejas = ref([])
const confirmRef = ref(null)

const showOrderModal = ref(false)
const showDetailModal = ref(false)
const selectedPesanan = ref(null)
const detailList = ref([])

const filterStatus = ref('')
const search = ref('')

// Cart state
const cart = ref([])
const orderForm = ref({
  tipe_pesanan: 'dine-in',
  id_meja: '',
  catatan: '',
})

const filteredPesanan = computed(() => {
  let list = pesananList.value
  if (filterStatus.value) {
    list = list.filter((p) => p.status === filterStatus.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter((p) => p.kode_pesanan?.toLowerCase().includes(q))
  }
  return list.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
})

const availableMejas = computed(() => mejas.value.filter((m) => m.status === 'tersedia' || m.status === 'kosong'))

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + item.harga * item.qty, 0))

const formatRupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

const statusColor = (s) => {
  const m = { baru: 'bg-blue-100 text-blue-700', diproses: 'bg-yellow-100 text-yellow-700', siap: 'bg-purple-100 text-purple-700', selesai: 'bg-green-100 text-green-700', batal: 'bg-red-100 text-red-700' }
  return m[s] || 'bg-gray-100 text-gray-700'
}

const fetchData = async () => {
  loading.value = true
  try {
    const [pRes, mRes, mjRes] = await Promise.all([pesananApi.getAll(), menuApi.getAll(), mejaApi.getAll()])
    pesananList.value = Array.isArray(pRes) ? pRes : pRes.data || []
    menus.value = Array.isArray(mRes) ? mRes : mRes.data || []
    mejas.value = Array.isArray(mjRes) ? mjRes : mjRes.data || []
  } catch (err) {
    toast.error('Gagal memuat data')
  } finally {
    loading.value = false
  }
}

// Cart actions
const addToCart = (menu) => {
  const existing = cart.value.find((c) => c.id_menu === menu.id)
  if (existing) {
    if (existing.qty < menu.stok) existing.qty++
    else toast.warning('Stok tidak mencukupi')
  } else {
    if (menu.stok < 1) { toast.warning('Stok habis'); return }
    cart.value.push({ id_menu: menu.id, nama_menu: menu.nama_menu, harga: menu.harga, qty: 1, stok: menu.stok })
  }
}

const removeFromCart = (index) => cart.value.splice(index, 1)

const updateQty = (index, delta) => {
  const item = cart.value[index]
  const newQty = item.qty + delta
  if (newQty < 1) return removeFromCart(index)
  if (newQty > item.stok) { toast.warning('Stok tidak mencukupi'); return }
  item.qty = newQty
}

const openNewOrder = () => {
  cart.value = []
  orderForm.value = { tipe_pesanan: 'dine-in', id_meja: '', catatan: '' }
  showOrderModal.value = true
}

const submitOrder = async () => {
  if (cart.value.length === 0) { toast.warning('Keranjang masih kosong'); return }
  if (orderForm.value.tipe_pesanan === 'dine-in' && !orderForm.value.id_meja) { toast.warning('Pilih meja untuk dine-in'); return }

  try {
    const payload = {
      id_meja: orderForm.value.tipe_pesanan === 'dine-in' ? Number(orderForm.value.id_meja) : null,
      tipe_pesanan: orderForm.value.tipe_pesanan,
      catatan: orderForm.value.catatan || null,
      items: cart.value.map((item) => ({
        id_menu: item.id_menu,
        qty: item.qty,
        harga_satuan: item.harga,
      })),
    }

    await pesananApi.buatPesanan(payload)

    toast.success('Pesanan berhasil dibuat!')
    showOrderModal.value = false
    cart.value = []
    await fetchData()
  } catch (err) {
    toast.error('Gagal membuat pesanan')
    console.error(err)
  }
}

const viewDetail = async (pesanan) => {
  selectedPesanan.value = pesanan
  try {
    const res = await detailPesananApi.getAll()
    const allDetails = Array.isArray(res) ? res : res.data || []
    detailList.value = allDetails.filter((d) => d.id_pesanan === pesanan.id)
  } catch (err) {
    detailList.value = []
  }
  showDetailModal.value = true
}

const updateStatus = async (pesanan, newStatus) => {
  try {
    await pesananApi.update(pesanan.id, { ...pesanan, status: newStatus })
    toast.success(`Status diubah menjadi ${newStatus}`)
    await fetchData()
    if (selectedPesanan.value?.id === pesanan.id) selectedPesanan.value.status = newStatus
  } catch (err) {
    toast.error('Gagal mengubah status')
  }
}

const handleDelete = async (pesanan) => {
  const ok = await confirmRef.value.open('Hapus Pesanan', `Yakin ingin menghapus pesanan "${pesanan.kode_pesanan}"?`)
  if (!ok) return
  try {
    await pesananApi.remove(pesanan.id)
    toast.success('Pesanan berhasil dihapus')
    await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus pesanan')
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
        <div class="flex gap-2 flex-wrap">
          <button v-for="s in ['', 'baru', 'diproses', 'siap', 'selesai', 'batal']" :key="s" @click="filterStatus = s"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize"
            :class="filterStatus === s ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'">
            {{ s || 'Semua' }}
          </button>
        </div>
        <button @click="openNewOrder" class="bg-red-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm flex items-center gap-2 justify-center">
          <i class="fas fa-plus"></i><span>Buat Pesanan</span>
        </button>
      </div>

      <!-- Search -->
      <div class="relative max-w-md">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input v-model="search" type="text" placeholder="Cari kode pesanan..." class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
      </div>

      <!-- Pesanan List -->
      <div class="space-y-3">
        <div v-for="p in filteredPesanan" :key="p.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="font-bold text-gray-800 text-sm">{{ p.kode_pesanan }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">{{ new Date(p.tanggal).toLocaleString('id-ID') }}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium capitalize" :class="statusColor(p.status)">{{ p.status }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span><i class="fas fa-utensils mr-1"></i>{{ p.tipe_pesanan }}</span>
            <span v-if="p.meja"><i class="fas fa-chair mr-1"></i>{{ p.meja?.kode_meja }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-1">
              <button v-if="p.status === 'baru'" @click="updateStatus(p, 'diproses')" class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200">Proses</button>
              <button v-if="p.status === 'diproses'" @click="updateStatus(p, 'siap')" class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200">Siap</button>
              <button v-if="p.status === 'siap'" @click="updateStatus(p, 'selesai')" class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">Selesai</button>
            </div>
            <div class="flex gap-2">
              <button @click="viewDetail(p)" class="text-blue-500 hover:text-blue-700 text-sm" title="Detail"><i class="fas fa-eye"></i></button>
              <button @click="handleDelete(p)" class="text-red-400 hover:text-red-600 text-sm" title="Hapus"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredPesanan.length === 0" class="text-center py-12 text-gray-400">
        <i class="fas fa-clipboard-list text-4xl mb-3"></i>
        <p>Belum ada pesanan</p>
      </div>
    </div>

    <!-- Modal Buat Pesanan (with Cart) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showOrderModal" class="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center bg-black/40">
          <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl sm:mx-4 max-h-[95vh] flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 class="text-lg font-bold text-gray-800">Buat Pesanan Baru</h3>
              <button @click="showOrderModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Left: Menu List -->
                <div>
                  <h4 class="font-medium text-gray-700 mb-3 text-sm">Pilih Menu</h4>
                  <div class="space-y-2 max-h-64 overflow-y-auto">
                    <div v-for="m in menus" :key="m.id"
                      @click="addToCart(m)"
                      class="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50 transition">
                      <div>
                        <p class="font-medium text-gray-800 text-sm">{{ m.nama_menu }}</p>
                        <p class="text-xs text-gray-500">{{ formatRupiah(m.harga) }} · Stok: {{ m.stok }}</p>
                      </div>
                      <i class="fas fa-plus-circle text-red-400"></i>
                    </div>
                  </div>
                </div>

                <!-- Right: Cart + Form -->
                <div class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-700 mb-3 text-sm">Keranjang</h4>
                    <div v-if="cart.length === 0" class="text-center py-6 text-gray-400 text-sm border border-dashed border-gray-300 rounded-xl">
                      <i class="fas fa-shopping-cart text-2xl mb-2"></i>
                      <p>Keranjang kosong</p>
                    </div>
                    <div v-else class="space-y-2 max-h-40 overflow-y-auto">
                      <div v-for="(item, i) in cart" :key="i" class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-800 truncate">{{ item.nama_menu }}</p>
                          <p class="text-xs text-gray-500">{{ formatRupiah(item.harga * item.qty) }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                          <button @click="updateQty(i, -1)" class="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs"><i class="fas fa-minus"></i></button>
                          <span class="text-sm font-medium w-6 text-center">{{ item.qty }}</span>
                          <button @click="updateQty(i, 1)" class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs"><i class="fas fa-plus"></i></button>
                          <button @click="removeFromCart(i)" class="text-gray-400 hover:text-red-500 ml-1"><i class="fas fa-times text-xs"></i></button>
                        </div>
                      </div>
                    </div>
                    <div v-if="cart.length > 0" class="mt-2 text-right font-bold text-red-500">Total: {{ formatRupiah(cartTotal) }}</div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Tipe Pesanan</label>
                      <select v-model="orderForm.tipe_pesanan" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option value="dine-in">Dine In</option>
                        <option value="take-away">Take Away</option>
                      </select>
                    </div>
                    <div v-if="orderForm.tipe_pesanan === 'dine-in'">
                      <label class="block text-xs font-medium text-gray-700 mb-1">Meja</label>
                      <select v-model="orderForm.id_meja" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option value="" disabled>Pilih meja</option>
                        <option v-for="mj in availableMejas" :key="mj.id" :value="mj.id">{{ mj.kode_meja }} ({{ mj.kapasitas }})</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                    <textarea v-model="orderForm.catatan" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Catatan tambahan..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-gray-100 flex gap-3">
              <button @click="showOrderModal = false" class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition">Batal</button>
              <button @click="submitOrder" class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-medium transition flex items-center justify-center gap-2">
                <i class="fas fa-paper-plane"></i> Kirim Pesanan
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Detail Pesanan -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDetailModal" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-800">Detail Pesanan</h3>
              <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>

            <div v-if="selectedPesanan" class="space-y-3">
              <div class="bg-gray-50 rounded-xl p-3 space-y-1">
                <div class="flex justify-between text-sm"><span class="text-gray-500">Kode</span><span class="font-medium">{{ selectedPesanan.kode_pesanan }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Tipe</span><span class="capitalize">{{ selectedPesanan.tipe_pesanan }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Status</span><span class="capitalize font-medium" :class="statusColor(selectedPesanan.status).replace('bg-', 'text-').split(' ')[1]">{{ selectedPesanan.status }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Tanggal</span><span>{{ new Date(selectedPesanan.tanggal).toLocaleString('id-ID') }}</span></div>
                <div v-if="selectedPesanan.catatan" class="text-sm"><span class="text-gray-500">Catatan: </span>{{ selectedPesanan.catatan }}</div>
              </div>

              <h4 class="font-medium text-gray-700 text-sm">Item Pesanan</h4>
              <div class="space-y-2">
                <div v-for="d in detailList" :key="d.id" class="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <p class="font-medium text-gray-800">{{ d.menu?.nama_menu || 'Menu #' + d.id_menu }}</p>
                    <p class="text-xs text-gray-500">{{ d.qty }}x @ {{ formatRupiah(d.harga_satuan) }}</p>
                  </div>
                  <span class="font-medium text-gray-800">{{ formatRupiah(d.subtotal) }}</span>
                </div>
                <div v-if="detailList.length === 0" class="text-center text-gray-400 text-sm py-4">Tidak ada detail</div>
              </div>

              <div v-if="detailList.length > 0" class="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                <span>Total</span>
                <span class="text-red-500">{{ formatRupiah(detailList.reduce((s, d) => s + d.subtotal, 0)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </MainLayout>
</template>
