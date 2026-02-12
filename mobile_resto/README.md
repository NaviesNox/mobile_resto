# 🍽️ RestoApp — Restaurant Management System

Frontend untuk sistem manajemen restoran yang dibangun dengan **Vue 3**, **Vite**, **Pinia**, **Axios**, dan **TailwindCSS**. Backend menggunakan **FastAPI** dengan autentikasi JWT.

---

## 📸 Tech Stack

| Teknologi | Versi |
|-----------|-------|
| Vue.js | 3.5+ (Composition API) |
| Vite | 7.x |
| Vue Router | 4.x |
| Pinia | 3.x |
| Axios | 1.x |
| TailwindCSS | 4.x |
| JWT Decode | 4.x |

---

## 🚀 Instalasi & Menjalankan

### 1. Clone & Install

```sh
git clone <repo-url>
cd mobile_resto
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```env
VITE_API_URL=http://localhost:8000/
```

> Sesuaikan `VITE_API_URL` dengan URL backend FastAPI Anda.

### 3. Jalankan Development Server

```sh
npm run dev
```

### 4. Build untuk Production

```sh
npm run build
```

---

## 📁 Arsitektur Folder

```
src/
├── api/                        # Axios instance & API modules
│   ├── axios.js                # Axios config + JWT interceptor + 401 handler
│   ├── authApi.js              # POST /auth/login, /auth/register
│   ├── usersApi.js             # CRUD /users/, GET/PATCH /users/profile/
│   ├── mejaApi.js              # CRUD /mejas/
│   ├── menuApi.js              # CRUD /menus/
│   ├── kategoriApi.js          # CRUD /kategori_menu/
│   ├── transaksiApi.js         # CRUD /transaksi/
│   ├── pesananApi.js           # CRUD /pesanan/
│   ├── detailPesananApi.js     # CRUD /detail-pesanan/
│   ├── stokApi.js              # CRUD /update_stok_harian/
│   └── karyawanApi.js          # CRUD /karyawan/
│
├── stores/                     # Pinia state management
│   ├── auth.js                 # Auth store (login, profile, role, logout)
│   └── toast.js                # Toast notification store
│
├── layouts/
│   └── MainLayout.vue          # Sidebar + header + role-based navigation
│
├── components/
│   ├── ToastNotification.vue   # Animated toast notifications
│   ├── ConfirmDialog.vue       # Promise-based confirm dialog
│   └── LoadingSpinner.vue      # Loading state component
│
├── router/
│   └── index.js                # Vue Router + role-based route guards
│
├── views/
│   ├── LoginView.vue           # Halaman login (mobile-friendly)
│   ├── DashboardView.vue       # Dashboard overview + statistik
│   ├── MenuView.vue            # CRUD Menu (card grid + modal)
│   ├── MejaView.vue            # CRUD Meja (status filter)
│   ├── KategoriMenuView.vue    # CRUD Kategori Menu
│   ├── PesananView.vue         # Pesanan + keranjang + order flow
│   ├── TransaksiView.vue       # Transaksi + pembayaran + QRIS
│   ├── StokHarianView.vue      # Update stok harian
│   ├── KaryawanView.vue        # CRUD Karyawan (admin/manager)
│   ├── UsersView.vue           # CRUD Users (admin/manager)
│   └── ProfilView.vue          # Profil pengguna + ubah password
│
├── assets/
│   ├── main.css                # TailwindCSS + custom styles
│   └── img/
│       ├── logo.png
│       └── resto-image.png
│
├── App.vue                     # Root component
└── main.js                     # Entry point (Pinia + Router)
```

---

## 🔐 Autentikasi & Otorisasi

### JWT Flow

1. User login via `POST /auth/login` (form-urlencoded)
2. Backend mengembalikan `access_token`
3. Token disimpan di `localStorage`
4. Axios interceptor menambahkan `Authorization: Bearer <token>` di setiap request
5. Jika backend mengembalikan **401**, interceptor otomatis logout dan redirect ke `/login`

### Role-Based Access Control

| Role | Akses Halaman |
|------|--------------|
| **admin** | Semua halaman |
| **manager** | Semua halaman |
| **kasir** | Dashboard, Pesanan, Menu, Meja, Transaksi, Profil |
| **pramusaji** | Dashboard, Pesanan, Menu, Meja, Profil |

> Halaman **Karyawan**, **Users**, **Kategori Menu**, dan **Update Stok** hanya bisa diakses oleh `admin` dan `manager`.

Route guard diimplementasikan di `router/index.js` melalui `meta.roles`.

---

## 📄 Halaman & Fitur

### 🔑 Login (`/login`)
- Form username + password
- Loading state saat proses login
- Redirect ke `/dashboard` setelah berhasil
- Mobile-friendly layout (full-screen hero di desktop, compact di mobile)

### 📊 Dashboard (`/dashboard`)
- Statistik: Omzet, Total Order, Pesanan Diproses, Pesanan Baru
- Data diambil dari `GET /transaksi/` dan `GET /pesanan/`
- Tabel pesanan terbaru (5 terakhir)

### 🍕 Menu (`/menu`) — Contoh CRUD Lengkap
- **List**: Card grid responsif dengan search
- **Create**: Modal form (nama, harga, stok, kategori, deskripsi)
- **Edit**: Modal form pre-filled
- **Delete**: Confirm dialog sebelum hapus
- Format harga dalam Rupiah

### 🪑 Meja (`/meja`)
- Card grid dengan status badge (tersedia/terisi/kosong)
- Filter status
- CRUD dengan modal

### 🏷️ Kategori Menu (`/kategori-menu`)
- Tabel CRUD sederhana
- Hanya admin & manager

### 📋 Pesanan (`/pesanan`) — Dengan Keranjang
- **Buat Pesanan Baru**:
  - Pilih menu → tambah ke keranjang
  - Atur qty (+ / -)
  - Pilih tipe pesanan (dine-in / take-away)
  - Pilih meja (untuk dine-in, hanya meja tersedia)
  - Tambah catatan
  - Otomatis membuat Transaksi → Pesanan → Detail Pesanan
- **Daftar Pesanan**: Filter status (baru/diproses/siap/selesai/batal)
- **Update Status**: Workflow baru → diproses → siap → selesai
- **Detail Pesanan**: Modal dengan breakdown item

### 💳 Transaksi (`/transaksi`)
- Tabel transaksi dengan info pesanan terkait
- **Pembayaran**:
  - Metode: Cash atau QRIS
  - Cash: Langsung konfirmasi
  - QRIS: Generate QR code otomatis
- Total dihitung dari detail pesanan

### 📦 Update Stok Harian (`/stok-harian`)
- Pilih menu → input jumlah porsi
- Riwayat update dengan timestamp

### 👨‍💼 Karyawan (`/karyawan`)
- CRUD: nama, no HP, alamat
- Search karyawan
- Akses: admin & manager

### 👤 Users (`/users`)
- CRUD user dengan role assignment
- Link ke data karyawan (opsional)
- Setting status (active/inactive)
- Akses: admin & manager

### ⚙️ Profil (`/profil`)
- Lihat dan edit profil
- Ubah password
- Tombol logout

---

## 💡 Fitur Teknis

### Toast Notification
Notifikasi muncul di pojok kanan atas dengan 4 tipe:
- ✅ `success` — Hijau
- ❌ `error` — Merah
- ⚠️ `warning` — Kuning
- ℹ️ `info` — Biru

```js
const toast = useToastStore()
toast.success('Data berhasil disimpan')
toast.error('Terjadi kesalahan')
```

### Confirm Dialog
Dialog konfirmasi sebelum delete (Promise-based):

```vue
<ConfirmDialog ref="confirmRef" />

