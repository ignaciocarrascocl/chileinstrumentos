<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="text-center">
          <h1 class="display-4 fw-bold text-primary mb-2">
            <i class="bi bi-music-note-beamed me-3"></i>
            Base de Datos de Controladores MIDI
          </h1>
          <p class="lead text-muted">
            Explora nuestra extensa colección de controladores MIDI con filtros avanzados
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando controladores MIDI...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Error al cargar los datos: {{ error }}
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error">
      <!-- Filtros y Búsqueda -->
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="bi bi-funnel me-2"></i>
            Filtros y Búsqueda
          </h5>
        </div>
        <div class="card-body">
          <!-- Búsqueda avanzada -->
          <AdvancedSearch 
            v-model="searchQuery"
            :controllers="controllers"
            @quick-filter="handleQuickFilter"
          />

          <!-- Filtros tradicionales -->
          <div class="row mt-4">
            <div class="col-12 mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0 text-muted">
                  <i class="bi bi-sliders me-2"></i>
                  Filtros Avanzados
                </h6>
                <button 
                  @click="resetFilters" 
                  class="btn btn-sm btn-outline-secondary"
                >
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Limpiar Todo
                </button>
              </div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="row">
            <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
              <label class="form-label fw-semibold">Fabricante</label>
              <select v-model="selectedManufacturer" class="form-select">
                <option value="">Todos</option>
                <option v-for="manufacturer in manufacturers" :key="manufacturer" :value="manufacturer">
                  {{ manufacturer }}
                </option>
              </select>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
              <label class="form-label fw-semibold">Número de Teclas</label>
              <select v-model="selectedKeyCount" class="form-select">
                <option value="">Todas</option>
                <option v-for="count in keyCounts" :key="count" :value="count">
                  {{ count }} teclas
                </option>
              </select>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
              <label class="form-label fw-semibold">Tipo de Teclas</label>
              <select v-model="selectedKeyType" class="form-select">
                <option value="">Todos</option>
                <option v-for="type in keyTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
              <label class="form-label fw-semibold">Número de Pads</label>
              <select v-model="selectedPadCount" class="form-select">
                <option value="">Todos</option>
                <option v-for="count in padCounts" :key="count" :value="count">
                  {{ count }} pads
                </option>
              </select>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
              <label class="form-label fw-semibold">Año</label>
              <select v-model="selectedYear" class="form-select">
                <option value="">Todos</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>

            <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
              <label class="form-label fw-semibold">Items por página</label>
              <select v-model="itemsPerPage" class="form-select">
                <option :value="6">6</option>
                <option :value="12">12</option>
                <option :value="24">24</option>
                <option :value="48">48</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de resultados y ordenamiento -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="text-muted">
          Mostrando {{ paginatedControllers.length }} de {{ filteredControllers.length }} controladores
        </div>
        
        <div class="dropdown">
          <button 
            class="btn btn-outline-primary dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-sort-down me-2"></i>
            Ordenar por: {{ sortBy }}
            <i v-if="sortOrder === 'asc'" class="bi bi-arrow-up ms-1"></i>
            <i v-else class="bi bi-arrow-down ms-1"></i>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" @click="setSortBy('Model')" href="#">Modelo</a></li>
            <li><a class="dropdown-item" @click="setSortBy('Manufacturer-0')" href="#">Fabricante</a></li>
            <li><a class="dropdown-item" @click="setSortBy('Year')" href="#">Año</a></li>
            <li><a class="dropdown-item" @click="setSortBy('Street Price-0')" href="#">Precio</a></li>
            <li><a class="dropdown-item" @click="setSortBy('keys_count')" href="#">Número de Teclas</a></li>
          </ul>
        </div>
      </div>

      <!-- Grid de Controladores -->
      <transition-group name="fade-in" tag="div" class="row g-4 mb-4">
        <div 
          v-for="(controller, index) in paginatedControllers" 
          :key="controller.ID" 
          class="col-xl-3 col-lg-4 col-md-6"
          :style="{ animationDelay: `${index * 50}ms` }"
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
              <h6 class="card-title fw-bold text-primary mb-2">
                {{ controller.Model }}
              </h6>
              
              <p class="card-text text-muted small mb-2">
                {{ controller['Manufacturer-0'] }}
              </p>

              <p v-if="controller['Blog-headline-0']" class="card-text small text-truncate mb-3">
                {{ controller['Blog-headline-0'] }}
              </p>

              <!-- Especificaciones -->
              <div class="mt-auto">
                <div class="row g-1 mb-2">
                  <div v-if="controller.keys_count && controller.keys_count !== 'NA'" class="col-6">
                    <small class="text-muted d-block">
                      <i class="bi bi-piano me-1"></i>
                      {{ controller.keys_count }} teclas
                    </small>
                  </div>
                  <div v-if="controller.pads_count && controller.pads_count > 0" class="col-6">
                    <small class="text-muted d-block">
                      <i class="bi bi-grid-3x3 me-1"></i>
                      {{ controller.pads_count }} pads
                    </small>
                  </div>
                </div>

                <div v-if="controller.keys_type && controller.keys_type !== 'NA'" class="mb-2">
                  <span class="badge bg-light text-dark">
                    {{ controller.keys_type }}
                  </span>
                </div>

                <!-- Precio -->
                <div v-if="controller['Street Price-0']" class="mt-2">
                  <span class="h6 text-success fw-bold">
                    {{ controller['Street Price-0'] }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer de la tarjeta -->
            <div class="card-footer bg-transparent border-top-0">
              <button 
                @click="openModal(controller)" 
                class="btn btn-outline-primary btn-sm w-100"
                data-bs-toggle="modal" 
                data-bs-target="#controllerModal"
              >
                <i class="bi bi-info-circle me-2"></i>
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Estado sin resultados -->
      <div v-if="filteredControllers.length === 0" class="text-center py-5">
        <i class="bi bi-search display-1 text-muted mb-3"></i>
        <h4 class="text-muted">No se encontraron controladores</h4>
        <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
        <button @click="resetFilters" class="btn btn-primary">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Limpiar Filtros
        </button>
      </div>

      <!-- Paginación -->
      <nav v-if="totalPages > 1" aria-label="Navegación de páginas">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click="setPage(currentPage - 1)" href="#">
              <i class="bi bi-chevron-left"></i>
            </a>
          </li>
          
          <li 
            v-for="page in getVisiblePages()" 
            :key="page" 
            class="page-item" 
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" @click="setPage(page)" href="#">{{ page }}</a>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" @click="setPage(currentPage + 1)" href="#">
              <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal de detalles -->
    <ControllerDetailModal 
      v-if="selectedController" 
      :controller="selectedController" 
      modal-id="controllerModal"
    />
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMidiStore } from '@/stores/midiStore'
import ControllerDetailModal from '@/components/ControllerDetailModal.vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'

