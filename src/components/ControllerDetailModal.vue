<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold text-primary">
            <i class="bi bi-music-note-beamed me-2"></i>
            {{ controller.Model }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <!-- Imagen -->
            <div class="col-md-6 mb-3">
              <div class="text-center">
                <img
                  :src="getImageUrl(controller)"
                  :alt="controller.Model"
                  class="img-fluid rounded shadow-sm"
                  style="max-height: 300px; object-fit: cover;"
                  @error="handleImageError"
                >
              </div>
            </div>

            <!-- Información detallada -->
            <div class="col-md-6">
              <div class="mb-3">
                <h6 class="text-muted mb-1">Fabricante</h6>
                <p class="h6 text-primary">{{ controller['Manufacturer-0'] || 'No especificado' }}</p>
              </div>

              <div v-if="controller['Blog-headline-0']" class="mb-3">
                <h6 class="text-muted mb-1">Descripción</h6>
                <p class="text-dark">{{ controller['Blog-headline-0'] }}</p>
              </div>

              <div v-if="controller['Street Price-0']" class="mb-3">
                <h6 class="text-muted mb-1">Precio</h6>
                <p class="h5 text-success fw-bold">{{ controller['Street Price-0'] }}</p>
              </div>

              <div v-if="controller.Year" class="mb-3">
                <h6 class="text-muted mb-1">Año</h6>
                <span class="badge bg-primary fs-6">{{ controller.Year }}</span>
              </div>
            </div>
          </div>

          <!-- Especificaciones técnicas -->
          <hr class="my-4">
          <h6 class="text-muted mb-3">
            <i class="bi bi-gear me-2"></i>
            Especificaciones Técnicas
          </h6>

          <div class="row g-3">
            <div v-if="controller.keys_count && controller.keys_count !== 'NA'" class="col-md-6">
              <div class="d-flex align-items-center">
                <i class="bi bi-piano text-primary me-2"></i>
                <div>
                  <small class="text-muted d-block">Número de Teclas</small>
                  <span class="fw-semibold">{{ controller.keys_count }}</span>
                </div>
              </div>
            </div>

            <div v-if="controller.keys_type && controller.keys_type !== 'NA'" class="col-md-6">
              <div class="d-flex align-items-center">
                <i class="bi bi-keyboard text-primary me-2"></i>
                <div>
                  <small class="text-muted d-block">Tipo de Teclas</small>
                  <span class="fw-semibold">{{ controller.keys_type }}</span>
                </div>
              </div>
            </div>

            <div v-if="controller.pads_count && controller.pads_count > 0" class="col-md-6">
              <div class="d-flex align-items-center">
                <i class="bi bi-grid-3x3 text-primary me-2"></i>
                <div>
                  <small class="text-muted d-block">Número de Pads</small>
                  <span class="fw-semibold">{{ controller.pads_count }}</span>
                </div>
              </div>
            </div>

            <div v-if="controller.weight_lbs && controller.weight_lbs !== 'NA'" class="col-md-6">
              <div class="d-flex align-items-center">
                <i class="bi bi-speedometer text-primary me-2"></i>
                <div>
                  <small class="text-muted d-block">Peso</small>
                  <span class="fw-semibold">{{ controller.weight_lbs }} lbs</span>
                </div>
              </div>
            </div>

            <div v-if="controller.dimensions_inches && controller.dimensions_inches !== 'NA'" class="col-md-12">
              <div class="d-flex align-items-center">
                <i class="bi bi-rulers text-primary me-2"></i>
                <div>
                  <small class="text-muted d-block">Dimensiones (Largo × Ancho × Alto)</small>
                  <span class="fw-semibold">{{ formatDimensions(controller.dimensions_inches) }} pulgadas</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Controles -->
          <div v-if="controller.controls && controller.controls.length > 0" class="mt-4">
            <h6 class="text-muted mb-3">
              <i class="bi bi-sliders text-primary me-2"></i>
              Controles
            </h6>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="control in controller.controls"
                :key="control"
                class="badge bg-light text-dark border"
              >
                {{ control }}
              </span>
            </div>
          </div>

          <!-- Conectividad -->
          <div v-if="controller.connectivity && controller.connectivity.length > 0" class="mt-4">
            <h6 class="text-muted mb-3">
              <i class="bi bi-plug text-primary me-2"></i>
              Conectividad
            </h6>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="connection in controller.connectivity"
                :key="connection"
                class="badge bg-info text-dark"
              >
                {{ connection }}
              </span>
            </div>
          </div>

          <!-- Alimentación -->
          <div v-if="controller.power && controller.power.length > 0" class="mt-4">
            <h6 class="text-muted mb-3">
              <i class="bi bi-lightning text-primary me-2"></i>
              Alimentación
            </h6>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="powerType in controller.power"
                :key="powerType"
                class="badge bg-warning text-dark"
              >
                {{ powerType }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cerrar
          </button>
          <a
            v-if="controller['parsed image']"
            :href="controller['parsed image']"
            target="_blank"
            class="btn btn-primary"
          >
            <i class="bi bi-box-arrow-up-right me-2"></i>
            Ver Imagen Original
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  controller: {
    type: Object,
    required: true
  },
  modalId: {
    type: String,
    default: 'controllerModal'
  }
})

// Función para obtener la URL de la imagen
const getImageUrl = (controller) => {
  if (controller.image) {
    // Usar imágenes locales basadas en el campo image
    return `/downloaded_images/${controller.image}`
  }
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
}

// Manejar errores de imagen
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
}

// Formatear dimensiones
const formatDimensions = (dimensions) => {
  if (!dimensions || dimensions === 'NA') return 'No especificado'

  const parts = dimensions.split(';')
  if (parts.length === 3) {
    return `${parts[0]} × ${parts[1]} × ${parts[2]}`
  }
  return dimensions
}
</script>

<style scoped>
.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 1rem 3rem rgba(33, 26, 29, 0.175);
  background: rgba(248, 240, 251, 0.95);
  backdrop-filter: blur(15px);
}

.modal-header {
  border-bottom: 1px solid var(--ash-gray);
  padding: 1.5rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-body {
  padding: 1.5rem;
  color: var(--raisin-black);
}

.modal-footer {
  border-top: 1px solid var(--ash-gray);
  padding: 1rem 1.5rem;
  background: rgba(248, 240, 251, 0.8);
  border-radius: 0 0 16px 16px;
}

.badge {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  padding: 0.5em 0.75em;
  border-radius: 8px;
}

.img-fluid {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(33, 26, 29, 0.1);
}

.text-primary {
  color: var(--electric-indigo) !important;
}

.text-success {
  color: var(--electric-indigo) !important;
  font-family: 'Roboto Mono', monospace;
  font-weight: 600;
}

.btn-secondary {
  background: var(--ash-gray);
  border-color: var(--ash-gray);
  color: var(--raisin-black);
}

.btn-secondary:hover {
  background: var(--medium-slate-blue);
  border-color: var(--medium-slate-blue);
  color: white;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }
}
</style>
