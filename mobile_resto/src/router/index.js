import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  // --- Protected routes ---
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/MenuView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
  },
  {
    path: '/kategori-menu',
    name: 'kategori-menu',
    component: () => import('@/views/KategoriMenuView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/meja',
    name: 'meja',
    component: () => import('@/views/MejaView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
  },
  {
    path: '/pesanan',
    name: 'pesanan',
    component: () => import('@/views/PesananView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
  },
  {
    path: '/transaksi',
    name: 'transaksi',
    component: () => import('@/views/TransaksiView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'kasir'] },
  },
  {
    path: '/stok-harian',
    name: 'stok-harian',
    component: () => import('@/views/StokHarianView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/karyawan',
    name: 'karyawan',
    component: () => import('@/views/KaryawanView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UsersView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/views/ProfilView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'manager', 'kasir', 'pramusaji'] },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  const profile = JSON.parse(localStorage.getItem('profile') || 'null')
  const role = (profile?.role || '').toLowerCase()

  // Not authenticated → allow login, block everything else
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  // Already authenticated → skip login page
  if (to.name === 'login' && token) {
    return next({ name: 'dashboard' })
  }

  // Role check — only if route defines roles AND user has a token
  if (token && to.meta.roles && to.meta.roles.length > 0 && !to.meta.roles.includes(role)) {
    // Prevent infinite loop: if already going to dashboard, just let it through
    if (to.name === 'dashboard') {
      return next()
    }
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
