<template>
  <div class="flex gap-4">
    <!-- SIDEBAR - Kategori Menu Management -->
    <div class="hidden md:block w-64 bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-sm md:h-fit md:sticky md:top-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-gray-700">Kategori Menu</h3>
        <button @click="openCreateKategoriModal" class="text-sm px-2 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition" title="Tambah Kategori">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <!-- Loading Kategori -->
      <div v-if="loadingKategori" class="flex justify-center py-4">
        <i class="fas fa-spinner text-red-500 animate-spin"></i>
      </div>

      <!-- Error Kategori -->
      <div v-else-if="errorKategori" class="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-xs mb-3">
        <p>{{ errorKategori }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="kategoriList.length === 0" class="text-center py-6">
        <i class="fas fa-inbox text-2xl text-gray-300 mb-2 block"></i>
        <p class="text-gray-400 text-sm">Tidak ada kategori</p>
      </div>

      <!-- Kategori List -->
      <div v-else class="space-y-2 max-h-96 overflow-y-auto">
        <div v-for="kategori in kategoriList" :key="kategori.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
          <span class="text-sm text-gray-700 font-medium">{{ kategori.nama_kategori }}</span>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button @click="openEditKategoriModal(kategori)" class="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition flex items-center justify-center" title="Edit">
              <i class="fas fa-edit text-xs"></i>
            </button>
            <button @click="openDeleteKategoriModal(kategori)" class="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition flex items-center justify-center" title="Hapus">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT - Menu List -->
    <div class="flex-1">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-gray-700">Daftar Menu</h3>
        <div class="flex gap-2">
          <button @click="refreshMenu" class="text-sm px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition" :disabled="loadingMenu">
            <i class="fas fa-sync-alt" :class="loadingMenu ? 'animate-spin' : ''"></i> Refresh
          </button>
          <button @click="openCreateModal" class="text-sm px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
            <i class="fas fa-plus"></i> Tambah
          </button>
        </div>
      </div>
      <!-- Mobile category filter buttons -->
      <div class="md:hidden mb-4">
        <label class="block text-sm text-gray-600 mb-2">Kategori</label>
        <div class="flex gap-2 overflow-x-auto pb-2">
          <button 
            @click="selectedKategori = 0"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
              selectedKategori === 0 
                ? 'bg-red-500 text-white shadow-md shadow-red-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            ]"
          >
            Semua
          </button>
          <button 
            v-for="k in kategoriList"
            :key="k.id"
            @click="selectedKategori = k.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
              selectedKategori === k.id 
                ? 'bg-red-500 text-white shadow-md shadow-red-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ k.nama_kategori }}
          </button>
        </div>
      </div>

      <div v-if="errorMenu" class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p class="text-sm">⚠️ Error: {{ errorMenu }}</p>
    </div>

    <div v-if="successMessage" class="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
      <p class="text-sm">✓ {{ successMessage }}</p>
    </div>

    <div v-if="loadingMenu" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="fas fa-spinner text-3xl text-red-500 animate-spin mb-2 block"></i>
        <p class="text-gray-500">Loading data menu...</p>
      </div>
    </div>

    <div v-else-if="menuList.length === 0" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
        <p class="text-gray-500 text-lg font-medium">Tidak ada data menu di database</p>
      </div>
    </div>

      <div v-else-if="menuList.length === 0" class="flex justify-center items-center h-64">
        <div class="text-center">
          <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500 text-lg font-medium">Tidak ada data menu di database</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="menu in filteredMenuList" :key="menu.id" class="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition">
        
        <!-- Image Container -->
        <div class="w-full h-40 bg-gray-200 overflow-hidden relative group">
          <img v-if="menu.foto" :src="menu.foto" :alt="menu.nama_menu" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <i class="fas fa-image text-3xl text-gray-300"></i>
          </div>

          <!-- Action Buttons - Hidden by default, shown on hover -->
          <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openEditModal(menu)" class="w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center justify-center" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="openDeleteModal(menu)" class="w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center" title="Hapus">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Menu Info -->
        <div class="p-4">
          <h4 class="font-bold text-gray-800 truncate">{{ menu.nama_menu }}</h4>
          <p class="text-sm text-gray-600 line-clamp-2 mt-1">{{ menu.deskripsi || '-' }}</p>
          
          <div class="flex justify-between items-center mt-3">
            <span class="font-bold text-red-500">Rp {{ formatPrice(menu.harga) }}</span>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Stok: {{ menu.stok }}</span>
          </div>
        </div>
      </div>      </div>    </div>

    <!-- Modal Create/Edit Menu -->
    <div v-if="showModal" class="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div class="bg-white sm:rounded-2xl rounded-none p-6 w-full sm:max-w-md max-w-full h-full sm:h-auto max-h-[90vh] overflow-y-auto border-2 border-red-400">
        <h2 class="text-xl font-bold mb-4">{{ modalMode === 'create' ? 'Tambah Menu' : 'Edit Menu' }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
            <input v-model="formData.nama_menu" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="Nasi Goreng">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
            <input v-model.number="formData.harga" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="15000" min="0" step="500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input v-model.number="formData.stok" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="10" min="0">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea v-model="formData.deskripsi" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500" placeholder="Deskripsi menu..." rows="3"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select v-model.number="formData.id_kategori_menu" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
              <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="closeModal" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Batal
          </button>
          <button @click="saveMenu" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" :disabled="savingMenu">
            <i class="fas fa-spinner animate-spin" v-if="savingMenu"></i>
            {{ savingMenu ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete Confirmation -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div class="bg-white sm:rounded-2xl rounded-none p-6 w-full max-w-sm sm:max-w-sm h-full sm:h-auto overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-red-600">Hapus Menu?</h2>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus <strong>{{ deleteTarget?.nama_menu }}</strong>?</p>
        
        <div class="flex gap-3">
          <button @click="closeDeleteModal" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Batal
          </button>
          <button @click="confirmDelete" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" :disabled="deletingMenu">
            <i class="fas fa-spinner animate-spin" v-if="deletingMenu"></i>
            {{ deletingMenu ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Kategori -->
    <div v-if="showKategoriModal" class="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div class="bg-white sm:rounded-2xl rounded-none p-6 w-full sm:max-w-md max-w-full h-full sm:h-auto border-2 border-green-400 overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">{{ kategoriModalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori' }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
            <input v-model="kategoriFormData.nama_kategori" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500" placeholder="Makanan">
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="closeKategoriModal" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Batal
          </button>
          <button @click="saveKategori" class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" :disabled="savingKategori">
            <i class="fas fa-spinner animate-spin" v-if="savingKategori"></i>
            {{ savingKategori ? 'Menyimpan...' : kategoriModalMode === 'create' ? 'Tambah' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete Kategori Confirmation -->
    <div v-if="showDeleteKategoriModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div class="bg-white sm:rounded-2xl rounded-none p-6 w-full max-w-sm h-full sm:h-auto overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-red-600">Hapus Kategori?</h2>
        <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus <strong>{{ deleteKategoriTarget?.nama_kategori }}</strong>?</p>
        
        <div class="flex gap-3">
          <button @click="closeDeleteKategoriModal" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
            Batal
          </button>
          <button @click="confirmDeleteKategori" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" :disabled="deletingKategori">
            <i class="fas fa-spinner animate-spin" v-if="deletingKategori"></i>
            {{ deletingKategori ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'MenuTab',
  data() {
    return {
      // Menu data
      menuList: [],
      loadingMenu: true,
      errorMenu: null,
      successMessage: null,
      
      // Kategori data
      kategoriList: [],
      loadingKategori: true,
      errorKategori: null,
      
      // Modal states
      showModal: false,
      showDeleteModal: false,
      modalMode: 'create', // 'create' atau 'edit'
      savingMenu: false,
      deletingMenu: false,
      
      // Kategori modal states
      showKategoriModal: false,
      showDeleteKategoriModal: false,
      kategoriModalMode: 'create',
      savingKategori: false,
      deletingKategori: false,
      
      // Form data
      formData: {
        nama_menu: '',
        harga: null,
        stok: null,
        deskripsi: '',
        id_kategori_menu: 1
      },
      
      // Kategori form data
      kategoriFormData: {
        nama_kategori: ''
      },

      // Mobile selected kategori (0 = semua)
      selectedKategori: 0,
      
      // Preview image
      previewImage: null,
      
      // Delete target
      deleteTarget: null,
      deleteKategoriTarget: null
    };
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID').format(price);
    },

    // ========== LOCALSTORAGE METHODS ==========
    saveMenuListToLocalStorage() {
      try {
        localStorage.setItem('menuList', JSON.stringify(this.menuList));
      } catch (error) {
        console.error('Error saving menuList to localStorage:', error);
      }
    },

    loadMenuListFromLocalStorage() {
      try {
        const savedData = localStorage.getItem('menuList');
        if (savedData) {
          this.menuList = JSON.parse(savedData);
          return true;
        }
      } catch (error) {
        console.error('Error loading menuList from localStorage:', error);
      }
      return false;
    },

    saveKategoriListToLocalStorage() {
      try {
        localStorage.setItem('kategoriList', JSON.stringify(this.kategoriList));
      } catch (error) {
        console.error('Error saving kategoriList to localStorage:', error);
      }
    },

    loadKategoriListFromLocalStorage() {
      try {
        const savedData = localStorage.getItem('kategoriList');
        if (savedData) {
          this.kategoriList = JSON.parse(savedData);
          return true;
        }
      } catch (error) {
        console.error('Error loading kategoriList from localStorage:', error);
      }
      return false;
    },

    // ========== KATEGORI METHODS ==========
    // FETCH KATEGORI
    async fetchKategoriFromDatabase() {
      this.loadingKategori = true;
      this.errorKategori = null;
      try {
        const response = await api.get('/kategori_menu/');
        console.log('API Kategori Response:', response);
        console.log('Response data:', response.data);
        
        // Pastikan data adalah array
        if (Array.isArray(response.data)) {
          this.kategoriList = response.data;
        } else if (response.data.results) {
          // Jika response adalah object dengan results key (pagination)
          this.kategoriList = response.data.results;
        } else {
          this.kategoriList = response.data;
        }
        
        this.saveKategoriListToLocalStorage(); // Simpan ke localStorage setelah fetch dari API
        console.log('Data kategori berhasil diambil:', this.kategoriList);
      } catch (error) {
        console.error('Error fetching kategori:', error);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response);
        // Coba load dari localStorage sebagai fallback
        if (!this.loadKategoriListFromLocalStorage()) {
          this.errorKategori = `Error: ${error.response?.status} - ${error.response?.data?.detail || error.message}`;
          this.kategoriList = [];
        } else {
          console.log('Loaded kategori from localStorage as fallback');
          this.errorKategori = null; // Clear error jika berhasil load dari localStorage
        }
      } finally {
        this.loadingKategori = false;
      }
    },

    // KATEGORI MODAL HANDLERS
    openCreateKategoriModal() {
      this.kategoriModalMode = 'create';
      this.kategoriFormData = {
        nama_kategori: ''
      };
      this.showKategoriModal = true;
    },

    openEditKategoriModal(kategori) {
      this.kategoriModalMode = 'edit';
      this.kategoriFormData = {
        ...kategori
      };
      this.showKategoriModal = true;
    },

    closeKategoriModal() {
      this.showKategoriModal = false;
      this.kategoriFormData = {
        nama_kategori: ''
      };
    },

    openDeleteKategoriModal(kategori) {
      this.deleteKategoriTarget = kategori;
      this.showDeleteKategoriModal = true;
    },

    closeDeleteKategoriModal() {
      this.showDeleteKategoriModal = false;
      this.deleteKategoriTarget = null;
    },

    // KATEGORI CRUD OPERATIONS
    async saveKategori() {
      if (!this.kategoriFormData.nama_kategori) {
        this.errorKategori = 'Nama kategori harus diisi!';
        return;
      }

      this.savingKategori = true;
      this.errorKategori = null;

      try {
        if (this.kategoriModalMode === 'create') {
          // CREATE
          const response = await api.post('/kategori_menu/', this.kategoriFormData);
          this.kategoriList.push(response.data);
          this.saveKategoriListToLocalStorage();
          this.successMessage = 'Kategori berhasil ditambahkan!';
        } else {
          // UPDATE
          const response = await api.patch(`/kategori_menu/${this.kategoriFormData.id}/`, this.kategoriFormData);
          const index = this.kategoriList.findIndex(k => k.id === this.kategoriFormData.id);
          if (index !== -1) {
            this.kategoriList[index] = response.data;
            this.saveKategoriListToLocalStorage();
          }
          this.successMessage = 'Kategori berhasil diperbarui!';
        }

        this.closeKategoriModal();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error saving kategori:', error);
        this.errorKategori = error.response?.data?.detail || error.message;
      } finally {
        this.savingKategori = false;
      }
    },

    async confirmDeleteKategori() {
      if (!this.deleteKategoriTarget) return;

      this.deletingKategori = true;
      this.errorKategori = null;

      try {
        await api.delete(`/kategori_menu/${this.deleteKategoriTarget.id}/`);
        this.kategoriList = this.kategoriList.filter(k => k.id !== this.deleteKategoriTarget.id);
        this.saveKategoriListToLocalStorage();
        this.successMessage = 'Kategori berhasil dihapus!';
        this.closeDeleteKategoriModal();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error deleting kategori:', error);
        this.errorKategori = error.response?.data?.detail || error.message;
      } finally {
        this.deletingKategori = false;
      }
    },

    // ========== MENU METHODS ==========
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMenu = 'Ukuran file terlalu besar (max 5MB)';
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        this.errorMenu = 'File harus berupa gambar';
        return;
      }

      this.errorMenu = null;

      // Convert to base64 dan simpan langsung ke formData
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        this.previewImage = base64String;
        this.formData.foto = base64String; // Simpan base64 di frontend
      };
      reader.readAsDataURL(file);
    },

    // FETCH DATA
    async fetchMenuFromDatabase() {
      this.loadingMenu = true;
      this.errorMenu = null;
      try {
        const response = await api.get('/menus/');
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        console.log('Data type:', typeof response.data);
        
        // Pastikan data adalah array
        if (Array.isArray(response.data)) {
          this.menuList = response.data;
        } else if (response.data.results) {
          // Jika response adalah object dengan results key (pagination)
          this.menuList = response.data.results;
        } else {
          this.menuList = response.data;
        }
        
        this.saveMenuListToLocalStorage(); // Simpan ke localStorage setelah fetch dari API
        console.log('Data menu berhasil diambil:', this.menuList);
      } catch (error) {
        console.error('Error fetching menu:', error);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response);
        // Coba load dari localStorage sebagai fallback
        if (!this.loadMenuListFromLocalStorage()) {
          this.errorMenu = `Error: ${error.response?.status} - ${error.response?.data?.detail || error.message}`;
          this.menuList = [];
        } else {
          console.log('Loaded menu from localStorage as fallback');
          this.errorMenu = null; // Clear error jika berhasil load dari localStorage
        }
      } finally {
        this.loadingMenu = false;
      }
    },

    refreshMenu() {
      this.fetchMenuFromDatabase();
    },

    // MODAL HANDLERS
    openCreateModal() {
      this.modalMode = 'create';
      this.formData = {
        nama_menu: '',
        harga: null,
        stok: null,
        deskripsi: '',
        id_kategori_menu: 1
      };
      this.previewImage = null;
      this.showModal = true;
    },

    openEditModal(menu) {
      this.modalMode = 'edit';
      this.formData = {
        ...menu
      };
      this.previewImage = menu.foto || null;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.formData = {
        nama_menu: '',
        harga: null,
        stok: null,
        deskripsi: '',
        id_kategori_menu: 1
      };
      this.previewImage = null;
    },

    openDeleteModal(menu) {
      this.deleteTarget = menu;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
    },

    // CRUD OPERATIONS
    async saveMenu() {
      // Validasi
      if (!this.formData.nama_menu || this.formData.harga === null || this.formData.stok === null || !this.formData.id_kategori_menu) {
        this.errorMenu = 'Semua field wajib diisi!';
        return;
      }

      this.savingMenu = true;
      this.errorMenu = null;

      try {
        // Kirim data sebagai JSON (foto sudah tidak ada di backend)
        const dataToSend = {
          nama_menu: this.formData.nama_menu,
          harga: this.formData.harga,
          stok: this.formData.stok,
          deskripsi: this.formData.deskripsi || '',
          id_kategori_menu: this.formData.id_kategori_menu
        };

        if (this.modalMode === 'create') {
          // CREATE
          const response = await api.post('/menus/', dataToSend);
          console.log('Create response:', response.data);
          this.menuList.push(response.data);
          this.saveMenuListToLocalStorage();
          this.successMessage = 'Menu berhasil ditambahkan!';
        } else {
          // UPDATE
          const response = await api.patch(`/menus/${this.formData.id}/`, dataToSend);
          const index = this.menuList.findIndex(m => m.id === this.formData.id);
          if (index !== -1) {
            this.menuList[index] = response.data;
            this.saveMenuListToLocalStorage();
          }
          this.successMessage = 'Menu berhasil diperbarui!';
        }

        this.closeModal();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error saving menu:', error);
        this.errorMenu = error.response?.data?.detail || error.message;
      } finally {
        this.savingMenu = false;
      }
    },

    async confirmDelete() {
      if (!this.deleteTarget) return;

      this.deletingMenu = true;
      this.errorMenu = null;

      try {
        await api.delete(`/menus/${this.deleteTarget.id}/`);
        this.menuList = this.menuList.filter(m => m.id !== this.deleteTarget.id);
        this.saveMenuListToLocalStorage();
        this.successMessage = 'Menu berhasil dihapus!';
        this.closeDeleteModal();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (error) {
        console.error('Error deleting menu:', error);
        this.errorMenu = error.response?.data?.detail || error.message;
      } finally {
        this.deletingMenu = false;
      }
    }
  },

  computed: {
    filteredMenuList() {
      if (!this.selectedKategori || this.selectedKategori === 0) return this.menuList;
      return this.menuList.filter(m => Number(m.id_kategori_menu) === Number(this.selectedKategori));
    }
  },

  mounted() {
    this.fetchMenuFromDatabase();
    this.fetchKategoriFromDatabase();
  }
};
</script>
