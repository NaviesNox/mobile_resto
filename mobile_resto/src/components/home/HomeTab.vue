<template>
  <div class="space-y-4">
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
</template>

<script>
export default {
  name: 'HomeTab'
};
</script>
