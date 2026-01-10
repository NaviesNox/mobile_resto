<template>
  <h1>Welcome Home</h1>
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
