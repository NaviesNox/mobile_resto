<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { profile, isAdminOrManager } = storeToRefs(auth)
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

const menuItems = computed(() => {
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: 'fas fa-home', roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
    { to: '/pesanan', label: 'Pesanan', icon: 'fas fa-clipboard-list', roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
    { to: '/menu', label: 'Daftar Menu', icon: 'fas fa-book-open', roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
    { to: '/kategori-menu', label: 'Kategori Menu', icon: 'fas fa-tags', roles: ['admin', 'manager'] },
    { to: '/meja', label: 'Management Meja', icon: 'fas fa-chair', roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
    { to: '/transaksi', label: 'Transaksi', icon: 'fas fa-receipt', roles: ['admin', 'manager', 'kasir'] },
    { to: '/stok-harian', label: 'Update Stok', icon: 'fas fa-boxes-stacked', roles: ['admin', 'manager'] },
    { to: '/karyawan', label: 'Karyawan', icon: 'fas fa-id-badge', roles: ['admin', 'manager'] },
    { to: '/users', label: 'Users', icon: 'fas fa-users-cog', roles: ['admin', 'manager'] },
  ]
  const role = auth.userRole
  return items.filter((i) => i.roles.includes(role))
})

const pageTitle = computed(() => {
  const names = {
    '/dashboard': 'Dashboard Overview',
    '/pesanan': 'Pesanan',
    '/menu': 'Katalog Menu',
    '/kategori-menu': 'Kategori Menu',
    '/meja': 'Layout & Meja',
    '/transaksi': 'Transaksi & Pembayaran',
    '/stok-harian': 'Update Stok Harian',
    '/karyawan': 'Kelola Karyawan',
    '/users': 'Kelola Users',
    '/profil': 'Profil Pengguna',
  }
  return names[route.path] || 'RestoApp'
})

const userName = computed(() => profile.value?.username || 'User')
const userEmail = computed(() => profile.value?.email || '')

function handleLogout() {
  auth.logout()
}

function isActive(to) {
  return route.path === to
}

function navigateTo(to) {
  router.push(to)
  sidebarOpen.value = false
}
</script>

<template>
  <div class="text-gray-800 h-screen w-screen overflow-hidden flex flex-col md:flex-row select-none bg-gray-50">
    <!-- Overlay mobile -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/30 z-30 md:hidden"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed md:static inset-y-0 left-0 w-64 flex flex-col bg-white border-r border-gray-200 z-40 shadow-sm transform transition-transform duration-300 md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="h-16 flex items-center px-6 border-b border-gray-100">
        <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white mr-3">
          <i class="fas fa-utensils"></i>
        </div>
        <span class="text-xl font-bold text-gray-800 tracking-tight">RestoApp</span>
        <button class="md:hidden ml-auto text-gray-400" @click="sidebarOpen = false">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1 hide-scrollbar">
        <button
          v-for="item in menuItems"
          :key="item.to"
          @click="navigateTo(item.to)"
          class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group"
          :class="isActive(item.to) ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
        >
          <i
            :class="[item.icon, 'w-6 text-lg text-center mr-3 transition-colors', isActive(item.to) ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600']"
          ></i>
          <span class="font-medium text-sm">{{ item.label }}</span>
        </button>

        <div class="my-4 border-t border-gray-100 mx-3"></div>

        <button
          @click="navigateTo('/profil')"
          class="w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group"
          :class="isActive('/profil') ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
        >
          <i class="fas fa-user w-6 text-lg text-center mr-3"></i>
          <span class="font-medium text-sm">Profil</span>
        </button>

        <button
          @click="handleLogout"
          class="w-full flex items-center px-3 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <i class="fas fa-sign-out-alt w-6 text-lg text-center mr-3"></i>
          <span class="font-medium text-sm">Logout</span>
        </button>
      </div>

      <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-bold">
            {{ userName.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 truncate capitalize">{{ auth.userRole }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col h-full relative overflow-hidden">
      <header class="bg-white px-4 md:px-6 py-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <button class="md:hidden text-gray-500 hover:text-gray-700" @click="sidebarOpen = true">
            <i class="fas fa-bars text-xl"></i>
          </button>
          <div>
            <h1 class="text-lg md:text-2xl font-bold text-gray-800">{{ pageTitle }}</h1>
            <p class="hidden md:block text-sm text-gray-500 mt-0.5">Manage your restaurant efficiently.</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <span class="capitalize bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-medium">{{ auth.userRole }}</span>
          </div>
          <div
            class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-bold text-sm cursor-pointer"
            @click="navigateTo('/profil')"
          >
            {{ userName.charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto hide-scrollbar p-4 md:p-6 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
