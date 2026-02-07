<template>
  <div class="h-full flex flex-col bg-gray-50">
    
    <div class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Manajemen Pesanan</h1>
          <p class="text-sm text-gray-500">Kasir / Kitchen Display System</p>
        </div>
        
        <div class="flex items-center gap-3 w-full md:w-auto">
          <select v-model="filterStatus" class="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full md:w-48">
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="siap">Siap Saji</option>
            <option value="selesai">Selesai</option>
          </select>

          <button @click="fetchOrders" class="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" title="Refresh Data">
            <i class="fas fa-sync-alt" :class="{'animate-spin': loading}"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 p-6 overflow-y-auto">
      
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="text-blue-600 font-semibold flex items-center gap-2">
          <i class="fas fa-circle-notch animate-spin text-2xl"></i> Memuat data pesanan...
        </div>
      </div>

      <div v-else-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
        <p class="font-bold">Error</p>
        <p>{{ errorMessage }}</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="flex flex-col justify-center items-center h-64 text-gray-400">
        <i class="fas fa-clipboard text-5xl mb-3"></i>
        <p>Tidak ada pesanan aktif</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-200 flex flex-col h-full"
        >
          <div class="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono font-bold text-gray-800 text-lg">{{ order.kode_pesanan }}</span>
              </div>
              
              <div class="flex gap-2">
                <span v-if="order.id_meja" class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                  Meja {{ order.id_meja }}
                </span>
                <span v-else class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                  Take Away
                </span>
                <span class="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-bold rounded uppercase">
                  {{ order.tipe_pesanan }}
                </span>
              </div>
            </div>

            <span :class="getStatusColor(order.status)" class="px-3 py-1 text-xs font-bold rounded-full capitalize border">
              {{ order.status }}
            </span>
          </div>

          <div class="p-4 flex-1 flex flex-col">
            <div class="text-xs text-gray-400 mb-2 flex justify-between">
              <span><i class="far fa-clock"></i> {{ formatTime(order.tanggal) }}</span>
              <span>Wait/User: {{ order.id_user }}</span>
            </div>

            <div class="space-y-2 mb-3 flex-1">
              <template v-if="order.detail_pesanan && order.detail_pesanan.length">
                <div v-for="(detail, idx) in order.detail_pesanan.slice(0, 3)" :key="detail.id" class="flex justify-between text-sm text-gray-700 border-b border-dashed border-gray-100 pb-1 last:border-0">
                  <div class="flex gap-2">
                    <span class="font-bold text-gray-900 w-6 text-center bg-gray-100 rounded">{{ detail.qty }}x</span>
                    <span class="truncate max-w-[120px]" :title="detail.menu?.nama || 'Menu ID: ' + detail.id_menu">
                      {{ detail.menu?.nama || 'Menu #' + detail.id_menu }}
                    </span>
                  </div>
                  <span class="font-medium">{{ formatCurrency(detail.subtotal) }}</span>
                </div>
                
                <div v-if="order.detail_pesanan.length > 3" class="text-xs text-center text-gray-400 italic mt-1">
                  + {{ order.detail_pesanan.length - 3 }} menu lainnya
                </div>
              </template>
              <div v-else class="text-gray-400 text-sm italic text-center py-2">
                Belum ada detail item
              </div>
            </div>

            <div v-if="order.catatan" class="bg-yellow-50 text-yellow-800 text-xs p-2 rounded border border-yellow-100 mb-3">
              <i class="fas fa-sticky-note mr-1"></i> {{ order.catatan }}
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-gray-200 mt-auto">
              <span class="text-gray-500 text-sm font-medium">Total</span>
              <span class="text-lg font-bold text-gray-800">{{ formatCurrency(calculateGrandTotal(order.detail_pesanan)) }}</span>
            </div>
          </div>

          <div class="p-3 bg-gray-50 rounded-b-xl border-t border-gray-200 grid grid-cols-2 gap-2">
             <button @click="openModal(order)" class="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition">
              <i class="fas fa-list-ul mr-1"></i> Detail
            </button>

            <button 
              v-if="order.status !== 'selesai' && order.status !== 'batal'"
              @click="nextStatus(order)" 
              class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-sm"
            >
              {{ getNextActionText(order.status) }}
            </button>
            <div v-else class="flex justify-center items-center text-gray-400 text-sm font-medium bg-gray-100 rounded-lg">
              <i class="fas fa-check mr-1"></i> Final
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ selectedOrder.kode_pesanan }}</h2>
            <p class="text-sm text-gray-500">Trx ID: {{ selectedOrder.id_transaksi }} | {{ formatTime(selectedOrder.tanggal, true) }}</p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1">
          
          <div class="flex items-center gap-4 mb-6">
            <div class="flex-1">
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Status Pesanan</label>
              <select 
                :value="selectedOrder.status" 
                @change="updateOrderStatus(selectedOrder.id, $event.target.value)"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="baru">Baru</option>
                <option value="diproses">Sedang Diproses</option>
                <option value="siap">Siap Saji</option>
                <option value="selesai">Selesai</option>
                <option value="batal">Dibatalkan</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">User/Kasir ID</label>
              <input type="text" :value="selectedOrder.id_user" disabled class="w-full bg-gray-100 border-gray-300 rounded-lg text-gray-500">
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3">Menu</th>
                  <th class="px-4 py-3 text-center">Qty</th>
                  <th class="px-4 py-3 text-right">Harga Satuan</th>
                  <th class="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in selectedOrder.detail_pesanan" :key="item.id">
                  <td class="px-4 py-3 font-medium text-gray-900">
                    {{ item.menu?.nama || 'ID Menu: ' + item.id_menu }}
                  </td>
                  <td class="px-4 py-3 text-center bg-gray-50 font-mono">{{ item.qty }}</td>
                  <td class="px-4 py-3 text-right text-gray-500">{{ formatCurrency(item.harga_satuan) }}</td>
                  <td class="px-4 py-3 text-right font-bold text-gray-800">{{ formatCurrency(item.subtotal) }}</td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50 font-bold text-gray-900">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-right">Total Akhir</td>
                  <td class="px-4 py-3 text-right text-lg">{{ formatCurrency(calculateGrandTotal(selectedOrder.detail_pesanan)) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div v-if="selectedOrder.catatan" class="mb-4">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan Tambahan</label>
            <p class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-700 text-sm">
              {{ selectedOrder.catatan }}
            </p>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button 
            @click="cancelOrder(selectedOrder)"
            class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
          >
            Batalkan Pesanan
          </button>
          
          <button 
            @click="closeModal"
            class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import api from '@/services/api'; // Sesuaikan path axios instance Anda

export default {
  data() {
    return {
      orders: [],
      loading: false,
      errorMessage: null,
      filterStatus: 'all',
      
      // Modal control
      showModal: false,
      selectedOrder: null,
    };
  },
  computed: {
    filteredOrders() {
      if (this.filterStatus === 'all') {
        return this.orders;
      }
      return this.orders.filter(o => o.status === this.filterStatus);
    }
  },
  methods: {
    // --- READ ---
    async fetchOrders() {
      this.loading = true;
      this.errorMessage = null;
      try {
        // Asumsi Endpoint GET /pesanan/ mengembalikan data lengkap dengan nested detail_pesanan
        // Jika backend Django/Laravel, pastikan serializer menyertakan relation 'detail_pesanan'
        const response = await api.get('/pesanan'); 
        this.orders = response.data.data || response.data; // Sesuaikan struktur response backend
      } catch (error) {
        console.error(error);
        this.errorMessage = "Gagal mengambil data pesanan. Periksa koneksi atau server.";
      } finally {
        this.loading = false;
      }
    },

    // --- UPDATE STATUS ---
    async updateOrderStatus(id, newStatus) {
      try {
        await api.patch(`/pesanan/${id}`, { status: newStatus });
        
        // Update Local State (Optimistic UI)
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
          this.orders[index].status = newStatus;
          if (this.selectedOrder && this.selectedOrder.id === id) {
            this.selectedOrder.status = newStatus;
          }
        }
      } catch (error) {
        alert("Gagal update status");
      }
    },

    // --- DELETE / CANCEL ---
    async cancelOrder(order) {
      if(!confirm(`Yakin ingin membatalkan pesanan ${order.kode_pesanan}?`)) return;
      
      // Biasanya di sistem kasir, delete = set status 'batal', bukan hapus row DB
      this.updateOrderStatus(order.id, 'batal');
      this.closeModal();
    },

    // --- LOGIC HELPERS ---
    nextStatus(order) {
      const flow = ['baru', 'diproses', 'siap', 'selesai'];
      const currentIdx = flow.indexOf(order.status);
      if (currentIdx < flow.length - 1 && currentIdx !== -1) {
        this.updateOrderStatus(order.id, flow[currentIdx + 1]);
      }
    },

    calculateGrandTotal(details) {
      if (!details || !Array.isArray(details)) return 0;
      // Menggunakan field 'subtotal' langsung dari DB detail_pesanan
      return details.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    },

    // --- FORMATTERS ---
    formatCurrency(val) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
    },
    formatTime(dateStr, full = false) {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      if (full) return date.toLocaleString('id-ID');
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    },
    getStatusColor(status) {
      const colors = {
        baru: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        diproses: 'bg-blue-100 text-blue-700 border-blue-200',
        siap: 'bg-green-100 text-green-700 border-green-200',
        selesai: 'bg-gray-100 text-gray-700 border-gray-200',
        batal: 'bg-red-50 text-red-700 border-red-200',
      };
      return colors[status] || 'bg-gray-100 text-gray-600';
    },
    getNextActionText(status) {
      const text = {
        baru: 'Proses',
        diproses: 'Siap Saji',
        siap: 'Selesaikan',
      };
      return text[status] || 'Detail';
    },

    // --- MODAL UTILS ---
    openModal(order) {
      // Clone object agar edit di modal tidak langsung merubah list sebelum save (optional)
      this.selectedOrder = JSON.parse(JSON.stringify(order));
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedOrder = null;
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>