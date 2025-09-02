import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ProductsService } from '@/services/productsService'

// Utility function for parsing price strings
const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === '' || priceStr === 'NA') return 0
  
  // Handle both string format ($59.00) and number format from database
  if (typeof priceStr === 'number') {
    return priceStr / 100 // Convert from cents to dollars
  }
  
  // Remover $ y cualquier carácter no numérico excepto puntos y comas
  const cleaned = priceStr.replace(/[$,]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

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

  // Filtros avanzados
  const advancedFilters = ref({
    manufacturers: [],
    keyCounts: [],
    keyTypes: [],
    padCounts: [],
    yearRange: { min: null, max: null },
    priceRange: { min: null, max: null },
    quickFilters: []
  })

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
      // Fetch products from Supabase
      const data = await ProductsService.getAllProducts()

      // Filtrar solo los elementos que tienen datos completos
      controllers.value = data.filter(item =>
        item &&
        typeof item === 'object' &&
        item.image &&
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
    if (advancedFilters.value.quickFilters.length > 0) {
      filtered = filtered.filter(controller => {
        return advancedFilters.value.quickFilters.every(quickFilter => {
          switch (quickFilter.key) {
            case 'hasKeys':
              return controller.keys_count && controller.keys_count !== 'NA' && parseInt(controller.keys_count) > 0

            case 'hasPads':
              return controller.pads_count && controller.pads_count !== 'NA' && parseInt(controller.pads_count) > 0

            case 'mini':
              return controller.keys_type && controller.keys_type.toLowerCase().includes('mini')

            case 'weighted':
              return controller.keys_type && (
                controller.keys_type.toLowerCase().includes('weighted') ||
                controller.keys_type.toLowerCase().includes('hammer')
              )

            case 'hasMidi':
              return controller.connectivity && Array.isArray(controller.connectivity) &&
                controller.connectivity.some(conn =>
                  conn.toLowerCase().includes('midi')
                )

            case 'hasUsb':
              return controller.connectivity && Array.isArray(controller.connectivity) &&
                controller.connectivity.some(conn =>
                  conn.toLowerCase().includes('usb')
                )

            case 'wireless':
              return controller.connectivity && Array.isArray(controller.connectivity) &&
                controller.connectivity.some(conn =>
                  conn.toLowerCase().includes('bluetooth') ||
                  conn.toLowerCase().includes('wireless')
                )

            case 'battery':
              return controller.power && Array.isArray(controller.power) &&
                controller.power.some(pow =>
                  pow.toLowerCase().includes('battery') ||
                  pow.toLowerCase().includes('batería')
                )

            case 'transportControls':
              return controller.controls && Array.isArray(controller.controls) &&
                controller.controls.some(ctrl =>
                  ctrl.toLowerCase().includes('transport')
                )

            case 'modWheel':
              return controller.controls && Array.isArray(controller.controls) &&
                controller.controls.some(ctrl =>
                  ctrl.toLowerCase().includes('modulation')
                )

            default:
              return true
          }
        })
      })
    }

    // Filtros de selección múltiple
    if (advancedFilters.value.manufacturers.length > 0) {
      filtered = filtered.filter(controller =>
        advancedFilters.value.manufacturers.includes(controller['Manufacturer-0'])
      )
    } else if (selectedManufacturer.value) {
      // Filtro legacy
      filtered = filtered.filter(controller =>
        controller['Manufacturer-0'] === selectedManufacturer.value
      )
    }

    if (advancedFilters.value.keyCounts.length > 0) {
      filtered = filtered.filter(controller =>
        advancedFilters.value.keyCounts.includes(parseInt(controller.keys_count))
      )
    } else if (selectedKeyCount.value) {
      // Filtro legacy
      filtered = filtered.filter(controller =>
        controller.keys_count == selectedKeyCount.value
      )
    }

    if (advancedFilters.value.keyTypes.length > 0) {
      filtered = filtered.filter(controller =>
        advancedFilters.value.keyTypes.includes(controller.keys_type)
      )
    } else if (selectedKeyType.value) {
      // Filtro legacy
      filtered = filtered.filter(controller =>
        controller.keys_type === selectedKeyType.value
      )
    }

    if (advancedFilters.value.padCounts.length > 0) {
      filtered = filtered.filter(controller =>
        advancedFilters.value.padCounts.includes(parseInt(controller.pads_count))
      )
    } else if (selectedPadCount.value) {
      // Filtro legacy
      filtered = filtered.filter(controller =>
        controller.pads_count == selectedPadCount.value
      )
    }

    // Filtro por rango de años
    const hasYearFilter = advancedFilters.value.yearRange.min !== null &&
                         advancedFilters.value.yearRange.max !== null

    if (hasYearFilter) {
      const allYears = controllers.value.map(c => parseInt(c.Year)).filter(y => !isNaN(y))
      const dataMinYear = Math.min(...allYears)
      const dataMaxYear = Math.max(...allYears)

      // Solo aplicar filtro si los valores son realmente restrictivos
      const isMinRestricted = advancedFilters.value.yearRange.min > dataMinYear
      const isMaxRestricted = advancedFilters.value.yearRange.max < dataMaxYear

      if (isMinRestricted || isMaxRestricted) {
        filtered = filtered.filter(controller => {
          const year = parseInt(controller.Year)
          if (!year || isNaN(year)) return false

          const minYear = advancedFilters.value.yearRange.min
          const maxYear = advancedFilters.value.yearRange.max

          return year >= minYear && year <= maxYear
        })
      }
    } else if (selectedYear.value) {
      // Filtro legacy
      filtered = filtered.filter(controller =>
        controller.Year == selectedYear.value
      )
    }

    // Filtro por rango de precios
    const hasPriceFilter = advancedFilters.value.priceRange.min !== null &&
                          advancedFilters.value.priceRange.max !== null

    if (hasPriceFilter) {
      const allPrices = controllers.value.map(c => parsePrice(c['Street Price-0'])).filter(p => !isNaN(p) && p > 0)
      const dataMinPrice = Math.min(...allPrices)
      const dataMaxPrice = Math.max(...allPrices)

      // Solo aplicar filtro si los valores son realmente restrictivos
      const isMinRestricted = advancedFilters.value.priceRange.min > dataMinPrice
      const isMaxRestricted = advancedFilters.value.priceRange.max < dataMaxPrice

      if (isMinRestricted || isMaxRestricted) {
        filtered = filtered.filter(controller => {
          const price = parsePrice(controller['Street Price-0'])
          if (isNaN(price)) return false

          const minPrice = advancedFilters.value.priceRange.min
          const maxPrice = advancedFilters.value.priceRange.max

          return price >= minPrice && price <= maxPrice
        })
      }
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]
      
      // Handle null/undefined values
      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

      // Manejo especial para números
      if (sortBy.value === 'Year' || sortBy.value === 'keys_count') {
        aValue = parseFloat(aValue) || 0
        bValue = parseFloat(bValue) || 0
      } else if (sortBy.value === 'Street Price-0') {
        // Use shared parsePrice function
        aValue = parsePrice(aValue)
        bValue = parsePrice(bValue)
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      } else {
        // Convert to string for consistent comparison
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortOrder.value === 'asc') {
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
        return 0
      } else {
        if (aValue > bValue) return -1
        if (aValue < bValue) return 1
        return 0
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

  // Obtener un producto específico por ID
  const getProductById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const product = await ProductsService.getProductById(id)
      return product
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Métodos
  const resetFilters = () => {
    searchQuery.value = ''
    selectedManufacturer.value = ''
    selectedKeyCount.value = ''
    selectedKeyType.value = ''
    selectedPadCount.value = ''
    selectedYear.value = ''
    activeQuickFilters.value = []
    advancedFilters.value = {
      manufacturers: [],
      keyCounts: [],
      keyTypes: [],
      padCounts: [],
      yearRange: { min: null, max: null },
      priceRange: { min: null, max: null },
      quickFilters: []
    }
    currentPage.value = 1
  }

  const setAdvancedFilters = (filters) => {
    advancedFilters.value = filters
    currentPage.value = 1
  }

  const setQuickFilters = (filters) => {
    activeQuickFilters.value = filters
    currentPage.value = 1
  }

  const setSortBy = (field, order = null) => {
    if (order) {
      sortBy.value = field
      sortOrder.value = order
    } else {
      if (sortBy.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortBy.value = field
        sortOrder.value = 'asc'
      }
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
    getProductById,
    resetFilters,
    setSortBy,
    setPage,
    setQuickFilters,
    setAdvancedFilters
  }
})
