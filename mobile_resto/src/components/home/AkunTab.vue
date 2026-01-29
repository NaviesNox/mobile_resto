<template>
  <div class="space-y-1">
    <div class="bg-white p-6 rounded-t-2xl shadow-sm border-b border-gray-100 flex flex-col items-center">
      <div class="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chef" class="w-full h-full object-cover">
      </div>
      <h2 class="text-xl font-bold">Admin Resto</h2>
      <p class="text-gray-500 text-sm">Manager</p>
    </div>
    
    <div class="bg-white p-2 space-y-1">
      <button class="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><i class="fas fa-cog"></i></div>
        <span>Pengaturan</span>
        <i class="fas fa-chevron-right ml-auto text-gray-300 text-xs"></i>
      </button>
      <button class="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><i class="fas fa-history"></i></div>
        <span>Riwayat Shift</span>
        <i class="fas fa-chevron-right ml-auto text-gray-300 text-xs"></i>
      </button>
    </div>

    <div class="p-4">
      <button @click="logout" class="w-full bg-red-100 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4 active:bg-red-200 transition">
        <i class="fas fa-sign-out-alt"></i> Keluar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AkunTab',
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>