const midiStore = useMidiStore()
const selectedController = ref(null)

const {
  controllers,
  loading,
  error,
  searchQuery,
  selectedManufacturer,
  selectedKeyCount,
  selectedKeyType,
  selectedPadCount,
  selectedYear,
  sortBy,
  sortOrder,
  currentPage,
  itemsPerPage,
  manufacturers,
  keyCounts,
  keyTypes,
  padCounts,
  years,
  filteredControllers,
  totalPages,
  paginatedControllers
} = storeToRefs(midiStore)

const { loadControllers, resetFilters, setSortBy, setPage, setQuickFilters } = midiStore

// Cargar datos al montar el componente
onMounted(() => {
  loadControllers()
})

// Resetear página cuando cambian los filtros
watch([
  searchQuery,
  selectedManufacturer,
  selectedKeyCount,
  selectedKeyType,
  selectedPadCount,
  selectedYear,
  itemsPerPage
], () => {
  currentPage.value = 1
})

// Función para obtener la URL de la imagen
const getImageUrl = (controller) => {
  if (controller.ID) {
    // Usar imágenes locales basadas en el ID
    return `/downloaded_images/${controller.ID}.jpg`
  }
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
}

// Manejar errores de imagen
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg=='
}

// Obtener páginas visibles para la paginación
const getVisiblePages = () => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, currentPage.value - delta); 
       i <= Math.min(totalPages.value - 1, currentPage.value + delta); 
       i++) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (currentPage.value + delta < totalPages.value - 1) {
    rangeWithDots.push('...', totalPages.value)
  } else {
    if (totalPages.value > 1) {
      rangeWithDots.push(totalPages.value)
    }
  }

  return rangeWithDots.filter((page, index, array) => 
    array.indexOf(page) === index && page !== '...' || page === '...'
  )
}

// Abrir modal con detalles del controlador
const openModal = (controller) => {
  selectedController.value = controller
}

// Manejar filtros rápidos
const handleQuickFilter = (filters) => {
  setQuickFilters(filters)
}
</script>

<style scoped>
.controller-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(248, 240, 251, 0.9);
  backdrop-filter: blur(10px);
}

.controller-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 50px rgba(99, 32, 238, 0.2) !important;
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

.btn {
  transition: all 0.3s ease;
  font-weight: 500;
  border-radius: 10px;
}

.btn:hover {
  transform: translateY(-2px);
}

.form-select, .form-control {
  border-radius: 12px;
  border: 2px solid var(--ash-gray);
  background: rgba(248, 240, 251, 0.8);
  transition: all 0.3s ease;
}

.form-select:focus, .form-control:focus {
  border-color: var(--electric-indigo);
  box-shadow: 0 0 0 0.2rem rgba(99, 32, 238, 0.25);
  background: white;
}

.card {
  border-radius: 16px;
  border: none;
  background: rgba(248, 240, 251, 0.9);
  backdrop-filter: blur(10px);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  color: var(--raisin-black);
}

.dropdown-item:hover {
  background: var(--gradient-primary);
  color: white;
}

.text-success {
  color: var(--electric-indigo) !important;
  font-family: 'Roboto Mono', monospace;
  font-weight: 600;
}

/* Animaciones de transición */
.fade-in-enter-active {
  animation: fadeInUp 0.6s ease forwards;
}

.fade-in-leave-active {
  animation: fadeOut 0.3s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* Animación de entrada escalonada */
.col-xl-3:nth-child(1) { animation-delay: 0ms; }
.col-xl-3:nth-child(2) { animation-delay: 50ms; }
.col-xl-3:nth-child(3) { animation-delay: 100ms; }
.col-xl-3:nth-child(4) { animation-delay: 150ms; }
.col-xl-3:nth-child(5) { animation-delay: 200ms; }
.col-xl-3:nth-child(6) { animation-delay: 250ms; }
.col-xl-3:nth-child(7) { animation-delay: 300ms; }
.col-xl-3:nth-child(8) { animation-delay: 350ms; }
.col-xl-3:nth-child(9) { animation-delay: 400ms; }
.col-xl-3:nth-child(10) { animation-delay: 450ms; }
.col-xl-3:nth-child(11) { animation-delay: 500ms; }
.col-xl-3:nth-child(12) { animation-delay: 550ms; }

/* Efectos de carga de imágenes */
.card-img-top {
  background: linear-gradient(90deg, var(--magnolia) 25%, var(--ash-gray) 50%, var(--magnolia) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.card-img-top[src] {
  animation: none;
  background: none;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .controller-card:hover {
    transform: none;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .btn:hover {
    transform: none;
  }
}
</style>
