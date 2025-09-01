<template>
  <div class="advanced-search">
    <div class="search-input-container position-relative">
      <div class="input-group">
        <span class="input-group-text bg-primary text-white border-primary">
          <i class="bi bi-search"></i>
        </span>
        <input 
          v-model="localSearchQuery"
          @input="handleInput"
          @focus="showSuggestions = true"
          @keydown="handleKeyDown"
          type="text" 
          class="form-control border-primary"
          :placeholder="placeholder"
          autocomplete="off"
        >
        <button 
          v-if="localSearchQuery"
          @click="clearSearch"
          class="btn btn-outline-secondary"
          type="button"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Sugerencias de autocompletado -->
      <div 
        v-if="showSuggestions && suggestions.length > 0" 
        class="suggestions-dropdown position-absolute w-100 mt-1"
      >
        <div class="list-group shadow-lg">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="list-group-item list-group-item-action d-flex align-items-center"
            :class="{ active: selectedSuggestionIndex === index }"
            type="button"
          >
            <i :class="suggestion.icon" class="me-2 text-primary"></i>
            <div class="flex-grow-1">
              <div class="fw-semibold">{{ suggestion.title }}</div>
              <small class="text-muted">{{ suggestion.category }}</small>
            </div>
            <small class="text-muted">{{ suggestion.count }} resultados</small>
          </button>
        </div>
      </div>
    </div>

    <!-- Filtros rápidos -->
    <div class="quick-filters mt-3">
      <div class="d-flex flex-wrap gap-2">
        <span class="text-muted me-2">Filtros rápidos:</span>
        <button
          v-for="filter in quickFilters"
          :key="filter.key"
          @click="applyQuickFilter(filter)"
          class="btn btn-sm btn-outline-primary quick-filter-btn"
          :class="{ active: isQuickFilterActive(filter) }"
        >
          <i :class="filter.icon" class="me-1"></i>
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Búsquedas recientes -->
    <div v-if="recentSearches.length > 0" class="recent-searches mt-3">
      <div class="d-flex align-items-center mb-2">
        <i class="bi bi-clock-history text-muted me-2"></i>
        <span class="text-muted small">Búsquedas recientes:</span>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <div
          v-for="(search, index) in recentSearches"
          :key="index"
          class="recent-search-item d-flex align-items-center"
        >
          <button
            @click="selectRecentSearch(search)"
            class="btn btn-sm btn-light recent-search-btn"
          >
            {{ search }}
          </button>
          <button
            @click="removeRecentSearch(index)"
            class="btn btn-sm ms-1 p-0 remove-btn"
            style="background: none; border: none;"
          >
            <i class="bi bi-x text-muted"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar controladores MIDI...'
  },
  controllers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'quickFilter'])

const localSearchQuery = ref(props.modelValue)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)

// Almacenar búsquedas recientes en localStorage
const recentSearches = useLocalStorage('midi-recent-searches', [])

// Filtros rápidos predefinidos
const quickFilters = [
  { key: 'hasKeys', label: 'Con Teclas', icon: 'bi bi-piano', filter: (c) => c.keys_count && c.keys_count !== 'NA' && c.keys_count > 0 },
  { key: 'hasPads', label: 'Con Pads', icon: 'bi bi-grid-3x3', filter: (c) => c.pads_count && c.pads_count > 0 },
  { key: 'mini', label: 'Mini', icon: 'bi bi-phone', filter: (c) => c.keys_type === 'mini' },
  { key: 'weighted', label: 'Teclas Pesadas', icon: 'bi bi-speedometer2', filter: (c) => c.keys_type?.includes('weighted') },
  { key: 'usb', label: 'USB', icon: 'bi bi-usb-symbol', filter: (c) => c.connectivity?.includes('USB') },
  { key: 'wireless', label: 'Inalámbrico', icon: 'bi bi-wifi', filter: (c) => c.connectivity?.includes('Bluetooth') || c.connectivity?.includes('Wireless') }
]

const activeQuickFilters = ref([])

// Generar sugerencias basadas en la búsqueda
const suggestions = computed(() => {
  if (!localSearchQuery.value || localSearchQuery.value.length < 2) {
    return []
  }

  const query = localSearchQuery.value.toLowerCase()
  const suggestionSet = new Set()
  const suggestions = []

  // Sugerencias por modelo
  props.controllers.forEach(controller => {
    if (controller.Model?.toLowerCase().includes(query)) {
      const key = `model:${controller.Model}`
      if (!suggestionSet.has(key)) {
        suggestionSet.add(key)
        suggestions.push({
          title: controller.Model,
          category: 'Modelo',
          icon: 'bi bi-music-note-beamed',
          query: controller.Model,
          count: props.controllers.filter(c => c.Model?.toLowerCase().includes(query)).length
        })
      }
    }
  })

  // Sugerencias por fabricante
  const manufacturers = [...new Set(props.controllers.map(c => c['Manufacturer-0']).filter(Boolean))]
  manufacturers.forEach(manufacturer => {
    if (manufacturer.toLowerCase().includes(query)) {
      const key = `manufacturer:${manufacturer}`
      if (!suggestionSet.has(key)) {
        suggestionSet.add(key)
        suggestions.push({
          title: manufacturer,
          category: 'Fabricante',
          icon: 'bi bi-building',
          query: manufacturer,
          count: props.controllers.filter(c => c['Manufacturer-0']?.toLowerCase().includes(query)).length
        })
      }
    }
  })

  // Sugerencias por tipo de teclas
  const keyTypes = [...new Set(props.controllers.map(c => c.keys_type).filter(c => c && c !== 'NA'))]
  keyTypes.forEach(keyType => {
    if (keyType.toLowerCase().includes(query)) {
      const key = `keyType:${keyType}`
      if (!suggestionSet.has(key)) {
        suggestionSet.add(key)
        suggestions.push({
          title: keyType,
          category: 'Tipo de Teclas',
          icon: 'bi bi-keyboard',
          query: keyType,
          count: props.controllers.filter(c => c.keys_type?.toLowerCase().includes(query)).length
        })
      }
    }
  })

  return suggestions.slice(0, 8) // Limitar a 8 sugerencias
})

