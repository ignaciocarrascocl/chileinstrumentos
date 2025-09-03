<template>
  <div class="advanced-search">
    <!-- Barra de búsqueda principal con Fuse.js -->
    <div class="search-section mb-4">
      <div class="input-group input-group-lg">
        <span class="input-group-text bg-primary text-white">
          <i class="bi bi-search"></i>
        </span>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          class="form-control"
          placeholder="Buscar controladores MIDI por modelo, fabricante, características..."
          autocomplete="off"
        >
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="btn btn-outline-secondary"
          type="button"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Sugerencias de búsqueda -->
      <div v-if="searchSuggestions.length > 0" class="suggestions-list mt-2">
        <div class="list-group">
          <button
            v-for="(suggestion, index) in searchSuggestions.slice(0, 5)"
            :key="index"
            @click="applySuggestion(suggestion)"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{{ suggestion.item.Model }}</strong>
              <small class="text-muted d-block">{{ suggestion.item['Manufacturer-0'] }}</small>
            </div>
            <span class="badge bg-primary rounded-pill">{{ Math.round((1 - suggestion.score) * 100) }}% match</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros Avanzados -->
    <div class="filters-section">
      <div class="filters-content">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center gap-2">
            <span v-if="activeFiltersCount > 0" class="badge bg-info">
              {{ activeFiltersCount }} filtro{{ activeFiltersCount !== 1 ? 's' : '' }} activo{{ activeFiltersCount !== 1 ? 's' : '' }}
            </span>
            <button @click="clearAllFilters" class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Limpiar
            </button>
          </div>
        </div>

        <div class="row g-4">
          <!-- Fabricantes -->
          <div class="col-12">
            <label class="form-label fw-semibold">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-factory-icon lucide-factory"><path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/></svg>
              Fabricantes
            </label>
            <MultiSelect
              v-model="selectedManufacturers"
              :options="manufacturerOptions"
              placeholder="Seleccionar fabricantes..."
              @update:modelValue="updateFilters"
            />
          </div>

          <!-- Número de Teclas -->
          <div class="col-12">
            <label class="form-label fw-semibold">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-keyboard-music-icon lucide-keyboard-music"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h4"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M2 12h20"/><path d="M6 12v4"/><path d="M10 12v4"/><path d="M14 12v4"/><path d="M18 12v4"/></svg>
              Número de Teclas
            </label>
            <MultiSelect
              v-model="selectedKeyCounts"
              :options="keyCountOptions"
              placeholder="Seleccionar teclas..."
              @update:modelValue="updateFilters"
            />
          </div>

          <!-- Tipo de Teclas -->
          <div class="col-12">
            <label class="form-label fw-semibold">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-blend-icon lucide-blend"><circle cx="9" cy="9" r="7"/><circle cx="15" cy="15" r="7"/></svg>
              Tipo de Teclas
            </label>
            <MultiSelect
              v-model="selectedKeyTypes"
              :options="keyTypeOptions"
              placeholder="Seleccionar tipos..."
              @update:modelValue="updateFilters"
            />
          </div>

          <!-- Número de Pads -->
          <div class="col-12">
            <label class="form-label fw-semibold">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid-icon lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              Número de Pads
            </label>
            <MultiSelect
              v-model="selectedPadCounts"
              :options="padCountOptions"
              placeholder="Seleccionar pads..."
              @update:modelValue="updateFilters"
            />
          </div>
        </div>

        <!-- Rangos -->
        <div class="row g-4 mt-2">
          <!-- Rango de Años -->
          <div class="col-12">
            <label class="form-label fw-semibold">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar1-icon lucide-calendar-1"><path d="M11 14h1v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>
              Rango de Años ({{ minYear }} - {{ maxYear }})
            </label>
            <RangeSlider
              v-model="yearRange"
              :min="minYear"
              :max="maxYear"
              :step="1"
              @update:modelValue="updateFilters"
            />
          </div>

          <!-- Rango de Precios -->
          <div class="col-12">
            <label class="form-label fw-semibold">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
              Rango de Precios (${{ minPrice }} - ${{ maxPrice }})
            </label>
            <RangeSlider
              v-model="priceRange"
              :min="minPrice"
              :max="maxPrice"
              :step="50"
              @update:modelValue="updateFilters"
            />
          </div>
        </div>

        <!-- Filtros Rápidos -->
        <div class="mt-4">
          <label class="form-label fw-semibold">Filtros Rápidos</label>
          <div class="d-flex flex-wrap gap-2">
            <button
              v-for="filter in quickFilters"
              :key="filter.key"
              @click="toggleQuickFilter(filter)"
              class="btn btn-sm"
              :class="filter.active ? 'btn-primary' : 'btn-outline-primary'"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Fuse from 'fuse.js'