const ok = await confirmRef.value.open('Hapus Data', 'Yakin ingin menghapus?')
if (ok) { /* proceed delete */ }
```

### Loading State
Setiap halaman menampilkan spinner saat loading data:

```vue
<LoadingSpinner :loading="loading" />
```

### QRIS Payment
QR Code di-generate menggunakan `api.qrserver.com` dengan data transaksi yang di-encode ke dalam QR.

---

## 🔌 Backend API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register` |
| Users | `GET/POST /users/`, `GET/PATCH /users/profile/`, `GET/PATCH/DELETE /users/{id}` |
| Meja | `GET/POST /mejas/`, `GET/PATCH/DELETE /mejas/{id}` |
| Menu | `GET/POST /menus/`, `GET/PATCH/DELETE /menus/{id}` |
| Kategori Menu | `GET/POST /kategori_menu/`, `GET/PUT/DELETE /kategori_menu/{id}` |
| Transaksi | `GET/POST /transaksi/`, `GET/PUT/DELETE /transaksi/{id}` |
| Pesanan | `GET/POST /pesanan/`, `GET/PUT/DELETE /pesanan/{id}` |
| Detail Pesanan | `GET/POST /detail-pesanan/`, `GET/PUT/DELETE /detail-pesanan/{id}` |
| Stok Harian | `GET/POST /update_stok_harian/`, `GET/PUT/DELETE /update_stok_harian/{id}` |
| Karyawan | `GET/POST /karyawan/`, `GET/PATCH/DELETE /karyawan/{id}` |

---

## 🎨 Desain & UI

- **Tema**: Warna utama merah (`red-500`) dengan latar abu-abu muda
- **Font**: Inter (Google Fonts)
- **Icon**: Font Awesome 6
- **Mobile First**: Semua halaman responsif
- **Sidebar**: Desktop — sidebar tetap, Mobile — hamburger menu dengan overlay
- **Cards & Tables**: `rounded-xl`, `shadow-sm`, `border border-gray-100`
- **Modals**: Centered, backdrop blur, animasi fade

---

## 📝 Konvensi Kode

- ✅ **Composition API** (`<script setup>`) di semua komponen
- ✅ **Pinia** untuk state management
- ✅ **async/await** untuk semua API calls
- ✅ **try/catch** untuk error handling
- ❌ **Tidak ada Options API**
- ❌ **Tidak ada pseudo code**

---

## 🛠️ IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (nonaktifkan Vetur jika terpasang).
