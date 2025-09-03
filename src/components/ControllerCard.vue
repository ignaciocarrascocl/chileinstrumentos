<template>
  <router-link
    :to="{ name: 'product-detail', params: { id: controller.ID || controller.image } }"
    class="text-decoration-none"
  >
    <div class="card h-100 shadow-sm border-0 controller-card">
      <!-- Imagen -->
      <div class="card-img-container position-relative">
        <img
          :src="getImageUrl(controller)"
          :alt="controller.Model"
          class="card-img-top"
          style="height: 200px; object-fit: cover;"
          @error="handleImageError"
        >
        <div class="position-absolute top-0 end-0 m-2">
          <span v-if="controller.Year" class="badge bg-primary">
            {{ controller.Year }}
          </span>
        </div>
      </div>

      <!-- Contenido de la tarjeta -->
      <div class="card-body d-flex flex-column">
        <!-- Title -->
        <h6 class="card-title fw-bold mb-2">
          {{ controller.Model }}
        </h6>

        <!-- Brand/Manufacturer -->
        <p class="card-text text-muted small mb-3">
          <i class="bi bi-building me-1"></i>
          {{ controller['Manufacturer-0'] }}
        </p>

        <!-- Info Boxes -->
        <ControllerInfo :controller="controller" />

        <!-- Price -->
        <div v-if="controller['Street Price-0']" class="price-section mt-auto">
          <div class="price-label">
            <small class="text-muted">Precio de lanzamiento en dólares:</small>
          </div>
          <span class="h6 text-success fw-bold">
            {{ controller['Street Price-0'] }}
          </span>
        </div>
      </div>

      <!-- Footer de la tarjeta -->
      <div class="card-footer bg-transparent border-top-0">
        <div class="btn btn-outline-primary btn-sm w-100">
          <i class="bi bi-info-circle me-2"></i>
          Ver Detalles
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { useImageHandling } from '@/composables/useImageHandling'
import ControllerInfo from './ControllerInfo.vue'

defineProps({
  controller: {
    type: Object,
    required: true
  }
})

const { getImageUrl, handleImageError } = useImageHandling()
</script>

<style scoped>
/* ...existing controller card styles... */
.controller-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(248, 240, 251, 0.9);
  backdrop-filter: blur(10px);
}

.controller-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 50px rgba(67, 56, 202, 0.2) !important;
}

.card-img-container {
  overflow: hidden;
  position: relative;
}

.card-img-top {
  transition: transform 0.3s ease;
  background: linear-gradient(135deg, var(--magnolia), var(--ash-gray));
}

.controller-card:hover .card-img-top {
  transform: scale(1.05);
}

.badge {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  padding: 0.5em 0.75em;
  border-radius: 8px;
}

.text-success {
  color: var(--electric-indigo) !important;
  font-family: 'Roboto Mono', monospace;
  font-weight: 600;
}
</style>
