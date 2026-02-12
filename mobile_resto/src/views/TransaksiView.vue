<script setup>
import { ref, onMounted, computed } from 'vue'
import { transaksiApi } from '@/api/transaksiApi'
import { pesananApi } from '@/api/pesananApi'
import { detailPesananApi } from '@/api/detailPesananApi'
import { useToastStore } from '@/stores/toast'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const toast = useToastStore()
const loading = ref(true)
const transaksiList = ref([])
const confirmRef = ref(null)
const showPayModal = ref(false)
const showQrisModal = ref(false)
const selectedTransaksi = ref(null)
const pesananMap = ref({})
const detailMap = ref({})

const payForm = ref({ metode: 'cash', total: 0 })

const formatRupiah = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

const fetchData = async () => {
  loading.value = true
  try {
    const [tRes, pRes, dRes] = await Promise.all([transaksiApi.getAll(), pesananApi.getAll(), detailPesananApi.getAll()])
    transaksiList.value = Array.isArray(tRes) ? tRes : tRes.data || []
    const pesananArr = Array.isArray(pRes) ? pRes : pRes.data || []
    const detailArr = Array.isArray(dRes) ? dRes : dRes.data || []

    // Map pesanan by transaksi id
    const pMap = {}
    pesananArr.forEach((p) => { pMap[p.id_transaksi] = p })
    pesananMap.value = pMap

    // Map detail by pesanan id
    const dMap = {}
    detailArr.forEach((d) => {
      if (!dMap[d.id_pesanan]) dMap[d.id_pesanan] = []
      dMap[d.id_pesanan].push(d)
    })
    detailMap.value = dMap
  } catch (err) {
    toast.error('Gagal memuat transaksi')
  } finally {
    loading.value = false
  }
}

const getTransaksiTotal = (t) => {
  const pesanan = pesananMap.value[t.id]
  if (!pesanan) return 0
  const details = detailMap.value[pesanan.id] || []
  return details.reduce((s, d) => s + (d.subtotal || 0), 0)
}

const openPayment = (t) => {
  selectedTransaksi.value = t
  payForm.value = { metode: 'cash', total: getTransaksiTotal(t) }
  showPayModal.value = true
}

const submitPayment = async () => {
  try {
    const payload = {
      pembayaran: {
        metode: payForm.value.metode,
        total: payForm.value.total,
        status: 'lunas',
      },
    }
    await transaksiApi.update(selectedTransaksi.value.id, payload)

    // If metode is qris, show QR code
    if (payForm.value.metode === 'qris') {
      showPayModal.value = false
      showQrisModal.value = true
    } else {
      showPayModal.value = false
      toast.success('Pembayaran berhasil!')
    }
    await fetchData()
  } catch (err) {
    toast.error('Gagal memproses pembayaran')
    console.error(err)
  }
}

const handleDelete = async (t) => {
  const ok = await confirmRef.value.open('Hapus Transaksi', `Yakin ingin menghapus transaksi #${t.id}?`)
  if (!ok) return
  try {
    await transaksiApi.remove(t.id)
    toast.success('Transaksi berhasil dihapus')
    await fetchData()
  } catch (err) {
    toast.error('Gagal menghapus transaksi')
  }
}

// Generate QRIS data URI (simple QR using an API)
const qrisUrl = computed(() => {
  if (!selectedTransaksi.value) return ''
  const data = JSON.stringify({
    transaksi_id: selectedTransaksi.value.id,
    total: payForm.value.total,
    metode: 'qris',
    merchant: 'RestoApp',
    timestamp: new Date().toISOString(),
  })
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data)}`
})

onMounted(fetchData)
</script>

<template>
  <MainLayout>
    <ConfirmDialog ref="confirmRef" />
    <LoadingSpinner :loading="loading" />

    <div v-if="!loading" class="space-y-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">ID</th>
                <th class="px-4 py-3 text-left">Pesanan</th>
                <th class="px-4 py-3 text-left">Waktu</th>
                <th class="px-4 py-3 text-left">Total</th>
                <th class="px-4 py-3 text-left">Pembayaran</th>
                <th class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="t in transaksiList" :key="t.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">#{{ t.id }}</td>
                <td class="px-4 py-3">
                  <span v-if="pesananMap[t.id]" class="text-sm">{{ pesananMap[t.id].kode_pesanan }}</span>
                  <span v-else class="text-gray-400 text-xs">-</span>
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ new Date(t.waktu).toLocaleString('id-ID') }}</td>
                <td class="px-4 py-3 font-medium">{{ formatRupiah(getTransaksiTotal(t)) }}</td>
                <td class="px-4 py-3">
                  <span v-if="t.pembayaran" class="px-2 py-1 rounded-full text-xs font-medium" :class="t.pembayaran.status === 'lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                    {{ t.pembayaran.status }} · {{ t.pembayaran.metode }}
                  </span>
                  <span v-else class="text-xs text-gray-400">Belum bayar</span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex gap-2 justify-end">
                    <button v-if="!t.pembayaran" @click="openPayment(t)" class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200" title="Bayar">
                      <i class="fas fa-credit-card mr-1"></i>Bayar
                    </button>
                    <button @click="handleDelete(t)" class="text-red-400 hover:text-red-600 text-sm" title="Hapus"><i class="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr v-if="transaksiList.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">Belum ada transaksi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Pembayaran -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPayModal" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div class="flex items-center justify-between mb-5">
              <h3 class="text-lg font-bold text-gray-800">Pembayaran</h3>
              <button @click="showPayModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-xl p-4 text-center">
                <p class="text-gray-500 text-sm">Total Pembayaran</p>
                <p class="text-2xl font-bold text-red-500">{{ formatRupiah(payForm.total) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select v-model="payForm.metode" class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="cash">Cash</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button @click="showPayModal = false" class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition">Batal</button>
                <button @click="submitPayment" class="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-medium transition">
                  {{ payForm.metode === 'qris' ? 'Generate QRIS' : 'Bayar Sekarang' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal QRIS -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showQrisModal" class="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 p-4">
          <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-800">Scan QRIS</h3>
              <button @click="showQrisModal = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="bg-white border-2 border-gray-200 rounded-xl p-4 inline-block mb-4">
              <img :src="qrisUrl" alt="QRIS Code" class="w-56 h-56 mx-auto" />
            </div>
            <p class="text-gray-500 text-sm mb-2">Scan QR code di atas untuk pembayaran</p>
            <p class="text-2xl font-bold text-red-500 mb-4">{{ formatRupiah(payForm.total) }}</p>
            <button @click="showQrisModal = false; toast.success('Pembayaran QRIS berhasil!')" class="w-full px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-medium transition">
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </MainLayout>
</template>
