<template>
  <div class="text-gray-800 h-screen overflow-hidden flex flex-col select-none">
    <div id="app" class="h-full flex flex-col relative">
    
        <!-- 2. LAYOUT UTAMA -->
        <div class="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
            
            <!-- Header Sederhana -->
            <header class="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
                <div class="flex justify-between items-center">
                    <h1 class="text-lg font-bold text-gray-800 capitalize">{{ currentTab }}</h1>
                    <div class="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chef" alt="User">
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto hide-scrollbar p-5 pb-28">
                <HomeTab v-if="currentTab === 'home'" />
                <MejaTab v-if="currentTab === 'meja'" />
                <MenuTab v-if="currentTab === 'menu'" />
                <AkunTab v-if="currentTab === 'akun'" />
            </main>

            <!-- Bottom Navigation Bar -->
            <nav class="bg-white border-t border-gray-200 flex justify-around items-center px-2 pb-safe fixed bottom-0 w-full z-40 h-[80px]">
                
                <button @click="currentTab = 'home'" class="flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all duration-200" :class="currentTab === 'home' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'">
                    <i class="fas fa-home text-xl mb-0.5" :class="currentTab === 'home' ? 'transform scale-110' : ''"></i>
                    <span class="text-[10px] font-medium">Home</span>
                </button>

                <button @click="currentTab = 'meja'" class="flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all duration-200" :class="currentTab === 'meja' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'">
                    <i class="fas fa-chair text-xl mb-0.5" :class="currentTab === 'meja' ? 'transform scale-110' : ''"></i>
                    <span class="text-[10px] font-medium">Meja</span>
                </button>

                <!-- Tombol Tengah Menonjol -->
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
  </div>
</template>

<script>
import HomeTab from '../components/home/HomeTab.vue';
import MejaTab from '../components/home/MejaTab.vue';
import MenuTab from '../components/home/MenuTab.vue';
import AkunTab from '../components/home/AkunTab.vue';

export default {
  components: {
    HomeTab,
    MejaTab,
    MenuTab,
    AkunTab
  },
  data() {
    return {
      currentTab: 'home'
    };
  },
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }
  }
};
</script>