import { useDebounce } from '@vueuse/core'
import MultiSelect from './ui/MultiSelect.vue'
import RangeSlider from './ui/RangeSlider.vue'

const props = defineProps({
  controllers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search', 'filtersChanged'])

// Estados reactivos
const searchQuery = ref('')
const selectedManufacturers = ref([])
const selectedKeyCounts = ref([])
const selectedKeyTypes = ref([])
const selectedPadCounts = ref([])
const yearRange = ref([1980, new Date().getFullYear()])
const priceRange = ref([0, 5000])

// Filtros rápidos
const quickFilters = ref([
  { key: 'hasKeys', label: 'Con Teclas', active: false },
  { key: 'hasPads', label: 'Con Pads', active: false },
  { key: 'mini', label: 'Teclas Mini', active: false },
  { key: 'weighted', label: 'Teclas Pesadas', active: false },
  { key: 'hasMidi', label: 'Con MIDI', active: false },
  { key: 'hasUsb', label: 'Con USB', active: false },
  { key: 'wireless', label: 'Inalámbrico', active: false },
  { key: 'battery', label: 'A Batería', active: false },
  { key: 'transportControls', label: 'Controles de Transporte', active: false },
  { key: 'modWheel', label: 'Rueda de Modulación', active: false }
])

// Búsqueda debounced
const debouncedSearchQuery = useDebounce(searchQuery, 300)

// Instancia de Fuse.js para búsqueda inteligente
const fuseOptions = {
  keys: [
    { name: 'Model', weight: 0.4 },
    { name: 'Manufacturer-0', weight: 0.3 },
    { name: 'Blog-headline-0', weight: 0.2 },
    { name: 'keys_type', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
}

const fuse = computed(() => new Fuse(props.controllers, fuseOptions))

const searchSuggestions = computed(() => {
  if (!debouncedSearchQuery.value || debouncedSearchQuery.value.length < 2) {
    return []
  }

  const results = fuse.value.search(debouncedSearchQuery.value)
  return results.slice(0, 5) // Limitar a 5 sugerencias
})

// Opciones para los selectores múltiples
const manufacturerOptions = computed(() => {
  const manufacturers = [...new Set(
    props.controllers
      .map(c => c['Manufacturer-0'])
      .filter(Boolean)
  )].sort()

  return manufacturers.map(m => ({ value: m, label: m }))
})

const keyCountOptions = computed(() => {
  const counts = [...new Set(
    props.controllers
      .map(c => parseInt(c.keys_count))
      .filter(c => !isNaN(c) && c > 0)
  )].sort((a, b) => a - b)

  return counts.map(c => ({ value: c, label: `${c} teclas` }))
})

const keyTypeOptions = computed(() => {
  const types = [...new Set(
    props.controllers
      .map(c => c.keys_type)
      .filter(c => c && c !== 'NA')
  )].sort()

  return types.map(t => ({ value: t, label: t }))
})

const padCountOptions = computed(() => {
  const counts = [...new Set(
    props.controllers
      .map(c => parseInt(c.pads_count))
      .filter(c => !isNaN(c) && c > 0)
  )].sort((a, b) => a - b)

  return counts.map(c => ({ value: c, label: `${c} pads` }))
})

// Rangos mín/máx
const minYear = computed(() => {
  const years = props.controllers
    .map(c => parseInt(c.Year))
    .filter(y => !isNaN(y) && y > 0)
  return years.length > 0 ? Math.min(...years) : 1980
})

const maxYear = computed(() => {
  const years = props.controllers
    .map(c => parseInt(c.Year))
    .filter(y => !isNaN(y) && y > 0)
  return years.length > 0 ? Math.max(...years) : new Date().getFullYear()
})

const minPrice = computed(() => {
  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'NA') return NaN
    // Remover $ y convertir a número
    const cleaned = priceStr.replace(/[$,]/g, '')
    return parseFloat(cleaned)
  }

  const prices = props.controllers
    .map(c => parsePrice(c['Street Price-0']))
    .filter(p => !isNaN(p) && p > 0)
  return prices.length > 0 ? Math.min(...prices) : 50
})

const maxPrice = computed(() => {
  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'NA') return NaN
    // Remover $ y convertir a número
    const cleaned = priceStr.replace(/[$,]/g, '')
    return parseFloat(cleaned)
  }

  const prices = props.controllers
    .map(c => parsePrice(c['Street Price-0']))
    .filter(p => !isNaN(p) && p > 0)
  return prices.length > 0 ? Math.max(...prices) : 5000
})

