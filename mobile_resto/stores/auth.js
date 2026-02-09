import {
  ref,
  computed
} from 'vue'
import {
  defineStore
} from 'pinia'
import api from '../src/services/api.js'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    token: localStorage.getItem("access_token") || null,
    profile: JSON.parse(localStorage.getItem("profile")) || null,
  }),

  actions: {

    async fetchAuth(usn, pw) {
      try {
        const data = new FormData()
        data.set('grant_type', "password", )
        data.set('username', usn)
        data.set('password', pw)
        data.set('scope', "")
        const Fauth = await api.post(`/api/v1/auth/login`,
          // ini berdasarkan form fastAPI
          data,

          // mengatur http req (keterangan tambahan buat si server)
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded", //data yang dikirim form encoded
            }
          })


        //set auth.token yang ada di auth.js menjadi apa yang berdasarkan response data akses token
        this.token = Fauth.data.access_token

        //set token di local storage
        localStorage.setItem("access_token", Fauth.data.access_token)

      } catch (error) {
        this.token = null
        localStorage.removeItem("access_token")
        alert("Username atau Password salah")
        console.error("Gagal Login", error);
      }
    },


    async fetchProfile() {
      try {
        const Uprofile = await api.get(`/user/profile`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          }
        });

        this.profile = Uprofile.data
        localStorage.setItem("profile", JSON.stringify(Uprofile.data));
        console.log(this.profile);
      } catch (error) {
        console.error("Gagal ambil Profile", error);
      }
    },


    async logout() {
      this.token = null
      this.profile = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('profile')
    }

  },


  getters: {
    isPetugas: (state) =>
      state.profile?.role === 'admin',

    isAnggota: (state) =>
      state.profile?.role === 'pramuSaji'

  }
})