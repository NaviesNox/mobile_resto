<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-gray-700">Denah Lantai 1</h3>
      <div class="flex gap-2">
        <button @click="refreshMeja" class="text-sm px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition" :disabled="loadingMeja">
          <i class="fas fa-sync-alt" :class="loadingMeja ? 'animate-spin' : ''"></i> Refresh
        </button>
        <button @click="openCreateModal" class="text-sm px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
          <i class="fas fa-plus"></i> Tambah
        </button>
      </div>
    </div>
    
    <div v-if="errorMeja" class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p class="text-sm">⚠️ Error: {{ errorMeja }}</p>
    </div>

    <div v-if="successMessage" class="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
      <p class="text-sm">✓ {{ successMessage }}</p>
    </div>

    <div v-if="loadingMeja" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="fas fa-spinner text-3xl text-red-500 animate-spin mb-2 block"></i>
        <p class="text-gray-500">Loading data meja...</p>
      </div>
    </div>

    <div v-else-if="mejaList.length === 0" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500 text-lg font-medium">Tidak ada data meja di database</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="meja in mejaList" :key="meja.id" class="bg-white rounded-2xl border-2 shadow-sm flex flex-col relative overflow-hidden group" :class="meja.status === 'terisi' ? 'border-red-200' : 'border-gray-100'">
        
        <!-- Status Badge -->
        <div class="aspect-square flex flex-col items-center justify-center p-4 relative" :class="meja.status === 'terisi' ? 'bg-red-50' : 'bg-white'">
          <span class="absolute top-2 right-2 w-3 h-3 rounded-full" :class="meja.status === 'terisi' ? 'bg-red-500' : 'bg-green-500'"></span>
          <i class="fas fa-chair text-3xl mb-2" :class="meja.status === 'terisi' ? 'text-red-400' : 'text-gray-300'"></i>
          <span class="font-bold text-gray-700 text-center">{{ meja.kode_meja }}</span>
          <span class="text-xs text-gray-400 mt-1">{{ meja.status === 'tersedia' ? 'tersedia' : 'booked' }}</span>
          <span class="text-xs text-gray-500 mt-0.5">Kapasitas: {{ meja.kapasitas }}</span>
        </div>

        <!-- Action Buttons - Hidden by default, shown on hover -->
        <div class="absolute inset-0 bg-black bg-opacity-100 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-50 transition-opacity rounded-2xl">
          <button @click="openEditModal(meja)" class="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="openDeleteModal(meja)" class="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Meja -->
    <div v-if="showModal" class="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md border-red border-2 border-solid border-red-400      ">
        <h2 class="text-xl font-bold mb-4">{{ modalMode === 'create' ? 'Tambah Meja' : 'Edit Meja' }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kode Meja</label>
            <input v-model="formData.kode_meja" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="Meja 1">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
            <input v-model.number="formData.kapasitas" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="4" min="1">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input v-model="formData.lokasi" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="Lantai 1">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="formData.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
              <option value="booked">Booked</option>
              <option value="tersedia">Tersedia</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="closeModal" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Batal
          </button>
          <button @click="saveMeja" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" :disabled="savingMeja">
            <i class="fas fa-spinner animate-spin" v-if="savingMeja"></i>
            {{ savingMeja ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete Confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h2 class="text-xl font-bold mb-4 text-red-600">Hapus Meja?</h2>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus <strong>{{ deleteTarget?.kode_meja }}</strong>?</p>
        
        <div class="flex gap-3">
          <button @click="closeDeleteModal" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Batal
          </button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" :disabled="deletingMeja">
            <i class="fas fa-spinner animate-spin" v-if="deletingMeja"></i>
            {{ deletingMeja ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'MejaTab',
  data() {
    return {
      mejaList: [],
      loadingMeja: true,
      errorMeja: null,
      successMessage: null,
      
      // Modal states
      showModal: false,
      showDeleteModal: false,
      modalMode: 'create', // 'create' atau 'edit'
      savingMeja: false,
      deletingMeja: false,
      
      // Form data
      formData: {
        kode_meja: '',
        kapasitas: null,
        lokasi: '',
        status: 'kosong'
      },
      
      // Delete target
      deleteTarget: null
    };
  },
  methods: {
    selectMeja(meja) {
      console.log('Meja dipilih:', meja);
    },

    // FETCH DATA
    async fetchMejaFromDatabase() {
      this.loadingMeja = true;
      this.errorMeja = null;
      try {
        const response = await api.get('/mejas/');
        this.mejaList = response.data;
        console.log('Data meja berhasil diambil:', this.mejaList);
      } catch (error) {
        console.error('Error fetching meja:', error);
        this.errorMeja = error.message;
        this.mejaList = [];
      } finally {
        this.loadingMeja = false;
      }
    },

    refreshMeja() {
      this.fetchMejaFromDatabase();
    },

    // MODAL HANDLERS
    openCreateModal() {
      this.modalMode = 'create';
      this.formData = {
        kode_meja: '',
        kapasitas: null,
        lokasi: '',
        status: 'kosong'
      };
      this.showModal = true;
    },

    openEditModal(meja) {
      this.modalMode = 'edit';
      this.formData = {
        ...meja
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.formData = {
        kode_meja: '',
        kapasitas: null,
        lokasi: '',
        status: 'kosong'
      };
    },

    openDeleteModal(meja) {
      this.deleteTarget = meja;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
    },

    // CRUD OPERATIONS
    async saveMeja() {
      // Validasi
      if (!this.formData.kode_meja || !this.formData.kapasitas || !this.formData.lokasi) {
        this.errorMeja = 'Semua field harus diisi!';
        return;
      }

      this.savingMeja = true;
      this.errorMeja = null;

      try {
        if (this.modalMode === 'create') {
          // CREATE
          const response = await api.post('/mejas/', this.formData);
          this.mejaList.push(response.data);
          this.successMessage = 'Meja berhasil ditambahkan!';
        } else {
          // UPDATE
          const response = await api.patch(`/mejas/${this.formData.id}/`, this.formData);
          const index = this.mejaList.findIndex(m => m.id === this.formData.id);
          if (index !== -1) {
            this.mejaList[index] = response.data;
          }
          this.successMessage = 'Meja berhasil diperbarui!';
        }

        this.closeModal();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error saving meja:', error);
        this.errorMeja = error.response?.data?.detail || error.message;
      } finally {
        this.savingMeja = false;
      }
    },

    async confirmDelete() {
      if (!this.deleteTarget) return;

      this.deletingMeja = true;
      this.errorMeja = null;

      try {
        await api.delete(`/mejas/${this.deleteTarget.id}/`);
        this.mejaList = this.mejaList.filter(m => m.id !== this.deleteTarget.id);
        this.successMessage = 'Meja berhasil dihapus!';
        this.closeDeleteModal();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error deleting meja:', error);
        this.errorMeja = error.response?.data?.detail || error.message;
      } finally {
        this.deletingMeja = false;
      }
    }
  },

  mounted() {
    this.fetchMejaFromDatabase();
  }
};
</script>
