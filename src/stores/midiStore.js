import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMidiStore = defineStore('midi', () => {
  const controllers = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Filtros
  const searchQuery = ref('')
  const selectedManufacturer = ref('')
  const selectedKeyCount = ref('')
  const selectedKeyType = ref('')
  const selectedPadCount = ref('')
  const selectedYear = ref('')
  const sortBy = ref('Model')
  const sortOrder = ref('asc')
  
  // Paginación
  const currentPage = ref(1)
  const itemsPerPage = ref(12)
  
  // Filtros rápidos
  const activeQuickFilters = ref([])

  // Cargar datos de la base de datos
  const loadControllers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/database.json')
      if (!response.ok) {
        throw new Error(`Error al cargar los datos: ${response.status}`)
      }
      const data = await response.json()
      
      // Filtrar solo los elementos que tienen datos completos
      controllers.value = data.filter(item => 
        item && 
        typeof item === 'object' && 
        item.ID && 
        Object.keys(item).length > 1
      )
      
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Computed para obtener valores únicos para filtros
  const manufacturers = computed(() => {
    const unique = [...new Set(controllers.value.map(c => c['Manufacturer-0']).filter(Boolean))]
    return unique.sort()
  })

  const keyCounts = computed(() => {
    const unique = [...new Set(controllers.value.map(c => c.keys_count).filter(c => c && c !== 'NA'))]
    return unique.sort((a, b) => Number(a) - Number(b))
  })

  const keyTypes = computed(() => {
    const unique = [...new Set(controllers.value.map(c => c.keys_type).filter(c => c && c !== 'NA'))]
    return unique.sort()
  })

  const padCounts = computed(() => {
    const unique = [...new Set(controllers.value.map(c => c.pads_count).filter(c => c && c !== 'NA' && c > 0))]
    return unique.sort((a, b) => Number(a) - Number(b))
  })

  const years = computed(() => {
    const unique = [...new Set(controllers.value.map(c => c.Year).filter(c => c && c !== 'NA'))]
    return unique.sort((a, b) => Number(b) - Number(a))
  })

  // Filtrar y buscar controladores
  const filteredControllers = computed(() => {
    let filtered = controllers.value

    // Búsqueda por texto
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(controller => 
        controller.Model?.toLowerCase().includes(query) ||
        controller['Manufacturer-0']?.toLowerCase().includes(query) ||
        controller['Blog-headline-0']?.toLowerCase().includes(query)
      )
    }

    // Aplicar filtros rápidos
    if (activeQuickFilters.value.length > 0) {
      filtered = filtered.filter(controller => 
        activeQuickFilters.value.every(quickFilter => 
          quickFilter.filter(controller)
        )
      )
    }

    // Filtro por fabricante
    if (selectedManufacturer.value) {
      filtered = filtered.filter(controller => 
        controller['Manufacturer-0'] === selectedManufacturer.value
      )
    }

    // Filtro por número de teclas
    if (selectedKeyCount.value) {
      filtered = filtered.filter(controller => 
        controller.keys_count == selectedKeyCount.value
      )
    }

    // Filtro por tipo de teclas
    if (selectedKeyType.value) {
      filtered = filtered.filter(controller => 
        controller.keys_type === selectedKeyType.value
      )
    }

    // Filtro por número de pads
    if (selectedPadCount.value) {
      filtered = filtered.filter(controller => 
        controller.pads_count == selectedPadCount.value
      )
    }

    // Filtro por año
    if (selectedYear.value) {
      filtered = filtered.filter(controller => 
        controller.Year == selectedYear.value
      )
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy.value] || ''
      let bValue = b[sortBy.value] || ''
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  })

  // Paginación
  const totalPages = computed(() => 
    Math.ceil(filteredControllers.value.length / itemsPerPage.value)
  )

  const paginatedControllers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredControllers.value.slice(start, end)
  })

  // Métodos
  const resetFilters = () => {
    searchQuery.value = ''
    selectedManufacturer.value = ''
    selectedKeyCount.value = ''
    selectedKeyType.value = ''
    selectedPadCount.value = ''
    selectedYear.value = ''
    activeQuickFilters.value = []
    currentPage.value = 1
  }

  const setQuickFilters = (filters) => {
    activeQuickFilters.value = filters
    currentPage.value = 1
  }

  const setSortBy = (field) => {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
    currentPage.value = 1
  }

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  return {
    // State
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
    
    // Computed
    manufacturers,
    keyCounts,
    keyTypes,
    padCounts,
    years,
    filteredControllers,
    totalPages,
    paginatedControllers,
    
    // Methods
    loadControllers,
    resetFilters,
    setSortBy,
    setPage,
    setQuickFilters
  }
})
