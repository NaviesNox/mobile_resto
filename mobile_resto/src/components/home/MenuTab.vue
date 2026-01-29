<template>
  <div class="space-y-3">
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
</template>

<script>
export default {
  name: 'MenuTab'
};
</script>
