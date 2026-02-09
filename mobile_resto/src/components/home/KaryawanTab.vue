<template>
  <div class="space-y-4">
    <!-- Header & sub tabs -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
      <div>
        <h3 class="text-lg md:text-xl font-bold text-gray-800">
          Manajemen Karyawan & User
        </h3>
        <p class="text-sm text-gray-500">
          Kelola data karyawan dan akun pengguna aplikasi.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end w-full md:w-auto">
        <!-- Sub tabs -->
        <div
          class="inline-flex bg-gray-100 rounded-full p-1 text-xs md:text-sm self-start sm:self-auto"
        >
          <button
            type="button"
            class="px-3 py-1.5 rounded-full font-medium transition-all"
            :class="activeSubTab === 'karyawan'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'"
            @click="activeSubTab = 'karyawan'"
          >
            Karyawan
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-full font-medium transition-all"
            :class="activeSubTab === 'users'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-800'"
            @click="activeSubTab = 'users'"
          >
            User
          </button>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 justify-end">
          <button
            type="button"
            @click="refreshActive"
            class="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isActiveLoading"
          >
            <i
              class="fas fa-sync-alt"
              :class="isActiveLoading ? 'animate-spin' : ''"
            ></i>
            <span class="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            @click="openCreateModal"
            class="inline-flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg text-xs md:text-sm hover:bg-green-600 transition"
          >
            <i class="fas fa-plus"></i>
            <span class="hidden sm:inline">
              Tambah {{ activeSubTab === 'karyawan' ? 'Karyawan' : 'User' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="globalSuccessMessage" class="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
      <p class="text-sm">✓ {{ globalSuccessMessage }}</p>
    </div>

    <!-- Karyawan section -->
    <div v-if="activeSubTab === 'karyawan'" class="space-y-3">
      <div
        v-if="errorKaryawan"
        class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">⚠️ {{ errorKaryawan }}</p>
      </div>

      <div
        v-if="loadingKaryawan"
        class="flex justify-center items-center h-64"
      >
        <div class="text-center">
          <i class="fas fa-spinner text-3xl text-red-500 animate-spin mb-2 block"></i>
          <p class="text-gray-500">Memuat data karyawan...</p>
        </div>
      </div>

      <div
        v-else-if="karyawanList.length === 0"
        class="flex justify-center items-center h-64"
      >
        <div class="text-center">
          <i class="fas fa-users-slash text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500 text-lg font-medium">
            Belum ada data karyawan
          </p>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="karyawan in karyawanList"
          :key="karyawan.id"
          class="bg-white rounded-2xl border-2 border-gray-100 shadow-sm flex flex-col relative overflow-hidden group"
        >
          <div class="p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
              <i class="fas fa-user-tie"></i>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-gray-800 truncate">
                {{ karyawan.nama_karyawan || 'Karyawan #' + karyawan.id }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ karyawan.alamat || 'Alamat belum diatur' }}
              </p>
            </div>
          </div>

          <div class="px-4 pb-4 pt-0 text-xs text-gray-500 space-y-1">
            <p v-if="karyawan.no_hp">
              <i class="fas fa-phone-alt mr-1"></i>
              {{ karyawan.no_hp }}
            </p>
          </div>

          <!-- overlay actions -->
          <div
            class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 transition-opacity"
          >
            <button
              type="button"
              @click="openEditModal(karyawan)"
              class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              type="button"
              @click="openDeleteModal(karyawan)"
              class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
              title="Hapus"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users section -->
    <div v-else class="space-y-3">
      <div
        v-if="errorUsers"
        class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg"
      >
        <p class="text-sm">⚠️ {{ errorUsers }}</p>
      </div>

      <div
        v-if="loadingUsers"
        class="flex justify-center items-center h-64"
      >
        <div class="text-center">
          <i class="fas fa-spinner text-3xl text-red-500 animate-spin mb-2 block"></i>
          <p class="text-gray-500">Memuat data user...</p>
        </div>
      </div>

      <div
        v-else-if="usersList.length === 0"
        class="flex justify-center items-center h-64"
      >
        <div class="text-center">
          <i class="fas fa-user-slash text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500 text-lg font-medium">
            Belum ada data user
          </p>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="user in usersList"
          :key="user.id"
          class="bg-white rounded-2xl border-2 border-gray-100 shadow-sm flex flex-col relative overflow-hidden group"
        >
          <div class="p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
              <i class="fas fa-user"></i>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-gray-800 truncate">
                {{ user.nama || user.username || 'User #' + user.id }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ user.email || 'Email belum diatur' }}
              </p>
            </div>
          </div>

          <div class="px-4 pb-4 pt-0 text-xs text-gray-500 space-y-1">
            <p>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                :class="userRoleBadgeClass(user)"
              >
                <i class="fas fa-id-badge text-[10px]"></i>
                {{ user.role || 'role tidak diketahui' }}
              </span>
            </p>
            <p v-if="user.status">
              <i
                class="fas fa-circle mr-1"
                :class="user.status === 'active' ? 'text-green-500' : 'text-gray-400'"
              ></i>
              {{ user.status === 'active' ? 'Aktif' : user.status }}
            </p>
          </div>

          <!-- overlay actions -->
          <div
            class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 transition-opacity"
          >
            <button
              type="button"
              @click="openEditModal(user)"
              class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              type="button"
              @click="openDeleteModal(user)"
              class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
              title="Hapus"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 p-0 sm:p-4"
    >
      <div
        class="bg-white sm:rounded-2xl rounded-none p-6 w-full sm:max-w-md max-w-full h-full sm:h-auto max-h-[90vh] overflow-y-auto border-2"
        :class="activeSubTab === 'karyawan' ? 'border-red-400' : 'border-blue-400'"
      >
        <h2 class="text-xl font-bold mb-4">
          {{ modalMode === 'create' ? 'Tambah' : 'Edit' }}
          {{ activeSubTab === 'karyawan' ? 'Karyawan' : 'User' }}
        </h2>

        <div v-if="modalError" class="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
          {{ modalError }}
        </div>

        <div class="space-y-4">
          <!-- Form Karyawan -->
          <template v-if="activeSubTab === 'karyawan'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nama Karyawan</label
              >
              <input
                v-model="formData.nama_karyawan"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Alamat</label
              >
              <input
                v-model="formData.alamat"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Alamat lengkap"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >No. Telepon</label
              >
              <input
                v-model="formData.no_hp"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                placeholder="08xx..."
              />
            </div>
          </template>

          <!-- Form Users -->
          <template v-else>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Username</label
              >
              <input
                v-model="formData.username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Username"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nama Lengkap</label
              >
              <input
                v-model="formData.nama"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >No. HP</label
              >
              <input
                v-model="formData.no_telp"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="08xx..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                v-model="formData.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="contoh@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Role</label
              >
              <select
                v-model="formData.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="kasir">Kasir</option>
                <option value="kitchen">Kitchen</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Status</label
              >
              <select
                v-model="formData.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Relasi Karyawan</label
              >
              <select
                v-model="formData.id_karyawan"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option :value="null">Tanpa relasi</option>
                <option
                  v-for="k in karyawanList"
                  :key="k.id"
                  :value="k.id"
                >
                  {{ k.nama_karyawan }} (ID: {{ k.id }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Password
                <span class="text-xs text-gray-400">
                  (isi hanya jika ingin mengubah)
                </span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                :placeholder="modalMode === 'create' ? 'Minimal 6 karakter' : 'Biarkan kosong jika tidak diubah'"
              />
            </div>
          </template>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Batal
          </button>
          <button
            type="button"
            @click="saveEntity"
            class="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
            :class="activeSubTab === 'karyawan' ? 'bg-red-500' : 'bg-blue-500'"
            :disabled="saving"
          >
            <i class="fas fa-spinner animate-spin" v-if="saving"></i>
            <span v-else>
              {{ saving ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah' : 'Simpan' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Delete Confirmation -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h2 class="text-xl font-bold mb-4 text-red-600">
          Hapus {{ activeSubTab === 'karyawan' ? 'Karyawan' : 'User' }}?
        </h2>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus
          <strong>
            {{
              activeSubTab === 'karyawan'
                ? (deleteTarget?.nama_karyawan || 'data ini')
                : (deleteTarget?.username || deleteTarget?.nama || 'data ini')
            }}
          </strong>
          ?
        </p>

        <div class="flex gap-3">
          <button
            type="button"
            @click="closeDeleteModal"
            class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="deleting"
          >
            <i class="fas fa-spinner animate-spin" v-if="deleting"></i>
            <span v-else>{{ deleting ? 'Menghapus...' : 'Hapus' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'KaryawanTab',
  data() {
    return {
      activeSubTab: 'karyawan',

      // karyawan
      karyawanList: [],
      loadingKaryawan: true,
      errorKaryawan: null,

      // users
      usersList: [],
      loadingUsers: true,
      errorUsers: null,

      // global feedback
      globalSuccessMessage: null,

      // modal state
      showModal: false,
      showDeleteModal: false,
      modalMode: 'create',
      formData: {},
      deleteTarget: null,
      saving: false,
      deleting: false,
      modalError: null
    };
  },
  computed: {
    isActiveLoading() {
      return this.activeSubTab === 'karyawan'
        ? this.loadingKaryawan
        : this.loadingUsers;
    }
  },
  methods: {
    userRoleBadgeClass(user) {
      const role = (user.role || '').toString().toLowerCase();
      if (role.includes('admin')) {
        return 'bg-red-100 text-red-700';
      }
      if (role.includes('kasir')) {
        return 'bg-green-100 text-green-700';
      }
      if (role.includes('kitchen')) {
        return 'bg-yellow-100 text-yellow-700';
      }
      return 'bg-gray-100 text-gray-600';
    },

    async fetchKaryawan() {
      this.loadingKaryawan = true;
      this.errorKaryawan = null;
      try {
        const res = await api.get('/karyawan/');
        const raw = res.data;
        const data = Array.isArray(raw)
          ? raw
          : raw.results || raw.data || raw;
        this.karyawanList = data || [];
      } catch (err) {
        console.error('Error fetching karyawan:', err);
        this.errorKaryawan =
          err.response?.data?.detail ||
          err.message ||
          'Gagal memuat data karyawan';
        this.karyawanList = [];
      } finally {
        this.loadingKaryawan = false;
      }
    },

    async fetchUsers() {
      this.loadingUsers = true;
      this.errorUsers = null;
      try {
        const res = await api.get('/users/');
        const raw = res.data;
        const data = Array.isArray(raw)
          ? raw
          : raw.results || raw.data || raw;
        this.usersList = data || [];
      } catch (err) {
        console.error('Error fetching users:', err);
        this.errorUsers =
          err.response?.data?.detail ||
          err.message ||
          'Gagal memuat data user';
        this.usersList = [];
      } finally {
        this.loadingUsers = false;
      }
    },

    refreshActive() {
      if (this.activeSubTab === 'karyawan') {
        this.fetchKaryawan();
      } else {
        this.fetchUsers();
      }
    },

    openCreateModal() {
      this.modalMode = 'create';
      this.modalError = null;
      if (this.activeSubTab === 'karyawan') {
        this.formData = {
          nama_karyawan: '',
          no_hp: '',
          alamat: ''
        };
      } else {
        this.formData = {
          username: '',
          nama: '',
          no_telp: '',
          email: '',
          role: 'kasir',
          status: 'active',
          id_karyawan: null,
          password: ''
        };
      }
      this.showModal = true;
    },

    openEditModal(item) {
      this.modalMode = 'edit';
      this.modalError = null;
      if (this.activeSubTab === 'karyawan') {
        this.formData = {
          id: item.id,
          nama_karyawan: item.nama_karyawan || '',
          no_hp: item.no_hp || '',
          alamat: item.alamat || ''
        };
      } else {
        this.formData = {
          id: item.id,
          username: item.username || '',
          nama: item.nama || '',
          no_telp: item.no_telp || '',
          email: item.email || '',
          role: item.role || 'kasir',
          status: item.status || 'active',
          id_karyawan: item.id_karyawan || null,
          password: ''
        };
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.formData = {};
      this.modalError = null;
    },

    openDeleteModal(item) {
      this.deleteTarget = item;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteTarget = null;
      this.deleting = false;
    },

    async saveEntity() {
      this.saving = true;
      this.modalError = null;
      try {
        if (this.activeSubTab === 'karyawan') {
          await this.saveKaryawan();
        } else {
          await this.saveUser();
        }
        this.closeModal();
      } catch (err) {
        console.error('Error saving entity:', err);
        this.modalError =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          (typeof err.response?.data === 'string'
            ? err.response.data
            : err.message) ||
          'Gagal menyimpan data';
      } finally {
        this.saving = false;
      }
    },

    async saveKaryawan() {
      if (!this.formData.nama_karyawan) {
        throw new Error('Nama karyawan wajib diisi');
      }

      const payload = {
        nama_karyawan: String(this.formData.nama_karyawan).trim(),
        no_hp: this.formData.no_hp || '',
        alamat: this.formData.alamat || ''
      };

      if (this.modalMode === 'create') {
        const res = await api.post('/karyawan/', payload);
        this.karyawanList.push(res.data);
        this.globalSuccessMessage = 'Karyawan berhasil ditambahkan!';
      } else {
        const res = await api.patch(`/karyawan/${this.formData.id}/`, payload);
        const idx = this.karyawanList.findIndex(
          (k) => k.id === this.formData.id
        );
        if (idx !== -1) {
          this.karyawanList.splice(idx, 1, res.data);
        }
        this.globalSuccessMessage = 'Karyawan berhasil diperbarui!';
      }

      setTimeout(() => {
        this.globalSuccessMessage = null;
      }, 3000);
    },

    async saveUser() {
      if (!this.formData.username || !this.formData.email) {
        throw new Error('Username dan email wajib diisi');
      }

      const payload = {
        username: String(this.formData.username).trim(),
        nama: this.formData.nama ? String(this.formData.nama).trim() : '',
        no_telp: this.formData.no_telp || '',
        email: String(this.formData.email).trim(),
        role: this.formData.role || 'kasir',
        status: this.formData.status || 'active',
        id_karyawan: this.formData.id_karyawan || null
      };

      if (this.modalMode === 'create' || this.formData.password) {
        payload.password = this.formData.password;
      }

      if (this.modalMode === 'create') {
        const res = await api.post('/users/', payload);
        this.usersList.push(res.data);
        this.globalSuccessMessage = 'User berhasil ditambahkan!';
      } else {
        const res = await api.patch(`/users/${this.formData.id}/`, payload);
        const idx = this.usersList.findIndex((u) => u.id === this.formData.id);
        if (idx !== -1) {
          this.usersList.splice(idx, 1, res.data);
        }
        this.globalSuccessMessage = 'User berhasil diperbarui!';
      }

      setTimeout(() => {
        this.globalSuccessMessage = null;
      }, 3000);
    },

    async confirmDelete() {
      if (!this.deleteTarget) return;
      this.deleting = true;
      try {
        if (this.activeSubTab === 'karyawan') {
          await api.delete(`/karyawan/${this.deleteTarget.id}/`);
          this.karyawanList = this.karyawanList.filter(
            (k) => k.id !== this.deleteTarget.id
          );
          this.globalSuccessMessage = 'Karyawan berhasil dihapus!';
        } else {
          await api.delete(`/users/${this.deleteTarget.id}/`);
          this.usersList = this.usersList.filter(
            (u) => u.id !== this.deleteTarget.id
          );
          this.globalSuccessMessage = 'User berhasil dihapus!';
        }
        this.closeDeleteModal();
        setTimeout(() => {
          this.globalSuccessMessage = null;
        }, 3000);
      } catch (err) {
        console.error('Error deleting entity:', err);
        alert(
          err.response?.data?.detail ||
            err.message ||
            'Gagal menghapus data, silakan coba lagi.'
        );
        this.deleting = false;
      }
    }
  },
  mounted() {
    this.fetchKaryawan();
    this.fetchUsers();
  }
};
</script>

