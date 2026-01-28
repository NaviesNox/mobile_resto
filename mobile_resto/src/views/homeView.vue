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
                
                <!-- HALAMAN: HOME -->
                <div v-if="currentTab === 'home'" class="space-y-4">
                    <div class="bg-gradient-to-r from-red-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
                        <h2 class="text-2xl font-bold mb-1">Halo, Kasir</h2>
                        <p class="opacity-90 text-sm">Siap melayani pelanggan hari ini?</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-32">
                            <div class="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mb-2"><i class="fas fa-dollar-sign"></i></div>
                            <span class="text-gray-400 text-xs">Omzet</span>
                            <span class="font-bold text-lg">Rp --.--</span>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-32">
                            <div class="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mb-2"><i class="fas fa-receipt"></i></div>
                            <span class="text-gray-400 text-xs">Total Order</span>
                            <span class="font-bold text-lg">--</span>
                        </div>
                    </div>
                </div>

                <!-- HALAMAN: MEJA -->
                <div v-if="currentTab === 'meja'">
                    <h3 class="font-bold text-gray-700 mb-4">Denah Lantai 1</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="n in 6" :key="n" class="aspect-square bg-white rounded-2xl border-2 border-gray-100 shadow-sm flex flex-col items-center justify-center relative active:scale-95 transition-transform" :class="n === 2 ? 'border-red-200 bg-red-50' : ''">
                            <span class="absolute top-2 right-2 w-3 h-3 rounded-full" :class="n === 2 ? 'bg-red-500' : 'bg-green-500'"></span>
                            <i class="fas fa-chair text-3xl mb-2" :class="n === 2 ? 'text-red-400' : 'text-gray-300'"></i>
                            <span class="font-bold text-gray-700">Meja {{ n }}</span>
                            <span class="text-xs text-gray-400 mt-1">{{ n === 2 ? 'Terisi' : 'Kosong' }}</span>
                        </div>
                    </div>
                </div>

                <!-- HALAMAN: MENU -->
                <div v-if="currentTab === 'menu'" class="space-y-3">
                    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                        <button class="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-md shadow-red-200 whitespace-nowrap">Semua</button>
                        <button class="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-full text-sm whitespace-nowrap">Makanan</button>
                        <button class="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-full text-sm whitespace-nowrap">Minuman</button>
                    </div>

                    <div v-for="n in 5" :key="n" class="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                        <div class="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div class="flex justify-between items-center mt-2">
                                <div class="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                <button class="w-8 h-8 bg-gray-100 rounded-full text-gray-400"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- HALAMAN: AKUN -->
                <div v-if="currentTab === 'akun'" class="space-y-1">
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
export default {
  mounted() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/login");
    }
  },
};
</script>
