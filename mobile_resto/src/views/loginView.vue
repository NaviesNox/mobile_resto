
<script>
import api from "@/services/api";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const form = new URLSearchParams();
        form.append("username", this.username);
        form.append("password", this.password);

        const res = await api.post("/auth/login", form, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        localStorage.setItem("token", res.data.access_token);
        this.$router.push("/home");
      } catch (err) {
        console.error(err);
        alert("Login gagal");
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen flex bg-white">
    <!-- Sisi Kiri - Gambar (50%) -->
    <div class="w-1/2 bg-gray-200 flex items-center justify-center overflow-hidden">
      <img
        src="@/assets/img/resto-image.png"
        alt="Resto"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Sisi Kanan - Form Login (50%) -->
    <div class="w-1/2 flex items-center justify-center bg-white">
      <form
        @submit.prevent="login"
        class="w-full max-w-sm bg-white p-8"
      >
        <h2 class="text-2xl font-semibold text-center mb-6">
          Login Resto
        </h2>

        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          type="submit"
          class="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-400 hover:text-black transition"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

