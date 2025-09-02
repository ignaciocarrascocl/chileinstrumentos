<template>
  <div class="container-fluid py-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando detalles del producto...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="row">
      <!-- Back Button -->
      <div class="col-12 mb-4">
        <button @click="goBack" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left me-2"></i>
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
        <div class="card shadow-custom mb-4">
          <div class="card-header">
            <h1 class="h3 mb-0 text-white">
              <i class="bi bi-music-note-beamed me-2"></i>
              {{ product.Model }}
            </h1>
          </div>
          <div class="card-body">
            <!-- Basic Information -->
            <div class="mb-4">
              <h6 class="text-muted mb-1">Fabricante</h6>
              <p class="h5 text-primary mb-3">{{ product['Manufacturer-0'] || 'No especificado' }}</p>

              <div v-if="product['Blog-headline-0']" class="mb-3">
                <h6 class="text-muted mb-1">Descripción</h6>
                <p class="text-dark">{{ product['Blog-headline-0'] }}</p>
              </div>

              <div class="row">
                <div v-if="product['Street Price-0']" class="col-md-6 mb-3">
                  <h6 class="text-muted mb-1">Precio</h6>
                  <p class="h4 text-success fw-bold">{{ product['Street Price-0'] }}</p>
                </div>

                <div v-if="product.Year" class="col-md-6 mb-3">
                  <h6 class="text-muted mb-1">Año</h6>
                  <span class="badge bg-primary fs-6">{{ product.Year }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Specifications -->
        <div class="card shadow-custom mb-4">
          <div class="card-header">
            <h5 class="mb-0 text-white">
              <i class="bi bi-gear me-2"></i>
              Especificaciones Técnicas
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div v-if="product.keys_count && product.keys_count !== 'NA'" class="col-md-6">
                <div class="d-flex align-items-center">
                  <i class="bi bi-piano text-primary me-3 fs-4"></i>
                  <div>
                    <small class="text-muted d-block">Número de Teclas</small>
                    <span class="fw-semibold fs-5">{{ product.keys_count }}</span>
                  </div>
                </div>
              </div>

              <div v-if="product.keys_type && product.keys_type !== 'NA'" class="col-md-6">
                <div class="d-flex align-items-center">
                  <i class="bi bi-keyboard text-primary me-3 fs-4"></i>
                  <div>
                    <small class="text-muted d-block">Tipo de Teclas</small>
                    <span class="fw-semibold">{{ product.keys_type }}</span>
                  </div>
                </div>
              </div>

              <div v-if="product.pads_count && product.pads_count > 0" class="col-md-6">
                <div class="d-flex align-items-center">
                  <i class="bi bi-grid-3x3 text-primary me-3 fs-4"></i>
                  <div>
                    <small class="text-muted d-block">Número de Pads</small>
                    <span class="fw-semibold fs-5">{{ product.pads_count }}</span>
                  </div>
                </div>
              </div>

              <div v-if="product.weight_lbs && product.weight_lbs !== 'NA'" class="col-md-6">
                <div class="d-flex align-items-center">
                  <i class="bi bi-speedometer text-primary me-3 fs-4"></i>
                  <div>
                    <small class="text-muted d-block">Peso</small>
                    <span class="fw-semibold">{{ product.weight_lbs }} lbs</span>
                  </div>
                </div>
              </div>

              <div v-if="product.dimensions_inches && product.dimensions_inches !== 'NA'" class="col-12">
                <div class="d-flex align-items-center">
                  <i class="bi bi-rulers text-primary me-3 fs-4"></i>
                  <div>
                    <small class="text-muted d-block">Dimensiones (Largo × Ancho × Alto)</small>
                    <span class="fw-semibold">{{ formatDimensions(product.dimensions_inches) }} pulgadas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div v-if="product.controls && product.controls.length > 0" class="card shadow-custom mb-4">
          <div class="card-header">
            <h5 class="mb-0 text-white">
              <i class="bi bi-sliders me-2"></i>
              Controles
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="control in product.controls"
                :key="control"
                class="badge bg-light text-dark border fs-6 px-3 py-2"
              >
                {{ control }}
              </span>
            </div>
          </div>
        </div>

        <!-- Connectivity -->
        <div v-if="product.connectivity && product.connectivity.length > 0" class="card shadow-custom mb-4">
          <div class="card-header">
            <h5 class="mb-0 text-white">
              <i class="bi bi-plug me-2"></i>
              Conectividad
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="connection in product.connectivity"
                :key="connection"
                class="badge bg-info text-dark fs-6 px-3 py-2"
              >
                {{ connection }}
              </span>
            </div>
          </div>
        </div>

        <!-- Power -->
        <div v-if="product.power && product.power.length > 0" class="card shadow-custom mb-4">
          <div class="card-header">
            <h5 class="mb-0 text-white">
              <i class="bi bi-lightning me-2"></i>
              Alimentación
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="powerType in product.power"
                :key="powerType"
                class="badge bg-warning text-dark fs-6 px-3 py-2"
              >
                {{ powerType }}
              </span>
            </div>
          </div>
        </div>

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
                <i class="bi bi-box-arrow-up-right me-2"></i>
                Ver Imagen Original
              </a>
              <button @click="goBack" class="btn btn-primary">
                <i class="bi bi-arrow-left me-2"></i>
                Volver al Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-5">
      <i class="bi bi-search display-1 text-muted mb-3"></i>
      <h4 class="text-muted">Producto no encontrado</h4>
      <p class="text-muted">El producto que buscas no existe o ha sido eliminado.</p>
      <button @click="goBack" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2"></i>
        Volver al Catálogo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMidiStore } from '@/stores/midiStore'

const route = useRoute()
const router = useRouter()
const midiStore = useMidiStore()

const product = ref(null)
const loading = ref(true)
const error = ref(null)

// Get product ID from route params
const productId = computed(() => route.params.id)

// Function to get image URL
const getImageUrl = (product) => {
  if (product.image) {
    return `/downloaded_images/${product.image}`
  }
  
  if (product['parsed image']) {
    return product['parsed image']
  }
  
  // Fallback placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
}

// Format dimensions
const formatDimensions = (dimensions) => {
  if (!dimensions || dimensions === 'NA') return 'No especificado'

  const parts = dimensions.split(';')
  if (parts.length === 3) {
    return `${parts[0]} × ${parts[1]} × ${parts[2]}`
  }
  return dimensions
}

// Load product data
const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    // Try to get product by ID from Supabase first
    const foundProduct = await midiStore.getProductById(productId.value)

    if (foundProduct) {
      product.value = foundProduct
    } else {
      // Fallback: If store doesn't have controllers loaded, load them first and search by image field
      if (midiStore.controllers.length === 0) {
        await midiStore.loadControllers()
      }

      // Find product by image field (for backward compatibility)
      const fallbackProduct = midiStore.controllers.find(controller => 
        controller.image === productId.value
      )

      if (fallbackProduct) {
        product.value = fallbackProduct
      } else {
        error.value = 'Producto no encontrado'
      }
    }
  } catch (err) {
    error.value = `Error al cargar el producto: ${err.message}`
  } finally {
    loading.value = false
  }
}

// Navigation functions
const goBack = () => {
  router.push({ name: 'catalog' })
}

// Load product on component mount
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.card {
  border: none;
  border-radius: 16px;
  background: rgba(248, 240, 251, 0.9);
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
