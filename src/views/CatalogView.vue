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
      <i class="bi bi-exclamation-triangle me-2"></i>
      Error al cargar los datos: {{ error }}
    </div>

    <!-- Main Content -->
    <div v-if="!loading && !error" class="row">
      <!-- Left Sidebar - Filters (Desktop) -->
      <div class="col-lg-4 col-xl-3 mb-4">
        <div class="filters-sidebar">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-transparent border-bottom">
              <h6 class="mb-0 fw-bold">
                <i class="bi bi-funnel me-2"></i>
                Filtros
              </h6>
            </div>
            <div class="card-body p-3">
              <!-- Búsqueda avanzada -->
              <AdvancedSearch
                :controllers="controllers"
                @search="handleSearch"
                @filters-changed="handleFiltersChanged"
                :sidebar-mode="true"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content Area - Results -->
      <div class="col-lg-8 col-xl-9">
        <!-- Results Header -->
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
                class="btn btn-details dropdown-toggle"
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
            <ControllerCard :controller="controller" />
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
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMidiStore } from '@/stores/midiStore'
import AdvancedSearch from '@/components/AdvancedSearch.vue'
import ControllerCard from '@/components/ControllerCard.vue'
import { useFilters } from '@/composables/useFilters'
import { usePagination } from '@/composables/usePagination'
import { useAnimations } from '@/composables/useAnimations'

// ==========================================
// STORE AND REACTIVE STATE
// ==========================================

const midiStore = useMidiStore()
const { loadControllers, setPage, setAdvancedFilters, setSortBy: setSortByStore } = midiStore

// Store state refs
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

// ==========================================
// COMPOSABLES
// ==========================================

const { advancedFilters, handleSearch, handleFiltersChanged, resetFilters } = useFilters(
  searchQuery,
  setAdvancedFilters
)

const { getVisiblePages } = usePagination(currentPage, totalPages)
const { onEnter, onLeave } = useAnimations()

// ==========================================
// COMPUTED PROPERTIES
// ==========================================

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

// ==========================================
// LIFECYCLE HOOKS
// ==========================================

onMounted(() => {
  loadControllers()
})

// ==========================================
// WATCHERS
// ==========================================

// Reset page when filters change
watch([searchQuery, itemsPerPage, advancedFilters], () => {
  currentPage.value = 1
}, { deep: true })

// Force re-render animations on data changes
watch([currentPage, filteredControllers], () => {
  // Ensures animations work properly on page changes
}, { flush: 'post' })

// ==========================================
// SORTING HANDLERS
// ==========================================

const setSortBy = (field) => {
  setSortByStore(field)
}
</script>

<style scoped>
.btn-details {
  border: var(--electric-indigo);
  color: white;
}
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

/* Info boxes styling */
.info-boxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-box {
  background: rgba(67, 56, 202, 0.05);
  border: 1px solid rgba(67, 56, 202, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  border-left: 3px solid var(--electric-indigo);
}

.info-box-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--electric-indigo);
  font-size: 0.875rem;
}

.info-box-content {
  font-size: 0.875rem;
  color: var(--raisin-black);
}

.connections-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.connections-badges .badge {
  font-size: 0.7rem;
}
</style>
