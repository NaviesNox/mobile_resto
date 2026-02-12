<script setup>
const props = defineProps({
  loading: { type: Boolean, default: false },
  text: { type: String, default: 'Memuat data...' },
})
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-gray-400">
    <div class="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
    <span class="text-sm">{{ text }}</span>
  </div>
</template>