// Watchers
watch(localSearchQuery, (newValue) => {
  emit('update:modelValue', newValue)
  selectedSuggestionIndex.value = -1
})

watch(() => props.modelValue, (newValue) => {
  localSearchQuery.value = newValue
})

// Métodos
const handleInput = () => {
  showSuggestions.value = true
  selectedSuggestionIndex.value = -1
}

const handleKeyDown = (event) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.min(
        selectedSuggestionIndex.value + 1,
        suggestions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedSuggestionIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
      } else if (localSearchQuery.value) {
        addToRecentSearches(localSearchQuery.value)
        showSuggestions.value = false
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedSuggestionIndex.value = -1
      break
  }
}

const selectSuggestion = (suggestion) => {
  localSearchQuery.value = suggestion.query
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  addToRecentSearches(suggestion.query)
}

const clearSearch = () => {
  localSearchQuery.value = ''
  showSuggestions.value = false
}

const addToRecentSearches = (search) => {
  if (!search || search.length < 2) return

  const searches = recentSearches.value.filter(s => s !== search)
  searches.unshift(search)
  recentSearches.value = searches.slice(0, 5) // Mantener solo las últimas 5
}

const selectRecentSearch = (search) => {
  localSearchQuery.value = search
  showSuggestions.value = false
}

const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1)
}

const applyQuickFilter = (filter) => {
  const index = activeQuickFilters.value.findIndex(f => f.key === filter.key)
  if (index >= 0) {
    activeQuickFilters.value.splice(index, 1)
  } else {
    activeQuickFilters.value.push(filter)
  }
  
  emit('quickFilter', activeQuickFilters.value)
}

const isQuickFilterActive = (filter) => {
  return activeQuickFilters.value.some(f => f.key === filter.key)
}

// Cerrar sugerencias cuando se hace clic fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.advanced-search')) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.advanced-search {
  position: relative;
}

.suggestions-dropdown {
  z-index: 1050;
  max-height: 300px;
  overflow-y: auto;
}

.list-group-item {
  border: none;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  background: rgba(248, 240, 251, 0.9);
  color: var(--raisin-black);
}

.list-group-item:hover,
.list-group-item.active {
  background: var(--gradient-primary);
  color: white;
}

.quick-filter-btn {
  transition: all 0.3s ease;
  border-radius: 20px;
  border: 2px solid var(--ash-gray);
  background: rgba(248, 240, 251, 0.8);
  color: var(--raisin-black);
  font-weight: 500;
}

.quick-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 32, 238, 0.2);
  background: var(--gradient-primary);
  color: white;
  border-color: var(--electric-indigo);
}

.quick-filter-btn.active {
  background: var(--gradient-primary);
  border-color: var(--electric-indigo);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 32, 238, 0.3);
}

.recent-search-btn {
  border-radius: 15px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: rgba(202, 213, 202, 0.3);
  color: var(--raisin-black);
  border: 1px solid var(--ash-gray);
}

.recent-search-btn:hover {
  background: var(--medium-slate-blue);
  color: white;
  transform: translateY(-1px);
  border-color: var(--medium-slate-blue);
}

.recent-search-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.remove-btn {
  color: var(--ash-gray);
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: var(--electric-indigo);
}

.search-input-container .form-control:focus {
  border-color: var(--electric-indigo);
  box-shadow: 0 0 0 0.2rem rgba(99, 32, 238, 0.25);
  background: white;
}

.input-group-text {
  border-right: none;
  background: var(--gradient-primary);
  color: white;
  border-color: var(--electric-indigo);
}

.form-control {
  border-left: none;
  border-color: var(--electric-indigo);
  background: rgba(248, 240, 251, 0.8);
}

.form-control:focus {
  border-left: none;
  border-color: var(--electric-indigo);
}

.list-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(33, 26, 29, 0.15);
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .quick-filters .d-flex {
    flex-direction: column;
    align-items: start;
  }
  
  .quick-filters .d-flex > .btn {
    margin-bottom: 0.25rem;
  }
  
  .quick-filter-btn:hover {
    transform: none;
  }
}
</style>
