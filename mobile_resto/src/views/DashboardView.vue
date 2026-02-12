<script setup>
import { ref, onMounted, computed } from 'vue'
import { pesananApi } from '@/api/pesananApi'
import { transaksiApi } from '@/api/transaksiApi'
import { useAuthStore } from '@/stores/auth'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const auth = useAuthStore()

const loading = ref(true)
const pesananList = ref([])
const transaksiList = ref([])

const userName = computed(() => auth.profile?.username || 'User')

const totalPesanan = computed(() => pesananList.value.length)
const pesananBaru = computed(() => pesananList.value.filter((p) => p.status === 'baru').length)
const pesananDiproses = computed(() => pesananList.value.filter((p) => p.status === 'diproses').length)
const pesananSelesai = computed(() => pesananList.value.filter((p) => p.status === 'selesai').length)

const totalOmzet = computed(() => {
  return transaksiList.value.reduce((sum, t) => {
    if (t.pembayaran && t.pembayaran.status === 'lunas') {
      return sum + (t.pembayaran.total || 0)
    }
    return sum
  }, 0)
})

const recentPesanan = computed(() => {
  return [...pesananList.value]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, 5)
})

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0)
}

const statusColor = (status) => {
  const map = {
    baru: 'bg-blue-100 text-blue-700',
    diproses: 'bg-yellow-100 text-yellow-700',
    siap: 'bg-purple-100 text-purple-700',
    selesai: 'bg-green-100 text-green-700',
    batal: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

const fetchData = async () => {
  loading.value = true
  try {
    const [pRes, tRes] = await Promise.all([pesananApi.getAll(), transaksiApi.getAll()])
    pesananList.value = Array.isArray(pRes) ? pRes : pRes.data || []
    transaksiList.value = Array.isArray(tRes) ? tRes : tRes.data || []
  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <MainLayout>
    <LoadingSpinner :loading="loading" />

    <div v-if="!loading" class="space-y-6">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 class="text-2xl font-bold mb-1">Halo, {{ userName }} 👋</h2>
        <p class="opacity-90 text-sm">Siap melayani pelanggan hari ini?</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div class="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <span class="text-gray-400 text-xs">Omzet</span>
          <span class="font-bold text-base md:text-lg">{{ formatRupiah(totalOmzet) }}</span>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div class="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <i class="fas fa-receipt"></i>
          </div>
          <span class="text-gray-400 text-xs">Total Order</span>
          <span class="font-bold text-base md:text-lg">{{ totalPesanan }}</span>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div class="bg-yellow-100 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <i class="fas fa-clock"></i>
          </div>
          <span class="text-gray-400 text-xs">Diproses</span>
          <span class="font-bold text-base md:text-lg">{{ pesananDiproses }}</span>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div class="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <i class="fas fa-bell"></i>
          </div>
          <span class="text-gray-400 text-xs">Pesanan Baru</span>
          <span class="font-bold text-base md:text-lg">{{ pesananBaru }}</span>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-4 md:p-6 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-800">Pesanan Terbaru</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Kode</th>
                <th class="px-4 py-3 text-left">Tipe</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="p in recentPesanan" :key="p.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">{{ p.kode_pesanan }}</td>
                <td class="px-4 py-3 capitalize">{{ p.tipe_pesanan }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-medium capitalize" :class="statusColor(p.status)">
                    {{ p.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ new Date(p.tanggal).toLocaleDateString('id-ID') }}</td>
              </tr>
              <tr v-if="recentPesanan.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-gray-400">Belum ada pesanan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
