<template>
  <div class="container-fluid py-4">


    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border " role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando controladores MIDI...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class=".form-select:focus, .form-control:focus {
  border-color: var(--electric-indigo);
  box-shadow: 0 0 0 0.2rem rgba(67, 56, 202, 0.25);
  background: white;
}-exclamation-triangle me-2"></i>
      Error al cargar los datos: {{ error }}
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error">
      <!-- Filtros y Búsqueda -->
      <div class="card shadow-sm mb-4">

        <div class="card-body">
          <!-- Búsqueda avanzada -->
          <AdvancedSearch
            :controllers="controllers"
            @search="handleSearch"
            @filters-changed="handleFiltersChanged"
          />
        </div>
      </div>

      <!-- Información de resultados y ordenamiento -->
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <div class="text-muted">
          Mostrando {{ paginatedControllers.length }} de {{ filteredControllers.length }} controladores
        </div>

        <div class="d-flex align-items-center gap-3">
          <!-- Items por página -->
          <div class="d-flex align-items-center">
            <label class="form-label me-2 mb-0 text-muted small">Items por página:</label>
            <select v-model="itemsPerPage" class="form-select form-select-sm" style="width: auto;">
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="48">48</option>
            </select>
          </div>

          <!-- Ordenamiento -->
          <div class="dropdown">
            <button
              class="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-sort-down me-2"></i>
              Ordenar por: {{ sortByLabel }}
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
      </div>

      <!-- Grid de Controllers -->
      <transition-group name="list" tag="div" class="row g-4 mb-4" @enter="onEnter" @leave="onLeave">
        <div
          v-for="(controller, index) in paginatedControllers"
          :key="`${controller.image || controller.Model || index}-${currentPage}-${filteredControllers.length}`"
          class="col-xl-3 col-lg-4 col-md-6 controller-item"
          :data-index="index"
        >
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
                <h6 class="card-title fw-bold  mb-2">
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
                <div class="btn btn-outline-primary btn-sm w-100">
                  <i class="bi bi-info-circle me-2"></i>
                  Ver Detalles
                </div>
              </div>
            </div>
          </router-link>
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
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMidiStore } from '@/stores/midiStore'
import AdvancedSearch from '@/components/AdvancedSearch.vue'

const midiStore = useMidiStore()

// Estados de filtros avanzados locales
const advancedFilters = ref({
  manufacturers: [],
  keyCounts: [],
  keyTypes: [],
  padCounts: [],
  yearRange: { min: null, max: null },
  priceRange: { min: null, max: null },
  quickFilters: []
})

const {
  controllers,
  loading,
  error,
  searchQuery,
  sortBy,
  sortOrder,
  currentPage,
  itemsPerPage,
  filteredControllers,
  totalPages,
  paginatedControllers
} = storeToRefs(midiStore)

// Computed para etiquetas de ordenamiento
const sortByLabel = computed(() => {
  const labels = {
    'Model': 'Modelo',
    'Manufacturer-0': 'Fabricante',
    'Year': 'Año',
    'Street Price-0': 'Precio',
    'keys_count': 'Número de Teclas'
  }
  return labels[sortBy.value] || sortBy.value
})

const { loadControllers, setPage, setAdvancedFilters, setSortBy: setSortByStore } = midiStore

// Cargar datos al montar el componente
onMounted(() => {
  loadControllers()
})

// Resetear página cuando cambian los filtros
watch([searchQuery, itemsPerPage, advancedFilters], () => {
  currentPage.value = 1
}, { deep: true })

// Reset animations when data changes
watch([currentPage, filteredControllers], () => {
  // Force re-render of transition-group to restart animations
  // This ensures animations work properly on page changes
}, { flush: 'post' })

// Manejar búsqueda
const handleSearch = (query) => {
  searchQuery.value = query
}

// Manejar filtros avanzados
const handleFiltersChanged = (filters) => {
  // Convertir yearRange y priceRange de arrays a objetos para el store
  const formattedFilters = {
    ...filters,
    yearRange: filters.yearRange ? {
      min: filters.yearRange[0],
      max: filters.yearRange[1]
    } : { min: null, max: null },
    priceRange: filters.priceRange ? {
      min: filters.priceRange[0],
      max: filters.priceRange[1]
    } : { min: null, max: null }
  }

  advancedFilters.value = formattedFilters
  // Aplicar la lógica de filtrado en el store
  setAdvancedFilters(formattedFilters)
}

// Función para ordenamiento
const setSortBy = (field) => {
  setSortByStore(field)
}

// Función para obtener la URL de la imagen
const getImageUrl = (controller) => {
  if (controller.image) {
    // Usar imágenes locales basadas en el campo image
    return `/downloaded_images/${controller.image}`
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

// Animation handlers
const onEnter = (el, done) => {
  const index = el.dataset.index
  el.style.opacity = '0'
  el.style.transform = 'translateY(30px)'
  el.style.transition = 'all 0.6s ease'

  setTimeout(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }, index * 100)

  setTimeout(done, 600 + (index * 100))
}

const onLeave = (el, done) => {
  el.style.transition = 'all 0.3s ease'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-20px)'

  setTimeout(done, 300)
}
</script>

<style scoped>
/* Router link styling */
a.text-decoration-none {
  color: inherit;
}

a.text-decoration-none:hover {
  color: inherit;
}

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
  box-shadow: 0 0 0 0.2rem rgba(67, 56, 202, 0.25);
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

/* Transition group animations */
.controller-item {
  transition: all 0.6s ease;
}

.list-enter-active {
  transition: all 0.6s ease;
}

.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.list-move {
  transition: transform 0.5s ease;
}

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

  .controller-item {
    transition: all 0.4s ease;
  }
}
.page-link {
  color: var(--electric-indigo);
  text-decoration: none;
  transition: color 0.3s ease;
}

.page-link:hover {
  color: white;
}
.active>.page-link, .page-link.active{
  border: none;
}
.btn-outline-primary {
  border-color: var(--electric-indigo);
  color: var(--electric-indigo);
}
.btn-outline-primary:hover, .btn-outline-primary:focus, .btn-outline-primary:active, .btn-outline-primary.active {
  background-color: var(--electric-indigo);
  box-shadow: 0 4px 15px rgba(var(--bs-primary-rgb), 0.3);
  color: white;
  border: var(--electric-indigo);
}
</style>
