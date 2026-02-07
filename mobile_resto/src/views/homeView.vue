<template>
  <div class="text-gray-800 h-screen w-screen overflow-hidden flex flex-col md:flex-row select-none bg-gray-50">

    <aside class="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 z-20 shadow-sm">
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white mr-3">
          <i class="fas fa-utensils"></i>
        </div>
        <span class="text-xl font-bold text-gray-800 tracking-tight">RestoApp</span>
      </div>

      <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          @click="currentTab = item.id"
          class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group"
          :class="currentTab === item.id ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
        >
          <i :class="[item.icon, 'w-6 text-lg text-center mr-3 transition-colors', currentTab === item.id ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600']"></i>
          <span class="font-medium">{{ item.label }}</span>
        </button>

        <div class="my-4 border-t border-gray-100 mx-3"></div>

        <button class="w-full flex items-center px-3 py-3 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all">
          <div class="w-6 mr-3 text-center"><i class="fas fa-qrcode"></i></div>
          <span class="font-medium">Scan QR Code</span>
        </button>

      </div>

      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chef" alt="User">
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">Admin Resto</p>
            <p class="text-xs text-gray-500 truncate">admin@resto.com</p>
          </div>
        </div>
      </div>
    </aside>


    <div id="app" class="flex-1 flex flex-col h-full relative overflow-hidden">
      
      <header class="bg-white px-6 py-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <div>
           <h1 class="text-lg md:text-2xl font-bold text-gray-800 capitalize">{{ pageTitle }}</h1>
           <p class="hidden md:block text-sm text-gray-500 mt-1">Manage your restaurant efficiently.</p>
        </div>
        
        <div class="md:hidden w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chef" alt="User">
        </div>

        <div class="hidden md:flex items-center gap-4">
           <button class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 relative">
              <i class="fas fa-bell"></i>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
           </button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto hide-scrollbar p-5 pb-28 md:p-8 md:pb-8 bg-gray-50">
        <div class="max-w-7xl mx-auto h-full">
            <HomeTab v-if="currentTab === 'home'" />
            <MejaTab v-if="currentTab === 'meja'" />
            <Ordertab v-if="currentTab === 'order'" />
            <MenuTab v-if="currentTab === 'menu'" />
            <AkunTab v-if="currentTab === 'akun'" />
        </div>
      </main>

      <nav class="md:hidden bg-white border-t border-gray-200 flex justify-around items-center px-2 pb-safe fixed bottom-0 w-full z-40 h-[80px]">
        
        <button @click="currentTab = 'home'" class="flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all duration-200" :class="currentTab === 'home' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'">
          <i class="fas fa-home text-xl mb-0.5" :class="currentTab === 'home' ? 'transform scale-110' : ''"></i>
          <span class="text-[10px] font-medium">Home</span>
        </button>

        <button @click="currentTab = 'meja'" class="flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all duration-200" :class="currentTab === 'meja' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'">
          <i class="fas fa-chair text-xl mb-0.5" :class="currentTab === 'meja' ? 'transform scale-110' : ''"></i>
          <span class="text-[10px] font-medium">Meja</span>
        </button>

        <div class="relative -top-6">
          <button class="w-14 h-14 bg-red-500 rounded-full text-white shadow-lg shadow-red-300 flex items-center justify-center transform active:scale-95 transition-all">
            <i class="fas fa-qrcode text-xl"></i>
          </button>
        </div>

        <button @click="currentTab = 'menu'" class="flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all duration-200" :class="currentTab === 'menu' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'">
          <i class="fas fa-book-open text-xl mb-0.5" :class="currentTab === 'menu' ? 'transform scale-110' : ''"></i>
          <span class="text-[10px] font-medium">Menu</span>
        </button>

        <button @click="currentTab = 'akun'" class="flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all duration-200" :class="currentTab === 'akun' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'">
          <i class="fas fa-user text-xl mb-0.5" :class="currentTab === 'akun' ? 'transform scale-110' : ''"></i>
          <span class="text-[10px] font-medium">Akun</span>
        </button>

      </nav>
    </div>
  </div>
</template>

<script>
import HomeTab from '../components/home/HomeTab.vue';
import MejaTab from '../components/home/MejaTab.vue';
import MenuTab from '../components/home/MenuTab.vue';
import AkunTab from '../components/home/AkunTab.vue';
import Ordertab from '@/components/home/Ordertab.vue';


export default {
  components: {
    HomeTab,
    MejaTab,
    MenuTab,
    AkunTab,
    Ordertab
  },
  data() {
    return {
      currentTab: 'home',
      // Data untuk loop sidebar agar lebih rapi
      menuItems: [
        { id: 'home', label: 'Dashboard', icon: 'fas fa-home' },
        { id: 'meja', label: 'Management Meja', icon: 'fas fa-chair' },
        { id: 'menu', label: 'Daftar Menu', icon: 'fas fa-book-open' },
        { id: 'akun', label: 'Pengaturan Akun', icon: 'fas fa-user' },
        { id: 'order', label: 'Pesanan Masuk', icon: 'fas fa-clipboard-list' },
      ]
    };
  },
  computed: {
    pageTitle() {
      // Mengubah judul header agar lebih deskriptif
      const titles = {
        home: 'Dashboard Overview',
        meja: 'Layout & Meja',
        menu: 'Katalog Menu',
        akun: 'Profil Pengguna',
        order: 'Pesanan Masuk'

      };
      return titles[this.currentTab] || this.currentTab;
    }
  },
  mounted() {
    if (!localStorage.getItem("access_token")) {
      this.$router.push("/login");
    }
  }
};
</script>

<style>
/* Utility class for hiding scrollbar but keeping functionality */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>