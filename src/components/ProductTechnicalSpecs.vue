<template>
  <div class="card shadow-custom mb-4">
    <div class="card-header">
      <h5 class="mb-0 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
        Especificaciones Técnicas
      </h5>
    </div>
    <div class="card-body">
      <div class="row g-4">
        <div v-if="product.keys_count && product.keys_count !== 'NA'" class="col-md-6">
          <div class="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-3"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
            <div>
              <small class="text-muted d-block">Número de Teclas</small>
              <span class="fw-semibold fs-5">{{ product.keys_count }}</span>
            </div>
          </div>
        </div>

        <div v-if="product.keys_type && product.keys_type !== 'NA'" class="col-md-6">
          <div class="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-3"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
            <div>
              <small class="text-muted d-block">Tipo de Teclas</small>
              <span class="fw-semibold">{{ product.keys_type }}</span>
            </div>
          </div>
        </div>

        <div v-if="product.pads_count && product.pads_count > 0" class="col-md-6">
          <div class="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-3"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
            <div>
              <small class="text-muted d-block">Número de Pads</small>
              <span class="fw-semibold fs-5">{{ product.pads_count }}</span>
            </div>
          </div>
        </div>

        <div v-if="product.weight_lbs && product.weight_lbs !== 'NA'" class="col-md-6">
          <div class="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-3"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
            <div>
              <small class="text-muted d-block">Peso</small>
              <span class="fw-semibold">{{ product.weight_lbs }} lbs</span>
            </div>
          </div>
        </div>

        <div v-if="product.dimensions_inches && product.dimensions_inches !== 'NA'" class="col-12">
          <div class="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-override me-3"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
            <div>
              <small class="text-muted d-block">Dimensiones (Largo × Ancho × Alto)</small>
              <span class="fw-semibold">{{ formatDimensions(product.dimensions_inches) }} pulgadas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductFormatting } from '@/composables/useProductFormatting'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { formatDimensions } = useProductFormatting()
</script>
<style scoped>
.text-override {
  color: var(--electric-indigo) !important;
}
</style>
