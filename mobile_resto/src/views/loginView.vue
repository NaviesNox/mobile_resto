
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
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      @submit.prevent="login"
      class="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg"
    >
      <h2 class="text-2xl font-semibold text-center mb-6">
        Login
      </h2>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  </div>
</template>