// Contador de filtros activos
const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedManufacturers.value.length > 0) count++
  if (selectedKeyCounts.value.length > 0) count++
  if (selectedKeyTypes.value.length > 0) count++
  if (selectedPadCounts.value.length > 0) count++
  if (yearRange.value[0] > minYear.value || yearRange.value[1] < maxYear.value) count++
  if (priceRange.value[0] > minPrice.value || priceRange.value[1] < maxPrice.value) count++
  count += quickFilters.value.filter(f => f.active).length
  return count
})

// Inicializar rangos cuando se cargan los datos
watch([minYear, maxYear, minPrice, maxPrice], () => {
  // Solo inicializar si son los valores por defecto
  if (yearRange.value[0] === 1980 && yearRange.value[1] === new Date().getFullYear()) {
    yearRange.value = [minYear.value, maxYear.value]
  }
  if (priceRange.value[0] === 0 && priceRange.value[1] === 5000) {
    priceRange.value = [minPrice.value, maxPrice.value]
  }
}, { immediate: true })

// Métodos
const handleSearch = () => {
  emit('search', searchQuery.value)
}

const applySuggestion = (suggestion) => {
  searchQuery.value = suggestion.item.Model
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

const toggleQuickFilter = (filter) => {
  filter.active = !filter.active
  updateFilters()
}

const updateFilters = () => {
  // Solo enviar rangos si son diferentes a los valores por defecto
  const isYearRangeDefault = yearRange.value[0] === minYear.value && yearRange.value[1] === maxYear.value
  const isPriceRangeDefault = priceRange.value[0] === minPrice.value && priceRange.value[1] === maxPrice.value

  const filters = {
    search: searchQuery.value,
    manufacturers: selectedManufacturers.value,
    keyCounts: selectedKeyCounts.value,
    keyTypes: selectedKeyTypes.value,
    padCounts: selectedPadCounts.value,
    yearRange: isYearRangeDefault ? null : yearRange.value,
    priceRange: isPriceRangeDefault ? null : priceRange.value,
    quickFilters: quickFilters.value.filter(f => f.active)
  }

  emit('filtersChanged', filters)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedManufacturers.value = []
  selectedKeyCounts.value = []
  selectedKeyTypes.value = []
  selectedPadCounts.value = []
  yearRange.value = [minYear.value, maxYear.value]
  priceRange.value = [minPrice.value, maxPrice.value]
  quickFilters.value.forEach(f => f.active = false)
  updateFilters()
}

// Watchers para emitir cambios
watch([selectedManufacturers, selectedKeyCounts, selectedKeyTypes, selectedPadCounts, yearRange, priceRange], updateFilters, { deep: true })
watch(debouncedSearchQuery, () => emit('search', searchQuery.value))

onMounted(() => {
  updateFilters()
})
</script>

<style scoped>
.advanced-search {
  position: relative;
}

.search-section .input-group {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.search-section .form-control {
  border: none;
  padding: 12px 16px;
  font-size: 1.1rem;
}

.search-section .form-control:focus {
  box-shadow: none;
  border-color: transparent;
}

.search-section .input-group-text {
  border: none;
  background: linear-gradient(135deg, var(--bs-primary), var(--bs-purple));
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1050;
}

.suggestions-list .list-group {
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  border: none;
}

.suggestions-list .list-group-item {
  border: none;
  transition: all 0.3s ease;
}

.suggestions-list .list-group-item:hover {
  background-color: var(--bs-primary);
  color: white;
}

.filters-section .filters-content {
  padding: 1rem 0;
}

.filters-section .card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.filters-section .card-header {
  background: linear-gradient(135deg, var(--bs-light), var(--bs-gray-100));
  border: none;
  border-radius: 16px 16px 0 0;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
}

.badge {
  font-size: 0.75rem;
}

/* Quick filters */
.filters-section .btn-outline-primary {
  border-radius: 20px;
  transition: all 0.3s ease;
  border-color: var(--electric-indigo);
  color: var(--electric-indigo);
}

.filters-section .btn-outline-primary:hover,
.filters-section .btn-primary {
  transform: translateY(-2px);
  background-color: var(--electric-indigo);
  box-shadow: 0 4px 15px rgba(var(--bs-primary-rgb), 0.3);
  color: white;
}

/* Form controls */
.form-label {
  color: var(--bs-gray-700);
  margin-bottom: 0.5rem;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Range sliders */
.form-range::-webkit-slider-thumb {
  background: var(--bs-primary);
}

.form-range::-moz-range-thumb {
  background: var(--bs-primary);
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section .card-body .row > div {
    margin-bottom: 1rem;
  }

  .search-section .input-group {
    border-radius: 8px;
  }

  .filters-section .btn-outline-primary:hover,
  .filters-section .btn-primary {
    transform: none;
  }
}
</style>
