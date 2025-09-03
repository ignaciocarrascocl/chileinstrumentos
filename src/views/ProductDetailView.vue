<template>
  <div class="container-fluid py-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="row">
      <!-- Back Button -->
      <div class="col-12 mb-4">
        <button @click="goBack" class="btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
          Volver al Catálogo
        </button>
      </div>

      <!-- Product Image -->
      <div class="col-lg-6 mb-4">
        <div class="sticky-top" style="top: 100px;">
          <div class="card shadow-custom">
            <div class="card-body p-0">
              <img
                :src="getImageUrl(product)"
                :alt="product.Model"
                class="img-fluid w-100 rounded"
                style="max-height: 500px; object-fit: contain;"
                @error="handleImageError"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information -->
      <div class="col-lg-6">
        <!-- Basic Information -->
        <ProductBasicInfo :product="product" />

        <!-- Technical Specifications -->
        <ProductTechnicalSpecs :product="product" />

        <!-- Controls -->
        <ProductFeatureSection
          title="Controles"
          :items="product.controls"
          badge-class="bg-light text-dark"
        />

        <!-- Connectivity -->
        <ProductFeatureSection
          title="Conectividad"
          :items="product.connectivity"
          badge-class="bg-secondary text-white"
        />

        <!-- Power -->
        <ProductFeatureSection
          title="Alimentación"
          :items="product.power"
          badge-class="bg-primary text-white"
        />

        <!-- Actions -->
        <div class="card shadow-custom">
          <div class="card-body">
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <a
                v-if="product['parsed image']"
                :href="product['parsed image']"
                target="_blank"
                class="btn btn-outline-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
                Ver Imagen Original
              </a>
              <button @click="goBack" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
                Volver al Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music text-muted mb-3"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
      <h4 class="text-muted">Producto no encontrado</h4>
      <button @click="goBack" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music me-2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
        Volver al Catálogo
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductDetail } from '@/composables/useProductDetail'
import { useProductNavigation } from '@/composables/useProductNavigation'
import { useProductFormatting } from '@/composables/useProductFormatting'
import ProductBasicInfo from '@/components/ProductBasicInfo.vue'
import ProductTechnicalSpecs from '@/components/ProductTechnicalSpecs.vue'
import ProductFeatureSection from '@/components/ProductFeatureSection.vue'

const route = useRoute()

// ==========================================
// COMPOSABLES
// ==========================================

const { product, loading, error, loadProduct } = useProductDetail()
const { goBack } = useProductNavigation()
const { getImageUrl, handleImageError } = useProductFormatting()

// ==========================================
// COMPUTED PROPERTIES
// ==========================================

const productId = computed(() => route.params.id)

// ==========================================
// LIFECYCLE HOOKS
// ==========================================

onMounted(() => {
  loadProduct(productId.value)
})
</script>

<style scoped>
.card {
  border: none;
  border-radius: 16px;
  background: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 40px rgba(33, 26, 29, 0.15) !important;
}

.card-header {
  background: var(--gradient-primary) !important;
  color: white !important;
  border-bottom: none;
  border-radius: 16px 16px 0 0 !important;
  font-weight: 500;
}

.badge {
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  border-radius: 8px;
}

.text-primary {
  color: var(--electric-indigo) !important;
}

.text-success {
  color: var(--electric-indigo) !important;
  font-family: 'Roboto Mono', monospace;
  font-weight: 600;
}

.btn {
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.btn:hover {
  transform: translateY(-2px);
}

.img-fluid {
  border-radius: 12px;
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .sticky-top {
    position: relative !important;
  }

  .card:hover {
    transform: none;
  }

  .btn:hover {
    transform: none;
  }
}
</style>
