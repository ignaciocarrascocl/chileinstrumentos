<template>
  <div class="card shadow-custom mb-4">
    <div class="card-header">
      <h1 class="h3 mb-0 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
        {{ product.Model }}
      </h1>
    </div>
    <div class="card-body">
      <!-- Basic Information -->
      <div class="mb-4">
        <div class="d-flex align-items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
          <div>
            <h6 class="text-muted mb-1">Fabricante</h6>
            <p class="h5 text-override mb-0">{{ product['Manufacturer-0'] || 'No especificado' }}</p>
          </div>
        </div>

        <div class="row">
          <div v-if="product['Street Price-0']" class="col-md-6 mb-3">
            <div class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
              <div>
                <h6 class="text-muted mb-1">Precio</h6>
                <p class="h4 text-override fw-bold mb-0">{{ product['Street Price-0'] }}</p>
              </div>
            </div>
          </div>

          <div v-if="product.Year" class="col-md-6 mb-3">
            <div class="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
              <div>
                <h6 class="text-muted mb-1">Año</h6>
                <span class="h4 text-override fw-bold mb-0">{{ product.Year }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.text-override {
  color: var(--electric-indigo) !important;
}
</style>
