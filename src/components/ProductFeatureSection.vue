<template>
  <div v-if="items && items.length > 0" class="card shadow-custom mb-4">
    <div class="card-header">
      <h5 class="mb-0 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
        {{ title }}
      </h5>
    </div>
    <div class="card-body">
      <div class="d-flex flex-wrap gap-2">
        <span
          v-for="item in items"
          :key="item"
          :class="`badge ${badgeClass} fs-6 px-3 py-2`"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  badgeClass: {
    type: String,
    default: 'bg-light text-dark'
  }
})
</script>
<style scoped>
.bg-info {
  background-color: var(--electric-indigo) !important;
  color: white !important;
}
</style>
